// wordbreak-scan round 2 (batch 1c, 03/10): KOKO one-tap body still left "ไม่ | ต้อง" at a line end at 1440 → no negation at all.
const fs = require("fs");
const rep = (f, a, b) => {
  const s = fs.readFileSync(f, "utf8");
  const c = s.split(a).length - 1;
  if (c !== 1) throw new Error(`${f}: ${c} hits for ${a.slice(0, 40)}`);
  fs.writeFileSync(f, s.split(a).join(b));
};
const S = "src/i18n/story-copy.ts", U = "src/data/products/uwell.ts";
rep(S, "UWELL ทำจอนี้มาให้คนสูบพอตใช้โดยเฉพาะ หน้าจอโล่งสะอาดตา ไม่ต้องไล่หาเมนู", "UWELL ออกแบบจอนี้ให้คนสูบพอตโดยเฉพาะ หน้าจอโล่งสะอาดตา หาเมนูเจอง่าย");
rep(S, "UWELL built this screen for vapers: an uncluttered screen, no menus to dig through.", "UWELL built this screen for vapers: uncluttered, with menus easy to find.");
rep(S, "UWELL 专为烟友打造这块屏幕：界面简洁，不用层层找菜单。", "UWELL 专为烟友打造这块屏幕：界面简洁，菜单一找就到。");
rep(U, `description: "UWELL built this screen for vapers: an uncluttered screen, no menus to dig through.",`, `description: "UWELL built this screen for vapers: uncluttered, with menus easy to find.",`);
console.log("fixed");
