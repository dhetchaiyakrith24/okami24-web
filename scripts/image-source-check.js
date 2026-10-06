/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// OKami24 — image SOURCE check (owner 07/10, after Drag S3): run BEFORE any AI re-shoot, on every candidate reference
// photo of a product, so the recipe is picked from what the reference really is instead of guessed.
//
//   node scripts/image-source-check.js <slug> [file ...]      (no files = every colour candidate found for the slug)
//   node scripts/image-source-check.js --compare <old> <new>  (the ONE-colour test: did the re-shoot really change the look?)
//
// Candidates per colour (when no files are given): public/assets/products/<slug>/variants/<id>.webp (older real photos)
// and the live colour photo from src data (via the process-images map entries for that slug).
// Per file it prints and writes `_incoming/look-batch/<slug>/SOURCE-CHECK.md`:
//   size      device long side in px (alpha bbox; opaque files: whole image) — < 800 = SMALL
//   history   AI   = a map entry for that file carries `aiRender` or names Higgsfield/remake (= already AI-relit →
//                    "keep exactly" copies its old light; Drag S3 07/10) · REAL = otherwise
//   exposure  mean luma of the device · % near-white (≥ 250) · % near-black (≤ 8) — BRIGHT if > 6 % white,
//             DARK if mean < 55 and > 25 % black
//   edges     semi-transparent edge pixels that are much brighter than the device next to them (white halo) — HALO > 3 %
//   tilt      principal-axis angle of the device vs vertical — TILTED if > 5°
// Numbers cannot tell a flat recolour (KOKO v2) from an already-lit AI photo (Drag S3 v2) — their sd/falloff were the
// same — so the deciding check is --compare on the one-colour test: LITTLE CHANGE (|Δmean| < 8 and |Δsd| < 6, Drag S3
// 07/10: 100→96 / 65→63) = the reference's light was copied → switch to the real photo + v3 light block.
// Then it lists the fix lines ("modules") of docs/IMAGE_PROMPTS.md that apply. Mirrored photos, watermarks and wrong
// colours cannot be measured here — the eye check stays (IMAGE_SPEC §0 item 8).
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const [slug, ...given] = process.argv.slice(2);
if (!slug) { console.error("usage: node scripts/image-source-check.js <slug> [file ...]"); process.exit(2); }
const PUB = path.join(ROOT, "public", "assets", "products", slug);
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "process-images.map.json"), "utf8"));
const entries = map.filter((e) => e.slug === slug);

function history(file) {
  const base = path.basename(file);
  const e = entries.find((x) => x.fileName === base || (x.id && !x.fileName && base === `variant-${x.id}.webp`));
  if (!e) return { tag: "REAL?", why: "no map entry (older file — check by eye)" };
  const txt = JSON.stringify(e);
  if (e.aiRender || /higgsfield|remake|nano_banana|ai render/i.test(txt)) return { tag: "AI", why: (e.note || "aiRender").slice(0, 90) };
  return { tag: "REAL", why: (e.note || e.source || "").slice(0, 90) };
}

async function measure(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, hasAlpha = (await sharp(file).metadata()).hasAlpha;
  const A = (i) => (hasAlpha ? data[i * 4 + 3] : 255);
  let x0 = W, x1 = 0, y0 = H, y1 = 0, n = 0, sum = 0, sum2 = 0, white = 0, black = 0, mx = 0, my = 0, sxx = 0, sxy = 0, syy = 0;
  const L = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, o = i * 4;
    L[i] = 0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2];
    if (A(i) < 250) continue;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    n++; sum += L[i]; sum2 += L[i] * L[i]; if (L[i] >= 250) white++; if (L[i] <= 8) black++; mx += x; my += y;
  }
  const mean = sum / n, sd = Math.sqrt(Math.max(0, sum2 / n - mean * mean));
  mx /= n; my /= n;
  // falloff: mean luma of the left third minus the right third of the device box
  let lS = 0, lN = 0, rS = 0, rN = 0;
  const t1 = x0 + (x1 - x0) / 3, t2 = x0 + (2 * (x1 - x0)) / 3;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const i = y * W + x; if (A(i) < 250) continue;
    const dx = x - mx, dy = y - my; sxx += dx * dx; sxy += dx * dy; syy += dy * dy;
    if (x < t1) { lS += L[i]; lN++; } else if (x > t2) { rS += L[i]; rN++; }
  }
  const falloff = lS / Math.max(1, lN) - rS / Math.max(1, rN);
  const tilt = Math.abs(90 - Math.abs((0.5 * Math.atan2(2 * sxy, sxx - syy) * 180) / Math.PI));
  // halo: OUTER boundary pixels (partly transparent, touching a transparent pixel) that are 40+ brighter than the
  // brightest opaque pixel within 3 px — a light fringe from a bright old background (clear tanks/pods inside the
  // device are not on the outer boundary, so they do not count)
  let edge = 0, halo = 0;
  if (hasAlpha) for (let y = 3; y < H - 3; y++) for (let x = 3; x < W - 3; x++) {
    const i = y * W + x, a = A(i);
    if (a <= 20 || a >= 230) continue;
    if (!(A(i - 1) < 10 || A(i + 1) < 10 || A(i - W) < 10 || A(i + W) < 10)) continue;
    let inner = -1;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const j = i + dy * W + dx; if (A(j) >= 250 && L[j] > inner) inner = L[j]; }
    if (inner < 0) continue;
    edge++; if (L[i] > inner + 40) halo++;
  }
  return { long: Math.max(x1 - x0 + 1, y1 - y0 + 1), mean, sd, white: (100 * white) / n, black: (100 * black) / n, falloff, tilt, halo: edge ? (100 * halo) / edge : 0, hasAlpha };
}

