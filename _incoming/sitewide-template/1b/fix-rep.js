// REPEAT fixes from page-text-length (a fact 3x outside the spec table) — th.json + merge.js en/zh + uwell.ts who (en)
const fs = require("fs");
const thf = __dirname + "/th.json"; const th = JSON.parse(fs.readFileSync(thf, "utf8"));
th["caliburn-g4"].who = ["อยากได้เครื่องที่มีจอ และเลือกได้ว่าวันนี้จะสูบแรงหรือสูบนุ่ม"];
th["caliburn-g4-mini"].article[1].paragraphs = ["สองรุ่นนี้ไม่มีจอทั้งคู่ ต่างกันที่แบต [G5 Lite](/products/caliburn-g5-lite) จุมากกว่าที่ 1600mAh และมีไฟ 4 ขีดบอกระดับแบต"];
const cr = th["caliburn-g4-classic"];
cr.blocks.craft.points = [];
cr.who = ["ชอบดูแบตจากสีไฟ และอยากได้ตัวเครื่องอะลูมิเนียมงานละเอียด"];
fs.writeFileSync(thf, JSON.stringify(th, null, 1));
const mf = __dirname + "/merge.js"; let m = fs.readFileSync(mf, "utf8");
const add = `cl.craft.points = [];
am.en.sections[1].paragraphs[0] = "Neither has a screen. The difference is the battery: the [G5 Lite](/products/caliburn-g5-lite) holds more, 1600mAh, with a 4-bar battery light.";
am.zh.sections[1].paragraphs[0] = "两款都没有屏幕，差别在电池：[G5 Lite](/products/caliburn-g5-lite) 电池更大（1600mAh），配 4 格电量灯。";
`;
m = m.replace("// --- assemble", add + "// --- assemble");
fs.writeFileSync(mf, m);
const uf = process.cwd() + "/src/data/products/uwell.ts"; let u = fs.readFileSync(uf, "utf8");
const R = [["Vapers who want a screen and a daily choice between a hard Storm hit and a smooth Waves draw.", "Vapers who want a screen and a daily choice between a hard hit and a smooth one."],
  ["Vapers happy to read the battery from a light instead of a screen, who want a finely made aluminium body.", "Vapers who like reading the battery from a light and want a finely made aluminium body."]];
for (const [a, b] of R) { if (u.split(a).length !== 2) throw new Error(a); u = u.replace(a, b); }
fs.writeFileSync(uf, u); console.log("ok");
