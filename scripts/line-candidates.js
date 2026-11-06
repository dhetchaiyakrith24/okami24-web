/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// line-candidates.js — try Thai sentence candidates in the real element of a built page, before touching any source file
// (LESSONS 33: a guess costs a whole build, and the word-break scanner alone misses what the checker sends back).
// Promoted from the lab recipe seo-cand-driver.js (owner 06/11).
//
//   node scripts/test-server.js start            (a real build — dev breaks lines differently)
//   node scripts/line-candidates.js <file.json> [--base http://localhost:3412] [--out <result.json>] [--settle 6000]
//
// <file.json> (Thai goes in this file, never on the command line):
//   { "words": ["extra word that must not split"],            optional, for every item, on top of scripts/lib/line-words.json
//     "items": [ {
//       "id": "sup-25ml",                                     a name for the report
//       "pages": ["/products/relx-lumi-18k"],                 every page the text shows on
//       "current": "ซองของ LUMI ไม่ได้พิมพ์ตัวเลขนี้",                the text on the page now: a whole sentence or any part of it
//       "candidates": ["ปริมาณน้ำยาพิมพ์ไว้เฉพาะบนซอง ..."],          plain text, no markdown
//       "selector": "main"                                    optional: where to look (default main; "body" for header/footer)
//     } ] }
//   `current` is matched across the site's glue, so write it as plain text. It may not cross a link or other real
//   element (the report says CROSSES): give the part beside the link instead, the link stays in place.
//
// How it measures — the checker's own way:
//   · headless Chrome over CDP · 390 = 2x mobile emulation · 1440 = desktop · document.fonts.ready + 6 s settle.
//   · Closed FAQ answers are opened one at a time until `current` shows.
//   · Only the text of `current` is swapped, inside a throwaway clone of its block, never el.textContent = …: the rest of
//     the block keeps its links, no-break spaces and whitespace-nowrap spans. A candidate gets the site's real typography
//     first (scripts/lib/thai-runs.ts calls thaiTypographyNode) so it is glued as it would be on the page. One limit: a
//     JOINED entry whose `within` phrase reaches outside `current` does not fire; the fidelity check below shows it.
//   · Flags = everything wordbreak-scan raises (its own in-page code, scoped to the block) + what it cannot see across
//     text nodes: a split word from line-words.json, a number apart from its unit, ไม่/ยัง at a line end, a short word left
//     before a glued word, a Latin term split, one short word alone on the last line.
//   · Fidelity: `current` is also put back through the same swap; its lines must equal the untouched page. "FIDELITY" in
//     the report = the lines of that spot cannot be trusted, usually a `within` phrase (see above).
// A flag is not the whole verdict: a split compound missing from line-words.json is still judged by eye, so read the
// lines printed for the winner, and add the word when the checker catches one.
//
// Prints per item: the current text and each candidate with flags, then lines at 390/1440 for each one that passed.
// Writes the full result to --out (default _incoming/line-candidates/<file name>). A candidate PASSES only with no flag on
// every page × width × place. Exit: 0 every item has a passing candidate · 1 an item has none · 2 bad input, text not
// found, or no server. Local builds only — refuses the live site and port 3000 (the owner's dev server).
"use strict";
const { spawn, spawnSync } = require("child_process");
const fs = require("fs");
const http = require("http");
const path = require("path");
const { CHROME, FLAGS, TMP } = require("./lib/chrome");
const { waitReady, docStamp } = require("./page-ready");

const ROOT = path.resolve(__dirname, "..");
const WIDTHS = [390, 1440];
const AGE_KEY = "okami24-age-verified";
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const file = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
const base = opt("--base", "http://localhost:3412").replace(/\/$/, "");
const settle = +opt("--settle", 6000);
const fail = (msg) => { console.error(`line-candidates: ${msg}`); process.exit(2); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function readInput() {
  if (!file) fail("usage: node scripts/line-candidates.js <file.json> [--base <url>] [--out <file>] [--settle <ms>]");
  const u = new URL(base);
  if (!/^(localhost|127\.0\.0\.1)$/.test(u.hostname) || u.port === "3000") fail(`${base} is not a test server (a built page on localhost, not port 3000)`);
  const input = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(input.items) || !input.items.length) fail("the file has no items");
  for (const it of input.items) {
    if (!it.id || !it.current || !it.pages?.length || !it.candidates?.length) fail(`item ${it.id || "?"} needs id, pages, current, candidates`);
    if (new Set(input.items.filter((x) => x.id === it.id)).size > 1) fail(`two items are called ${it.id}`);
  }
  return input;
}

