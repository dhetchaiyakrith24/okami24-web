/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Builds src/data/thai-address/thai-map.json — the outline of Thailand's 77 provinces for the address step's map
// (owner picked draft A 03/11: "แผนที่ไทยภาพเส้น หมุดวิ่งไปจังหวัดที่เลือก", not Google Maps).
//
//   node scripts/build-thai-map.js <ne_10m_admin_1_states_provinces.geojson>
//
// Source: Natural Earth 10m "Admin 1 – States, Provinces" (public domain, naturalearthdata.com), taken from
// github.com/nvkelso/natural-earth-vector/geojson. The 40 MB world file is NOT kept in git — only this subset
// (Thailand, simplified) is. Each province: `d` = one SVG path (absolute coordinates, 1 decimal, in the file's own
// viewBox) and `c` = the pin position [x, y] (largest piece's area centroid, moved inside when the
// province is concave). Keys are the Thai province names exactly
// as src/data/thai-address/postcodes.json spells them, so the address form can look a province up by what it holds.
// The script fails when a Natural Earth feature or a province of postcodes.json has no partner.
const fs = require("fs");
const path = require("path");

const src = process.argv[2];
if (!src) {
  console.error("usage: node scripts/build-thai-map.js <ne_10m_admin_1_states_provinces.geojson>");
  process.exit(2);
}

const postcodes = require(path.join(__dirname, "..", "src", "data", "thai-address", "postcodes.json"));
const thaiOrder = [];
for (const rows of Object.values(postcodes.codes)) for (const r of rows) if (!thaiOrder.includes(r[2])) thaiOrder.push(r[2]);
// Thai names pinned by ISO 3166-2:TH code, then checked both ways against the provinces the postcode file can produce.
// Not taken from Natural Earth's `name_local`: it is wrong on 6 of the 77 rows (03/11: TH-10 says เชียงใหม่, TH-36 ชัยนาท,
// TH-38 หนองคาย, TH-67/71/73 name the town district); the other 71 agree with this table, and all 77 agree with its English `name`.
const NAMES = {
  10: "กรุงเทพมหานคร", 11: "สมุทรปราการ", 12: "นนทบุรี", 13: "ปทุมธานี", 14: "พระนครศรีอยุธยา", 15: "อ่างทอง", 16: "ลพบุรี",
  17: "สิงห์บุรี", 18: "ชัยนาท", 19: "สระบุรี", 20: "ชลบุรี", 21: "ระยอง", 22: "จันทบุรี", 23: "ตราด", 24: "ฉะเชิงเทรา",
  25: "ปราจีนบุรี", 26: "นครนายก", 27: "สระแก้ว", 30: "นครราชสีมา", 31: "บุรีรัมย์", 32: "สุรินทร์", 33: "ศรีสะเกษ",
  34: "อุบลราชธานี", 35: "ยโสธร", 36: "ชัยภูมิ", 37: "อำนาจเจริญ", 38: "บึงกาฬ", 39: "หนองบัวลำภู", 40: "ขอนแก่น",
  41: "อุดรธานี", 42: "เลย", 43: "หนองคาย", 44: "มหาสารคาม", 45: "ร้อยเอ็ด", 46: "กาฬสินธุ์", 47: "สกลนคร", 48: "นครพนม",
  49: "มุกดาหาร", 50: "เชียงใหม่", 51: "ลำพูน", 52: "ลำปาง", 53: "อุตรดิตถ์", 54: "แพร่", 55: "น่าน", 56: "พะเยา",
  57: "เชียงราย", 58: "แม่ฮ่องสอน", 60: "นครสวรรค์", 61: "อุทัยธานี", 62: "กำแพงเพชร", 63: "ตาก", 64: "สุโขทัย",
  65: "พิษณุโลก", 66: "พิจิตร", 67: "เพชรบูรณ์", 70: "ราชบุรี", 71: "กาญจนบุรี", 72: "สุพรรณบุรี", 73: "นครปฐม",
  74: "สมุทรสาคร", 75: "สมุทรสงคราม", 76: "เพชรบุรี", 77: "ประจวบคีรีขันธ์", 80: "นครศรีธรรมราช", 81: "กระบี่", 82: "พังงา",
  83: "ภูเก็ต", 84: "สุราษฎร์ธานี", 85: "ระนอง", 86: "ชุมพร", 90: "สงขลา", 91: "สตูล", 92: "ตรัง", 93: "พัทลุง",
  94: "ปัตตานี", 95: "ยะลา", 96: "นราธิวาส",
};
if (Object.keys(NAMES).length !== 77) throw new Error("province table is not 77 rows");
for (const n of thaiOrder) if (!Object.values(NAMES).includes(n)) throw new Error(`postcodes.json province not in the table: ${n}`);
for (const n of Object.values(NAMES)) if (!thaiOrder.includes(n)) throw new Error(`table province not in postcodes.json: ${n}`);

