// copy-base.json (en/zh, Friday) + th.json (thai-copy 03/10) → copy.json for edit-copy.js. The en/zh fixes thai-copy asked for
// (11 lines: words UWELL did not write, a fact said 3 times) are applied here so the three languages say the same thing.
const fs = require("fs");
const D = __dirname;
const base = JSON.parse(fs.readFileSync(`${D}/copy-base.json`, "utf8"));
const th = JSON.parse(fs.readFileSync(`${D}/th.json`, "utf8"));
const g4 = base["caliburn-g4"].blocks, mini = base["caliburn-g4-mini"].blocks, cl = base["caliburn-g4-classic"].blocks;
// --- en/zh fixes (thai-copy list 1–11 + the points it dropped)
g4.modes.subline = { en: "Two modes, two ways to vape.", zh: "两种模式，两种抽吸风格。" };
g4.button.body = { en: "Every command lives on one button — just remember how many clicks.", zh: "所有操作都在一个按键上，记住按几下就行。" };
g4.taste.body = { en: "The upgraded pods last longer, and the flavour tech keeps the e-liquid's taste true.", zh: "升级烟弹更耐用，口感技术保留烟油原味。" };
g4.airflow.body = { en: "Like it tight or a little more open? Use one way at a time, or both together.", zh: "喜欢紧一点还是松一点？可单独使用，也可两者结合。" };
g4["anti-leak"].title = { en: "U² anti-leak", zh: "U² 防漏" };
g4["anti-leak"].subline = { en: "Two techniques on the GPP pod.", zh: "GPP 烟弹上的两项工艺。" };
g4["anti-leak"].body = { en: "The pod is ultrasonically welded so it leaks less, and a U-shaped channel helps the air flow.", zh: "烟弹采用超声波焊接，更不易渗漏；U 形通道让气流更顺。" };
g4.pods.points[0].text = { en: "Upgraded pods refill while still in place", zh: "升级款烟弹无需取下即可注油" };
const a4 = base["caliburn-g4"].article;
a4.en.lede = "The Caliburn G4 starts with flavour, then lets you choose a hard hit or a smooth one.";
a4.zh.lede = "Caliburn G4 以口味为起点，再让你选择猛烈还是柔和。";
a4.en.sections[0].paragraphs[0] = "The G4 has a colour screen and a button; the [G4 mini](/products/caliburn-g4-mini) has no screen.";
a4.zh.sections[0].paragraphs[0] = "G4 有彩屏和按键；[G4 mini](/products/caliburn-g4-mini) 没有屏幕。";
a4.en.sections[1].paragraphs[0] = "The [G4 Classic](/products/caliburn-g4-classic) is a different body: aluminium, no screen, 14 RGB LEDs and a 1400mAh battery. Both take GPP pods.";
a4.zh.sections[1].paragraphs[0] = "[G4 Classic](/products/caliburn-g4-classic) 是另一种机身：铝合金、没有屏幕、14 颗 RGB LED，电池 1400mAh。两款都用 GPP 烟弹。";
mini.minimal.body = { en: "A slim body with clean lines that sits well in the hand.", zh: "机身纤细，线条简洁，握感贴合。" };
mini.taste.body = { en: "UWELL says PRO-FOCS 4.0 keeps your e-liquid's taste true.", zh: "UWELL 表示 PRO-FOCS 4.0 能保留烟油原本的味道。" };
mini.taste.subline = { en: "Full e-liquid taste in every puff.", zh: "每一口都是饱满的烟油味道。" };
const am = base["caliburn-g4-mini"].article;
am.en.lede = "The G4 mini is smaller than the G4, with the same flavour system.";
am.zh.lede = "G4 mini 比 G4 更小，口感技术却是同一套。";
am.en.sections[1].paragraphs[0] = "Neither has a screen. The difference is the battery: the [G5 Lite](/products/caliburn-g5-lite) holds 1600mAh with a 4-bar battery light, the G4 mini 1100mAh.";
am.zh.sections[1].paragraphs[0] = "两款都没有屏幕，差别在电池：[G5 Lite](/products/caliburn-g5-lite) 1600mAh，配 4 格电量灯；G4 mini 1100mAh。";
cl.craft.body = { en: "Finished in many fine CNC steps to a zirconia-smooth surface; the one-piece curved body feels smooth in the hand.", zh: "多道精细 CNC 工序打磨出锆石般顺滑的表面，一体式弧形机身，手感细腻。" };
cl["twin-sensor"].body = { en: "The two work together to catch the draw — UWELL says every puff.", zh: "两个传感器协同捕捉吸气，UWELL 表示每一口都能捕捉到。" };
cl["twin-sensor"].points[0].text = { en: "Auto-draw lifespan 300%+ (UWELL lab tests)", zh: "自动吸气寿命 300%+（UWELL 实验室数据）" };
cl["twin-sensor"].points[1].text = { en: "Trigger accuracy 99.999%+ (UWELL lab tests)", zh: "触发准确率 99.999%+（UWELL 实验室数据）" };
cl["rgb-light"].title = { en: "Light that follows your puff", zh: "随吸气流动的灯光" };
cl["dual-control"].body = { en: "Tight or open, button or just a draw — set it the way you like.", zh: "紧或松，按键或直接吸，按你的习惯来。" };
cl["dual-control"].points[2].text = { en: "A light press fires it (approx. 255gf)", zh: "轻按即可启动（压力约 255gf）" };
cl.pods.points = [];
cl.pods.body = { en: "A clear window shows the e-liquid left, so you refill in time.", zh: "透明视窗显示余量，及时补充。" };
cl["pro-focs"].body = { en: "Paired with U² anti-leak — one looks after the taste, the other makes leaks less likely.", zh: "搭配 U² 防漏：一个负责口味，一个让烟油更不易渗漏。" };
cl["pro-focs"].points = [cl["pro-focs"].points[1]];
const ac = base["caliburn-g4-classic"].article;
ac.en.lede = "UWELL's tenth-anniversary Caliburn: an aluminium body with colour light that glows as you puff.";
ac.zh.lede = "UWELL 十周年纪念款 Caliburn：铝合金机身，吸烟时灯光随之亮起。";
ac.en.sections[0].paragraphs = ["The [G4](/products/caliburn-g4) has a colour screen and two modes; the G4 Classic has no screen and shows the battery in light.", "The Classic holds 1400mAh against the G4's 1300mAh, and both take GPP pods."];
ac.zh.sections[0].paragraphs = ["[G4](/products/caliburn-g4) 有彩屏和两种模式；G4 Classic 没有屏幕，用灯光颜色显示电量。", "Classic 电池 1400mAh，G4 是 1300mAh，两款都用 GPP 烟弹。"];
ac.en.sections[1].paragraphs = ["Neither has a screen. The [G5 Lite](/products/caliburn-g5-lite) has a 1600mAh battery and an inner core under a translucent shell; the G4 Classic has 14 RGB LEDs and twin sensors."];
ac.zh.sections[1].paragraphs = ["两款都没有屏幕。[G5 Lite](/products/caliburn-g5-lite) 电池 1600mAh，半透明外壳包覆内芯；G4 Classic 有 14 颗 RGB LED 和双传感器。"];