// The site's real glue for every string: [current, ...candidates] per item.
function glue(items) {
  const inFile = `${TMP}/line-cand-in-${process.pid}.json`;
  const outFile = `${TMP}/line-cand-out-${process.pid}.json`;
  const texts = items.flatMap((it) => [it.current, ...it.candidates]);
  fs.writeFileSync(inFile, JSON.stringify(texts));
  const cmd = `npx tsx scripts/lib/thai-runs.ts "${inFile}" "${outFile}"`;
  const r = process.platform === "win32"
    ? spawnSync("cmd.exe", ["/d", "/s", "/c", `"${cmd}"`], { cwd: ROOT, encoding: "utf8", windowsVerbatimArguments: true })
    : spawnSync("sh", ["-c", cmd], { cwd: ROOT, encoding: "utf8" });
  if (r.status !== 0) fail(`thai-runs failed: ${r.stderr || r.stdout}`);
  const runs = JSON.parse(fs.readFileSync(outFile, "utf8"));
  fs.rmSync(inFile, { force: true });
  fs.rmSync(outFile, { force: true });
  let at = 0;
  return items.map((it) => { const n = it.candidates.length + 1; const part = runs.slice(at, at + n); at += n; return part; });
}

// wordbreak-scan's in-page code, read from the file so there is one copy; its walker is pointed at one element.
function scannerEval() {
  const src = fs.readFileSync(path.join(__dirname, "wordbreak-scan.js"), "utf8");
  const open = "const EVAL = String.raw`";
  const start = src.indexOf(open) + open.length;
  const end = src.indexOf("})()`;", start) + "})()".length;
  const walker = "document.createTreeWalker(document.body";
  const code = src.slice(start, end);
  if (start < open.length || end < start || !code.includes(walker)) fail("wordbreak-scan.js changed shape: its EVAL block was not found");
  return code.replace(walker, "document.createTreeWalker(window.__ROOT");
}