function candidates() {
  if (given.length) return given.map((f) => path.resolve(f));
  const out = [];
  const vdir = path.join(PUB, "variants");
  if (fs.existsSync(vdir)) for (const f of fs.readdirSync(vdir)) out.push(path.join(vdir, f));
  // our own studio re-shoots (image-look) are outputs, never sources
  for (const e of entries) if (e.role === "variant" && e.fileName && !/image-look/.test(e.note || "") && fs.existsSync(path.join(PUB, e.fileName))) out.push(path.join(PUB, e.fileName));
  return [...new Set(out)];
}

(async () => {
  if (slug === "--compare") {
    const [a, b] = given, A0 = await measure(path.resolve(a)), B0 = await measure(path.resolve(b));
    const dm = B0.mean - A0.mean, ds = B0.sd - A0.sd;
    console.log(`old mean/sd ${A0.mean.toFixed(0)}/${A0.sd.toFixed(0)} falloff ${A0.falloff.toFixed(0)} → new ${B0.mean.toFixed(0)}/${B0.sd.toFixed(0)} falloff ${B0.falloff.toFixed(0)}`);
    console.log(Math.abs(dm) < 8 && Math.abs(ds) < 6 ? "LITTLE CHANGE — the old light was copied: switch to a real photo + v3 (docs/IMAGE_PROMPTS.md)" : "CHANGED — judge by eye against the G5 bar");
    return;
  }
  const rows = [];
  for (const f of candidates()) {
    const m = await measure(f), h = history(f), flags = [];
    if (h.tag === "AI") flags.push("AI-RELIT");
    if (m.long < 800) flags.push("SMALL");
    if (m.white > 6) flags.push("BRIGHT");
    if (m.mean < 55 && m.black > 25) flags.push("DARK");
    if (m.halo > 3) flags.push("HALO");
    if (m.tilt > 5) flags.push("TILTED");
    rows.push({ file: path.relative(ROOT, f).replace(/\\/g, "/"), ...m, hist: h, flags });
  }
  const mod = {
    "AI-RELIT": "prefer a REAL photo as image 1 if one exists (prep-orig.js) + v3; if only this one exists, test ONE colour and run --compare",
    SMALL: "upscale before sending (lanczos to ~1700 px tall) + 'rebuild crisp micro-texture; printed text exactly as in the photo'",
    BRIGHT: "+ 'recover detail in the highlights, no blown-out whites'",
    DARK: "+ 'lift the shadows enough to show the surface texture and every printed detail'",
    HALO: "send the photo on the flat #2b2e33 backdrop, never a cut-out with a halo; we key it ourselves after",
    TILTED: "+ pose line: 'upright, front facing' (or keep the angle on purpose and say so)",
  };
  const lines = [`# Source check — ${slug} (${new Date().toISOString().slice(0, 10)}, scripts/image-source-check.js)`, "",
    "| file | long px | history | mean / sd | white % · black % | falloff | tilt ° | halo % | flags |", "|---|---|---|---|---|---|---|---|---|"];
  for (const r of rows) lines.push(`| ${r.file} | ${r.long} | ${r.hist.tag} | ${r.mean.toFixed(0)} / ${r.sd.toFixed(0)} | ${r.white.toFixed(1)} · ${r.black.toFixed(1)} | ${r.falloff.toFixed(0)} | ${r.tilt.toFixed(1)} | ${r.halo.toFixed(1)} | ${r.flags.join(" ") || "—"} |`);
  const used = [...new Set(rows.flatMap((r) => r.flags))];
  lines.push("", "Fix lines that apply (docs/IMAGE_PROMPTS.md modules):", ...used.map((k) => `- **${k}** — ${mod[k]}`), "",
    "Eye check still needed: mirrored? watermark/shop logo? right colour for the id? every printed word readable?");
  const outDir = path.join(ROOT, "_incoming", "look-batch", slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "SOURCE-CHECK.md"), lines.join("\n") + "\n");
  console.log(lines.join("\n"));
})();
