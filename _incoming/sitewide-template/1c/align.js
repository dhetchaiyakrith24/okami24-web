// en/zh aligned to thai-copy's Thai (its list (a) + Friday's repeat-count cuts, 03/10) → copy-base.json in place.
const fs = require("fs");
const f = `${__dirname}/copy-base.json`;
const B = JSON.parse(fs.readFileSync(f, "utf8"));
const P = B["caliburn-g4-pro"], K = B["caliburn-g4-pro-koko"];
const b = P.blocks, k = K.blocks;
P.lede = { en: "The Caliburn G4 Pro runs on a touchscreen. Below, one by one, what a tap can do.", zh: "Caliburn G4 Pro 用触屏操作。下面逐项看看轻点一下能做什么。" };
b["one-tap"].title = { en: "One tap does it", zh: "轻点即可调节" };
b["one-tap"].points = b["one-tap"].points.slice(1); // size: hero + article already · "shatterproof" waits for the owner (ruling 2026-09-14)
b.themes.subline = { en: "Half ready to use, half to unlock.", zh: "一半直接可用，一半等你解锁。" };
b.themes.body = { en: "UWELL wants vaping to feel like levelling up: keep using it and the screen has something new to open.", zh: "UWELL 想让抽烟像打怪升级：一直用下去，屏幕就有新内容可解锁。" };
b.settings.title = { en: "Settings menu", zh: "设置菜单" };
b.settings.body = { en: "UWELL keeps the rest of the settings in this one menu.", zh: "UWELL 把其余设置都放在这一个菜单里。" };
b.settings.points[0].text = { en: "8 languages (no Thai)", zh: "8 种语言（不含泰语）" };
b.battery.body = { en: "How long yours lasts depends on how often you vape and the wattage you set.", zh: "实际能用几天，取决于抽吸频率和设定的功率。" };
b.battery.points[1].text = { en: "Up to 7 days of use (UWELL's figure)", zh: "最长使用 7 天（UWELL 数据）" };
P.article.en = [
  { heading: "G4 Pro or G4 Pro KOKO?", paragraphs: ["Both have a touchscreen, up to 35W and GPP pods.", "The G4 Pro is the slim one, with the bigger 2.51-inch screen, at about 78g.", "The [G4 Pro KOKO](/products/caliburn-g4-pro-koko) is the box-shaped one, with a bigger 2000mAh battery, about 93g, and five blind-draw screen themes.", "Pick the shape you like."] },
  { heading: "How is the G4 Pro different from the G4?", paragraphs: ["The [G4](/products/caliburn-g4) has a 0.85-inch colour screen, one button to run it and two modes.", "The G4 Pro runs on a touchscreen, adds the Custom mode and has a bigger battery."] },
];
P.article.zh = [
  { heading: "G4 Pro 还是 G4 Pro KOKO？", paragraphs: ["两款都有触屏、最高 35W，都用 GPP 烟弹。", "G4 Pro 是纤长款，屏幕更大，2.51 英寸，约 78g。", "[G4 Pro KOKO](/products/caliburn-g4-pro-koko) 是方盒款，电池更大，2000mAh，约 93g，还有 5 款盲抽屏幕主题。", "喜欢哪种造型就选哪款。"] },
  { heading: "G4 Pro 和 G4 有什么不同？", paragraphs: ["[G4](/products/caliburn-g4) 是 0.85 英寸彩屏，一个按键操作，有两种模式。", "G4 Pro 用触屏操作，多了 Custom 模式，电池也更大。"] },
];
K.lede = { en: "The G4 Pro KOKO is a box-shaped device run from a touchscreen, with screen themes to collect.", zh: "G4 Pro KOKO 是方盒机身，用触屏操作，还有屏幕主题可以收集。" };
k["blind-draw"].title = { en: "Blind-draw themes", zh: "盲抽主题" };
k["blind-draw"].subline = { en: "You don't know which one you get until it opens.", zh: "打开之前，不知道会抽到哪款。" };
k["blind-draw"].body = { en: "The themes come from UWELL's blind-draw card game — collecting them is fun of its own.", zh: "主题来自 UWELL 的盲抽卡牌游戏，收集本身就是一种乐趣。" };
k["blind-draw"].points = [{ text: { en: "5 screen themes", zh: "5 款屏幕主题" }, specKey: "themes" }];
k["one-tap"].title = { en: "Core features in one tap", zh: "核心功能，一触即达" };
k["one-tap"].body = { en: "UWELL built this screen for vapers: an uncluttered screen, no menus to dig through.", zh: "UWELL 专为烟友打造这块屏幕：界面简洁，不用层层找菜单。" };
k.screen.title = { en: "Ultra-shatterproof screen", zh: "超防摔屏幕" };
k.screen.subline = { en: "Superb hand feel.", zh: "手感出众。" };
k.screen.body = { en: "Minimal bezels and an ergonomic curve that sits snugly in the hand.", zh: "窄边框加人体工学曲线，握在手里很贴合。" };
k.battery.title = { en: "Long battery life", zh: "续航持久" };
k.battery.subline = { en: "2000mAh.", zh: "2000mAh。" };
k.battery.body = { en: "One full charge lasts up to 10 days (UWELL lab tests).", zh: "充满一次最长可用 10 天（UWELL 实验室数据）。" };
k.battery.points = k.battery.points.slice(0, 1); // 35W: hero + article already
k.naming.title = { en: "Name your device", zh: "给设备起名" };
k.naming.body = { en: "Switch on Clean UI and type the name on the screen; the other settings sit in the same menu.", zh: "开启 Clean UI，直接在屏幕上输入名字；其他设置也在同一菜单里。" };
k.naming.points[0].text = { en: "8 languages (no Thai)", zh: "8 种语言（不含泰语）" };
k.modes.title = { en: "Three modes", zh: "三种模式" };
k.modes.body = { en: "Storm for an instant throat hit, Waves for a smooth, steady taste, Customize set the way you like.", zh: "Storm 即时击喉，Waves 口感顺滑稳定，Customize 按你喜欢的来设定。" };
K.article.en = [{ heading: "G4 Pro KOKO or G4 Pro?", paragraphs: ["Both have a touchscreen, up to 35W and GPP pods.", "The KOKO is the box-shaped one, with the bigger battery, at about 93g.", "The [G4 Pro](/products/caliburn-g4-pro) is the slim one: a 2.51-inch screen, 1800mAh, about 78g.", "Pick the shape you like."] }];
K.article.zh = [{ heading: "G4 Pro KOKO 还是 G4 Pro？", paragraphs: ["两款都有触屏、最高 35W，都用 GPP 烟弹。", "KOKO 是方盒款，电池更大，约 93g。", "[G4 Pro](/products/caliburn-g4-pro) 是纤长款：2.51 英寸屏，1800mAh，约 78g。", "喜欢哪种造型就选哪款。"] }];
fs.writeFileSync(f, JSON.stringify(B, null, 1));
console.log("aligned");
