// Swatch = median body colour of UWELL's own front-device render (opaque pixels, 25–90 % of the device height, the screen /
// light-bar columns included as they are a small share); two-tone or gradient bodies (G4 shell panel, mini gradients) = median of
// the more colourful half (chroma >= its median) when the body is clearly chromatic. Prints data · photo · dE76; --write replaces
// entries whose dE76 > 12 (uwell.ts, CRLF kept). Same method as batch 1a (_incoming/sitewide-template/1a/swatch.js).
const sharp = require("sharp");
const fs = require("fs");
const D = require("path").relative(process.cwd(), __dirname).split(require("path").sep).join("/");
const G4 = ["seashell-white", "glacier-blue", "karst-grey", "flamingo-red", "twilight-silver", "gunmetal-grey", "sahara-gold", "polar-black"];
const MINI = ["slate-grey", "night-black", "light-silver", "bright-pink", "lake-blue", "grass-green", "coast-gold", "peafowl-emerald", "dusty-indigo", "paddy-green", "phoenix-purple", "champagne-gold"];
const SETS = [
  { slug: "caliburn-g4", files: G4.map((id, i) => [id, `${D}/src/caliburn-g4/pc-${i + 2}.webp`]), cut: 0.94 },
  { slug: "caliburn-g4-mini", files: MINI.map((id, i) => [id, `${D}/src/caliburn-g4-mini/pc-${i + 1}.webp`]), cut: 1 },
];
const BAND = { "coast-gold": "top", "peafowl-emerald": "top", "dusty-indigo": "bottom", "paddy-green": "bottom", "champagne-gold": "bottom" };
const lab = ([r, g, b]) => { const f = (c) => { c /= 255; return c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92; };
  const [R, G, B] = [f(r), f(g), f(b)]; const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047, Y = R * 0.2126 + G * 0.7152 + B * 0.0722, Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const h = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116); return [116 * h(Y) - 16, 500 * (h(X) - h(Y)), 200 * (h(Y) - h(Z))]; };
const dE = (a, b) => Math.hypot(...lab(a).map((v, i) => v - lab(b)[i]));
const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
(async () => {
  const src = fs.readFileSync("src/data/products/uwell.ts", "utf8");
  let out = src;
  for (const set of SETS) {
    for (const [id, file] of set.files) {
      const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const H = Math.floor(info.height * set.cut);
      let right = 0, seen = false;
      for (let x = 0; x < info.width; x++) { let n = 0; for (let y = 0; y < H; y++) if (data[(y * info.width + x) * 4 + 3] > 8) n++; if (n) seen = true; else if (seen) { right = x; break; } }
      let top = H, bottom = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < right; x++) if (data[(y * info.width + x) * 4 + 3] > 8) { top = Math.min(top, y); bottom = Math.max(bottom, y); }
      // gradient bodies (G4 mini, two colours top → bottom): the dot = the end the colour NAME describes
      const [b0, b1] = BAND[id] === "top" ? [0.25, 0.5] : BAND[id] === "bottom" ? [0.65, 0.9] : [0.25, 0.9];
      const px = [];
      for (let y = Math.floor(top + (bottom - top) * b0); y < Math.floor(top + (bottom - top) * b1); y++) for (let x = 0; x < right; x++) { const k = (y * info.width + x) * 4; if (data[k + 3] > 250) px.push([data[k], data[k + 1], data[k + 2]]); }
      const chroma = px.map(([r, g, b]) => Math.max(r, g, b) - Math.min(r, g, b)); const cm = med(chroma);
      const use = cm > 25 ? px.filter((_, j) => chroma[j] >= cm) : px;
      const photo = [0, 1, 2].map((c) => med(use.map((p) => p[c])));
      const st = src.indexOf(`slug: "${set.slug}",`), en = src.indexOf("slug: ", st + 10); const sec = src.slice(st, en);
      const m = sec.match(new RegExp(`id: "${id}",\\r?\\n\\s+name: "[^"]+",\\r?\\n\\s+swatchHex: "(#[0-9a-f]{6})"`));
      if (!m) { console.log("no entry", set.slug, id); continue; }
      const data0 = m[1]; const rgb = [1, 3, 5].map((o) => parseInt(data0.slice(o, o + 2), 16));
      const d = dE(rgb, photo);
      console.log(set.slug, id.padEnd(16), "data", data0, "photo", hex(photo), "dE", d.toFixed(1).padStart(5), d > 12 ? "← change" : "");
      if (d > 12 && process.argv.includes("--write")) { if (out.split(m[0]).length !== 2) throw new Error("not unique: " + id); out = out.replace(m[0], m[0].replace(data0, hex(photo))); }
    }
  }
  if (process.argv.includes("--write")) { fs.writeFileSync("src/data/products/uwell.ts", out); console.log("written"); }
})();
