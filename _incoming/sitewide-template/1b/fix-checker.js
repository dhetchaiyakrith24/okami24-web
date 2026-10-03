// Checker round 1 on #233 (eb36252): fixes applied to the sources of the copy (th.json, merge.js) + uwell.ts + 2 mini images.
// Then: node merge.js && edit-copy.js on files restored from 23fc781 WITHOUT staging them (git show > file).
const fs = require("fs");
const sharp = require("sharp");
const D = __dirname;
// --- th.json: maker attribution (G4 taste/modes, mini subline) · "น้ำยา" out of device spec values (search contract) · mini "12 สี" point out
const th = JSON.parse(fs.readFileSync(`${D}/th.json`, "utf8"));
th["caliburn-g4"].blocks.taste.body = "UWELL บอกว่าหัวรุ่นใหม่ช่วยให้หัวพอตใช้ได้นานขึ้น ส่วนระบบปรับรสชาติช่วยให้ได้รสน้ำยาตรงตัว";
th["caliburn-g4"].blocks.modes.body = "UWELL เปรียบว่า Storm ได้ไอเร็วทันใจเหมือนนั่งรถไฟเหาะ ส่วน Waves นุ่ม นิ่ง สม่ำเสมอ เหมือนนั่งชิงช้าสวรรค์ London Eye";
th["caliburn-g4-mini"].blocks.taste.subline = "ค่อย ๆ ละเลียดทุกพัฟ";
th["caliburn-g4-mini"].blocks.minimal.points = ["ประมาณ 46 กรัม"];
th["caliburn-g4"].spec["pod-compat"] = "UWELL GPP ทั้งหัวรุ่นก่อนและรุ่นใหม่ · หัวรุ่นใหม่เติมได้ขณะหัวเสียบอยู่";
th["caliburn-g4-mini"].spec["pod-compat"] = "UWELL GPP ทั้งหัวรุ่นก่อนและรุ่นใหม่ (ในกล่องมีหัว mesh 0.6Ω) · หัวรุ่นใหม่เติมได้ขณะหัวเสียบอยู่";
th["caliburn-g4-classic"].spec["pod-compat"] = "UWELL GPP · เติมได้ขณะหัวเสียบอยู่ · มีช่องใสดูระดับในหัวพอต";
fs.writeFileSync(`${D}/th.json`, JSON.stringify(th, null, 1));
// --- merge.js: the same changes in en/zh
let m = fs.readFileSync(`${D}/merge.js`, "utf8");
m = m.replace("// --- assemble", `g4.taste.body = { en: "UWELL says the upgraded pods last longer and the flavour tech keeps the e-liquid's taste true.", zh: "UWELL 表示，升级烟弹更耐用，口感技术保留烟油原味。" };
g4.modes.body = { en: "UWELL compares Storm to a roller coaster — a fast hit — and Waves to the London Eye: smooth and steady.", zh: "UWELL 把 Storm 比作过山车，来得快；把 Waves 比作伦敦眼，平稳顺滑。" };
mini.taste.subline = { en: "Savour every puff.", zh: "细品每一口。" };
mini.minimal.points = [mini.minimal.points[0]];
// --- assemble`);
fs.writeFileSync(`${D}/merge.js`, m);
// --- uwell.ts: pod-chart alt without the Ω range (no verified row for 1.2Ω on the G4) · mini taste poster now on its white card
const uf = "src/data/products/uwell.ts";
let u = fs.readFileSync(uf, "utf8");
const rep = (a, b) => { if (u.split(a).length !== 2) throw new Error("not unique: " + a.slice(0, 60)); u = u.replace(a, b); };
rep("Official UWELL chart — GPP pods, top and side refill, 0.4Ω to 1.2Ω", "Official UWELL chart — GPP pods, top and side refill");
rep(`alt: "Official UWELL illustration from the Caliburn G4 mini page — a long exhale", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-mini", width: 1296, height: 1220, transparent: true }`,
  `alt: "Official UWELL illustration from the Caliburn G4 mini page — a long exhale", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-mini", width: 1296, height: 1220 }`);
fs.writeFileSync(uf, u);
// --- images: mini cover (40 transparent rows at the bottom → black strip) and mini taste (vignette with holes) flattened on white
(async () => {
  const S = `${D}/src/caliburn-g4-mini`, P = "public/assets/products/caliburn-g4-mini";
  await sharp(`${S}/pc-banner.webp`).flatten({ background: "#ffffff" }).resize({ width: 1920, kernel: "lanczos3" }).webp({ quality: 82, effort: 6 }).toFile(`${P}/story-cover.webp`);
  await sharp(`${S}/pc-drawing.webp`).flatten({ background: "#ffffff" }).webp({ quality: 82, effort: 6 }).toFile(`${P}/story-taste.webp`);
  for (const f of ["story-cover.webp", "story-taste.webp"]) { const md = await sharp(`${P}/${f}`).metadata(); console.log(f, md.width, md.height, md.hasAlpha); }
  console.log("ok");
})();
