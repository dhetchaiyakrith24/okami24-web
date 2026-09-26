/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Thai line-break scan (round 30.4ค closing, 2026-09-16). Loads each page in headless Chrome at the
// given widths, measures where every wrapped Thai text node actually breaks, and reports the breaks
// that read wrong: inside a dictionary word (ICU), inside a locked compound, a negation ("ไม่/ยัง")
// left at a line end, a number split from its Thai unit, a Latin term split across lines, and a
// single short word alone on the last line. Replaces shooting 100+ screenshots for the eye.
//
//   node scripts/wordbreak-scan.js [--base http://localhost:3412] [--widths 390,1440] [--out dir] [/path ...]
//   no paths → every URL in <base>/sitemap.xml · JSON per page/width in --out (default _incoming/wordbreak) ·
//   summary table (markdown) on stdout. Needs Chrome (CHROME_PATH) and a running `next start`.
//
// Companion: src/lib/thai-typography.ts fixes the classes this scan finds (no-break space before ๆ /
// between number and unit / inside two-word model names; the owner's joiner exceptions).
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const base = opt("--base", "http://localhost:3412");
const widths = opt("--widths", "390,1440").split(",").map(Number);
const outDir = opt("--out", "_incoming/wordbreak");
// --wait <ms> = the old fixed sleep after navigation (was always 8000). Not given = wait until the page is ready
// (scripts/page-ready.js, round "cloud" 2026-09-26 — proved against a fixed-wait control run, _incoming/cloud-round/).
const fixedWait = opt("--wait", null) == null ? null : +opt("--wait");
const { waitReady, docStamp } = require("./page-ready");
const paths = args.filter((a, i) => a.startsWith("/") && !args[i - 1]?.startsWith("--"));
const { CHROME, FLAGS, TMP } = require("./lib/chrome"); // Windows: same Chrome as before · cloud: Chromium, found by search
const AGE_KEY = process.env.AGE_KEY || "okami24-age-verified";

