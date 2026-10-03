// copy-base.json (en/zh, Friday) + th.json (thai-copy 03/10) → story-copy.ts + product-articles.ts entries for batch 1c.
// Run from the repo root: node _incoming/sitewide-template/1c/build.js (idempotent: refuses when the slugs are already in).
const fs = require("fs");
const D = __dirname;
const base = JSON.parse(fs.readFileSync(`${D}/copy-base.json`, "utf8"));
const th = JSON.parse(fs.readFileSync(`${D}/th.json`, "utf8"));
const q = (s) => JSON.stringify(s);
const tri = (t, b) => `{ th: ${q(t)}, en: ${q(b.en)}, zh: ${q(b.zh)} }`;
let story = "  // Site-wide template round batch 1c (03/10): UWELL's own G4 Pro / G4 Pro KOKO pages, posters and page films only\n  // (_incoming/sitewide-template/1c/copy-en.md lists the source of each line); Thai = thai-copy 03/10.\n";
let art = "  // Site-wide template round batch 1c (03/10): from UWELL's G4 Pro / KOKO pages and spec sheets; Thai = thai-copy 03/10.\n";
for (const slug of Object.keys(base)) {
  const B = base[slug], T = th[slug];
  story += `  ${q(slug)}: {\n`;
  for (const [id, b] of Object.entries(B.blocks)) {
    const t = T.blocks[id];
    if (!t) throw new Error(`${slug} ${id}: no Thai`);
    if (b.points.length !== t.points.length) throw new Error(`${slug} ${id}: points ${b.points.length} vs th ${t.points.length}`);
    story += `    ${q(id)}: {\n      title: ${tri(t.title, b.title)},\n      subline: ${tri(t.subline, b.subline)},\n      body: {\n        th: ${q(t.body)},\n        en: ${q(b.body.en)},\n        zh: ${q(b.body.zh)},\n      },\n`;
    if (b.captions) {
      if (!t.captions || t.captions.length !== b.captions.length) throw new Error(`${slug} ${id}: captions`);
      story += `      captions: [\n${b.captions.map((c, i) => `        ${tri(t.captions[i], c)},\n`).join("")}      ],\n`;
    }
    if (b.points.length) story += `      points: [\n${b.points.map((p, i) => `        { text: ${tri(t.points[i], p.text)}${p.specKey ? `, specKey: ${q(p.specKey)}` : ""} },\n`).join("")}      ],\n`;
    if (b.link) {
      if (!t.link) throw new Error(`${slug} ${id}: link label`);
      story += `      link: { href: ${q(b.link.href)}, label: { th: ${q(t.link)}, en: ${q(b.link.en)}, zh: ${q(b.link.zh)} } },\n`;
    }
    story += `    },\n`;
  }
  story += `  },\n`;
  const sec = (arr) => arr.map((s) => `        {\n          heading: ${q(s.heading)},\n          paragraphs: [\n${s.paragraphs.map((p) => `            ${q(p)}`).join(",\n")}\n          ]\n        }`).join(",\n");
  art += `  ${q(slug)}: {\n`;
  art += `    th: {\n      lede: ${q(T.lede)},\n      sections: [\n${sec(T.article)}\n      ]\n    },\n`;
  art += `    en: {\n      lede: ${q(B.lede.en)},\n      sections: [\n${sec(B.article.en)}\n      ]\n    },\n`;
  art += `    zh: {\n      lede: ${q(B.lede.zh)},\n      sections: [\n${sec(B.article.zh)}\n      ]\n    },\n  },\n`;
}
function insert(file, marker, text) {
  let s = fs.readFileSync(file, "utf8");
  if (s.includes('"caliburn-g4-pro-koko": {')) throw new Error(`${file}: already has 1c`);
  const crlf = s.includes("\r\n");
  if (crlf) { s = s.replace(/\r\n/g, "\n"); text = text; }
  const at = s.indexOf(marker);
  const end = s.indexOf("\n};", at);
  s = s.slice(0, end + 1) + text + s.slice(end + 1);
  if (crlf) s = s.replace(/\n/g, "\r\n");
  fs.writeFileSync(file, s);
}
insert("src/i18n/story-copy.ts", "export const STORY_COPY", story);
insert("src/data/product-articles.ts", "export const PRODUCT_ARTICLES", art);
console.log("inserted 1c story + articles");
