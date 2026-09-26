/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Line-map scan (round 9 B2, 2026-09-23): records WHERE every Thai text block breaks into lines, so a
// change to the render-time typography (src/lib/thai-typography.ts) can be proven to leave every line
// break on screen exactly where it was. Unlike scripts/wordbreak-scan.js (which reports only the
// breaks that read wrong, per text node), this records ALL break offsets per block element, keyed by
// the block's path + its normalised text (U+2060 removed, U+00A0 read as a space) — so the same block
// is comparable whether its text is one text node with joiners or several nodes split by <span>s.
// Also records per page: U+2060 count in the hydrated body, the joined runs (U+2060-connected runs
// before; [data-tj] span texts after), console errors (hydration), and optionally a full-page PNG.
//
//   node scripts/linemap-scan.js scan [--base http://localhost:3412] [--widths 390,1440] [--locale th]
//        [--out _incoming/round9/linemap-before] [--shots] [/path ...]      (no paths → every sitemap URL)
//   node scripts/linemap-scan.js diff <beforeDir> <afterDir>                (prints the gate table)
// One headless Chrome, one tab, pages visited one after another (HANDOFF §17: never two Chrome jobs).
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const mode = args[0];
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const FLAGS_WITH_VALUE = ["--base", "--widths", "--locale", "--out", "--wait"];
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const AGE_KEY = process.env.AGE_KEY || "okami24-age-verified";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- in-page measurement ---------------------------------------------------------------------
const EVAL = String.raw`(() => {
  const WJ = "\u2060", NBSP = "\u00a0";
  const TH = /\p{Script=Thai}/u;
  const SKIP = new Set(["SCRIPT","STYLE","NOSCRIPT","TEMPLATE","SVG"]);
  // the typography wrapper (data-tjw) stands where a bare text node stood before — never its own block
  const isBlock = (el) => { if (el.hasAttribute("data-tjw")) return false; const d = getComputedStyle(el).display; return !(d === "inline" || d === "contents"); };
  const blockOf = (el) => { while (el && el !== document.body && !isBlock(el)) el = el.parentElement; return el || document.body; };
  const pathOf = (el) => { const p = []; while (el && el !== document.body) { let i = 0, s = el; while ((s = s.previousElementSibling)) i++; p.unshift(el.tagName.toLowerCase() + ":" + i); el = el.parentElement; } return p.join("/"); };
  // group visible text nodes by their nearest block ancestor, in document order
  const blocks = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const el = node.parentElement;
    if (!el || !node.nodeValue || SKIP.has(el.tagName.toUpperCase()) || el.closest("svg")) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const b = blockOf(el);
    if (!blocks.has(b)) blocks.set(b, []);
    blocks.get(b).push(node);
  }
  const range = document.createRange();
  const out = [];
  for (const [b, nodes] of blocks) {
    let norm = ""; const tops = [];
    for (const n of nodes) {
      const t = n.nodeValue;
      for (let i = 0; i < t.length; i++) {
        const ch = t[i];
        if (ch === WJ) continue;                 // invisible, not part of the normalised text
        const c = ch === NBSP ? " " : ch;
        let top = null;
        if (!/\s/.test(c)) { range.setStart(n, i); range.setEnd(n, i + 1); const r = range.getClientRects()[0]; if (r && r.width > 0) top = Math.round(r.top + window.scrollY); }
        norm += c; tops.push(top);
      }
    }
    if (!TH.test(norm)) continue;
    const breaks = []; let cur = null;
    for (let i = 0; i < tops.length; i++) { if (tops[i] == null) continue; if (cur !== null && Math.abs(tops[i] - cur) > 3) breaks.push(i); cur = tops[i]; }
    out.push({ key: pathOf(b) + "|" + norm.replace(/\s+/g, " ").trim().slice(0, 160), breaks });
  }
  // joined runs: before = grapheme-joined runs connected by U+2060; after = [data-tj] span texts
  // visible-text only: <script> holds the RSC payload, whose chunk names change with every build
  let body = "";
  { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const p = n.parentElement; if (p && !SKIP.has(p.tagName.toUpperCase())) body += n.nodeValue; } }
  const wjCount = (body.match(/\u2060/g) || []).length;
  // before-state runs, per text node (textContent would glue neighbouring elements' text together):
  // the letters from the one just before the first U+2060 to the one just after the last
  const runs = [];
  const MARK = /[\u0e30-\u0e3a\u0e45\u0e47-\u0e4e]/u;
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let tn;
  while ((tn = tw.nextNode())) {
    const v = tn.nodeValue;
    if (!v || !v.includes(WJ)) continue;
    for (const tok of v.split(/\s+/)) {
      const f = tok.indexOf(WJ), l = tok.lastIndexOf(WJ);
      if (f < 0) continue;
      let s = f - 1; while (s > 0 && MARK.test(tok[s])) s--;
      let e = l + 2; while (e < tok.length && MARK.test(tok[e])) e++;
      runs.push(tok.slice(Math.max(0, s), e).split(WJ).join(""));
    }
  }
  const tj = [...document.querySelectorAll("[data-tj]")].map((e) => e.textContent.replace(/\u00a0/g, " "));
  const sw = document.documentElement.scrollWidth, cw = document.documentElement.clientWidth;
  return JSON.stringify({ blocks: out, wjCount, runs, tj, overflow: sw > cw ? sw - cw : 0, bodyText: body.replace(/[\u2060]/g, "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim() });
})()`;

