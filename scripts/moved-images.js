/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// Round SEO full 07/11, batch 4. Every product picture path that ever existed and is gone today → the picture to send it to.
// Watermark rounds renamed files (card.webp → -wm → -wm2 → -wm3 → -wm4 → -wm5) and no old name answered; Google knew the old names.
//   node scripts/moved-images.js          writes src/data/moved-images.json
//   node scripts/moved-images.js --check  exit 1 when the file on disk differs from what the repo gives
// Match order inside a product folder: same name after dropping -wmN and -vN → every word of the shorter name is in the other → the card picture.
// One step only: every target is a file that exists today, so a redirect never leads to another redirect.
// Run it again after any picture is renamed. `moved-images-contract-test.ts` fails when a target no longer exists.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = "public/assets/products";
const OUT = "src/data/moved-images.json";
const git = (args) => execSync(`git ${args}`, { maxBuffer: 1 << 28 }).toString().trim().split("\n").filter(Boolean);
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.posix.join(dir, e.name)) : [path.posix.join(dir, e.name)]));

const stem = (p) => path.posix.basename(p).replace(/\.[a-z0-9]+$/i, "").replace(/-wm\d?$/, "").replace(/-v\d+$/, "").replace(/^variant-/, "").toLowerCase();
const words = (p) => new Set(stem(p).split(/[-_ ]+/).filter((w) => w.length > 1));
const slugOf = (p) => p.slice(ROOT.length + 1).split("/")[0];

const today = walk(ROOT).filter((p) => /\.(webp|png|jpe?g|avif)$/i.test(p));
const todaySet = new Set(today);
const bySlug = new Map();
for (const p of today) (bySlug.get(slugOf(p)) ?? bySlug.set(slugOf(p), []).get(slugOf(p))).push(p);
const ever = git(`log --name-only --diff-filter=A --format= -- ${ROOT}`);

const map = {};
let noFolder = 0;
for (const old of new Set(ever)) {
  if (todaySet.has(old) || !/\.(webp|png|jpe?g|avif)$/i.test(old)) continue;
  const here = bySlug.get(slugOf(old));
  if (!here) { noFolder++; continue; }
  const s = stem(old);
  let target = here.find((p) => stem(p) === s);
  if (!target) {
    const w = words(old);
    let best = 0;
    for (const p of here) {
      const c = words(p);
      const shared = [...c].filter((x) => w.has(x)).length;
      if (shared === Math.min(c.size, w.size) && shared > best) { best = shared; target = p; }
    }
  }
  target ??= here.find((p) => stem(p) === "card") ?? here[0];
  map[old.slice("public".length)] = target.slice("public".length);
}
const text = JSON.stringify(Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b))), null, 0) + "\r\n";
if (process.argv.includes("--check")) {
  const same = fs.existsSync(OUT) && fs.readFileSync(OUT, "utf8") === text;
  console.log(same ? "moved-images: OK" : "moved-images: DIFFERENT, run node scripts/moved-images.js");
  process.exit(same ? 0 : 1);
}
fs.writeFileSync(OUT, text);
console.log(`moved-images: ${Object.keys(map).length} old paths · ${noFolder} with no product folder today · ${(text.length / 1024).toFixed(0)} KB`);
