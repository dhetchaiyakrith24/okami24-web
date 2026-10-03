// uwell.ts features (title/description/subline, English) = the final story-copy English; spec rows the copy changed (batch 1c, 03/10).
const fs = require("fs");
const f = "src/data/products/uwell.ts";
let s = fs.readFileSync(f, "utf8");
const B = JSON.parse(fs.readFileSync("_incoming/sitewide-template/1c/copy-base.json", "utf8"));
const rep = (a, b) => { if (!s.includes(a)) throw new Error("missing: " + a.slice(0, 80)); s = s.replace(a, b); };
for (const slug of Object.keys(B)) {
  const start = s.indexOf(`id: "${slug}",`), end = s.indexOf("relatedProductSlugs", start);
  let part = s.slice(start, end);
  for (const [id, b] of Object.entries(B[slug].blocks)) {
    const re = new RegExp(`(id: "${id}",\\n\\s+title: )".*?",\\n(\\s+description: )".*?",\\n(\\s+subline: )".*?",`);
    if (!re.test(part)) throw new Error(`${slug} ${id}`);
    part = part.replace(re, (_, a, c, d) => `${a}${JSON.stringify(b.title.en)},\n${c}${JSON.stringify(b.body.en)},\n${d}${JSON.stringify(b.subline.en)},`);
  }
  s = s.slice(0, start) + part + s.slice(end);
}
rep(`{ key: "screen", label: "Display", value: "2.51\\" ultra-shatterproof touchscreen", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/nch.webp" },`,
  `{ key: "screen", label: "Display", value: "2.51\\" touchscreen", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/nch.webp" },`);
rep(`      // Owner 2026-09-14 dropped "shatterproof" because the page text did not say it (researcher 2026-09-12). Batch 1c (03/10):
      // UWELL's own poster on that page prints "2.51-Inch Ultra-shatterproof screen" (pc/nch.webp) — the word is back with that source.`,
  `      // Owner 2026-09-14 dropped "shatterproof" because the page text did not say it (researcher 2026-09-12). Batch 1c (03/10):
      // UWELL's own poster on that page prints "2.51-Inch Ultra-shatterproof screen" (pc/nch.webp) — asked the owner before it comes back.`);
rep(`value: "Up to 7 days of use (UWELL lab tests)"`, `value: "Up to 7 days of use (UWELL's figure)"`);
fs.writeFileSync(f, s);
console.log("uwell.ts synced");
