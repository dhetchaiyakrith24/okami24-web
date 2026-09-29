/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Phone gallery probe — does the photo follow the flavour/colour the customer picked, frame by frame?
// Written for the owner's two bugs of 2026-09-30 (flavour chips on a phone: chip lights up, photo stays on the cover ·
// swipe: the previous flavour's photo flashes back before the chosen one settles).
//
//   node scripts/gallery-probe.js <url>|--sitemap <base> [--width 390] [--no-scrollend] [--frames <dir>] [--steps "tap:3,swipe:left,tap:0"]
//   --sitemap <base>: every /products/<slug> page in <base>/sitemap.xml, one Chrome; pages without a gallery are skipped
//
// Loads <url> as a touch phone (CDP emulation, touch on, age gate pre-accepted), then runs each step with REAL input
// (Input.dispatchTouchEvent for a chip tap, Input.synthesizeScrollGesture for a finger swipe on the gallery, fling
// included) and records, on every animation frame, which gallery slide fills the frame and which chip is pressed.
//   tap:N       tap the N-th option chip (0-based, in page order; -1 = the last chip)
//   swipe:left  swipe the gallery one slide forward · swipe:right one slide back
// After each step it prints the slides seen in order (runs collapsed) and judges:
//   FLASH   the visible slide went back to one it had already left (A→B→A…), i.e. the "flash" the owner saw
//   STUCK   after the step settles, the slide on screen is not the pressed chip's slide, or a tapped chip is not pressed
//   SKIP    a tap on a disabled chip (not counted either way)
//   OK      otherwise
// --no-scrollend: pretend the browser has no `scrollend` event (Safari before it shipped it) — the page's timer
//   fallback path. --frames <dir>: also save a screencast frame strip per step (<dir>/step-N.png) for the report.
// Exit 1 when any step is FLASH or STUCK.
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { CHROME, FLAGS, TMP } = require("./lib/chrome");

