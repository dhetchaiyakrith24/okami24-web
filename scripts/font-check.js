/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Font gate for screenshots and scans: which font really drew each piece of text, per page, as Chrome reports it
// (CDP CSS.getPlatformFontsForNode — the fonts used for the glyphs, not the CSS font-family list). Round "mobile",
// 2026-09-26: an image or a line-break scan made on a machine whose fonts differ from the site's is not proof.
//
//   node scripts/font-check.js --base <origin> [--out <file.json>] [--width 390] [--thai-font "<family>"] [--block-webfonts] [/path ...]
//        no paths → / + the first product page + the first guide in <base>/sitemap.xml
//
// What the site loads itself (src/app/layout.tsx, next/font): Barlow Condensed · Inter · IBM Plex Mono, LATIN subset
// only. It ships NO Thai (or Chinese) font — Thai text is always drawn by the visitor's own system font (Windows:
// Leelawadee UI · Android: Noto Sans Thai · iPhone: Thonburi · the cloud: whatever fontconfig picks). So the gate is:
//   1 latin    — every glyph of Latin-only text comes from a web font the site loaded (isCustomFont). A system font here
//                = the web fonts did not load → FAIL (proved red with --block-webfonts, which blocks .woff/.woff2).
//   2 thai     — the system font drawing Thai is the expected one for this machine: --thai-font, default
//                "Noto Sans Thai" off Windows (installed by scripts/prepare-clone.js step 6 — what Android visitors see),
//                "Leelawadee UI" on Windows · anything else (e.g. Loma, the cloud image's own Thai font) → FAIL.
//   3 missing  — a glyph drawn by "Last Resort"/an unnamed font (the tofu box) → FAIL.
// Chinese / other scripts are listed, not judged (no expected font is set for them yet).
// Exit 0 = PASS on every page · 1 = a rule failed · 2 = usage. Machine + Chrome version are written with the result.
const fs = require("fs");
const http = require("http");
const { spawn } = require("child_process");
const { CHROME, FLAGS, TMP, MACHINE } = require("./lib/chrome");

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const WITH_VALUE = ["--base", "--out", "--width", "--thai-font"];
const base = (opt("--base") || "").replace(/\/$/, "");
if (!base) { console.error("usage: node scripts/font-check.js --base <origin> [--out f.json] [--width 390] [--thai-font name] [--block-webfonts] [/path ...]"); process.exit(2); }
const width = +opt("--width", "390");
const THAI_FONT = opt("--thai-font", process.platform === "win32" ? "Leelawadee UI" : "Noto Sans Thai");
const block = args.includes("--block-webfonts");
const AGE_KEY = process.env.AGE_KEY || "okami24-age-verified";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Marks up to 600 elements that directly hold visible text, with the scripts their own text uses.
const MARK = `(() => {
  const out = []; const seen = new Set();
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n && out.length < 600; n = w.nextNode()) {
    const el = n.parentElement; if (!el || seen.has(el)) continue;
    if (["SCRIPT","STYLE","NOSCRIPT","TEMPLATE"].includes(el.tagName)) continue;
    const own = [...el.childNodes].filter((c) => c.nodeType === 3).map((c) => c.data).join("");
    if (!own.trim()) continue;
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (!r.width || !r.height || cs.visibility === "hidden" || cs.display === "none") continue;
    seen.add(el);
    // Chrome's per-node font report covers the element's whole subtree, so the scripts are read from textContent.
    const all = el.textContent;
    const thai = /[\\u0E00-\\u0E7F]/.test(all), latin = /[A-Za-z]/.test(all), cjk = /[\\u3400-\\u9FFF]/.test(all);
    // "other" = characters no font of the site is expected to hold (arrows, dots, the U+2060 the Thai typography
    // inserts, NBSP): a system font may draw these, as many glyphs as there are such characters and no more.
    const other = [...all].filter((ch) => !/[\\x20-\\x7E\\u0E00-\\u0E7F\\s]/.test(ch) || ch === "\\u00a0").length;
    el.setAttribute("data-fontcheck", String(out.length));
    out.push({ i: out.length, tag: el.tagName.toLowerCase(), thai, latin, cjk, other, text: own.replace(/\\s+/g, " ").trim().slice(0, 60) });
  }
  return JSON.stringify(out);
})()`;

