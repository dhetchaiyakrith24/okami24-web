 
// Recipe kept from _incoming/about3lang/viewport-probe.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Round 6 "about3lang" B5 — can a visitor on a SHORT viewport reach both buttons of the age gate?
//
// scripts/shot.js emulates a fixed 800/844-tall phone, so it cannot answer the designer's closing
// question (2026-09-23): a phone held sideways is ~360px tall against a ~477px Thai card, and the
// overlay used to be an unscrollable centred box with `document.body.style.overflow = "hidden"`
// behind it. This probe takes the viewport size on the command line, opens the gate (it does NOT
// pre-accept the age key) and reports, per locale: the card's rect, whether the overlay actually
// scrolls, and whether each button is inside the scrollable range — i.e. reachable at all.
//
//   node _incoming/about3lang/viewport-probe.js <url> <w> <h> [locale] [png]
//     e.g. node _incoming/about3lang/viewport-probe.js http://localhost:3412/ 390 360 th out.png
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");

const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const [url, wArg, hArg, locale, png] = process.argv.slice(2);
if (!url || !wArg || !hArg) {
  console.error("usage: node viewport-probe.js <url> <w> <h> [locale] [png]");
  process.exit(2);
}
const W = +wArg;
const H = +hArg;
const port = 9333 + Math.floor(Math.random() * 500);
const profile = `${process.env.TEMP}/okami-vp-profile-${process.pid}`;
const chrome = spawn(
  CHROME,
  [`--remote-debugging-port=${port}`, "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars", `--user-data-dir=${profile}`, "about:blank"],
  { stdio: "ignore" }
);
const sleep = (t) => new Promise((r) => setTimeout(r, t));
const getJson = (p) =>
  new Promise((res, rej) => {
    http
      .get(`http://127.0.0.1:${port}${p}`, (r) => {
        let b = "";
        r.on("data", (c) => (b += c));
        r.on("end", () => res(JSON.parse(b)));
      })
      .on("error", rej);
  });

const MEASURE = `
(() => {
  const overlay = document.querySelector('[role="dialog"]');
  if (!overlay) return JSON.stringify({ error: "no dialog" });
  const card = overlay.firstElementChild;
  const buttons = [...overlay.querySelectorAll("button")];
  const canScroll = overlay.scrollHeight > overlay.clientHeight;
  // Scroll to the bottom and back, and record where each button lands: a button that can never be
  // brought inside the viewport is a button the visitor cannot press.
  const reach = buttons.map((b) => {
    overlay.scrollTop = 0;
    const top = b.getBoundingClientRect();
    overlay.scrollTop = overlay.scrollHeight;
    const bottom = b.getBoundingClientRect();
    return {
      label: b.textContent.slice(0, 18),
      atScrollTop: { top: Math.round(top.top), bottom: Math.round(top.bottom) },
      atScrollEnd: { top: Math.round(bottom.top), bottom: Math.round(bottom.bottom) },
      reachable: (top.top >= 0 && top.bottom <= innerHeight) || (bottom.top >= 0 && bottom.bottom <= innerHeight),
    };
  });
  overlay.scrollTop = 0;
  const c = card.getBoundingClientRect();
  return JSON.stringify({
    viewport: { w: innerWidth, h: innerHeight },
    card: { left: Math.round(c.left), top: Math.round(c.top), w: Math.round(c.width), h: Math.round(c.height) },
    overlay: { clientH: overlay.clientHeight, scrollH: overlay.scrollHeight, canScroll },
    buttons: reach,
    allReachable: reach.every((r) => r.reachable),
  });
})();
`;

(async () => {
  let targets;
  for (let i = 0; i < 40; i++) {
    try {
      targets = await getJson("/json");
      break;
    } catch {
      await sleep(250);
    }
  }
  if (!targets) throw new Error("Chrome did not expose DevTools");
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((r, rej) => {
      const i = ++id;
      pending.set(i, r);
      ws.send(JSON.stringify({ id: i, method, params }));
      setTimeout(() => {
        if (pending.has(i)) {
          pending.delete(i);
          rej(new Error(`${method} timed out`));
        }
      }, 60000);
    });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 2, mobile: true });
  if (locale && locale !== "th") {
    await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{document.cookie="okami24_locale=${locale}; path=/"}catch(e){}` });
  }
  await send("Page.navigate", { url });
  await sleep(3000);
  const r = await send("Runtime.evaluate", { expression: MEASURE, returnByValue: true });
  console.log(`${W}x${H} ${locale || "th"} →`, r.result.result.value);
  if (png) {
    const shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(png, Buffer.from(shot.result.data, "base64"));
    console.log("saved", png);
  }
  ws.close();
  chrome.kill();
  setTimeout(() => {
    try {
      fs.rmSync(profile, { recursive: true, force: true });
    } catch {}
  }, 500);
})().catch((e) => {
  console.error(e.message || e);
  chrome.kill();
  process.exit(1);
});