const args = process.argv.slice(2);
let url = null, sitemapBase = null;
let width = 390, noScrollend = false, framesDir = null, steps = "swipe:left,swipe:left,swipe:right,tap:-1,tap:0";
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--width") width = +args[++i];
  else if (args[i] === "--no-scrollend") noScrollend = true;
  else if (args[i] === "--frames") framesDir = args[++i];
  else if (args[i] === "--steps") steps = args[++i];
  else if (args[i] === "--sitemap") sitemapBase = args[++i].replace(/\/$/, "");
  else if (!url) url = args[i];
}
if (!url && !sitemapBase) { console.error("usage: node scripts/gallery-probe.js <url>|--sitemap <base> [--width 390] [--no-scrollend] [--frames <dir>] [--steps ...]"); process.exit(2); }
const AGE_KEY = process.env.AGE_KEY || "okami24-age-verified";
const port = 9333 + Math.floor(Math.random() * 500);
const profile = `${TMP}/okami-gallery-probe-${process.pid}`;
const chrome = spawn(CHROME, [...FLAGS, `--remote-debugging-port=${port}`, "--headless=new", "--no-first-run", "--hide-scrollbars", `--user-data-dir=${profile}`, "--window-size=500,900", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJson = (p) => new Promise((res, rej) => http.get(`http://127.0.0.1:${port}${p}`, (r) => { let b = ""; r.on("data", (c) => (b += c)); r.on("end", () => res(JSON.parse(b))); }).on("error", rej));

// In-page recorder: the visible gallery track = the [role=group] snap track that is actually on screen.
const RECORDER = `(() => {
  const tracks = [...document.querySelectorAll('[role=group]')].filter((t) => t.clientWidth > 0 && t.scrollWidth > t.clientWidth);
  const tr = tracks[0];
  if (!tr) return "no gallery";
  window.__probe = { tr, log: [] };
  const tick = () => {
    const w = tr.clientWidth;
    const pressed = [...document.querySelectorAll('button[aria-pressed="true"][data-option-id]')].find((b) => b.offsetParent);
    window.__probe.log.push([performance.now(), tr.scrollLeft / w, pressed ? pressed.dataset.optionId : null]);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return "slides=" + tr.children.length;
})()`;

(async () => {
  let targets;
  for (let i = 0; i < 40 && !targets; i++) { try { targets = await getJson("/json"); } catch { await sleep(250); } }
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map(); const frames = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    if (m.method === "Page.screencastFrame") { frames.push(m.params.data); send("Page.screencastFrameAck", { sessionId: m.params.sessionId }); }
  };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;

  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height: 844, deviceScaleFactor: 2, mobile: true });
  await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await send("Emulation.setUserAgentOverride", { userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{localStorage.setItem(${JSON.stringify(AGE_KEY)},"true")}catch(e){}` });
  if (noScrollend) {
    // both halves of "has scrollend": the feature test (`"onscrollend" in window`) and the event itself
    await send("Page.addScriptToEvaluateOnNewDocument", { source: `(()=>{for(const P of [window,Window.prototype,Document.prototype,HTMLElement.prototype,Element.prototype]){try{delete P.onscrollend}catch(e){}}const add=EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener=function(t,...a){if(t==="scrollend")return;return add.call(this,t,...a)};})()` });
  }
  let urls = [url];
  if (sitemapBase) {
    const xml = await (await fetch(`${sitemapBase}/sitemap.xml`)).text();
    urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, sitemapBase)).filter((u) => /\/products\/[^/]+$/.test(u));
  }
  let bad = 0, n = 0, pages = 0;
  const failed = [];
  for (const u of urls) {
  await send("Page.navigate", { url: u });
  await sleep(sitemapBase ? 3000 : 4000);
  const rec = await evaluate(RECORDER);
  if (rec === "no gallery") { if (!sitemapBase) console.log(`gallery-probe: ${u} — no gallery`); continue; }
  pages++;
  console.log(`gallery-probe: ${u} @${width}${noScrollend ? " (no scrollend)" : ""} — ${rec}`);

  // slide index → option id, in slide order (the gallery's aria-hidden marks all but the current one)
  const slideIds = await evaluate(`(() => { const tr = window.__probe.tr; return [...tr.children].map((c) => { const img = c.querySelector('img'); return img ? img.alt : (c.textContent || '').trim().slice(0, 30); }); })()`);
  const chips = await evaluate(`[...document.querySelectorAll('button[data-option-id]')].filter((b) => b.offsetParent).map((b) => b.dataset.optionId)`);
  const chipAt = (a) => (+a < 0 ? chips.length + +a : +a);
  for (const step of steps.split(",")) {
    n++;
    const t0 = await evaluate("performance.now()");
    if (framesDir) { frames.length = 0; await send("Page.startScreencast", { format: "jpeg", quality: 70, maxWidth: width, maxHeight: 844, everyNthFrame: 1 }); }
    const [kind, arg] = step.split(":");
    let tapped = null;
    if (kind === "tap") {
      const box = await evaluate(`(() => { const b = [...document.querySelectorAll('button[data-option-id]')].filter((b) => b.offsetParent)[${chipAt(arg)}]; if (!b) return null; b.scrollIntoView({ block: "nearest", inline: "center" }); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, disabled: b.disabled, id: b.dataset.optionId }; })()`);
      // a disabled chip (every option sold out) cannot be tapped — say so instead of calling the no-op an OK (checker #127)
      if (box && box.disabled) { console.log(`  step ${n} ${step.padEnd(12)} chip ${box.id} is disabled — SKIP`); continue; }
      tapped = box ? box.id : null;
      if (!box) { console.log(`  step ${n} ${step}: no chip ${arg}`); bad++; continue; }
      await sleep(400);
      const b2 = await evaluate(`(() => { const b = [...document.querySelectorAll('button[data-option-id]')].filter((b) => b.offsetParent)[${chipAt(arg)}]; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
      await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: b2.x, y: b2.y }] });
      await sleep(60);
      await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    } else if (kind === "swipe") {
      const g = await evaluate(`(() => { const r = window.__probe.tr.getBoundingClientRect(); window.scrollTo({ top: window.scrollY + r.top - 80, behavior: "instant" }); const r2 = window.__probe.tr.getBoundingClientRect(); return { x: r2.left + r2.width / 2, y: r2.top + r2.height / 2, w: r2.width }; })()`);
      await sleep(400);
      // a finger: down, 12 moves over ~180 ms (a quick flick), up
      const dx = (arg === "left" ? -1 : 1) * g.w * 0.55;
      const x0 = g.x - dx / 2;
      await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x0, y: g.y }] });
      for (let k = 1; k <= 12; k++) { await sleep(15); await send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x0 + (dx * k) / 12, y: g.y + k * 0.3 }] }); }
      await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    }
    await sleep(1800);
    if (framesDir) await send("Page.stopScreencast");
    const log = await evaluate(`window.__probe.log.filter((e) => e[0] >= ${t0})`);
    // which slide fills the frame: only count frames where the track is (almost) at rest on a slide
    const seen = [];
    for (const [, pos] of log) { const k = Math.round(pos); if (Math.abs(pos - k) < 0.08 && seen[seen.length - 1] !== k) seen.push(k); }
    const last = log[log.length - 1] || [0, 0, null];
    const finalSlide = Math.round(last[1]);
    const pressed = last[2];
    const flash = seen.some((k, i) => seen.indexOf(k) < i);
    const slideLabel = slideIds[finalSlide] ?? "?";
    // slides = [a leading "all"/"default" slide when there is one] + one per option, in chip order
    const offset = slideIds.length - chips.length;
    const expected = pressed === null ? 0 : chips.indexOf(pressed) + offset;
    // a tap must also have pressed the chip that was tapped (a tap that does nothing is not OK)
    const stuck = finalSlide !== expected || (tapped !== null && pressed !== tapped);
    const verdict = flash ? "FLASH" : stuck ? "STUCK" : "OK";
    if (verdict !== "OK") { bad++; failed.push(`${u.replace(/^https?:\/\/[^/]+/, "")} ${step} ${verdict}`); }
    console.log(`  step ${n} ${step.padEnd(12)} slides seen ${seen.join("→") || "(none at rest)"} · on screen: ${slideLabel} · chip: ${pressed} → ${verdict}`);
    if (framesDir && frames.length) {
      fs.mkdirSync(framesDir, { recursive: true });
      const sharp = require("sharp");
      const pick = frames.filter((_, i) => i % Math.max(1, Math.ceil(frames.length / 10)) === 0).slice(0, 10);
      const tiles = await Promise.all(pick.map((f) => sharp(Buffer.from(f, "base64")).resize({ width: 195 }).png().toBuffer()));
      const h = (await sharp(tiles[0]).metadata()).height;
      await sharp({ create: { width: 195 * tiles.length + 4 * (tiles.length - 1), height: h, channels: 3, background: "#000" } })
        .composite(tiles.map((t, i) => ({ input: t, left: i * 199, top: 0 }))).png().toFile(path.join(framesDir, `step-${n}.png`));
    }
  }
  }
  for (const line of failed) console.log(`  FAILED ${line}`);
  console.log(`gallery-probe: ${bad === 0 ? "PASS" : `FAIL (${bad} of ${n} steps)`} · ${pages} page(s) with a gallery${sitemapBase ? ` of ${urls.length} product pages` : ""}`);
  ws.close(); chrome.kill();
  setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} process.exit(bad ? 1 : 0); }, 500);
})().catch((e) => { console.error(e.message || e); chrome.kill(); process.exit(2); });
