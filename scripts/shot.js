/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Mobile-width full-page screenshots via Chrome DevTools Protocol (no puppeteer needed; Node 22+ has WebSocket).
//
//   node scripts/shot.js <out.png> <url> [--click "<css selector>"]... [--cookie name=value]... [--wait ms] [--width 375]
//   e.g. node scripts/shot.js shot.png http://localhost:3000/products/zero-pro --wait 4000
//
// Why this exists: the Browser pane's screenshot can't be saved to a file, and plain headless
// Chrome (--screenshot) refuses window widths under ~500px on Windows. CDP emulation gives a real
// 375px mobile viewport, and the OKami24 age gate is pre-accepted by writing its localStorage key
// before any page script runs, so screenshots show the page, not the 21+ modal.
// Env: CHROME_PATH (default: the standard Chrome install), CHROME_PROFILE, AGE_KEY.
const { spawn } = require("child_process"); const http = require("http"); const fs = require("fs");
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const args = process.argv.slice(2); const out = args[0], url = args[1];
const clicks = []; let wait = 2500, width = 375; const AGE_KEY = process.env.AGE_KEY || "okami24-age-verified";
// --cookie name=value (repeatable): the site picks its language from the `okami24_locale` cookie,
// not from the URL, so this is the only way to screenshot the English or Chinese page.
const cookies = [];
// --desktop: emulate a real desktop (mouse pointer, desktop UA, 1x) instead of a phone. Added for the
// mobile round's "1440px must not move" proof — a 1440-wide *phone* emulation still answers
// `(hover: none)` / `(pointer: coarse)` media queries like a phone, which is not what the owner's
// desktop customers get. Default stays mobile so every existing call behaves as before.
let desktop = false;
// --eval "<js>" (repeatable, runs after the clicks): drive the page the way a finger would where a
// click cannot — e.g. scroll the product gallery track sideways to stand in for a swipe — and log
// the expression's result so the screenshot can be tied to what the page reported.
const evals = [];
// --viewport: capture only the first screen (no full-page resize). The full-page capture re-lays
// the page out at its whole height, which can move inner scroll containers; when the proof is
// "what is on screen right after the interaction", this is the honest capture.
let viewportOnly = false;
for (let i = 2; i < args.length; i++) {
  if (args[i] === "--viewport") { viewportOnly = true; continue; } if (args[i] === "--click") clicks.push(args[++i]); else if (args[i] === "--wait") wait = +args[++i]; else if (args[i] === "--width") width = +args[++i]; else if (args[i] === "--cookie") cookies.push(args[++i]); else if (args[i] === "--desktop") desktop = true; else if (args[i] === "--eval") evals.push(args[++i]); }
const port = 9333 + Math.floor(Math.random() * 500);
// one throw-away profile per run — a shared profile is locked by any Chrome still alive from an
// earlier run, and Chrome then exits silently (the DevTools endpoint never appears)
const profile = process.env.CHROME_PROFILE || `${process.env.TEMP}/okami-shot-profile-${process.pid}`;
const chrome = spawn(CHROME, [`--remote-debugging-port=${port}`, "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars", `--user-data-dir=${profile}`, "--window-size=1200,900", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJson(p) { return new Promise((res, rej) => http.get(`http://127.0.0.1:${port}${p}`, (r) => { let b = ""; r.on("data", (c) => (b += c)); r.on("end", () => res(JSON.parse(b))); }).on("error", rej)); }
(async () => {
  let targets; for (let i = 0; i < 40; i++) { try { targets = await getJson("/json"); break; } catch { await sleep(250); } }
  if (!targets) throw new Error(`Chrome did not expose DevTools on port ${port} within 10s — is CHROME_PATH right (${CHROME}) and is the profile dir writable (${profile})?`);
  const page = targets.find((t) => t.type === "page");
  if (!page) throw new Error("Chrome started but has no page target"); const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r)); let id = 0; const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  // every CDP call gets a deadline so a dead dev server (Page.navigate never returns) fails loudly instead of hanging
  const CDP_TIMEOUT_MS = +(process.env.CDP_TIMEOUT_MS || 60000);
  const send = (method, params = {}) => new Promise((r, rej) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params }));
    setTimeout(() => { if (pending.has(i)) { pending.delete(i); rej(new Error(`${method} did not answer within ${CDP_TIMEOUT_MS / 1000}s — is the dev server at ${url} alive? (curl it first)`)); } }, CDP_TIMEOUT_MS); });
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", desktop ? { width, height: 900, deviceScaleFactor: 1, mobile: false } : { width, height: 800, deviceScaleFactor: 2, mobile: true });
  await send("Emulation.setUserAgentOverride", { userAgent: desktop ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36" : "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{localStorage.setItem(${JSON.stringify(AGE_KEY)},"true")}catch(e){}` });
  if (cookies.length) await send("Page.addScriptToEvaluateOnNewDocument", { source: cookies.map((c) => `try{document.cookie=${JSON.stringify(`${c}; path=/`)}}catch(e){}`).join("") });
  await send("Page.navigate", { url }); await sleep(wait);
  for (const sel of clicks) { await send("Runtime.evaluate", { expression: `(()=>{const el=document.querySelector(${JSON.stringify(sel)});if(!el)return "missing";el.scrollIntoView({block:"center"});el.click();return "clicked"})()`, returnByValue: true }); await sleep(900); }
  for (const js of evals) { const r = await send("Runtime.evaluate", { expression: js, returnByValue: true, awaitPromise: true }); const cdp = r.result ?? {}; console.log("eval →", JSON.stringify(cdp.exceptionDetails ? { error: cdp.exceptionDetails.text, detail: cdp.exceptionDetails.exception?.description } : cdp.result?.value ?? null)); await sleep(900); }
  await send("Runtime.evaluate", { expression: "window.scrollTo(0,0)" }); await sleep(300);
  const { result } = await send("Runtime.evaluate", { expression: "Math.min(document.documentElement.scrollHeight, 4000)", returnByValue: true });
  // Same emulation as the page was loaded with (desktop stays desktop — before 2026-09-08 this line
  // silently switched a --desktop run back to a 2x phone for the capture itself).
  const h = viewportOnly ? (desktop ? 900 : 844) : result.result.value; await send("Emulation.setDeviceMetricsOverride", desktop ? { width, height: h, deviceScaleFactor: 1, mobile: false } : { width, height: h, deviceScaleFactor: 2, mobile: true }); await sleep(600);
  const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: !viewportOnly });
  fs.writeFileSync(out, Buffer.from(shot.result.data, "base64")); console.log("saved", out, `${width}x${h}@2x`);
  ws.close(); chrome.kill(); cleanup();
})().catch((e) => { console.error(e.message || e); chrome.kill(); cleanup(); process.exit(1); });
function cleanup() { if (!process.env.CHROME_PROFILE) setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }, 500); }