// ---- in-page measurement (runs in Chrome) ----------------------------------------------------
const EVAL = String.raw`(() => {
  const seg = new Intl.Segmenter("th", { granularity: "word" });
  const TH = /\p{Script=Thai}/u;
  const COMPOUNDS = ["หัวพอต","พอตซิสเต็ม","ใช้แล้วทิ้ง","พอตคิท","ตัวเครื่อง","เรียบง่าย","ยังไม่ยืนยัน","ยืนยัน","ผลไม้","ตอนนี้","ข้างใน","แบตเตอรี่","ช่องลม","กลุ่มรส","ร้านพอต","คนขาย","กล่าวอ้าง","ควันออก","เต็มรูปแบบ","การชาร์จ","ของคุณ","หวานกว่า","เป็นหลัก","ที่สุด","ดีที่สุด","ติดป้าย","ให้เอง","มาให้","แต่ละขวด","ไม่ต้อง","ตอนซื้อ","แน่นแบบ","โล่งแบบ","จอทัชสกรีน","จอทัช","เบเกอรี่","แนวการสูบ","เครื่องระบบสวิตช์","ชาร์จซ้ำ","บรรจุสำเร็จ","เติมด้านบน","รุ่นเรือธง","ระบบหัวพอต","ค่าโอห์ม","ความเข้มข้น","ปุ่มยิง","แหวนปรับลม","รายการโปรด","ตัวช่วยเลือกสินค้า"];
  const UNITS = /^(วัตต์|โอห์ม|พัฟ|นิ้ว|กรัม|นาที|วัน|สี|รส|กลิ่น|รายการ|รุ่น|โหมด|ก้าน|หัว|ชิ้น|ครั้ง|บาท)/;
  const SKIP = new Set(["SCRIPT","STYLE","NOSCRIPT","TEMPLATE"]);
  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue;
    if (!text || !TH.test(text) || text.trim().length < 4) continue;
    const el = node.parentElement;
    if (!el || SKIP.has(el.tagName) || el.closest("[aria-hidden=true]")) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const range = document.createRange(); const n = text.length; const tops = new Array(n).fill(null);
    for (let i = 0; i < n; i++) { if (text[i] === " " || text[i] === "\n") continue; range.setStart(node, i); range.setEnd(node, i + 1); const r = range.getClientRects()[0]; if (r && r.width > 0) tops[i] = Math.round(r.top); }
    const lines = []; let cur = null;
    for (let i = 0; i < n; i++) { if (tops[i] == null) continue; if (!cur || Math.abs(tops[i] - cur.top) > 3) { cur = { top: tops[i], start: i, end: i }; lines.push(cur); } else cur.end = i; }
    if (lines.length < 2) continue;
    const lineOf = (i) => { for (let k = 0; k < lines.length; k++) if (i >= lines[k].start && i <= lines[k].end) return k; return -1; };
    const issues = [];
    for (const w of [...seg.segment(text)].filter((w) => w.isWordLike)) { if (!TH.test(w.segment) || w.segment.length < 2) continue; const a = lineOf(w.index), b = lineOf(w.index + w.segment.length - 1); if (a >= 0 && b >= 0 && a !== b) issues.push({ type: "mid-word", word: w.segment }); }
    for (const c of COMPOUNDS) { let idx = text.indexOf(c); while (idx >= 0) { const a = lineOf(idx), b = lineOf(idx + c.length - 1); if (a >= 0 && b >= 0 && a !== b) issues.push({ type: "compound-split", word: c }); idx = text.indexOf(c, idx + 1); } }
    for (let k = 0; k < lines.length - 1; k++) { const lt = text.slice(lines[k].start, lines[k].end + 1).trim(); const nt = text.slice(lines[k + 1].start, lines[k + 1].end + 1).trim(); const lw = [...seg.segment(lt)].filter((w) => w.isWordLike).pop();
      if (lw && /^(ไม่|ยัง|ไม่ใช่|ไม่ได้)$/.test(lw.segment)) issues.push({ type: "negation-at-line-end", lineEnd: lt.slice(-30), nextStart: nt.slice(0, 20) });
      if (/[0-9.,–-]$/.test(lt) && UNITS.test(nt)) issues.push({ type: "number-unit-split", lineEnd: lt.slice(-18), nextStart: nt.slice(0, 12) });
      if (/[A-Za-z]$/.test(lt) && /^[A-Za-z]/.test(nt)) issues.push({ type: "latin-term-split", lineEnd: lt.slice(-18), nextStart: nt.slice(0, 18) }); }
    const last = lines[lines.length - 1]; const lastText = text.slice(last.start, last.end + 1).trim();
    if ([...seg.segment(lastText)].filter((w) => w.isWordLike).length <= 1 && lastText.length <= 10) issues.push({ type: "single-word-last-line", word: lastText });
    if (issues.length) { const r = el.getBoundingClientRect(); out.push({ tag: el.tagName.toLowerCase(), y: Math.round(r.top + window.scrollY), h: Math.round(r.height), text: text.slice(0, 100), lines: lines.length, issues }); }
  }
  return JSON.stringify(out);
})()`;