cl.craft.points = [];
am.en.sections[1].paragraphs[0] = "Neither has a screen. The difference is the battery: the [G5 Lite](/products/caliburn-g5-lite) holds more, 1600mAh, with a 4-bar battery light.";
am.zh.sections[1].paragraphs[0] = "两款都没有屏幕，差别在电池：[G5 Lite](/products/caliburn-g5-lite) 电池更大（1600mAh），配 4 格电量灯。";
g4.taste.body = { en: "UWELL says the upgraded pods last longer and the flavour tech keeps the e-liquid's taste true.", zh: "UWELL 表示，升级烟弹更耐用，口感技术保留烟油原味。" };
g4.modes.body = { en: "UWELL compares Storm to a roller coaster — a fast hit — and Waves to the London Eye: smooth and steady.", zh: "UWELL 把 Storm 比作过山车，来得快；把 Waves 比作伦敦眼，平稳顺滑。" };
mini.taste.subline = { en: "Savour every puff.", zh: "细品每一口。" };
mini.minimal.points = [mini.minimal.points[0]];
// --- assemble
const out = {};
for (const slug of Object.keys(base)) {
  const B = base[slug], T = th[slug];
  const blocks = {};
  for (const [id, b0] of Object.entries(B.blocks)) {
    const tb = T.blocks[id];
    const b = typeof b0 === "string" ? JSON.parse(JSON.stringify(base["caliburn-g4"].blocks[id])) : b0;
    const t = tb === "same" || tb?.same ? th["caliburn-g4"].blocks[id] : tb;
    const tri = (x, thv) => ({ th: thv, en: x.en, zh: x.zh });
    const nb = { title: tri(b.title, t.title), subline: tri(b.subline, t.subline), body: tri(b.body, t.body) };
    if (b.points.length !== t.points.length) throw new Error(`${slug} ${id}: points ${b.points.length} vs th ${t.points.length}`);
    nb.points = b.points.map((p, i) => ({ text: tri(p.text, t.points[i]), specKey: p.specKey }));
    if (b.link) nb.link = { href: b.link.href, label: { th: (typeof tb === "object" && tb.link) || t.link || b.link.label.th, en: b.link.label.en, zh: b.link.label.zh } };
    if (slug !== "caliburn-g4" && b.link && b.link.href === "/products/coil-94") nb.link.label.en = `See the GPP pods for the ${slug === "caliburn-g4-mini" ? "G4 mini" : "G4 Classic"}`;
    if (slug === "caliburn-g4" && b.link && b.link.href === "/products/coil-94") nb.link.label.en = "See the GPP pods for the G4";
    blocks[id] = nb;
  }
  out[slug] = {
    blocks,
    article: { th: { lede: T.lede, sections: T.article }, en: B.article.en, zh: B.article.zh },
    specTh: T.spec,
    whoTh: T.who,
  };
}
for (const s of Object.values(out)) for (const b of Object.values(s.blocks)) if (b.link && !b.link.label.th && b.link.href.startsWith("/guides/understanding-mtl-vs-dtl")) b.link.label.th = "อ่านเรื่อง MTL กับ DTL";
// keep the Thai values of the rows this batch did not touch
Object.assign(out["caliburn-g4"].specTh, { battery: "1300mAh ในตัว", "charge-time": "USB-C ชาร์จเร็ว 5V/2A", screen: "จอสี 0.85 นิ้ว มีโหมด Storm กับ Waves", firing: "สูบได้เลย หรือกดปุ่มก็ได้", output: "35W" });
fs.writeFileSync(`${D}/copy.json`, JSON.stringify(out, null, 1));
console.log("copy.json", Object.keys(out).map((s) => `${s}:${Object.keys(out[s].blocks).length}`).join(" "));