async function withChrome(fn) {
  const port = 9333 + Math.floor(Math.random() * 500);
  const profile = `${process.env.TEMP || "/tmp"}/okami-linemap-${process.pid}-${port}`;
  const chrome = spawn(CHROME, [`--remote-debugging-port=${port}`, "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars", `--user-data-dir=${profile}`, "--window-size=1200,900", "about:blank"], { stdio: "ignore" });
  const getJson = (p) => new Promise((res, rej) => http.get(`http://127.0.0.1:${port}${p}`, (r) => { let b = ""; r.on("data", (c) => (b += c)); r.on("end", () => res(JSON.parse(b))); }).on("error", rej));
  try {
    let target = null;
    for (let i = 0; i < 60 && !target; i++) { try { target = (await getJson("/json/list")).find((t) => t.type === "page"); } catch { /* not up yet */ } if (!target) await sleep(500); }
    if (!target) throw new Error("Chrome DevTools endpoint never appeared");
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let id = 0; const pending = new Map(); const consoleErrors = [];
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) { const p = pending.get(m.id); clearTimeout(p.timer); pending.delete(m.id); p.r(m); return; }
      if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") consoleErrors.push(m.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 300));
      if (m.method === "Runtime.exceptionThrown") consoleErrors.push((m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text || "").slice(0, 300));
    };
    const send = (method, params = {}) => new Promise((r, rej) => { const i = ++id; const timer = setTimeout(() => { if (pending.has(i)) { pending.delete(i); rej(new Error(`${method} timed out`)); } }, 90000); pending.set(i, { r, timer }); ws.send(JSON.stringify({ id: i, method, params })); });
    await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
    await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{localStorage.setItem(${JSON.stringify(AGE_KEY)},"true")}catch(e){}` });
    return await fn(send, consoleErrors);
  } finally {
    chrome.kill();
    setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* best effort */ } }, 800);
  }
}

async function scan() {
  const base = opt("--base", "http://localhost:3412").replace(/\/$/, "");
  const widths = opt("--widths", "390,1440").split(",").map(Number);
  const locale = opt("--locale", "th");
  const outDir = opt("--out", "_incoming/round9/linemap");
  // --wait <ms> = the old fixed sleep (was 2500 by default). Not given = wait until ready (scripts/page-ready.js,
  // round "cloud" 2026-09-26 — proved against a fixed-wait control run, _incoming/cloud-round/)
  const wait = opt("--wait", null) == null ? null : +opt("--wait");
  const { waitReady, docStamp } = require("./page-ready");
  const shots = args.includes("--shots");
  let urls = args.slice(1).filter((a, i) => a.startsWith("/") && !FLAGS_WITH_VALUE.includes(args[i]));
  if (urls.length === 0) {
    const sm = await (await fetch(`${base}/sitemap.xml`)).text();
    urls = [...new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/"))];
  }
  fs.mkdirSync(outDir, { recursive: true });
  const host = new URL(base).hostname;
  await withChrome(async (send, consoleErrors) => {
    await send("Network.setCookie", { name: "okami24_locale", value: locale, domain: host, path: "/" });
    for (const w of widths) {
      await send("Emulation.setDeviceMetricsOverride", { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
      for (const u of urls) {
        const name = `${u.replace(/^\//, "").replace(/[/?=,&]+/g, "_") || "home"}-${w}`;
        consoleErrors.length = 0;
        try {
          const stamp = await docStamp(send);
          await send("Page.navigate", { url: base + u });
          if (wait != null) await sleep(wait); else { const rd = await waitReady(send, stamp); if (rd.how !== "ready") process.stderr.write(`page-ready ${u} @${w}: ${rd.how} after ${rd.total} ms\n`); }
          await send("Runtime.evaluate", { expression: "document.fonts ? document.fonts.ready.then(() => true) : true", awaitPromise: true, returnByValue: true });
          const r = await send("Runtime.evaluate", { expression: EVAL, returnByValue: true });
          if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.text);
          const data = JSON.parse(r.result.result.value);
          data.consoleErrors = [...consoleErrors];
          fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(data));
          if (shots) {
            const s = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
            fs.writeFileSync(path.join(outDir, `${name}.png`), Buffer.from(s.result.data, "base64"));
          }
          process.stderr.write(`${name}: ${data.blocks.length} blocks · WJ ${data.wjCount} · runs ${data.runs.length} · tj ${data.tj.length} · overflow ${data.overflow} · errors ${data.consoleErrors.length}\n`);
        } catch (e) { process.stderr.write(`FAIL ${u} @${w}: ${e.message}\n`); }
      }
    }
  });
}