// ---- Chrome driver (CDP, same sequence as scripts/shot.js) ----------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function measure(url, width) {
  const port = 9333 + Math.floor(Math.random() * 500);
  const profile = `${TMP}/okami-wbscan-${process.pid}-${port}`;
  const chrome = spawn(CHROME, [...FLAGS, `--remote-debugging-port=${port}`, "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars", `--user-data-dir=${profile}`, "--window-size=1200,900", "about:blank"], { stdio: "ignore" });
  const getJson = (p) => new Promise((res, rej) => http.get(`http://127.0.0.1:${port}${p}`, (r) => { let b = ""; r.on("data", (c) => (b += c)); r.on("end", () => res(JSON.parse(b))); }).on("error", rej));
  try {
    let target = null;
    for (let i = 0; i < 60 && !target; i++) { try { const list = await getJson("/json/list"); target = list.find((t) => t.type === "page"); } catch { /* not up yet */ } if (!target) await sleep(500); }
    if (!target) throw new Error("Chrome DevTools endpoint never appeared");
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let id = 0; const pending = new Map();
    ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); clearTimeout(p.timer); pending.delete(m.id); p.r(m); } };
    const send = (method, params = {}) => new Promise((r, rej) => { const i = ++id; const timer = setTimeout(() => { if (pending.has(i)) { pending.delete(i); rej(new Error(`${method} timed out`)); } }, 60000); pending.set(i, { r, timer }); ws.send(JSON.stringify({ id: i, method, params })); });
    await send("Page.enable"); await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{localStorage.setItem(${JSON.stringify(AGE_KEY)},"true")}catch(e){}` });
    const stamp = await docStamp(send);
    await send("Page.navigate", { url });
    if (fixedWait != null) await sleep(fixedWait); else { const rd = await waitReady(send, stamp); if (rd.how !== "ready") process.stderr.write(`page-ready ${url} @${width}: ${rd.how} after ${rd.total} ms\n`); }
    await send("Runtime.evaluate", { expression: "window.scrollTo(0,0)" }); await sleep(300);
    const { result } = await send("Runtime.evaluate", { expression: "Math.min(document.documentElement.scrollHeight, 4000)", returnByValue: true });
    await send("Emulation.setDeviceMetricsOverride", { width, height: result.result.value, deviceScaleFactor: 1, mobile: width < 768 });
    await sleep(600);
    const r = await send("Runtime.evaluate", { expression: EVAL, returnByValue: true, awaitPromise: true });
    if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.text);
    ws.close();
    return JSON.parse(r.result.result.value);
  } finally {
    chrome.kill();
    setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* best effort */ } }, 500);
  }
}

(async () => {
  let urls = paths;
  if (urls.length === 0) {
    const sm = await (await fetch(`${base}/sitemap.xml`)).text();
    urls = [...new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, "")))];
  }
  fs.mkdirSync(outDir, { recursive: true });
  const byType = {};
  for (const u of urls) for (const w of widths) {
    const name = `${u.replace(/^\//, "").replace(/[/?=,&]+/g, "_") || "home"}-${w}`;
    let found;
    try { found = await measure(base + u, w); } catch (e) { console.error(`FAIL ${u} @${w}: ${e.message}`); continue; }
    fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(found));
    for (const e of found) for (const i of e.issues) {
      const key = `${i.type}|${e.text.slice(0, 40)}|${i.word || i.lineEnd || ""}`;
      const g = (byType[i.type] ??= new Map()).get(key) ?? { pages: new Set(), e, i };
      g.pages.add(`${u}@${w}`); byType[i.type].set(key, g);
    }
    process.stderr.write(`${name}: ${found.length} element(s) flagged\n`);
  }
  console.log(`# Thai line-break scan — ${urls.length} page(s) × ${widths.join("/")} · base ${base}\n`);
  for (const [type, map] of Object.entries(byType)) {
    console.log(`## ${type} — ${map.size}\n\n| n | page@width | element | text | detail |\n|---|---|---|---|---|`);
    for (const g of [...map.values()].sort((a, b) => b.pages.size - a.pages.size)) {
      const pages = [...g.pages]; const where = pages.length > 6 ? `${pages.length} pages (e.g. ${pages.slice(0, 3).join(" · ")})` : pages.join(" · ");
      const detail = g.i.word ? `«${g.i.word}»` : `…${g.i.lineEnd} | ${g.i.nextStart}…`;
      console.log(`| ${pages.length} | ${where} | ${g.e.tag} y=${g.e.y} | ${g.e.text.slice(0, 70).replace(/\|/g, "\\|")} | ${detail.replace(/\|/g, "\\|")} |`);
    }
    console.log("");
  }
})().catch((e) => { console.error(e.message || e); process.exit(1); });
