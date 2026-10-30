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
 *                 crisper. A modified file must reach >= 90% of the file it replaces; an added variant-<id> file
 *                 that replaces an option photo deleted in the same diff (same product, same <id> in any case, e.g.
 *                 variants/Coil-1-1.webp -> variant-coil-1-1.webp — a new name keeps the CDN from serving the old file)
 *                 must reach >= 90% of that deleted file (IMAGE_SPEC "ของรูปที่มันแทน", round "3 coil photos" 08/10);
 *                 any other added variant file must reach >= 90% of the product's own card (what the customer saw
 *                 before the new photo). Lineups: canvas
 *                 check only (a strip → grid layout change moves the number without any blur).
 *   new card    — (nexBar Switch 15K, 31/10) when the same diff also adds or modifies that product's card (card.* /
 *                 card-v<n>.*), the added variant files are measured against that NEW card instead, provided the new
 *                 card earns it: it reaches >= 90% of the old card, OR the old card is not a product cut-out but an
 *                 opaque poster (its "product" fills >= 97% of its own box — a busy line-up poster scores far above a
 *                 plain studio pod, the wrong yardstick) AND the new card is a shaped cut-out (fill <= 95%; a box-shaped
 *                 product replaced by the same box fills its box both times and gets no shortcut). Otherwise the old
 *                 card stays the yardstick, unchanged.
 *   --self-test — synthetic images prove the new-card rule picks the right yardstick both ways; exits 1 on a miss.
 *   restored    — a modified file byte-identical to an earlier version of the same path on <base> passes as
 *                 "restored" (putting back photos the site already showed, owner 28/09).
 * Prints one line per file and ends with PASS or FAIL. It judges pixels, not taste — the owner still sees the 3x /
 * 1440 before/after in the report after the merge (IMAGE_SPEC §7, owner 30/09).
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
const POSTER_FILL = 0.97; // an old card whose product fills its box this fully is a poster (or a box-shaped product)…
const CUTOUT_FILL = 0.95; // …and the shortcut needs the new card to be a shaped cut-out, so a box replacing a box gets none

const git = (a: string[]) => execFileSync("git", a, { cwd: ROOT, encoding: "buffer", maxBuffer: 256 * 1024 * 1024 });

async function phoneSharp(buf: Buffer): Promise<{ canvas: number; sharp: number; productLong: number; fill: number }> {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const opaque = !data.some((_, i) => i % 4 === 3 && data[i] < 255);
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  const inP = (p: number) => (opaque ? true : data[p * 4 + 3] >= 128);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (inP(y * W + x)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0) return { canvas: Math.max(W, H), sharp: 0, productLong: 0, fill: 0 };
  const k = PHONE_BOX / Math.max(W, H);
  const pw = x1 - x0 + 1, ph = y1 - y0 + 1;
  const flat = Buffer.alloc(pw * ph * 3), mask = Buffer.alloc(pw * ph);
  let inside = 0;
  for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) {
    const p = (y0 + y) * W + x0 + x, q = y * pw + x, a = data[p * 4 + 3] / 255;
    for (let c = 0; c < 3; c++) flat[q * 3 + c] = Math.round(data[p * 4 + c] * a + THEME[c] * (1 - a));
    mask[q] = inP(p) ? 255 : 0;
    if (mask[q]) inside++;
  }
  const fill = Math.round((inside / (pw * ph)) * 1000) / 1000;
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
  return { canvas: Math.max(W, H), sharp: n ? Math.round((lap / n) * 100) / 100 : 0, productLong: Math.max(pw, ph), fill };
}

type Measure = Awaited<ReturnType<typeof phoneSharp>>;
/** The new-card rule (header "new card"): may the new card in this diff replace the old card as the variants' yardstick? */
function newCardIsYardstick(oldCard: Measure, newCard: Measure): boolean {
  // poster shortcut only when the shape changes from a full box to a cut-out: a box-shaped product (carton, block device)
  // replaced by the same box fills its box both times and keeps the old card as the yardstick (checker #1077)
  return newCard.sharp >= oldCard.sharp * RATIO || (oldCard.fill >= POSTER_FILL && newCard.fill <= CUTOUT_FILL);
}

