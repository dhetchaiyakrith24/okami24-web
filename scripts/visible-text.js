/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Visible-text scan: what a visitor actually reads, after hydration, per page × locale × width — every script
// (Thai, English, Chinese), not only Thai like scripts/linemap-scan.js. Used to prove "what changed on screen"
// between two builds (skill .claude/skills/tier-b-proof), then shoot only those spots.
//
//   node scripts/visible-text.js scan --base <origin> --out <dir> [--locales th,en,zh] [--widths 390,1440] [--wait 2500] [/path ...]
//        no paths → every URL in <base>/sitemap.xml (origins rebased to --base) · one JSON per page/locale/width
//   node scripts/visible-text.js diff <beforeDir> <afterDir> <outDir> [--before-base <origin>] [--after-base <origin>]
//        [--shot-locales th] [--cluster-depth 3]
//        writes <outDir>/changes.json · changes.md (distinct changes + every change) · shots.md (the shot plan: which
//        image covers which change groups) · shots-before.txt / shots-after.txt (scripts/shot.js commands; run each
//        file while that side's server answers on its base; default base http://localhost:3412 for both)
//
// Why hydrated text: the server HTML carries every locale's strings in the hydration payload and the language is a
// cookie (okami24_locale) read in the browser — raw HTML cannot say what an English visitor sees. Widths matter
// because CSS shows different elements at 390 and 1440 (e.g. the phone vs desktop spec line of a product card).
// A "block" = nearest non-inline ancestor of visible text nodes; its key = DOM path + normalised text
// (U+2060 dropped, NBSP read as a space, whitespace collapsed). Hidden elements (display:none / visibility:hidden /
// zero size) are skipped. Same headless-Chrome/CDP approach as scripts/linemap-scan.js; one Chrome, one tab
// (HANDOFF §17: never two Chrome jobs at once). Age gate pre-accepted through localStorage like scripts/shot.js.
// Cloudflare's e-mail obfuscation on the live site ("[email protected]" before its decoder runs) is normalised to the
// address, so a live-vs-local comparison does not report it.
const fs = require("fs");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const AGE_KEY = process.env.AGE_KEY || "okami24-age-verified";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Git Bash rewrites a leading "/" into its install folder ("/contact" → "C:/Program Files/Git/contact") unless
// MSYS_NO_PATHCONV=1 is set — which would silently turn a page list into a whole-sitemap scan. Undo it here.
const args = process.argv.slice(2).map((a) => a.replace(/^[A-Za-z]:[/\\]Program Files[/\\]Git(?=[/\\]|$)/, "").replace(/\\/g, "/") || "/");
const FLAGS_WITH_VALUE = ["--base", "--widths", "--locales", "--out", "--wait", "--before-base", "--after-base", "--shot-locales", "--cluster-depth"];
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};

// ---- in-page measurement ---------------------------------------------------------------------
const EVAL = String.raw`(() => {
  const SKIP = new Set(["SCRIPT","STYLE","NOSCRIPT","TEMPLATE","SVG"]);
  const isBlock = (el) => { if (el.hasAttribute("data-tjw")) return false; const d = getComputedStyle(el).display; return !(d === "inline" || d === "contents"); };
  const blockOf = (el) => { while (el && el !== document.body && !isBlock(el)) el = el.parentElement; return el || document.body; };
  const pathOf = (el) => { const p = []; while (el && el !== document.body) { let i = 0, s = el; while ((s = s.previousElementSibling)) i++; p.unshift(el.tagName.toLowerCase() + ":" + (i + 1)); el = el.parentElement; } return p.join("/"); };
  const visible = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden") return false; } return true; };
  const blocks = new Map();
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const el = n.parentElement;
    if (!el || !n.nodeValue || !n.nodeValue.trim() || SKIP.has(el.tagName.toUpperCase()) || el.closest("svg")) continue;
    if (!visible(el)) continue;
    const r = document.createRange(); r.selectNodeContents(n); const rect = r.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    const b = blockOf(el);
    if (!blocks.has(b)) blocks.set(b, []);
    blocks.get(b).push(n.nodeValue);
  }
  const out = [];
  for (const [b, parts] of blocks) {
    const text = parts.join("").replace(/\u2060/g, "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
    if (text) out.push({ path: pathOf(b), text });
  }
  return JSON.stringify({ url: location.pathname, title: document.title, blocks: out });
})()`;