// ---- in the page ------------------------------------------------------------------------------------------------------
const PAGE = String.raw`
window.__LC = (() => {
  const SHORT = new Set(["ของ","ใน","บน","มี","ที่","และ","กับ","แต่","หรือ","จะ","ก็","ให้","ได้","ไป","มา","คือ","นี้","ว่า","เมื่อ","แล้ว","ถ้า","จึง","ซึ่ง","จาก","ตาม"]);
  const NEG = new Set(["ไม่","ยัง","ไม่ใช่","ไม่ได้"]);
  const seg = new Intl.Segmenter("th", { granularity: "word" });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const isGlue = (e) => e.hasAttribute("data-tj") || e.hasAttribute("data-tjw");
  function blockOf(node) {
    for (let e = node.parentElement; e; e = e.parentElement) {
      if (e === document.body) return e;
      if (!isGlue(e) && getComputedStyle(e).display !== "inline") return e; // the glue wrapper is blockified in a flex parent
    }
    return document.body;
  }
  const textNodes = (root) => { const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); const out = []; let n; while ((n = w.nextNode())) { if (!/^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.parentElement.tagName)) out.push(n); } return out; };
  const ownNodes = (block) => textNodes(block).filter((n) => blockOf(n) === block);
  // plain text of a block: site glue read back as spaces, whitespace collapsed, each character mapped to its node + offset
  function index(nodes) {
    let s = ""; const map = [];
    for (const n of nodes) for (let i = 0; i < n.data.length; i++) {
      let c = n.data[i];
      if (c === "⁠") continue;
      if (/[\s ]/.test(c)) { if (s.endsWith(" ")) continue; c = " "; }
      s += c; map.push([n, i]);
    }
    return { s, map };
  }
  const plain = (t) => index([document.createTextNode(t)]).s.trim();
  function rangeOf(ix, start, len) {
    const r = document.createRange(); const a = ix.map[start], b = ix.map[start + len - 1];
    r.setStart(a[0], a[1]); r.setEnd(b[0], b[1] + 1);
    return r;
  }
  function hits(selector, want) {
    const out = [];
    const scope = document.querySelector(selector); if (!scope) return out;
    const groups = new Map();
    for (const n of textNodes(scope)) { const b = blockOf(n); if (!groups.has(b)) groups.set(b, []); groups.get(b).push(n); }
    for (const [block, nodes] of groups) {
      const ix = index(nodes);
      for (let at = ix.s.indexOf(want); at >= 0; at = ix.s.indexOf(want, at + 1)) {
        out.push({ block, start: at, visible: rangeOf(ix, at, want.length).getClientRects().length > 0 });
      }
    }
    return out;
  }
  // a real element the text runs into or out of: swapping would pull its text out of it
  function crossing(block, ix, start, len) {
    const r = rangeOf(ix, start, len);
    const bad = [...block.querySelectorAll("*")].find((e) => !isGlue(e) && r.intersectsNode(e) && !(e.contains(r.startContainer) && e.contains(r.endContainer)));
    return bad ? bad.tagName.toLowerCase() : "";
  }
  function lines(block) {
    const out = []; let cur = null; const r = document.createRange();
    for (const n of ownNodes(block)) for (let i = 0; i < n.data.length; i++) {
      const ch = n.data[i];
      if (ch === "⁠") continue;
      if (/[ \t\r\n]/.test(ch)) { if (cur) cur.t += " "; continue; }
      r.setStart(n, i); r.setEnd(n, i + 1);
      const b = r.getClientRects()[0];
      if (!b || b.width === 0) { if (cur) cur.t += ch; continue; }
      if (!cur || (b.top + b.bottom) / 2 > cur.bottom) { cur = { t: "", bottom: b.bottom, glued: !!n.parentElement.closest("[data-tj]") }; out.push(cur); }
      cur.t += ch; cur.bottom = Math.max(cur.bottom, b.bottom);
    }
    return out;
  }
  const lastWord = (s) => [...seg.segment(s)].filter((w) => w.isWordLike).pop()?.segment || "";
  function breakFlags(a, b, words) {
    const flags = [];
    const L = a.t.replace(/ /g, " "), R = b.t.replace(/ /g, " ");
    const left = L.trimEnd(), right = R.trimStart(), gap = L !== left;
    const mark = left.slice(-7) + "|" + right.slice(0, 7);
    if (/(\d|หนึ่ง|สอง|สาม|สี่|ห้า|สิบ)$/.test(left) && /^(ก้อน|ลิตร|นาที|วัน|ชั่วโมง|คน|ตัว|ใบ|ครั้ง|mL|Wh|มวน)/.test(right)) flags.push("number-unit:" + mark);
    if (NEG.has(lastWord(left))) flags.push("negation-at-line-end:" + mark);
    if (/[A-Za-z0-9]$/.test(left) && /^[A-Za-z-]/.test(right)) flags.push("latin-term-split:" + mark);
    if (!gap) {
      if (b.glued && SHORT.has(lastWord(left))) flags.push("short-word-before-glue:" + mark);
      for (const w of words) for (let k = 1; k < w.length; k++) if (left.endsWith(w.slice(0, k)) && right.startsWith(w.slice(k))) { flags.push("word-split:" + w.slice(0, k) + "|" + w.slice(k)); break; }
    }
    return flags;
  }
  function measure(block, words) {
    window.__ROOT = block;
    const flags = JSON.parse((0, eval)(window.__LC_EVAL)).flatMap((x) => x.issues.map((s) => s.type + ":" + (s.word || s.lineEnd || "")));
    const L = lines(block);
    for (let j = 0; j < L.length - 1; j++) flags.push(...breakFlags(L[j], L[j + 1], words));
    if (/^(P|LI)$/.test(block.tagName) && L.length > 1 && L[L.length - 1].t.replace(/\s/g, "").length <= 7) flags.push("short-last-line:" + L[L.length - 1].t.trim());
    return { flags: [...new Set(flags)], lines: L.map((l) => l.t.replace(/ /g, "~").trim()) };
  }
  function fragment(runs) {
    const f = document.createDocumentFragment();
    for (const r of runs) {
      if (r.nowrap) { const s = document.createElement("span"); s.className = "whitespace-nowrap"; s.setAttribute("data-tj", ""); s.textContent = r.t; f.append(s); }
      else f.append(document.createTextNode(r.t));
    }
    return f;
  }
  // swap inside a clone so the live block (React's nodes) is untouched and each trial starts clean
  function trial(hit, len, runs, words) {
    const clone = hit.block.cloneNode(true);
    hit.block.replaceWith(clone);
    try {
      const r = rangeOf(index(ownNodes(clone)), hit.start, len);
      r.deleteContents(); r.insertNode(fragment(runs));
      clone.normalize(); // the swapped text and its neighbours are one text node, as on the page: the scanner reads per node
      return measure(clone, words);
    } finally { clone.replaceWith(hit.block); }
  }
  const isOpen = (b) => b.tagName === "SUMMARY" ? b.parentElement.open : b.getAttribute("aria-expanded") === "true";
  async function reveal(selector, want) {
    const scope = document.querySelector(selector);
    const count = scope.querySelectorAll("button[aria-expanded],summary").length;
    for (let i = 0; i < count; i++) {
      const all = [...scope.querySelectorAll("button[aria-expanded],summary")]; const btn = all[i]; if (!btn) break;
      for (const o of all) if (o !== btn && isOpen(o)) { o.click(); await wait(300); }
      if (!isOpen(btn)) { btn.click(); await wait(600); }
      const found = hits(selector, want);
      if (found.some((h) => h.visible)) return found;
    }
    return hits(selector, want);
  }
  async function run(items) {
    const out = {};
    for (const it of items) {
      const want = plain(it.current), selector = it.selector || "main", words = it.words;
      let found = hits(selector, want), opened = false;
      if (!found.some((h) => h.visible)) { found = await reveal(selector, want); opened = found.some((h) => h.visible); }
      const seen = found.filter((h) => h.visible);
      const rows = [];
      for (const h of seen) {
        const ix = index(ownNodes(h.block));
        const crosses = crossing(h.block, ix, h.start, want.length);
        if (crosses) { rows.push({ tag: h.block.tagName.toLowerCase(), crosses }); continue; }
        const live = measure(h.block, words);
        const echo = trial(h, want.length, it.runs[0], words);
        rows.push({ tag: h.block.tagName.toLowerCase(), live, faithful: JSON.stringify(echo.lines) === JSON.stringify(live.lines), echo: echo.lines,
          cands: it.runs.slice(1).map((runs) => trial(h, want.length, runs, words)) });
      }
      out[it.id] = { found: found.length, shown: seen.length, opened, rows };
    }
    return JSON.stringify(out);
  }
  return { run };
})();
`;

