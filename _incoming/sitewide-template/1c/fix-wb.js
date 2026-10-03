// wordbreak-scan fixes (batch 1c, 03/10): KOKO one-tap "ไม่ | รก" at a line end · included-pod row split inside "เติมด้านบน" at 390.
const fs = require("fs");
const rep = (f, a, b, n) => {
  let s = fs.readFileSync(f, "utf8");
  const c = s.split(a).length - 1;
  if (c !== n) throw new Error(`${f}: ${c} hits, want ${n}`);
  fs.writeFileSync(f, s.split(a).join(b));
};
rep("src/i18n/story-copy.ts", "หน้าจอไม่รก ไม่ต้องไล่หาเมนู", "หน้าจอสะอาดตา ไม่ต้องไล่หาเมนู", 1);
rep(
  "src/i18n/product-copy-th.ts",
  '"แล้วแต่เวอร์ชัน: INT และ FDA 0.4Ω + 0.6Ω เติมด้านข้าง · TPD 0.4Ω + 0.9Ω เติมด้านบน · CRC 0.4Ω + 0.6Ω เติมด้านบน (คอยล์ mesh FeCrAl)"',
  '"คอยล์ mesh FeCrAl แล้วแต่เวอร์ชัน: INT และ FDA 0.4Ω + 0.6Ω เติมด้านข้าง · TPD 0.4Ω + 0.9Ω เติมด้านบน · CRC 0.4Ω + 0.6Ω เติมด้านบน"',
  2,
);
console.log("fixed");
