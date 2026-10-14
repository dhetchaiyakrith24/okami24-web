/* eslint-disable */
// Recipe kept from _incoming/seo-f/b6d/cand-driver.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Topic 11, checker #463 round 1: measure line-break candidates the way the checker does (headless Chrome over CDP, 390 = 2x
// mobile emulation, 1440 = desktop; fonts.ready + 6 s settle) - in the REAL elements of /guides/quit-smoking-with-a-pod (and
// /guides for keys whose match is "card"/"dek"). Based on chk-driver.js (the checker's own driver).
//   node _incoming/seo-f/b6d/cand-driver.js <render-6b output .js> <out.json>
// Each key's text[0] must be the element's CURRENT text (found by its first 25 characters). FAQ answers are opened first.
// out.json = { "390": { key: [ok indices] }, "1440": {...}, "lines": { "390": { key: [lines of cand 0] } ... } }
const R = "C:/Users/dhetc/Claude-Web-Lab-v3-checkpoint-3.3.3";
const { spawn } = require("child_process"); const http = require("http"); const fs = require("fs");
const { CHROME, FLAGS, TMP } = require(R + "/scripts/lib/chrome");
const { waitReady, docStamp } = require(R + "/scripts/page-ready");
const [candFile, outFile] = process.argv.slice(2);
const helpers = fs.readFileSync(R + "/_incoming/seo-f/b6c/pagebad.js", "utf8") + "\n" + fs.readFileSync(R + "/_incoming/seo-f/b6c/bad-quit.js", "utf8");
const cand = fs.readFileSync(candFile, "utf8");
const BASE = "http://localhost:3412";
const port = 9700 + Math.floor(Math.random() * 200);
const profile = `${TMP}/cand-b6d-profile-${process.pid}`;
const chrome = spawn(CHROME, [...FLAGS, `--remote-debugging-port=${port}`, "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars", `--user-data-dir=${profile}`, "--window-size=1200,900", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJson = (p) => new Promise((res, rej) => http.get(`http://127.0.0.1:${port}${p}`, (r) => { let b = ""; r.on("data", (c) => (b += c)); r.on("end", () => res(JSON.parse(b))); }).on("error", rej));
const RUN = (page) => `(async()=>{
const norm=(s)=>s.replace(/[\\u00a0\\u2060]/g," ").replace(/\\s+/g," ").trim();
const out={ok:{},lines:{},why:{}};
for(const [k,c] of Object.entries(window.__C)){
  const want = c.match==="card"||c.match==="dek" ? "/guides" : "/guides/quit-smoking-with-a-pod";
  if(want!=="${page}") continue;
  const head=norm((window.__A&&window.__A[k])||c.text[0]).replace(/\\[([^\\]]+)\\]\\([^)]+\\)/g,"$1").slice(0,25);
  const pool=[...document.querySelectorAll("main h1,main h2,main h3,main p,main button span.font-display")];
  let el=pool.find(e=>norm(e.textContent).startsWith(head));
  if(!el){ // a closed FAQ answer is not in the DOM: open each question in turn and look again
    for(const btn of [...document.querySelectorAll("main button[aria-expanded]")]){
      const open=[...document.querySelectorAll("main button[aria-expanded]")].find(b=>b.getAttribute("aria-expanded")==="true"); if(open&&open!==btn){open.click(); await new Promise(r=>setTimeout(r,300));}
      if(btn.getAttribute("aria-expanded")==="false"){btn.click(); await new Promise(r=>setTimeout(r,600));}
      el=[...document.querySelectorAll("main p")].find(e=>norm(e.textContent).startsWith(head)); if(el) break;
    }
  }
  if(!el){out.ok[k]="NOT FOUND";continue;}
  if(!el.getClientRects().length){
    const btn=[...document.querySelectorAll("main button[aria-expanded]")].find(b=>b.parentElement.contains(el));
    if(btn){ const open=[...document.querySelectorAll("main button[aria-expanded]")].find(b=>b.getAttribute("aria-expanded")==="true"); if(open&&open!==btn){open.click(); await new Promise(r=>setTimeout(r,300));}
      if(btn.getAttribute("aria-expanded")==="false"){btn.click(); await new Promise(r=>setTimeout(r,600));} }
  }
  if(!el.getClientRects().length){out.ok[k]="HIDDEN";continue;}
  const keep=el.innerHTML; out.ok[k]=[];
  c.html.forEach((h,i)=>{ el.innerHTML=h; window.__ROOT=el; const r=JSON.parse(eval(window.__EVAL)); const L=window.__L(el);
    let bad=r.some(x=>x.issues.length); const why=r.flatMap(x=>x.issues.map(s=>s.type.slice(0,6)+":"+(s.word||s.lineEnd||"")));
    for(let j=0;j<L.length-1;j++){ const x=window.__bad(L[j],L[j+1]); if(x){ bad=true; why.push(x+" «"+L[j].slice(-7)+"|"+L[j+1].slice(0,6)+"»"); } }
    (out.why[k] ||= [])[i]=why.join(" ; ");
    if(el.tagName==="P"&&L.length>1&&L[L.length-1].replace(/\\s/g,"").length<=7) bad=true; // one short word alone on the last line
    if(!bad) out.ok[k].push(i); if(i===0) out.lines[k]=L; });
  el.innerHTML=keep;
}
return JSON.stringify(out);})()`;
(async () => {
  let targets; for (let i = 0; i < 40; i++) { try { targets = await getJson("/json"); break; } catch { await sleep(250); } }
  const page = targets.find((t) => t.type === "page"); const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r)); let id = 0; const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); clearTimeout(p.timer); pending.delete(m.id); p.r(m); } };
  const send = (method, params = {}) => new Promise((r, rej) => { const i = ++id; const timer = setTimeout(() => { pending.delete(i); rej(new Error(method + " timeout")); }, 120000); pending.set(i, { r, timer }); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 600)); return r.result?.result?.value; };
  await send("Page.enable"); await send("Runtime.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{localStorage.setItem("okami24-age-verified","true")}catch(e){}` });
  const result = { lines: {} };
  for (const w of [390, 1440]) {
    const desktop = w >= 1000;
    await send("Emulation.setDeviceMetricsOverride", desktop ? { width: w, height: 900, deviceScaleFactor: 1, mobile: false } : { width: w, height: 800, deviceScaleFactor: 2, mobile: true });
    await send("Emulation.setUserAgentOverride", { userAgent: desktop ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36" : "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
    result[w] = {}; result.lines[w] = {};
    for (const p of ["/guides/quit-smoking-with-a-pod", "/guides"]) {
      const stamp = await docStamp(send);
      await send("Page.navigate", { url: BASE + p });
      await waitReady(send, stamp); await ev("document.fonts.ready.then(()=>1)"); await sleep(6000);
      await ev(helpers + "\n" + cand + "\n1");
      const r = JSON.parse(await ev(RUN(p)));
      Object.assign(result[w], r.ok); Object.assign(result.lines[w], r.lines); (result.why ||= {})[w] = Object.assign((result.why||{})[w]||{}, r.why);
    }
  }
  fs.writeFileSync(outFile, JSON.stringify(result, null, 1));
  console.log("written", outFile);
  ws.close(); chrome.kill(); setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} process.exit(0); }, 500);
})().catch((e) => { console.error(e.message || e); chrome.kill(); process.exit(1); });
