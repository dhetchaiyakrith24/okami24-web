/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// xlsx-lite.js — read and write simple .xlsx files with Node alone (the repo has no Excel package, and a new one would
// be a package.json change for a tool that never runs on the site). Values only: no styles, no formulas kept.
//
//   readXlsx(path)  → [{ name, rows: [{ A: "text", B: "12" }, …] }, …]   path = an .xlsx file or an unzipped folder
//   writeXlsx(path, [{ name, rows: [[cell, …], …], widths: [chars, …] }, …])   numbers stay numbers, the rest is text
//   crc32 · zipEntries are exported for the self-test of scripts/weekly-bill-check.js.
"use strict";
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const decode = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const encode = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Every file of a zip by its central directory (the local headers may leave sizes out). */
function zipEntries(buf) {
  let end = buf.length - 22;
  while (end >= 0 && buf.readUInt32LE(end) !== 0x06054b50) end--;
  if (end < 0) throw new Error("not a zip file");
  const count = buf.readUInt16LE(end + 10);
  let at = buf.readUInt32LE(end + 16);
  const files = {};
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
    files[name.replace(/\\/g, "/")] = method === 0 ? body : zlib.inflateRawSync(body);
    at += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

function folderEntries(dir, base = dir, out = {}) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) folderEntries(p, base, out);
    else out[path.relative(base, p).replace(/\\/g, "/")] = fs.readFileSync(p);
  }
  return out;
}

function parseRows(xml, shared) {
  return [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((m) => {
    const row = {};
    for (const c of m[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const inner = c[3] || "";
      const v = inner.match(/<v>([\s\S]*?)<\/v>/);
      const inline = [...inner.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join("");
      if (/t="s"/.test(c[2]) && v) row[c[1]] = shared[+v[1]] ?? "";
      else if (inline) row[c[1]] = decode(inline);
      else row[c[1]] = v ? decode(v[1]) : "";
    }
    return row;
  });
}

function readXlsx(file) {
  const files = fs.statSync(file).isDirectory() ? folderEntries(file) : zipEntries(fs.readFileSync(file));
  const text = (n) => (files[n] ? files[n].toString("utf8") : "");
  const shared = [...text("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
    decode([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join(""))
  );
  const rels = Object.fromEntries(
    [...text("xl/_rels/workbook.xml.rels").matchAll(/<Relationship [^>]*>/g)].map((m) => [m[0].match(/Id="([^"]+)"/)?.[1], m[0].match(/Target="([^"]+)"/)?.[1]])
  );
  const sheets = [...text("xl/workbook.xml").matchAll(/<sheet [^>]*>/g)].map((m) => ({
    name: decode(m[0].match(/name="([^"]+)"/)?.[1] ?? ""),
    target: rels[m[0].match(/r:id="([^"]+)"/)?.[1]],
  }));
  return sheets.map((s, i) => {
    const part = s.target ? `xl/${s.target.replace(/^\/?(xl\/)?/, "")}` : `xl/worksheets/sheet${i + 1}.xml`;
    return { name: s.name, rows: parseRows(text(part), shared) };
  });
}

const CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function zip(files) {
  const parts = [];
  const central = [];
  let offset = 0;
  for (const [name, content] of Object.entries(files)) {
    const body = Buffer.from(content, "utf8");
    const packed = zlib.deflateRawSync(body);
    const nameBuf = Buffer.from(name, "utf8");
    const crc = crc32(body);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(body.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(20, 4);
    dir.writeUInt16LE(20, 6);
    dir.writeUInt16LE(0x0800, 8);
    dir.writeUInt16LE(8, 10);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(packed.length, 20);
    dir.writeUInt32LE(body.length, 24);
    dir.writeUInt16LE(nameBuf.length, 28);
    dir.writeUInt32LE(offset, 42);
    parts.push(local, nameBuf, packed);
    central.push(dir, nameBuf);
    offset += local.length + nameBuf.length + packed.length;
  }
  const dirBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(files).length, 8);
  end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(dirBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, dirBuf, end]);
}

const column = (n) => (n < 26 ? String.fromCharCode(65 + n) : column(Math.floor(n / 26) - 1) + String.fromCharCode(65 + (n % 26)));

function sheetXml(sheet) {
  const rows = sheet.rows
    .map((cells, r) => {
      const xml = cells
        .map((v, c) => {
          const at = `${column(c)}${r + 1}`;
          if (v === null || v === undefined || v === "") return "";
          if (typeof v === "number" && Number.isFinite(v)) return `<c r="${at}"${r === 0 ? ' s="1"' : ""}><v>${v}</v></c>`;
          return `<c r="${at}" t="inlineStr"${r === 0 ? ' s="1"' : ""}><is><t xml:space="preserve">${encode(String(v))}</t></is></c>`;
        })
        .join("");
      return `<row r="${r + 1}">${xml}</row>`;
    })
    .join("");
  const cols = (sheet.widths || []).map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>${cols ? `<cols>${cols}</cols>` : ""}<sheetData>${rows}</sheetData></worksheet>`;
}

function writeXlsx(file, sheets) {
  const main = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
  const rel = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const files = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets
      .map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`)
      .join("")}</Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${rel}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="${main}" xmlns:r="${rel}"><sheets>${sheets
      .map((s, i) => `<sheet name="${encode(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`)
      .join("")}</sheets></workbook>`,
    "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets
      .map((_, i) => `<Relationship Id="rId${i + 1}" Type="${rel}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`)
      .join("")}<Relationship Id="rId${sheets.length + 1}" Type="${rel}/styles" Target="styles.xml"/></Relationships>`,
    "xl/styles.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="${main}"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="2"><xf/><xf fontId="1" applyFont="1"/></cellXfs></styleSheet>`,
  };
  sheets.forEach((s, i) => (files[`xl/worksheets/sheet${i + 1}.xml`] = sheetXml(s)));
  fs.writeFileSync(file, zip(files));
}

module.exports = { readXlsx, writeXlsx, crc32, zipEntries };