async function withChrome(fn) {
  const port = 9333 + Math.floor(Math.random() * 500);
  const profile = `${process.env.TEMP || "/tmp"}/okami-vtext-${process.pid}-${port}`;
  const chrome = spawn(CHROME, [`--remote-debugging-port=${port}`, "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars", `--user-data-dir=${profile}`, "--window-size=1200,900", "about:blank"], { stdio: "ignore" });
  const getJson = (p) => new Promise((res, rej) => http.get(`http://127.0.0.1:${port}${p}`, (r) => { let b = ""; r.on("data", (c) => (b += c)); r.on("end", () => res(JSON.parse(b))); }).on("error", rej));
  try {
    let target = null;
    for (let i = 0; i < 60 && !target; i++) {
      try { target = (await getJson("/json/list")).find((t) => t.type === "page"); } catch { /* not up yet */ }
      if (!target) await sleep(500);
    }
    if (!target) throw new Error("Chrome DevTools endpoint never appeared");
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let id = 0;
    const pending = new Map();
    ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
    const send = (method, params = {}) => new Promise((r, rej) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); setTimeout(() => { if (pending.has(i)) { pending.delete(i); rej(new Error(`${method} timed out`)); } }, 90000); });
    await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
    await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{localStorage.setItem(${JSON.stringify(AGE_KEY)},"true")}catch(e){}` });
    return await fn(send);
  } finally {
    chrome.kill();
    setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* best effort */ } }, 800);
  }
}

const fileName = (u, loc, w) => `${u.replace(/^\//, "").replace(/[/?=,&]+/g, "_") || "home"}~${loc}~${w}.json`;

async function scan() {
  const base = (opt("--base") || "").replace(/\/$/, "");
  const outDir = opt("--out");
  if (!base || !outDir) { console.error("scan needs --base <origin> --out <dir>"); process.exit(2); }
  const locales = opt("--locales", "th,en,zh").split(",");
  const widths = opt("--widths", "390,1440").split(",").map(Number);
  const wait = +opt("--wait", "2500");
  let urls = args.slice(1).filter((a, i) => a.startsWith("/") && !FLAGS_WITH_VALUE.includes(args[i]));
  if (urls.length === 0) {
    const sm = await (await fetch(`${base}/sitemap.xml`)).text();
    urls = [...new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/"))];
  }
  fs.mkdirSync(outDir, { recursive: true });
  const host = new URL(base).hostname;
  let fails = 0;
  await withChrome(async (send) => {
    for (const loc of locales) {
      await send("Network.setCookie", { name: "okami24_locale", value: loc, domain: host, path: "/" });
      for (const w of widths) {
        await send("Emulation.setDeviceMetricsOverride", { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
        for (const u of urls) {
          try {
            await send("Page.navigate", { url: base + u });
            await sleep(wait);
            await send("Runtime.evaluate", { expression: "document.fonts ? document.fonts.ready.then(() => true) : true", awaitPromise: true, returnByValue: true });
            const r = await send("Runtime.evaluate", { expression: EVAL, returnByValue: true });
            if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.text);
            const data = JSON.parse(r.result.result.value);
            fs.writeFileSync(path.join(outDir, fileName(u, loc, w)), JSON.stringify({ page: u, locale: loc, width: w, ...data }));
            process.stderr.write(`${loc} ${w} ${u}: ${data.blocks.length} blocks\n`);
          } catch (e) {
            fails++;
            process.stderr.write(`FAIL ${loc} ${w} ${u}: ${e.message}\n`);
          }
        }
      }
    }
  });
  console.log(`scan done: ${urls.length} pages × ${locales.length} locales × ${widths.length} widths → ${outDir} · failures ${fails}`);
  if (fails) process.exit(1);
}

// e-mail obfuscation by Cloudflare on the live site: the undecoded placeholder reads "[email protected]"
// Whitespace is dropped for the comparison: text nodes of sibling elements are joined as they sit in the DOM, so
// "20" + "Flavor" in two flex items reads "20Flavor" in one build and "20 Flavor" in another although the screen is
// the same. Where Thai text wraps is scripts/wordbreak-scan.js's job, not this one.
const norm = (t) => t.replace(/\[email(?:\u00a0| )protected\]/g, "<email>").replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, "<email>").replace(/\s+/g, "");
// shot.js --anchor wants a CSS selector; the DOM path is tag:nth-child from <body>
const selectorOf = (p) => "body > " + p.split("/").map((s) => { const [t, i] = s.split(":"); return `${t}:nth-child(${i})`; }).join(" > ");

function diff(beforeDir, afterDir, outDir) {
  const list = (d) => new Set(fs.readdirSync(d).filter((f) => f.endsWith(".json")));
  const A = list(beforeDir), B = list(afterDir);
  const changes = [];
  const onlyOne = [];
  for (const f of [...new Set([...A, ...B])].sort()) {
    if (!A.has(f) || !B.has(f)) { onlyOne.push(`${f}: ${A.has(f) ? "before only" : "after only"}`); continue; }
    const a = JSON.parse(fs.readFileSync(path.join(beforeDir, f), "utf8"));
    const b = JSON.parse(fs.readFileSync(path.join(afterDir, f), "utf8"));
    // multiset difference on the normalised text: a block whose text still exists elsewhere on the page is not a change
    const minus = (xs, ys) => {
      const left = new Map();
      for (const y of ys) left.set(norm(y.text), (left.get(norm(y.text)) || 0) + 1);
      return xs.filter((x) => { const k = norm(x.text); if ((left.get(k) || 0) > 0) { left.set(k, left.get(k) - 1); return false; } return true; });
    };
    const gone = minus(a.blocks, b.blocks);
    const added = minus(b.blocks, a.blocks);
    // pair a removed and an added block that sit at the same DOM path = one "changed" block
    const addedByPath = new Map(added.map((x) => [x.path, x]));
    for (const g of gone) {
      const pair = addedByPath.get(g.path);
      if (pair) addedByPath.delete(g.path);
      changes.push({ page: a.page, locale: a.locale, width: a.width, kind: pair ? "changed" : "removed", path: g.path, before: g.text, after: pair ? pair.text : null });
    }
    for (const x of addedByPath.values()) changes.push({ page: a.page, locale: a.locale, width: a.width, kind: "added", path: x.path, before: null, after: x.text });
  }
  // the same before→after at the same locale and width on several pages (a shared card, a footer line) = one group,
  // shot once on its first page
  const groups = new Map();
  for (const c of changes) {
    const k = [c.locale, c.width, c.kind, norm(c.before || ""), norm(c.after || "")].join("|");
    if (!groups.has(k)) groups.set(k, { id: groups.size + 1, rep: c, pages: [] });
    const g = groups.get(k);
    g.pages.push(c.page);
    c.group = g.id;
  }
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "changes.json"), JSON.stringify({ beforeDir, afterDir, pagesCompared: [...A].filter((f) => B.has(f)).length, onlyOne, changes }, null, 1));
  const cell = (t) => (t == null ? "—" : t.length > 180 ? t.slice(0, 177) + "…" : t).replace(/\|/g, "\\|");
  const G = [...groups.values()];
  const md = [
    `# Visible-text diff — ${beforeDir} → ${afterDir}`,
    "",
    `page×locale×width files compared: ${[...A].filter((f) => B.has(f)).length} · changes: ${changes.length} · distinct changes (groups): ${G.length} · files on one side only: ${onlyOne.length}`,
    "",
    "## Distinct changes (one shot pair each)",
    "| group | locale | width | kind | before | after | pages |",
    "|---|---|---|---|---|---|---|",
    ...G.map((g) => `| ${g.id} | ${g.rep.locale} | ${g.rep.width} | ${g.rep.kind} | ${cell(g.rep.before)} | ${cell(g.rep.after)} | ${g.pages.length}: ${[...new Set(g.pages)].slice(0, 6).join(" ")}${new Set(g.pages).size > 6 ? " …" : ""} |`),
    "",
    "## Every change",
    "| # | group | page | locale | width | kind | before | after |",
    "|---|---|---|---|---|---|---|---|",
    ...changes.map((c, i) => `| ${i + 1} | ${c.group} | ${c.page} | ${c.locale} | ${c.width} | ${c.kind} | ${cell(c.before)} | ${cell(c.after)} |`),
    ...(onlyOne.length ? ["", "## Files on one side only", ...onlyOne.map((x) => `- ${x}`)] : []),
  ].join("\n");
  fs.writeFileSync(path.join(outDir, "changes.md"), md);
  // Shot plan — as few images as cover every distinct change once, in the shot language(s) (default th; the other
  // languages are proven by the text diff above, which lists every word). Per language and width: pick the page that
  // shows the most not-yet-covered distinct changes, again and again until all are covered; on each picked page,
  // changes that share a page section (the first --cluster-depth levels of their DOM path) share one image anchored on
  // the first of them. A section with a removed/changed block also gets a "before" image. shots.md ties every image
  // to the change groups it covers.
  const beforeBase = (opt("--before-base", "http://localhost:3412") || "").replace(/\/$/, "");
  const afterBase = (opt("--after-base", "http://localhost:3412") || "").replace(/\/$/, "");
  const shotLocales = (opt("--shot-locales", "th") || "th").split(",");
  const depth = +(opt("--cluster-depth", "3") || 3);
  const cmd = (file, base, c) =>
    `node scripts/shot.js ${outDir}/${file} ${base}${c.page} --width ${c.width}${c.width >= 768 ? " --desktop" : ""} --cookie okami24_locale=${c.locale} --anchor ${JSON.stringify(selectorOf(c.path))}`;
  const before = [], after = [], plan = [], shotGroups = new Set();
  let n = 0;
  // a page+width whose changes exist only in another language (e.g. an English-only fix) is shot in that language
  const shotPairs = new Set(changes.filter((c) => shotLocales.includes(c.locale)).map((c) => `${c.page}|${c.width}`));
  const otherLocales = [...new Set(changes.map((c) => c.locale))].filter((l) => !shotLocales.includes(l));
  for (const loc of [...shotLocales, ...otherLocales]) {
    const own = shotLocales.includes(loc);
    for (const w of [...new Set(changes.map((c) => c.width))].sort((a, b) => a - b)) {
      const mine = changes.filter((c) => c.locale === loc && c.width === w && (own || !shotPairs.has(`${c.page}|${c.width}`)));
      const byPage = new Map();
      for (const c of mine) { if (!byPage.has(c.page)) byPage.set(c.page, []); byPage.get(c.page).push(c); }
      const left = new Set(mine.map((c) => c.group));
      while (left.size) {
        let best = null, score = 0;
        for (const [p, cs] of byPage) { const k = new Set(cs.map((c) => c.group).filter((g) => left.has(g))).size; if (k > score) { score = k; best = p; } }
        const clusters = new Map();
        for (const c of byPage.get(best)) {
          if (!left.has(c.group)) continue;
          const pre = c.path.split("/").slice(0, depth).join("/");
          if (!clusters.has(pre)) clusters.set(pre, []);
          clusters.get(pre).push(c);
        }
        for (const cs of clusters.values()) {
          const id = `s${String(++n).padStart(3, "0")}-${loc}-${w}`;
          const groups = [...new Set(cs.map((c) => c.group))];
          groups.forEach((g) => shotGroups.add(g));
          const afterAnchor = cs.find((c) => c.kind !== "removed");
          const beforeAnchor = cs.find((c) => c.kind !== "added");
          if (afterAnchor) after.push(cmd(`${id}-after.png`, afterBase, afterAnchor));
          if (beforeAnchor) before.push(cmd(`${id}-before.png`, beforeBase, beforeAnchor));
          plan.push(`| ${id} | ${best} | ${beforeAnchor ? "before + after" : "after"} | ${groups.join(" ")} |`);
        }
        for (const c of byPage.get(best)) left.delete(c.group);
      }
    }
  }
  const lines = (xs) => xs.join("\n") + (xs.length ? "\n" : "");
  fs.writeFileSync(path.join(outDir, "shots-before.txt"), lines(before));
  fs.writeFileSync(path.join(outDir, "shots-after.txt"), lines(after));
  const textOnly = G.filter((g) => !shotGroups.has(g.id)).map((g) => g.id);
  fs.writeFileSync(
    path.join(outDir, "shots.md"),
    [
      `# Shot plan — ${before.length + after.length} image(s) (${before.length} before · ${after.length} after) · shot language(s): ${shotLocales.join(",")}`,
      "",
      "| image | page | sides | change groups it covers (changes.md) |",
      "|---|---|---|---|",
      ...plan,
      "",
      `Groups proven by the text diff only (other languages): ${textOnly.length ? textOnly.join(" ") : "none"}`,
    ].join("\n"),
  );
  console.log(
    `diff: ${changes.length} change(s) (${changes.filter((c) => c.kind === "changed").length} changed · ${changes.filter((c) => c.kind === "added").length} added · ${changes.filter((c) => c.kind === "removed").length} removed) in ${G.length} distinct group(s) · one-side files ${onlyOne.length} → ${outDir}/changes.md · shot plan ${before.length} before + ${after.length} after (shots.md)`,
  );
}

if (args[0] === "scan") scan();
else if (args[0] === "diff" && args[3]) diff(args[1], args[2], args[3]);
else {
  console.error("usage: node scripts/visible-text.js scan --base <origin> --out <dir> [--locales th,en,zh] [--widths 390,1440] [/path ...]\n       node scripts/visible-text.js diff <beforeDir> <afterDir> <outDir> [--before-base <origin>] [--after-base <origin>]");
  process.exit(2);
}
