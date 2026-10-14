/* eslint-disable */
// Recipe kept from _incoming/seo-f/b6d/mks.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Topic 11: slot candidates - every combination of the options per slot ({LINK} = the base paragraph's markdown link).
const fs = require("fs");
const d = "_incoming/seo-f/b6d/";
const base = JSON.parse(fs.readFileSync(d + (process.argv[4] || "cq1.json"), "utf8"));
const spec = JSON.parse(fs.readFileSync(d + process.argv[2], "utf8"));
const out = {};
for (const [k, slots] of Object.entries(spec)) {
  const b = base[k].cands[0];
  const link = (b.match(/\[[^\]]+\]\([^)]+\)/) || [""])[0];
  let v = [""];
  for (const opts of slots) v = v.flatMap((p) => opts.map((o) => p + o.replace("{LINK}", link)));
  if (!v.includes(b)) console.log("WARN " + k + ": base not reproduced by slot 0s");
  out[k] = { ...base[k], cands: [b, ...v.filter((x) => x !== b)] };
}
fs.writeFileSync(d + process.argv[3], JSON.stringify(out, null, 1));
console.log(Object.entries(out).map(([k, x]) => k + ":" + x.cands.length).join(" "));
