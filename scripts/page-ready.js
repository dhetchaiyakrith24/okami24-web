// page-ready.js — "wait until the page is ready" for the CDP scripts (shot.js · wordbreak-scan.js · visible-text.js ·
// linemap-scan.js), instead of a fixed sleep after Page.navigate (round "cloud", 2026-09-26 — the fixed sleeps were
// 2.5 s to 8 s per page and made up most of a whole-site scan).
//
// Ready = the NEW document (not the one before the navigation) has fired `load`, `document.fonts.ready` resolved, the
// images inside the viewport finished (load or error), and the DOM has been quiet (no text / child / attribute change other than `style`) for QUIET ms, then two animation
// frames. Hydration (locale cookie → the page re-renders in en/zh) and late client fetches show up as DOM changes, so
// the quiet window covers them. `style`-only changes are ignored because CSS animations and marquees rewrite style
// forever. A hard cap (MAX) stops a page that never goes quiet — the result then says "capped", never hides it.
//
// Old behaviour stays available: every script keeps its `--wait <ms>` flag, and giving it = the old fixed sleep.
//
//   const { waitReady } = require("./page-ready");
//   const before = await docStamp(send);           // before Page.navigate
//   await send("Page.navigate", { url });
//   const r = await waitReady(send, before);       // → { ms, how: "ready" | "capped" }

const QUIET = +(process.env.READY_QUIET_MS || 600);
const MAX = +(process.env.READY_MAX_MS || 15000);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Identity of the document currently in the tab — a new navigation gets a new performance.timeOrigin.
async function docStamp(send) {
  try {
    const r = await send("Runtime.evaluate", { expression: "performance.timeOrigin", returnByValue: true });
    return r.result?.result?.value ?? null;
  } catch {
    return null;
  }
}

const readyExpr = (oldStamp, quiet, max) => `(async () => {
  if (performance.timeOrigin === ${JSON.stringify(oldStamp)}) return "old-doc";
  const t0 = performance.now();
  if (document.readyState !== "complete") await new Promise((r) => addEventListener("load", r, { once: true }));
  if (document.fonts) await document.fonts.ready;
  // in view on BOTH axes: a sideways gallery keeps lazy images off-screen to the right, and they never load
  const inView = (i) => { const r = i.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && r.width > 0; };
  const pending = [...document.images].filter((i) => !i.complete && inView(i));
  const imgCap = new Promise((r) => setTimeout(r, Math.max(0, ${max} - (performance.now() - t0))));
  await Promise.race([Promise.all(pending.map((i) => new Promise((r) => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); }))), imgCap]);
  let capped = false;
  await new Promise((res) => {
    let timer = null, cap = null, mo = null;
    const done = (c) => { if (mo) mo.disconnect(); clearTimeout(timer); clearTimeout(cap); capped = !!c; res(); };
    const bump = () => { clearTimeout(timer); timer = setTimeout(() => done(false), ${quiet}); };
    mo = new MutationObserver((ms) => { if (ms.some((m) => m.type !== "attributes" || m.attributeName !== "style")) bump(); });
    mo.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true });
    bump();
    cap = setTimeout(() => done(true), Math.max(0, ${max} - (performance.now() - t0)));
  });
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  return (capped ? "capped " : "ready ") + Math.round(performance.now() - t0);
})()`;

// Poll until the new document answers (the navigation may not have committed yet, or the old context is torn down
// mid-call), then wait inside it. Never throws on a slow page: returns how it ended.
async function waitReady(send, oldStamp, { quiet = QUIET, max = MAX } = {}) {
  const start = Date.now();
  while (Date.now() - start < max + 5000) {
    let v = null;
    try {
      const r = await send("Runtime.evaluate", { expression: readyExpr(oldStamp, quiet, max), awaitPromise: true, returnByValue: true });
      v = r.result?.exceptionDetails ? null : r.result?.result?.value;
    } catch {
      v = null; // context destroyed by the navigation — try again
    }
    if (typeof v === "string" && v !== "old-doc") {
      const [how, ms] = v.split(" ");
      return { how, ms: +ms, total: Date.now() - start };
    }
    await sleep(100);
  }
  return { how: "timeout", ms: null, total: Date.now() - start };
}

module.exports = { waitReady, docStamp, QUIET, MAX };
