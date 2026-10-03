// Batch 1b part 2: G4 + G4 mini colour images → the tilted -v2 files (tilt.js), card → card-v2 (upright 4:5), page opens on the
// card (openOnCardPhoto) like G5 / G5 Lite. Run from the colour worktree root (_incoming/wt-b1b-col). CRLF kept.
// node ../sitewide-template/1b/edit-colours.js
const fs = require("fs");
const path = require("path");
const T = path.join(__dirname, "tilt");
const F = "src/data/products/uwell.ts";
let whole = fs.readFileSync(F, "utf8").replace(/\r\n/g, "\n");
const SETS = [["caliburn-g4", "caliburn-g4-mini", 8, "seashell-white"], ["caliburn-g4-mini", "caliburn-g4-classic", 12, "slate-grey"]];
for (const [slug, next, count] of SETS) {
  const a = whole.indexOf(`    slug: "${slug}",`), z = whole.indexOf(`    slug: "${next}",`);
  let s = whole.slice(a, z);
  const P = `/assets/products/${slug}`;
  let n = 0;
  s = s.replace(new RegExp(`image: \\{ src: "${P}/variant-([a-z-]+)\\.webp"`, "g"), (m, id) => { n++; return `image: { src: "${P}/variant-${id}-v2.webp"`; });
  if (n !== count) throw new Error(`${slug}: ${n} colour images`);
  const once = (x, y) => { if (s.split(x).length !== 2) throw new Error(`${slug} not unique: ` + x.slice(0, 80)); s = s.replace(x, y); };
  once(`        src: "${P}/card.webp",`, `        src: "${P}/card-v2.webp",`);
  s = s.replace(/alt: "UWELL Caliburn G4( Mini)?, [A-Za-z ]+ colourway, front and back isolated product shot"/, () =>
    `alt: "UWELL Caliburn G4${slug.endsWith("mini") ? " Mini" : ""}, ${slug.endsWith("mini") ? "Slate Grey" : "Seashell White"}, front, isolated product shot"`);
  once(`        angle: "Front + back, isolated",`, `        angle: "Front, upright on 4:5 — the front device of UWELL's own render (batch 1b, 03/10)",`);
  once(`    colorVariants: [`, `    // Site-wide template round batch 1b (owner 03/10: set-1 UWELL colours re-tilted): every colour image = the front device of UWELL's
    // own per-colour render, turned 12° in 2D, no AI; the page opens on the card, the card colour upright on 4:5
    // (_incoming/sitewide-template/1b/tilt.js). Swatches = the body colour of the same renders (1b/swatch.js).
    openOnCardPhoto: true,
    colorVariants: [`);
  whole = whole.slice(0, a) + s + whole.slice(z);
  for (const f of fs.readdirSync(path.join(T, slug))) fs.copyFileSync(path.join(T, slug, f), `public/assets/products/${slug}/${f}`);
}
fs.writeFileSync(F, whole.replace(/\n/g, "\r\n"));
console.log("ok");