async function selfTest(): Promise<void> {
  // busy opaque poster · plain transparent pod cut-out · the same pod blurred · a busy pod cut-out (sharp, transparent) ·
  // a box-shaped cut-out (a carton fills its own box like a poster does — checker #1077: relx-infinity-pro-2-pod 0.9998)
  const noise = (w: number, h: number) => { const b = Buffer.alloc(w * h * 4); for (let i = 0; i < w * h; i++) { const v = (i * 2654435761) >>> 24; b[i * 4] = v; b[i * 4 + 1] = 255 - v; b[i * 4 + 2] = (v * 7) & 255; b[i * 4 + 3] = 255; } return b; };
  const pod = async (blur: number, busy: boolean, box = false) => {
    const W = 1000, H = 1250, b = Buffer.alloc(W * H * 4);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const inPod = box ? Math.abs(x - 500) < 260 && y > 200 && y < 1050 : ((x - 500) / 200) ** 2 + ((y - 625) / 480) ** 2 < 1, i = (y * W + x) * 4;
      if (!inPod) continue;
      const v = busy ? ((x * 31 + y * 17) * 2654435761) >>> 24 : 40 + ((x * 3) % 40);
      b[i] = b[i + 1] = b[i + 2] = v; b[i + 3] = 255;
    }
    let s = sharp(b, { raw: { width: W, height: H, channels: 4 } });
    if (blur) s = s.blur(blur);
    return s.png().toBuffer();
  };
  const poster = await phoneSharp(await sharp(noise(1000, 1250), { raw: { width: 1000, height: 1250, channels: 4 } }).png().toBuffer());
  const plain = await phoneSharp(await pod(0, false)), blurred = await phoneSharp(await pod(6, true)), busyPod = await phoneSharp(await pod(0, true));
  const boxCard = await phoneSharp(await pod(0, true, true)), boxBlurred = await phoneSharp(await pod(6, true, true));
  const cases: [string, boolean, boolean][] = [
    ["poster old card + plain new card → new card", newCardIsYardstick(poster, plain), true],
    ["sharp cut-out old card + blurred new card → old card", newCardIsYardstick(busyPod, blurred), false],
    ["sharp cut-out old card + equally sharp new card → new card", newCardIsYardstick(busyPod, busyPod), true],
    ["box-shaped cut-out old card + the same box blurred → old card", newCardIsYardstick(boxCard, boxBlurred), false],
  ];
  let bad = 0;
  for (const [name, got, want] of cases) { const ok = got === want; if (!ok) bad++; console.log(`${ok ? "ok  " : "MISS"}  ${name}`); }
  console.log(`(poster fill ${poster.fill} sharp ${poster.sharp} · plain fill ${plain.fill} sharp ${plain.sharp} · blurred ${blurred.sharp} · busy cut-out ${busyPod.sharp})`);
  console.log(bad ? "SELF-TEST FAIL" : "SELF-TEST PASS");
  if (bad) process.exitCode = 1;
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
  if (args.includes("--self-test")) return selfTest();
  const diff = git(["diff", "--name-status", "--no-renames", base, "--", "public/assets/products"]).toString().trim();
  const all = diff ? diff.split(/\r?\n/).map((l) => l.split("\t")) : [];
  const rows = all.filter(([st, f]) => /^[AM]$/.test(st) && /\.(webp|png|jpe?g)$/i.test(f));
  // option photos deleted in this diff, keyed by product dir + lower-case id: the file a renamed variant-<id> replaces
  const productDir = (f: string) => f.split("/").slice(0, 4).join("/");
  const idOf = (f: string) => path.basename(f).replace(/\.[^.]+$/, "").replace(/^variant-/i, "").toLowerCase();
  const deleted = new Map<string, string>();
  for (const [st, f] of all) if (st === "D" && /\.(webp|png|jpe?g)$/i.test(f)) deleted.set(`${productDir(f)}|${idOf(f)}`, f);
  if (!rows.length) { console.log(`no product image added or modified since ${base}\nPASS`); return; }
  // the card this diff adds or modifies per product dir (header "new card")
  const newCardOf = new Map<string, string>();
  for (const [, f] of rows) if (/^card(-v\d+)?\.(webp|png|jpe?g)$/i.test(path.basename(f))) newCardOf.set(path.posix.dirname(f), f);
  let fail = 0;
  for (const [st, f] of rows) {
    const name = path.basename(f);
    const isDetail = /^(angle|detail)-/.test(name);
    const restored = st === "M" ? restoredFrom(f) : null;
    if (restored) { console.log(`ok    ${f}  restored — byte-identical to ${restored.slice(0, 7)} (${base} history)`); continue; }
    const now = await phoneSharp(readFileSync(path.join(ROOT, f)));
    const problems: string[] = [];
    if (!isDetail && now.canvas < MIN_CANVAS) problems.push(`canvas ${now.canvas} < ${MIN_CANVAS}`);
    let ref: string | null = null, refSharp: number | null = null, refFromTree = false;
    let refKind = st === "M" ? "the file it replaces" : "the product card";
    // a lineup's layout can change (strip → grid): the number then measures layout, not blur — canvas check only,
    // the owner judges a lineup by eye on the 3x / 1440 before/after
    if (name.startsWith("lineup")) ref = null;
    else if (st === "M") ref = f;
    else if (/^variant-/.test(name)) {
      const replaced = deleted.get(`${productDir(f)}|${idOf(f)}`);
      ref = replaced ?? cardOf(path.posix.dirname(f));
      if (replaced) refKind = "the option photo it replaces";
      const newCard = newCardOf.get(path.posix.dirname(f));
      if (!replaced && ref && newCard) {
        const oldM = await phoneSharp(git(["show", `${base}:${ref}`])), newM = await phoneSharp(readFileSync(path.join(ROOT, newCard)));
        if (newCardIsYardstick(oldM, newM)) {
          ref = newCard; refFromTree = true;
          refKind = `the new card in this diff (old card ${oldM.fill >= POSTER_FILL ? `is a poster, fill ${oldM.fill}` : `sharp ${oldM.sharp}`})`;
        }
      }
    }
    if (ref) {
      refSharp = (await phoneSharp(refFromTree ? readFileSync(path.join(ROOT, ref)) : git(["show", `${base}:${ref}`]))).sharp;
      if (now.sharp < refSharp * RATIO) problems.push(`phoneSharp ${now.sharp} < 90% of ${refKind} (${refSharp})`);
    }
    if (problems.length) fail++;
    console.log(`${problems.length ? "FAIL" : "ok  "}  ${f}  canvas ${now.canvas} · product ${now.productLong}px · phoneSharp ${now.sharp}${refSharp !== null ? ` (ref ${refSharp})` : ""}${problems.length ? "  ← " + problems.join("; ") : ""}`);
  }
  console.log(`${rows.length} file(s) · ${fail} failing`);
  console.log(fail ? "FAIL" : "PASS");
  if (fail) process.exitCode = 1;
})();
