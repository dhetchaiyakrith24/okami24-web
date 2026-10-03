// product-copy-th.ts: G4 Pro + KOKO entries rebuilt from th.json (spec values, who, KOKO faq + tagline/shortDescription kept as they
// were — head copy is off-limits this round); old feature Thai removed (the features are the story blocks now). spec-labels-th.ts: 3 labels.
const fs = require("fs");
const th = JSON.parse(fs.readFileSync("_incoming/sitewide-template/1c/th.json", "utf8"));
const f = "src/i18n/product-copy-th.ts";
let s = fs.readFileSync(f, "utf8");
const q = JSON.stringify;
function block(slug) {
  const a = s.indexOf(`  ${q(slug)}: {\n`), b = s.indexOf("\n  },\n", a) + 5;
  return [a, b, s.slice(a, b)];
}
for (const slug of ["caliburn-g4-pro-koko", "caliburn-g4-pro"]) {
  const [a, b, old] = block(slug);
  const tag = old.match(/\n    tagline: .*\n/)[0];
  const sd = old.match(/\n    shortDescription:\n.*\n/)[0];
  const faq = old.match(/\n    faqs: \{[\s\S]*?\n    \},/);
  const whoOld = old.match(/\n    whoIsThisFor: \{\n      0: (.*),\n/)[1];
  const T = th[slug];
  const who0 = T.who["0"] ? q(T.who["0"]) : whoOld;
  let out = `  ${q(slug)}: {`;
  if (faq) out += faq[0];
  out += `\n    whoIsThisFor: {\n      0: ${who0},\n      1: ${q(T.who["1"])},\n    },\n    specifications: {\n`;
  for (const [k, v] of Object.entries(T.spec)) out += `      ${/^[a-z]+$/.test(k) ? k : q(k)}: ${q(v)},\n`;
  out += `    },` + tag.replace(/\n$/, "") + sd.replace(/\n$/, "") + `\n  },\n`;
  s = s.slice(0, a) + out + s.slice(b);
}
fs.writeFileSync(f, s);
const L = "src/i18n/spec-labels-th.ts";
let l = fs.readFileSync(L, "utf8");
l = l.replace(`  "Status indicator": "ไฟบอกสถานะ",\n`, `  "Status indicator": "ไฟบอกสถานะ",\n  // Site-wide template round batch 1c (03/10, thai-copy): G4 Pro / G4 Pro KOKO touchscreen rows.\n${Object.entries(th.labels).map(([k, v]) => `  ${/^\w+$/.test(k) ? k : q(k)}: ${q(v)},\n`).join("")}`);
fs.writeFileSync(L, l);
console.log("th edited");