// ---- Chrome ------------------------------------------------------------------------------------------------------------
function getJson(port, p) {
  return new Promise((res, rej) => http.get(`http://127.0.0.1:${port}${p}`, (r) => { let b = ""; r.on("data", (c) => (b += c)); r.on("end", () => { try { res(JSON.parse(b)); } catch (e) { rej(e); } }); }).on("error", rej));
}
function serverUp() {
  return new Promise((res) => { const q = http.get(base + "/", (r) => { r.resume(); res(r.statusCode < 500); }); q.on("error", () => res(false)); q.setTimeout(20000, () => { q.destroy(); res(false); }); });
}
async function open() {
  const port = 9700 + Math.floor(Math.random() * 200);
  const profile = `${TMP}/line-cand-profile-${process.pid}`;
  const chrome = spawn(CHROME, [...FLAGS, `--remote-debugging-port=${port}`, "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars", `--user-data-dir=${profile}`, "--window-size=1200,900", "about:blank"], { stdio: "ignore" });
  const close = () => { chrome.kill(); };
  let target = null;
  for (let i = 0; i < 60 && !target; i++) { try { target = (await getJson(port, "/json/list")).find((t) => t.type === "page"); } catch { /* not up yet */ } if (!target) await sleep(500); }
  if (!target) { close(); fail("Chrome DevTools endpoint never appeared"); }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); clearTimeout(p.timer); pending.delete(m.id); p.r(m); } };
  const send = (method, params = {}) => new Promise((r, rej) => { const i = ++id; const timer = setTimeout(() => { pending.delete(i); rej(new Error(`${method} timed out`)); }, 120000); pending.set(i, { r, timer }); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expression) => { const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 600)); return r.result?.result?.value; };
  await send("Page.enable"); await send("Runtime.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{localStorage.setItem(${JSON.stringify(AGE_KEY)},"true")}catch(e){}` });
  return { send, ev, close: () => { ws.close(); close(); setTimeout(() => fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5 }), 400); } };
}
async function setWidth(send, w) {
  const desktop = w >= 1000;
  await send("Emulation.setDeviceMetricsOverride", desktop ? { width: w, height: 900, deviceScaleFactor: 1, mobile: false } : { width: w, height: 800, deviceScaleFactor: 2, mobile: true });
  await send("Emulation.setUserAgentOverride", { userAgent: desktop ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36" : "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
}

// ---- report ------------------------------------------------------------------------------------------------------------
function report(input, measured) {
  let stuck = 0, missing = 0;
  const verdicts = {};
  for (const it of input.items) {
    const places = measured.filter((m) => m.id === it.id);
    const lost = places.filter((m) => !m.shown);
    const crossed = places.flatMap((m) => m.rows.filter((r) => r.crosses).map((r) => `${m.page} @${m.width}: <${r.crosses}>`));
    const rows = places.flatMap((m) => m.rows.filter((r) => !r.crosses).map((r) => ({ ...r, at: `${m.page} @${m.width} ${r.tag}${m.opened ? " (opened)" : ""}` })));
    console.log(`\n## ${it.id}  ${it.current.slice(0, 50)}`);
    for (const m of lost) console.log(`   NOT FOUND ${m.page} @${m.width} (in the page ${m.found} time(s), none shown)`);
    for (const c of crossed) console.log(`   CROSSES ${c}: give the part beside that element`);
    if (lost.length || crossed.length) missing++;
    for (const r of rows) if (!r.faithful) console.log(`   FIDELITY ${r.at}: the swap moved the lines of the current text — live «${r.live.lines.join(" ▌ ")}» swapped «${r.echo.join(" ▌ ")}»`);
    const nowFlags = [...new Set(rows.flatMap((r) => r.live.flags))];
    if (rows.length) console.log(`   current: ${nowFlags.length ? "flags " + nowFlags.join(" · ") : "clean"}`);
    const passed = [];
    it.candidates.forEach((text, i) => {
      const flags = rows.flatMap((r) => r.cands[i].flags.map((f) => `${f} [${r.at}]`));
      const ok = rows.length > 0 && !flags.length && !lost.length && !crossed.length;
      if (ok) passed.push(i);
      console.log(`   ${i}: ${ok ? "PASS" : "FAIL"}  ${text.slice(0, 60)}`);
      for (const f of flags) console.log(`        ${f}`);
      if (ok) for (const r of rows) console.log(`        ${r.at}: ${r.cands[i].lines.join(" ▌ ")}`);
    });
    if (!passed.length) stuck++;
    verdicts[it.id] = { passed, candidates: it.candidates.length };
  }
  return { stuck, missing, verdicts };
}

(async () => {
  const input = readInput();
  if (!(await serverUp())) fail(`nothing answers on ${base} — node scripts/test-server.js start`);
  const shared = JSON.parse(fs.readFileSync(path.join(__dirname, "lib", "line-words.json"), "utf8")).words;
  const words = [...new Set([...shared, ...(input.words || [])])];
  const runs = glue(input.items);
  const items = input.items.map((it, i) => ({ ...it, words, runs: runs[i] }));
  const pages = [...new Set(items.flatMap((it) => it.pages))];
  const scanner = scannerEval();
  const { send, ev, close } = await open();
  const measured = [];
  try {
    for (const width of WIDTHS) {
      await setWidth(send, width);
      for (const page of pages) {
        const stamp = await docStamp(send);
        await send("Page.navigate", { url: base + page });
        await waitReady(send, stamp);
        await ev("document.fonts.ready.then(()=>1)");
        await sleep(settle);
        await ev(`window.__LC_EVAL=${JSON.stringify(scanner)};${PAGE};1`);
        const todo = items.filter((it) => it.pages.includes(page));
        const res = JSON.parse(await ev(`window.__LC.run(${JSON.stringify(todo)})`));
        for (const [id, r] of Object.entries(res)) measured.push({ id, page, width, ...r });
      }
    }
  } finally {
    close();
  }
  const { stuck, missing, verdicts } = report(input, measured);
  const out = opt("--out", `_incoming/line-candidates/${path.basename(file)}`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ base, widths: WIDTHS, date: new Date().toISOString(), verdicts, measured }, null, 1));
  console.log(`\n${missing ? `NOT MEASURED ${missing} item(s)` : stuck ? `NO WINNER ${stuck} item(s)` : `PASS every item has a candidate`} — full result ${out}`);
  setTimeout(() => process.exit(missing ? 2 : stuck ? 1 : 0), 600);
})().catch((e) => { console.error(e.message || e); process.exit(2); });