function diff(beforeDir, afterDir) {
  const files = fs.readdirSync(beforeDir).filter((f) => f.endsWith(".json")).sort();
  let pages = 0, pagesChanged = 0, blocksChanged = 0, blocksMissing = 0, wjAfter = 0, runsLost = 0, overflow = 0, errs = 0;
  const rows = [];
  for (const f of files) {
    const bp = path.join(beforeDir, f), ap = path.join(afterDir, f);
    if (!fs.existsSync(ap)) { rows.push(`| ${f} | missing in after | | | |`); pagesChanged++; continue; }
    pages++;
    const b = JSON.parse(fs.readFileSync(bp, "utf8")), a = JSON.parse(fs.readFileSync(ap, "utf8"));
    const am = new Map(a.blocks.map((x) => [x.key, x.breaks.join(",")]));
    const changed = [], missing = [];
    for (const x of b.blocks) { if (!am.has(x.key)) missing.push(x.key); else if (am.get(x.key) !== x.breaks.join(",")) changed.push(`${x.key.split("|")[1].slice(0, 60)} [${x.breaks}]→[${am.get(x.key)}]`); }
    const tjAll = a.tj.join("\n");
    const lost = [...new Set(b.runs)].filter((r) => !tjAll.includes(r.replace(/\u00a0/g, " ")) && !a.runs.includes(r));
    wjAfter += a.wjCount; overflow += a.overflow ? 1 : 0; errs += a.consoleErrors.length;
    blocksChanged += changed.length; blocksMissing += missing.length; runsLost += lost.length;
    // visible text: every before-block found again with the same text (bodyText of an older scan also held <script> text)
    const textSame = missing.length === 0;
    // "runs lost" is informational: a whitespace token holding two joined words reads as one run before
    if (changed.length || missing.length || a.wjCount || a.overflow || a.consoleErrors.length || !textSame) {
      pagesChanged++;
      rows.push(`| ${f} | ${changed.length} | ${missing.length} | ${lost.length} | WJ ${a.wjCount} · overflow ${a.overflow} · errors ${a.consoleErrors.length} · text ${textSame ? "same" : "DIFFERENT"} |`);
      for (const c of changed.slice(0, 5)) rows.push(`|  ↳ break moved | ${c.replace(/\|/g, "\\|")} | | | |`);
      for (const m of missing.slice(0, 3)) rows.push(`|  ↳ block missing | ${m.slice(0, 90).replace(/\|/g, "\\|")} | | | |`);
      for (const l of lost.slice(0, 5)) rows.push(`|  ↳ joined run lost | «${l}» | | | |`);
      for (const e of a.consoleErrors.slice(0, 2)) rows.push(`|  ↳ console | ${e.slice(0, 120).replace(/\|/g, "\\|")} | | | |`);
    }
  }
  console.log(`# Line-map diff — ${beforeDir} → ${afterDir}\n`);
  console.log(`pages compared ${pages} · pages with any difference ${pagesChanged} · blocks whose breaks moved ${blocksChanged} · blocks missing ${blocksMissing} · joined runs lost ${runsLost} · U+2060 left ${wjAfter} · pages overflowing ${overflow} · console errors ${errs}\n`);
  if (rows.length) console.log(`| page | breaks moved | blocks missing | runs lost | other |\n|---|---|---|---|---|\n${rows.join("\n")}`);
  const pass = pagesChanged === 0;
  console.log(`\n${pass ? "PASS" : "FAIL"}`);
  process.exitCode = pass ? 0 : 1;
}

(async () => {
  if (mode === "scan") await scan();
  else if (mode === "diff") diff(args[1], args[2]);
  else { console.error("usage: linemap-scan.js scan [...] | diff <before> <after>"); process.exit(2); }
})().catch((e) => { console.error(e.message || e); process.exit(1); });
