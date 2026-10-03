// page-text-length REPEAT fixes (batch 1c, 03/10): G4 Pro "2.51" ×3 (hero tagline + short description are head copy, off-limits
// this round → the article drops it) and "Custom" ×3 (the custom-mode body says "this mode" instead), in th/en/zh.
const fs = require("fs");
const rep = (f, a, b) => {
  const s = fs.readFileSync(f, "utf8");
  const c = s.split(a).length - 1;
  if (c !== 1) throw new Error(`${f}: ${c} hits for ${a.slice(0, 40)}`);
  fs.writeFileSync(f, s.split(a).join(b));
};
const A = "src/data/product-articles.ts", S = "src/i18n/story-copy.ts", U = "src/data/products/uwell.ts";
rep(A, "G4 Pro ทรงเพรียว จอใหญ่กว่าที่ 2.51 นิ้ว หนักประมาณ 78 กรัม", "G4 Pro ทรงเพรียว จอใหญ่กว่า หนักประมาณ 78 กรัม");
rep(A, "The G4 Pro is the slim one, with the bigger 2.51-inch screen, at about 78g.", "The G4 Pro is the slim one, with the bigger screen, at about 78g.");
rep(A, "G4 Pro 是纤长款，屏幕更大，2.51 英寸，约 78g。", "G4 Pro 是纤长款，屏幕更大，约 78g。");
rep(S, "Storm ตบคอทันที Waves รสนุ่มลื่น ส่วน Custom ให้ตั้งเองว่าชอบแบบไหน", "Storm ตบคอทันที Waves รสนุ่มลื่น ส่วนโหมดนี้ให้ตั้งเองว่าชอบแบบไหน");
rep(S, "Storm gives an instant throat hit, Waves a smooth flavour. Custom is the one you tune yourself.", "Storm gives an instant throat hit, Waves a smooth flavour. This one you tune yourself.");
rep(S, "Storm 带来即时击喉感，Waves 口感顺滑，Custom 由你自己调。", "Storm 带来即时击喉感，Waves 口感顺滑，这个模式由你自己调。");
rep(U, `description: "Storm gives an instant throat hit, Waves a smooth flavour. Custom is the one you tune yourself.",`, `description: "Storm gives an instant throat hit, Waves a smooth flavour. This one you tune yourself.",`);
console.log("fixed");
