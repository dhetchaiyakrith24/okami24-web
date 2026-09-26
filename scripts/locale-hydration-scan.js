/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Thai text on English/Chinese pages AFTER hydration (round 10B, owner ruling 2026-09-24).
//
// The server always renders Thai; the visitor's language is a cookie read client-side, so neither curl nor scan.js can
// see what an English visitor sees, and thai-leak-scan.js reads component source, not record data. Round 10B's
// Thai-only guides reached English visitors in Thai through their record fields — found by the checker by hand. This
// gate loads each page in headless Chrome with the locale cookie, waits for hydration, and counts the text nodes in
// <body> (script/style/noscript/template excluded) that hold a Thai letter.
//
//   node scripts/locale-hydration-scan.js [--base http://localhost:3412] [--locales en,zh] [--selector "<css>"] [/path ...]
//
// No paths = every guide route in the sitemap (/guides and /guides/*). --selector limits the count to one block
// (e.g. "[data-related-articles]" on product pages). Pass = "0 Thai text node(s)" on every page × locale; exit 1 otherwise.
// Same CDP approach as scripts/shot.js (Node 22+ WebSocket, the age gate pre-accepted through localStorage).
const { spawn } = require("child_process"); const http = require("http"); const fs = require("fs");
const { CHROME, FLAGS, TMP } = require("./lib/chrome"); // Windows: same Chrome as before · cloud: Chromium, found by search
const AGE_KEY = process.env.AGE_KEY || "okami24-age-verified";
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const base = opt("--base", "http://localhost:3412").replace(/\/$/, "");
const locales = opt("--locales", "en,zh").split(",");
const selector = opt("--selector", "body");
const valueFlags = new Set(["--base", "--locales", "--selector"]);
const paths = args.filter((a, i) => a.startsWith("/") && !valueFlags.has(args[i - 1]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function guidePaths() {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).filter((p) => p === "/guides" || p.startsWith("/guides/"));
}

async function main() {
  const list = paths.length ? paths : await guidePaths();
  const port = 9333 + Math.floor(Math.random() * 500);
  const profile = `${TMP}/okami-locale-scan-${process.pid}`;
  const chrome = spawn(CHROME, [...FLAGS, `--remote-debugging-port=${port}`, "--headless=new", "--disable-gpu", "--no-first-run", `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
  const getJson = (p) => new Promise((res, rej) => http.get(`http://127.0.0.1:${port}${p}`, (r) => { let b = ""; r.on("data", (c) => (b += c)); r.on("end", () => res(JSON.parse(b))); }).on("error", rej));
  let targets; for (let i = 0; i < 40 && !targets; i++) { try { targets = await getJson("/json"); } catch { await sleep(250); } }
  if (!targets) throw new Error("Chrome did not expose DevTools");
  const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Page.enable"); await send("Runtime.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{localStorage.setItem(${JSON.stringify(AGE_KEY)},"true")}catch(e){}` });

  const probe = `(() => {
    const root = document.querySelector(${JSON.stringify(selector)});
    if (!root) return { missing: true, hits: [] };
    const thai = /[\\u0E01-\\u0E3A\\u0E40-\\u0E5B]/;
    const skip = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"]);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const hits = [];
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      if (n.parentElement && skip.has(n.parentElement.tagName)) continue;
      if (thai.test(n.nodeValue)) hits.push(n.nodeValue.trim().slice(0, 60));
    }
    return { missing: false, hits, lang: document.documentElement.lang };
  })()`;

  let total = 0; const rows = [];
  for (const locale of locales) {
    await send("Network.enable");
    await send("Network.setCookie", { name: "okami24_locale", value: locale, url: base });
    for (const p of list) {
      await send("Page.navigate", { url: base + p }); await sleep(3500);
      const r = (await send("Runtime.evaluate", { expression: probe, returnByValue: true })).result.result.value;
      const n = r.missing ? 0 : r.hits.length; total += n;
      rows.push({ p, locale, n, missing: r.missing, sample: r.hits.slice(0, 3) });
      console.log(`${n === 0 ? "ok  " : "FAIL"} ${locale} ${p}${r.missing ? ` (no ${selector})` : ""}: ${n} Thai text node(s)${n ? " — " + r.hits.slice(0, 3).map((h) => JSON.stringify(h)).join(" · ") : ""}`);
    }
  }
  ws.close(); chrome.kill(); setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }, 500);
  console.log(`\n# locale hydration scan — ${list.length} page(s) × ${locales.join("/")} · selector ${selector} · base ${base}`);
  console.log(total === 0 ? `PASS 0 Thai text node(s) on ${rows.length} page×locale` : `FAIL ${total} Thai text node(s) on ${rows.filter((r) => r.n).length}/${rows.length} page×locale`);
  process.exit(total === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e.message || e); process.exit(1); });
