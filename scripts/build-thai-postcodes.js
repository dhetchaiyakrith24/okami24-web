/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Builds src/data/thai-address/postcodes.json — postcode → [sub-district, district, province] in Thai — for the checkout
// address step (owner queue 02/11 item 4: "ใส่รหัสไปรษณีย์แล้วขึ้นจังหวัดเลย"). Source = kongvut/thai-province-data (MIT),
// api/latest/{province,district,sub_district}.json at a pinned commit, downloaded by hand into a folder of its own:
//   node scripts/build-thai-postcodes.js <folder with the 3 json files> <commit sha>
// Re-run when the source updates (it fixes names / postcodes from the Department of Provincial Administration and Thailand Post).
const fs = require("fs"); const path = require("path");
const [dir, commit] = process.argv.slice(2);
if (!dir || !commit) { console.error("usage: node scripts/build-thai-postcodes.js <dir> <commit>"); process.exit(2); }
const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
const provinces = new Map(read("province.json").filter((p) => !p.deleted_at).map((p) => [p.id, p.name.th]));
const districts = new Map(read("district.json").filter((d) => !d.deleted_at).map((d) => [d.id, { name: d.name.th, province: d.province_id }]));
const byCode = {};
let rows = 0;
for (const s of read("sub_district.json")) {
  if (s.deleted_at || !s.zip_code) continue;
  const d = districts.get(s.district_id); if (!d) continue;
  const prov = provinces.get(d.province); if (!prov) continue;
  const code = String(s.zip_code).padStart(5, "0");
  (byCode[code] ??= []).push([s.name.th, d.name, prov]);
  rows++;
}
const sorted = Object.fromEntries(Object.keys(byCode).sort().map((k) => [k, byCode[k].sort((a, b) => a[2].localeCompare(b[2], "th") || a[1].localeCompare(b[1], "th") || a[0].localeCompare(b[0], "th"))]));
const out = path.join(__dirname, "..", "src", "data", "thai-address", "postcodes.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ source: `kongvut/thai-province-data@${commit} (MIT)`, codes: sorted }) + "\n");
console.log(`postcodes: ${Object.keys(sorted).length} codes · ${rows} sub-districts · ${provinces.size} provinces → ${path.relative(process.cwd(), out)} (${fs.statSync(out).size} bytes)`);
