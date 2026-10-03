// node where.js <scanDir> <slug> <term>... — the th 1440 blocks that contain each term (to place a REPEAT)
const fs = require("fs");
const [dir, slug, ...terms] = process.argv.slice(2);
const f = fs.readdirSync(dir).find((x) => x.includes(slug.replace(/\//g, "_")) && x.includes("th") && x.includes("1440") && !x.includes(`${slug}-`));
const j = JSON.parse(fs.readFileSync(`${dir}/${f}`, "utf8"));
const blocks = j.blocks ?? j;
for (const t of terms) {
  console.log(`== ${t}`);
  for (const b of blocks) { const txt = b.text ?? b.t ?? ""; if (txt.includes(t)) console.log("  ", (b.path ?? b.key ?? "").slice(-60), "|", txt.slice(0, 140)); }
}