async function main() {
  let paths = args.filter((a, i) => a.startsWith("/") && !WITH_VALUE.includes(args[i - 1]));
  if (!paths.length) {
    const sm = await (await fetch(`${base}/sitemap.xml`)).text();
    const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/");
    paths = ["/", locs.find((p) => p.startsWith("/products/")), locs.find((p) => p.startsWith("/guides/"))].filter(Boolean);
  }
  const port = 9333 + Math.floor(Math.random() * 500);
  const profile = `${TMP}/okami-fontcheck-${process.pid}-${port}`;
  const chrome = spawn(CHROME, [...FLAGS, `--remote-debugging-port=${port}`, "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars", `--user-data-dir=${profile}`, "--window-size=1200,900", "about:blank"], { stdio: "ignore" });
  const getJson = (p) => new Promise((res, rej) => http.get(`http://127.0.0.1:${port}${p}`, (r) => { let b = ""; r.on("data", (c) => (b += c)); r.on("end", () => res(JSON.parse(b))); }).on("error", rej));
  const report = { machine: MACHINE, chrome: null, base, width, thaiFont: THAI_FONT, blockedWebfonts: block, date: new Date().toISOString(), pages: [] };
  let failed = 0;
  try {
    let target = null;
    for (let i = 0; i < 40 && !target; i++) {
      try { target = (await getJson("/json/list")).find((t) => t.type === "page"); } catch { /* not up yet */ }
      if (!target) await sleep(250);
    }
    if (!target) throw new Error(`Chrome DevTools never appeared (${CHROME})`);
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let id = 0; const pending = new Map();
    ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); clearTimeout(p.timer); pending.delete(m.id); p.r(m); } };
    const send = (method, params = {}) => new Promise((r, rej) => { const i = ++id; const timer = setTimeout(() => { if (pending.has(i)) { pending.delete(i); rej(new Error(`${method} timed out`)); } }, 60000); pending.set(i, { r, timer }); ws.send(JSON.stringify({ id: i, method, params })); });
    report.chrome = (await send("Browser.getVersion")).result?.product || null;
    await send("Page.enable"); await send("Runtime.enable"); await send("DOM.enable"); await send("CSS.enable"); await send("Network.enable");
    if (block) await send("Network.setBlockedURLs", { urls: ["*.woff2", "*.woff", "*.ttf", "*.otf"] });
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 2, mobile: width < 800 });
    await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{localStorage.setItem(${JSON.stringify(AGE_KEY)},"true")}catch(e){}` });
    const { waitReady, docStamp } = require("./page-ready");
    for (const p of paths) {
      const stamp = await docStamp(send);
      await send("Page.navigate", { url: base + p });
      await waitReady(send, stamp);
      await send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => true)", awaitPromise: true });
      const els = JSON.parse((await send("Runtime.evaluate", { expression: MARK, returnByValue: true })).result.result.value);
      const doc = await send("DOM.getDocument", { depth: 0 });
      const ids = (await send("DOM.querySelectorAll", { nodeId: doc.result.root.nodeId, selector: "[data-fontcheck]" })).result.nodeIds;
      const fonts = {}; const problems = [];
      for (const nodeId of ids) {
        const attr = (await send("DOM.getAttributes", { nodeId })).result.attributes;
        const el = els[+attr[attr.indexOf("data-fontcheck") + 1]];
        const used = (await send("CSS.getPlatformFontsForNode", { nodeId })).result?.fonts || [];
        for (const f of used) {
          const k = `${f.familyName}${f.isCustomFont ? " (web font)" : " (system)"}`;
          fonts[k] = (fonts[k] || 0) + f.glyphCount;
          if (!f.familyName || /last resort/i.test(f.familyName)) problems.push({ rule: "missing", font: f.familyName || "(none)", el });
        }
        if (el.cjk) continue; // listed in the font totals, not judged
        // System glyphs beyond the element's "other" characters: Latin (no Thai in it) → rule latin; with Thai in it,
        // everything but the expected Thai font → rule thai; and the expected Thai font must be there at all.
        const sysOther = used.filter((f) => !f.isCustomFont && f.familyName !== (el.thai ? THAI_FONT : null));
        const sysOtherGlyphs = sysOther.reduce((n, f) => n + f.glyphCount, 0);
        if (sysOtherGlyphs > el.other) problems.push({ rule: el.thai ? "thai" : "latin", font: sysOther.map((f) => `${f.familyName} ×${f.glyphCount}`).join(", "), el });
        else if (el.thai && !used.some((f) => !f.isCustomFont && f.familyName === THAI_FONT)) problems.push({ rule: "thai", font: used.map((f) => f.familyName).join(", ") || "(none)", el });
      }
      const byRule = {};
      for (const pr of problems) (byRule[pr.rule] ||= []).push(pr);
      const pass = problems.length === 0;
      if (!pass) failed++;
      report.pages.push({ path: p, elements: ids.length, pass, fonts, problems: problems.slice(0, 40), problemCount: problems.length });
      const summary = Object.entries(fonts).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(" · ");
      console.log(`${pass ? "PASS" : "FAIL"} ${p} — ${ids.length} text elements · glyphs by font: ${summary}`);
      for (const [rule, list] of Object.entries(byRule)) console.log(`     ${rule}: ${list.length} element(s), e.g. <${list[0].el.tag}> "${list[0].el.text}" drawn with ${list[0].font}`);
    }
    ws.close();
  } finally {
    chrome.kill();
    setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* best effort */ } }, 800);
  }
  if (opt("--out")) fs.writeFileSync(opt("--out"), JSON.stringify(report, null, 1));
  console.log(`font-check: ${failed ? `FAIL on ${failed} of ${report.pages.length} page(s)` : `PASS ${report.pages.length}/${report.pages.length}`} · machine ${MACHINE} · ${report.chrome} · expected Thai font "${THAI_FONT}"${block ? " · web fonts BLOCKED (red test)" : ""}`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
