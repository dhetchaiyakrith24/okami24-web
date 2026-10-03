// checker round 1 (batch 1c, 03/10): (1) "Superb hand feel" / 手感出众 = a boast without a number → plain words · (2) fits-with box said
// top-fill while the page now says top or side (UWELL's pod chart) → gppSideTopCompatibility, as G5 · (3) "menus easy to find" is not
// UWELL's ("intuitive, no cluttered interfaces") · (4) G4 Pro story-pods has alpha → transparent · (5) "ultra-shatterproof" (a durability
// word without a number) held back on KOKO too, until the owner decides for both pages.
const fs = require("fs");
const rep = (f, a, b, n = 1) => {
  const s = fs.readFileSync(f, "utf8");
  const c = s.split(a).length - 1;
  if (c !== n) throw new Error(`${f}: ${c} hits for ${a.slice(0, 50)}`);
  fs.writeFileSync(f, s.split(a).join(b));
};
const S = "src/i18n/story-copy.ts", U = "src/data/products/uwell.ts", T = "src/i18n/product-copy-th.ts";
// (1) + (5) KOKO screen block
rep(S, `title: { th: "จอแตกยาก", en: "Ultra-shatterproof screen", zh: "超防摔屏幕" },`, `title: { th: "จอทัช 2.0 นิ้ว", en: "2.0-inch touchscreen", zh: "2.0 英寸触屏" },`);
rep(S, `subline: { th: "จับแล้วถนัดมือ", en: "Superb hand feel.", zh: "手感出众。" },`, `subline: { th: "จับแล้วถนัดมือ", en: "Comfortable in the hand.", zh: "握感舒适。" },`);
rep(U, `title: "Ultra-shatterproof screen",`, `title: "2.0-inch touchscreen",`);
rep(U, `subline: "Superb hand feel.",`, `subline: "Comfortable in the hand.",`);
rep(U, `{ key: "screen", label: "Display", value: "2.0\\" ultra-shatterproof touchscreen",`, `{ key: "screen", label: "Display", value: "2.0\\" touchscreen",`);
rep(T, `screen: "จอทัชสกรีน 2.0 นิ้ว ออกแบบให้แตกยาก",`, `screen: "จอทัชสกรีน 2.0 นิ้ว",`);
rep(U, `alt: "Official UWELL poster — the KOKO's ultra-shatterproof screen"`, `alt: "Official UWELL poster — the KOKO's screen, \\"Ultra-Shatterproof Screen\\" printed by UWELL"`);
// (2) fits-with
rep(U, `compatibility: [gppCompatibility, g3PodCompatibility, usbCNoNote],`, `compatibility: [gppSideTopCompatibility, g3PodCompatibility, usbCNoNote],`, 2);
rep(U, `// G5 only for now; the shared note above ("top-fill") is re-checked per product in the UWELL batch.`, `// G5, G4 Pro, G4 Pro KOKO (batch 1c — UWELL's pod chart shows top and side refill); the shared note above ("top-fill") is re-checked per product in the UWELL batch.`);
// (3) KOKO one-tap
rep(S, `th: "UWELL ออกแบบจอนี้ให้คนสูบพอตโดยเฉพาะ หน้าจอโล่งสะอาดตา หาเมนูเจอง่าย",`, `th: "UWELL ออกแบบจอนี้ให้คนสูบพอตโดยเฉพาะ หน้าจอโล่งสะอาดตา ใช้งานง่าย",`);
rep(S, `en: "UWELL built this screen for vapers: uncluttered, with menus easy to find.",`, `en: "UWELL built this screen for vapers: uncluttered and intuitive.",`);
rep(S, `zh: "UWELL 专为烟友打造这块屏幕：界面简洁，菜单一找就到。",`, `zh: "UWELL 专为烟友打造这块屏幕：界面简洁，操作直观。",`);
rep(U, `description: "UWELL built this screen for vapers: uncluttered, with menus easy to find.",`, `description: "UWELL built this screen for vapers: uncluttered and intuitive.",`);
// (4) G4 Pro pods poster floats like KOKO's
rep(U, `sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro", width: 1800, height: 1201 },`, `sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro", width: 1800, height: 1201, transparent: true },`);
console.log("fixed");
