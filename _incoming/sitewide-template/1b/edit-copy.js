// Batch 1b copy → story-copy.ts · product-articles.ts · product-copy-th.ts (spec values, whoIsThisFor, old feature overlay out).
// Text: copy.json (th = thai-copy 03/10, en/zh = Friday). CRLF kept. node _incoming/sitewide-template/1b/edit-copy.js
const fs = require("fs");
const C = JSON.parse(fs.readFileSync("_incoming/sitewide-template/1b/copy.json", "utf8"));
const q = (s) => JSON.stringify(s);
const sheet = (t) => `{ th: ${q(t.th)}, en: ${q(t.en)}, zh: ${q(t.zh)} }`;
const edit = (file, fn) => { const s = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n"); fs.writeFileSync(file, fn(s).replace(/\n/g, "\r\n")); };
const once = (s, a, b) => { if (s.split(a).length !== 2) throw new Error("not unique: " + a.slice(0, 70)); return s.replace(a, b); };
const SLUGS = ["caliburn-g4", "caliburn-g4-mini", "caliburn-g4-classic"];

// ---- story-copy.ts
const block = (id, b) => {
  const pts = (b.points ?? []).map((p) => `        { text: ${sheet(p.text)}${p.specKey ? `, specKey: ${q(p.specKey)}` : ""} },`).join("\n");
  return `    ${q(id)}: {
      title: ${sheet(b.title)},
      subline: ${sheet(b.subline)},
      body: {
        th: ${q(b.body.th)},
        en: ${q(b.body.en)},
        zh: ${q(b.body.zh)},
      },${pts ? `\n      points: [\n${pts}\n      ],` : ""}${b.link ? `\n      link: { href: ${q(b.link.href)}, label: ${sheet(b.link.label)} },` : ""}
    },`;
};
edit("src/i18n/story-copy.ts", (s) => {
  const end = s.lastIndexOf("};");
  const add = SLUGS.map((slug, i) => `${i === 0 ? `  // Site-wide template round batch 1b (03/10): UWELL's own G4 / G4 mini / G4 Classic pages only
  // (_incoming/sitewide-template/1b/caliburn-g4*.txt + the spec images); Thai = thai-copy 03/10.
` : ""}  ${q(slug)}: {
${Object.entries(C[slug].blocks).map(([id, b]) => block(id, b)).join("\n")}
  },`).join("\n");
  return s.slice(0, end) + add + "\n" + s.slice(end);
});

// ---- product-articles.ts
const art = (a) => `{
      lede: ${q(a.lede)},
      sections: [
${a.sections.map((x) => `        {
          heading: ${q(x.heading)},
          paragraphs: [
${x.paragraphs.map((p) => `            ${q(p)}`).join(",\n")}
          ]
        }`).join(",\n")}
      ]
    }`;
edit("src/data/product-articles.ts", (s) => {
  const end = s.indexOf("\n};\n");
  const add = SLUGS.map((slug, i) => `${i === 0 ? `  // Site-wide template round batch 1b (03/10): UWELL's G4 / G4 mini / G4 Classic pages; buyer questions the posters do not
  // answer (which one of the family). Thai = thai-copy 03/10.
` : ""}  ${q(slug)}: {
    th: ${art(C[slug].article.th)},
    en: ${art(C[slug].article.en)},
    zh: ${art(C[slug].article.zh)}
  },`).join("\n");
  return s.slice(0, end) + "\n" + add + s.slice(end);
});

// ---- product-copy-th.ts: Thai spec values for every row + whoIsThisFor; the old one-feature overlay goes (the story replaces it)
edit("src/i18n/product-copy-th.ts", (s) => {
  for (const slug of SLUGS) {
    const a = s.indexOf(`  ${q(slug)}: {`);
    const z = s.indexOf("\n  },\n", a) + 5;
    let e = s.slice(a, z);
    const spec = Object.entries(C[slug].specTh).map(([k, v]) => `      ${/^[a-z]+$/.test(k) ? k : q(k)}: ${q(v)},`).join("\n");
    if (/    specifications: \{[\s\S]*?\n    \},\n/.test(e)) e = e.replace(/    specifications: \{[\s\S]*?\n    \},\n/, `    specifications: {\n${spec}\n    },\n`);
    else e = once(e, "    tagline:", `    specifications: {\n${spec}\n    },\n    tagline:`);
    e = e.replace(/    features: \{[\s\S]*?\n    \},\n/, "");
    if (C[slug].whoTh) e = e.replace(/    whoIsThisFor: \{[\s\S]*?\n    \},\n/, `    whoIsThisFor: {\n${C[slug].whoTh.map((w, i) => `      ${i}: ${q(w)},`).join("\n")}\n    },\n`);
    s = s.slice(0, a) + e + s.slice(z);
  }
  return s;
});
console.log("ok");
