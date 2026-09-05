/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Scroll-through recorder: real wheel events, frames as JPEG + timestamps.
// node record.js <outdir> <url> <width> <height> <totalScrollPx> <frames> [wheelDelta]
const { spawn } = require("child_process"); const http = require("http"); const fs = require("fs"); const path = require("path");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const [outdir, url, w, h, total, nframes] = process.argv.slice(2); const width = +w, height = +h, TOTAL = +total, N = +nframes;
fs.mkdirSync(outdir, { recursive: true });
const port = 9333 + Math.floor(Math.random() * 500); const profile = `${process.env.TEMP}/okami-rec-profile-${process.pid}`;
const chrome = spawn(CHROME, [`--remote-debugging-port=${port}`, "--headless=new", "--no-first-run", "--hide-scrollbars", `--user-data-dir=${profile}`, "--window-size=1600,1000", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJson = (p) => new Promise((res, rej) => http.get(`http://127.0.0.1:${port}${p}`, (r) => { let b = ""; r.on("data", (c) => (b += c)); r.on("end", () => res(JSON.parse(b))); }).on("error", rej));
(async () => {
  let targets; for (let i = 0; i < 40; i++) { try { targets = await getJson("/json"); break; } catch { await sleep(250); } }
  const page = targets.find((t) => t.type === "page"); const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r)); let id = 0; const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{localStorage.setItem("okami24-age-verified","true")}catch(e){}` });
  await send("Page.navigate", { url }); await sleep(7000);
  await send("Runtime.evaluate", { expression: "document.querySelector('nextjs-portal')?.remove(); window.scrollTo(0,0); 'ok'" }); await sleep(800);
  const step = TOTAL / N; const t0 = Date.now(); const log = [];
  for (let i = 0; i < N; i++) {
    await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: Math.round(width / 2), y: Math.round(height / 2), deltaX: 0, deltaY: step });
    await sleep(25);
    const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 82 });
    const { result } = await send("Runtime.evaluate", { expression: "window.scrollY", returnByValue: true });
    fs.writeFileSync(path.join(outdir, `f${String(i).padStart(4, "0")}.jpg`), Buffer.from(shot.result.data, "base64"));
    log.push({ i, t: Date.now() - t0, y: result.result.value });
  }
  fs.writeFileSync(path.join(outdir, "frames.json"), JSON.stringify(log));
  console.log("frames", N, "duration_ms", Date.now() - t0, "lastY", log[N - 1].y, "avg_ms/frame", Math.round((Date.now() - t0) / N));
  ws.close(); chrome.kill(); setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }, 500);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
