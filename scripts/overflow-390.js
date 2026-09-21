/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Sideways-scroll gate at phone width, over EVERY page in the sitemap (owner ruling 2026-09-22,
// round SEO ข close): a word the typography mechanism joins into one unbreakable run must never
// make a page scroll sideways. PASS = document.documentElement.scrollWidth === clientWidth on
// every page at --width (default 390, the two-tier rule's phone width). One headless Chrome, one
// tab, pages visited one after another (never two Chrome jobs at once — HANDOFF §17).
//
//   node scripts/overflow-390.js [--base http://localhost:3412] [--width 390] [--wait 1500] [/path ...]
//   no paths → every URL in <base>/sitemap.xml · prints one line per page and a PASS/FAIL total.
// Env: CHROME_PATH (default: the standard Chrome install), AGE_KEY — same as scripts/shot.js.
const { spawn } = require("child_process"); const http = require("http"); const fs = require("fs");
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const AGE_KEY = process.env.AGE_KEY || "okami24-age-verified";
const args = process.argv.slice(2); const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const base = opt("--base", "http://localhost:3412").replace(/\/$/, ""); const width = +opt("--width", "390"); const wait = +opt("--wait", "1500");
const paths = args.filter((a, i) => a.startsWith("/") && !["--base", "--width", "--wait"].includes(args[i - 1]));
const port = 9333 + Math.floor(Math.random() * 500);
const profile = `${process.env.TEMP}/okami-overflow-profile-${process.pid}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getText(url) { return new Promise((res, rej) => http.get(url, (r) => { let b = ""; r.on("data", (c) => (b += c)); r.on("end", () => res(b)); }).on("error", rej)); }
(async () => {
  const urls = paths.length ? paths.map((p) => base + p) : [...(await getText(`${base}/sitemap.xml`)).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, base));
  const chrome = spawn(CHROME, [`--remote-debugging-port=${port}`, "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars", `--user-data-dir=${profile}`, "--window-size=1200,900", "about:blank"], { stdio: "ignore" });
  const cleanup = () => { try { chrome.kill(); } catch {} setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }, 500); };
  try {
    let targets; for (let i = 0; i < 40; i++) { try { targets = JSON.parse(await getText(`http://127.0.0.1:${port}/json`)); break; } catch { await sleep(250); } }
    if (!targets) throw new Error(`Chrome did not expose DevTools on port ${port}`);
    const page = targets.find((t) => t.type === "page"); const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r)); let id = 0; const pending = new Map();
    ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
    const send = (method, params = {}) => new Promise((r, rej) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); setTimeout(() => { if (pending.has(i)) { pending.delete(i); rej(new Error(`${method} timed out`)); } }, 60000); });
    await send("Page.enable"); await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", { width, height: 844, deviceScaleFactor: 2, mobile: true });
    await send("Emulation.setUserAgentOverride", { userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
    await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{localStorage.setItem(${JSON.stringify(AGE_KEY)},"true")}catch(e){}` });
    let fails = 0;
    for (const url of urls) {
      await send("Page.navigate", { url }); await sleep(wait);
      const r = await send("Runtime.evaluate", { expression: "JSON.stringify({s:document.documentElement.scrollWidth,c:document.documentElement.clientWidth,b:document.body.scrollWidth})", returnByValue: true });
      const v = JSON.parse(r.result?.result?.value ?? "{}"); const ok = v.s === v.c && v.b <= v.c;
      if (!ok) fails++; console.log(`${ok ? "ok  " : "FAIL"} ${url.replace(base, "")} scrollWidth=${v.s} clientWidth=${v.c} body=${v.b}`);
    }
    console.log(`\n${fails === 0 ? "PASS" : "FAIL"} sideways-scroll gate at ${width}px: ${urls.length - fails}/${urls.length} pages with scrollWidth = clientWidth`);
    ws.close(); cleanup(); process.exit(fails === 0 ? 0 : 1);
  } catch (e) { console.error(e.message || e); cleanup(); process.exit(1); }
})();
