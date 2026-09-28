/**
 * OKami24 — image sharpness gate (owner, image-fix round 2026-09-28): run before merging ANY batch that adds or
 * replaces product photos. A new photo may not look softer on a phone than what it replaces.
 *
 *   npx tsx scripts/image-sharpness-gate.ts [--base origin/main]
 *
 * Looks at every public/assets/products/**.webp|png|jpg added or modified since <base> (git diff). For each file:
 *   canvas      — card/variant/lineup files must be at least 1000 px on the long side (detail 1600 is not
 *                 required here). A smaller canvas is what made the round's photos soft: the site fills the
 *                 351-px phone hero, so a 625-px file is drawn 1.7x enlarged on a 3x phone.
 *   phoneSharp  — mean |laplacian| inside the product (alpha >= 128) after resizing the product to the size a
 *                 3x phone actually draws it (1053 device px for the file's long side, object-contain). Higher =
 *                 crisper. A modified file must reach >= 90% of the file it replaces; an added variant file must
 *                 reach >= 90% of the product's own card (what the customer saw before the new photo). Lineups: canvas
 *                 check only (a strip → grid layout change moves the number without any blur).
 *   restored    — a modified file byte-identical to an earlier version of the same path on <base> passes as
 *                 "restored" (putting back photos the site already showed, owner 28/09).
 * Prints one line per file and ends with PASS or FAIL. It judges pixels, not taste — the owner still sees the 3x /
 * 1440 before/after before the merge (IMAGE_SPEC §7).
 */
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

sharp.cache(false);
const ROOT = process.cwd();
const args = process.argv.slice(2);
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : "origin/main";
const PHONE_BOX = 1053; // 351 CSS px hero at DPR 3
const THEME = [17, 17, 19];
const MIN_CANVAS = 1000;
const RATIO = 0.9;

const git = (a: string[]) => execFileSync("git", a, { cwd: ROOT, encoding: "buffer", maxBuffer: 256 * 1024 * 1024 });

async function phoneSharp(buf: Buffer): Promise<{ canvas: number; sharp: number; productLong: number }> {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const opaque = !data.some((_, i) => i % 4 === 3 && data[i] < 255);
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  const inP = (p: number) => (opaque ? true : data[p * 4 + 3] >= 128);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (inP(y * W + x)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0) return { canvas: Math.max(W, H), sharp: 0, productLong: 0 };
  const k = PHONE_BOX / Math.max(W, H);
  const pw = x1 - x0 + 1, ph = y1 - y0 + 1;
  const flat = Buffer.alloc(pw * ph * 3), mask = Buffer.alloc(pw * ph);
  for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) {
    const p = (y0 + y) * W + x0 + x, q = y * pw + x, a = data[p * 4 + 3] / 255;
    for (let c = 0; c < 3; c++) flat[q * 3 + c] = Math.round(data[p * 4 + c] * a + THEME[c] * (1 - a));
    mask[q] = inP(p) ? 255 : 0;
  }
  const dw = Math.max(3, Math.round(pw * k)), dh = Math.max(3, Math.round(ph * k));
  const g = await sharp(flat, { raw: { width: pw, height: ph, channels: 3 } }).resize(dw, dh, { kernel: "cubic" }).greyscale().raw().toBuffer();
  const m = await sharp(mask, { raw: { width: pw, height: ph, channels: 1 } }).resize(dw, dh, { kernel: "nearest" }).extractChannel(0).raw().toBuffer();
  let lap = 0, n = 0;
  for (let y = 2; y < dh - 2; y++) for (let x = 2; x < dw - 2; x++) {
    const p = y * dw + x;
    if (!m[p] || !m[p - 2] || !m[p + 2] || !m[p - 2 * dw] || !m[p + 2 * dw]) continue; // interior only
    lap += Math.abs(4 * g[p] - g[p - 1] - g[p + 1] - g[p - dw] - g[p + dw]);
    n++;
  }
  return { canvas: Math.max(W, H), sharp: n ? Math.round((lap / n) * 100) / 100 : 0, productLong: Math.max(pw, ph) };
}

// A modified file that is byte-identical to an earlier version of the same path in <base>'s history is a restore of
// a file the site already showed (owner 28/09: "back to the pre-round photos") — the gate compares new pixels
// against old ones, it is not a reason to refuse putting the old ones back. Returns that earlier commit, or null.
function restoredFrom(f: string): string | null {
  const blob = git(["hash-object", "--", f]).toString().trim();
  const commits = git(["rev-list", base, "--", f]).toString().trim().split(/\r?\n/).filter(Boolean);
  for (const c of commits.slice(1)) {
    try { if (git(["rev-parse", `${c}:${f}`]).toString().trim() === blob) return c; } catch { /* path absent there */ }
  }
  return null;
}

function cardOf(dir: string): string | null {
  for (const n of ["card.webp", "card.png", "card.jpg"]) {
    try { git(["cat-file", "-e", `${base}:${dir}/${n}`]); return `${dir}/${n}`; } catch { /* next */ }
  }
  return null;
}

(async () => {
  const diff = git(["diff", "--name-status", "--no-renames", base, "--", "public/assets/products"]).toString().trim();
  const rows = diff ? diff.split(/\r?\n/).map((l) => l.split("\t")).filter(([st, f]) => /^[AM]$/.test(st) && /\.(webp|png|jpe?g)$/i.test(f)) : [];
  if (!rows.length) { console.log(`no product image added or modified since ${base}\nPASS`); return; }
  let fail = 0;
  for (const [st, f] of rows) {
    const name = path.basename(f);
    const isDetail = /^(angle|detail)-/.test(name);
    const restored = st === "M" ? restoredFrom(f) : null;
    if (restored) { console.log(`ok    ${f}  restored — byte-identical to ${restored.slice(0, 7)} (${base} history)`); continue; }
    const now = await phoneSharp(readFileSync(path.join(ROOT, f)));
    const problems: string[] = [];
    if (!isDetail && now.canvas < MIN_CANVAS) problems.push(`canvas ${now.canvas} < ${MIN_CANVAS}`);
    let ref: string | null = null, refSharp: number | null = null;
    // a lineup's layout can change (strip → grid): the number then measures layout, not blur — canvas check only,
    // the owner judges a lineup by eye on the 3x / 1440 before/after
    if (name.startsWith("lineup")) ref = null;
    else if (st === "M") ref = f;
    else if (/^variant-/.test(name)) ref = cardOf(path.posix.dirname(f));
    if (ref) {
      refSharp = (await phoneSharp(git(["show", `${base}:${ref}`]))).sharp;
      if (now.sharp < refSharp * RATIO) problems.push(`phoneSharp ${now.sharp} < 90% of ${st === "M" ? "the file it replaces" : "the product card"} (${refSharp})`);
    }
    if (problems.length) fail++;
    console.log(`${problems.length ? "FAIL" : "ok  "}  ${f}  canvas ${now.canvas} · product ${now.productLong}px · phoneSharp ${now.sharp}${refSharp !== null ? ` (ref ${refSharp})` : ""}${problems.length ? "  ← " + problems.join("; ") : ""}`);
  }
  console.log(`${rows.length} file(s) · ${fail} failing`);
  console.log(fail ? "FAIL" : "PASS");
  if (fail) process.exitCode = 1;
})();
