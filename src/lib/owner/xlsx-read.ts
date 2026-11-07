import zlib from "node:zlib";

/**
 * Reads the values of an .xlsx file from memory, with Node alone: the owner's cost file and the warehouse bill arrive through
 * the owner's pages and are never written to disk, and an Excel package would be a dependency for two small tables.
 * Pure (no database, no env), so the contract test and scripts/weekly-bill-check.ts run it directly.
 */
export interface Sheet {
  name: string;
  rows: Record<string, string>[];
}

/** A workbook holds a few dozen parts. Both limits are for the whole file: one per part would still let many parts add up. */
const MAX_PARTS = 500;
const MAX_UNPACKED = 32 * 1024 * 1024;

const decode = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");

function inflate(body: Buffer, room: number): Buffer {
  try {
    return zlib.inflateRawSync(body, { maxOutputLength: room });
  } catch {
    throw new Error("ไฟล์เสียหรือใหญ่เกินไป");
  }
}

/** Every file of a zip, by its central directory (local headers may leave the sizes out). */
function zipEntries(buf: Buffer): Record<string, Buffer> {
  let end = buf.length - 22;
  while (end >= 0 && buf.readUInt32LE(end) !== 0x06054b50) end--;
  if (end < 0) throw new Error("ไฟล์นี้ไม่ใช่ Excel (.xlsx)");
  const count = buf.readUInt16LE(end + 10);
  if (count > MAX_PARTS) throw new Error("ไฟล์ใหญ่เกินไป");
  let room = MAX_UNPACKED;
  let at = buf.readUInt32LE(end + 16);
  const files: Record<string, Buffer> = {};
  for (let i = 0; i < count; i++) {
    const method = buf.readUInt16LE(at + 10);
    const packed = buf.readUInt32LE(at + 20);
    const nameLen = buf.readUInt16LE(at + 28);
    const extraLen = buf.readUInt16LE(at + 30);
    const commentLen = buf.readUInt16LE(at + 32);
    const local = buf.readUInt32LE(at + 42);
    const name = buf.toString("utf8", at + 46, at + 46 + nameLen);
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const body = buf.subarray(start, start + packed);
    // The limits stop a zip bomb; an upload is the owner's own, but they cost nothing.
    const unpacked = method === 0 ? body : inflate(body, room);
    room -= unpacked.length;
    files[name.replace(/\\/g, "/")] = unpacked;
    at += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

function parseRows(xml: string, shared: string[]): Record<string, string>[] {
  return [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((m) => {
    const row: Record<string, string> = {};
    for (const c of m[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const inner = c[3] ?? "";
      const v = inner.match(/<v>([\s\S]*?)<\/v>/);
      const inline = [...inner.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join("");
      if (/t="s"/.test(c[2]) && v) row[c[1]] = shared[Number(v[1])] ?? "";
      else if (inline) row[c[1]] = decode(inline);
      else row[c[1]] = v ? decode(v[1]) : "";
    }
    return row;
  });
}

export function readXlsx(buf: Buffer): Sheet[] {
  const files = zipEntries(buf);
  const text = (n: string) => files[n]?.toString("utf8") ?? "";
  const shared = [...text("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
    decode([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join(""))
  );
  const rels = new Map(
    [...text("xl/_rels/workbook.xml.rels").matchAll(/<Relationship [^>]*>/g)].map((m) => [m[0].match(/Id="([^"]+)"/)?.[1], m[0].match(/Target="([^"]+)"/)?.[1]])
  );
  return [...text("xl/workbook.xml").matchAll(/<sheet [^>]*>/g)].map((m, i) => {
    const target = rels.get(m[0].match(/r:id="([^"]+)"/)?.[1]);
    const part = target ? `xl/${target.replace(/^\/?(xl\/)?/, "")}` : `xl/worksheets/sheet${i + 1}.xml`;
    return { name: decode(m[0].match(/name="([^"]+)"/)?.[1] ?? ""), rows: parseRows(text(part), shared) };
  });
}

/** Column letters by header. Stops with the headers it saw when one is missing: a renamed column must not read as empty. */
export function findColumns<K extends string>(header: Record<string, string>, wanted: Record<K, string>, what: string): Record<K, string> {
  const out = {} as Record<K, string>;
  for (const key of Object.keys(wanted) as K[]) {
    const label = wanted[key];
    const hits = Object.entries(header).filter(([, v]) => String(v).startsWith(label));
    const hit = hits.find(([, v]) => String(v).split(" (")[0] === label) ?? hits[0];
    if (!hit) throw new Error(`${what}: ไม่พบคอลัมน์ "${label}" · หัวตารางที่เจอ: ${Object.values(header).join(" | ")}`);
    out[key] = hit[0];
  }
  return out;
}

/** Rounded to the satang: the bill's own formulas leave 1390.0000000000002. */
export const parseAmount = (v: unknown): number => Math.round(Number(String(v ?? "").replace(/[,฿\s]/g, "")) * 100) / 100;