const geo = JSON.parse(fs.readFileSync(src, "utf8"));
const features = geo.features.filter((f) => f.properties.iso_a2 === "TH");
if (features.length !== 77) throw new Error(`expected 77 Thai features, got ${features.length}`);

// Equirectangular, scaled so a degree of longitude is cos(13°) of a degree of latitude (Thailand's middle latitude).
const COS = Math.cos((13 * Math.PI) / 180);
const SCALE = 40; // units per degree of latitude
const polysOf = (g) => (g.type === "Polygon" ? [g.coordinates] : g.coordinates);
let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
for (const f of features) for (const poly of polysOf(f.geometry)) for (const [lon, lat] of poly[0]) {
  minLon = Math.min(minLon, lon); maxLon = Math.max(maxLon, lon); minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat);
}
const PAD = 6;
const proj = ([lon, lat]) => [(lon - minLon) * COS * SCALE + PAD, (maxLat - lat) * SCALE + PAD];
const W = Math.round((maxLon - minLon) * COS * SCALE + PAD * 2);
const H = Math.round((maxLat - minLat) * SCALE + PAD * 2);

// Douglas–Peucker on a ring (closed rings keep their first point).
function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const keep = new Array(pts.length).fill(false);
  keep[0] = keep[pts.length - 1] = true;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let far = -1, dmax = 0;
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      let d;
      if (len2 === 0) d = Math.hypot(px - ax, py - ay);
      else {
        const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
        d = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
      }
      if (d > dmax) { dmax = d; far = i; }
    }
    if (far >= 0 && dmax > tol) { keep[far] = true; stack.push([a, far], [far, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const area = (ring) => {
  let s = 0;
  for (let i = 0; i < ring.length - 1; i++) s += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  return s / 2;
};
const centroid = (ring) => {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const k = ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    a += k; cx += (ring[i][0] + ring[i + 1][0]) * k; cy += (ring[i][1] + ring[i + 1][1]) * k;
  }
  return [cx / (3 * a), cy / (3 * a)];
};
const r1 = (n) => Math.round(n * 10) / 10;
const inside = ([x, y], ring) => {
  let inn = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inn = !inn;
  }
  return inn;
};
// A concave province can have its centroid outside itself: then the pin goes to the middle of the widest stretch of the
// province on the centroid's own line (so it still sits about where the eye expects).
function pinPoint(ring) {
  const c = centroid(ring);
  if (inside(c, ring)) return c;
  const xs = [];
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > c[1] !== yj > c[1]) xs.push(((xj - xi) * (c[1] - yi)) / (yj - yi) + xi);
  }
  xs.sort((a, b) => a - b);
  let best = null;
  for (let i = 0; i + 1 < xs.length; i += 2) if (!best || xs[i + 1] - xs[i] > best[1] - best[0]) best = [xs[i], xs[i + 1]];
  return best ? [(best[0] + best[1]) / 2, c[1]] : c;
}

const TOL = Number(process.env.TOL || 0.7); // ~13 KB gzipped; finer than a pixel at the size the page draws it
const MIN_AREA = 1.2; // drop specks (islands smaller than this, in square map units), but never a province's biggest piece
const provinces = {};
for (const f of features) {
  const code = Number(String(f.properties.iso_3166_2).replace("TH-", ""));
  const name = NAMES[code];
  if (!name) throw new Error(`no Thai name for ${f.properties.iso_3166_2} (${f.properties.name})`);
  const rings = polysOf(f.geometry).map((poly) => poly[0].map(proj));
  rings.sort((a, b) => Math.abs(area(b)) - Math.abs(area(a)));
  const c = pinPoint(rings[0]);
  let d = "";
  rings.forEach((ring, i) => {
    if (i > 0 && Math.abs(area(ring)) < MIN_AREA) return;
    const s = simplify(ring, TOL);
    if (s.length < 4) return;
    d += "M" + s.slice(0, -1).map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L") + "Z";
  });
  provinces[name] = { d, c: [r1(c[0]), r1(c[1])] };
}
if (Object.keys(provinces).length !== 77) throw new Error("province count is not 77");

const out = path.join(__dirname, "..", "src", "data", "thai-address", "thai-map.json");
const doc = {
  source: "Natural Earth 10m Admin 1 – States, Provinces (public domain) via nvkelso/natural-earth-vector; built by scripts/build-thai-map.js",
  viewBox: [W, H],
  provinces,
};
fs.writeFileSync(out, JSON.stringify(doc) + "\n");
console.log(`thai-map.json: ${W}x${H}, 77 provinces, ${fs.statSync(out).size} bytes`);
