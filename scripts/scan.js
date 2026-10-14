/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// English-sentence leak gate for the Thai site (owner, 2026-09-17 — round 30.4ข close).
//
// Walks every URL in <base>/sitemap.xml (the count is whatever the catalog justifies — it was 105
// when this was written, 103 after round "share-deadend" dropped the empty categories and 99 after
// round "leftovers" dropped the four noindex tool pages; read it from the run, not from here),
// fetches the server HTML (the default
// locale is Thai), and flags any visible text run that has NO Thai script at all, is longer than
// 35 characters, has 6 or more words, and contains an English function word — i.e. an English
// sentence that a Thai visitor was never meant to see (a compatibility note, a spec value, a
// research remark that never got its Thai overlay). Brand names, model names, category names,
// spec stats and the brand slogans that stay English by owner ruling (THAI_STYLE §5 group ก) are
// short or carry no function word, and anything marked lang="en" (labelLang) is skipped outright;
// the brand `tagline` strings from src/data/brands.ts are allow-listed explicitly as well.
//
//   node scripts/scan.js [--base http://localhost:3412] [--pages "/ /guides /products/x"] [--allow "<exact text>"]... [--verbose]
//
// Pass = 0 flagged runs across all pages (prints "0/<pages>"). Exit code 1 when anything is flagged
// so the checker can use it as a gate. Read-only, no browser needed.
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const base = opt("--base", "http://localhost:3412").replace(/\/$/, "");
const VERBOSE = args.includes("--verbose");
const extraAllow = args.map((a, i) => (a === "--allow" ? args[i + 1] : null)).filter(Boolean);
// --pages "/a /b,/c" = only these paths (TEAM_RULES 13.5 #2 (ข): the touched pages + the pages that show that text);
// without it = every sitemap URL (13.5 #5: shared parts). Paths start with "/"; full URLs are cut to their path.
const PAGES = (opt("--pages", "") || "").split(/[\s,]+/).filter(Boolean).map((p) => p.replace(/^https?:\/\/[^/]+/, "") || "/");

const THAI = /\p{Script=Thai}/u;
const FUNCTION_WORD = /\b(is|are|the|for|which|that|designed|stated|with|from|your|our|can|will|has|not|when)\b/i;
const MIN_CHARS = 35;
const MIN_WORDS = 6;
const SKIP_TAGS = new Set(["script", "style", "noscript", "template", "svg", "head", "title"]);
const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr", "path", "circle", "rect", "line", "polyline", "polygon", "use", "stop"]);

// Brand slogans stay English in every language (owner ruling) — read them from the data file so the
// allow-list cannot drift from what the site shows.
function brandTaglines() {
  try {
    const src = fs.readFileSync(path.join(__dirname, "..", "src", "data", "brands.ts"), "utf8");
    return [...src.matchAll(/tagline:\s*"([^"]+)"/g)].map((m) => m[1]);
  } catch {
    return [];
  }
}
const ALLOW = new Set([...brandTaglines(), ...extraAllow].map(norm));

function norm(s) {
  return s
    .replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ")
    .replace(new RegExp("[" + String.fromCharCode(0xa0) + String.fromCharCode(0x2060) + "]", "g"), " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Tokenise the HTML into tags and text, keeping a stack so each text run knows its element chain
// and whether an ancestor carries lang="en" (or is a skipped element).
function scanHtml(html) {
  const body = html.slice(Math.max(0, html.indexOf("<body")));
  const tokens = body.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) || [];
  const stack = []; // { tag, langEn, skip }
  const hits = [];
  for (const tok of tokens) {
    if (tok.startsWith("<!--")) continue;
    if (tok.startsWith("</")) {
      const tag = tok.slice(2, -1).trim().toLowerCase().split(/\s/)[0];
      for (let i = stack.length - 1; i >= 0; i--) if (stack[i].tag === tag) { stack.length = i; break; }
      continue;
    }
    if (tok.startsWith("<")) {
      const m = tok.match(/^<([a-zA-Z][\w:-]*)/);
      if (!m) continue;
      const tag = m[1].toLowerCase();
      const selfClosing = tok.endsWith("/>") || VOID_TAGS.has(tag);
      const langEn = /\slang=["']en(?:-[A-Za-z]+)?["']/.test(tok);
      const parent = stack[stack.length - 1];
      const frame = { tag, langEn: langEn || (parent ? parent.langEn : false), skip: SKIP_TAGS.has(tag) || (parent ? parent.skip : false) };
      if (!selfClosing) stack.push(frame);
      continue;
    }
    const top = stack[stack.length - 1];
    if (!top || top.skip || top.langEn) continue;
    const text = norm(tok);
    if (text.length <= MIN_CHARS) continue;
    if (THAI.test(text)) continue;
    const words = text.split(" ").filter(Boolean);
    if (words.length < MIN_WORDS) continue;
    if (!FUNCTION_WORD.test(text)) continue;
    if (ALLOW.has(text)) continue;
    hits.push({ chain: stack.map((f) => f.tag).slice(-4).join(">"), text });
  }
  return hits;
}

async function main() {
  let urls;
  if (PAGES.length) urls = [...new Set(PAGES)];
  else {
    const smRes = await fetch(`${base}/sitemap.xml`);
    if (!smRes.ok) { console.error(`sitemap.xml → HTTP ${smRes.status}`); process.exit(2); }
    const sm = await smRes.text();
    urls = [...new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/"))];
  }
  let flaggedPages = 0, flaggedRuns = 0, unread = 0;
  const distinct = new Map();
  for (const u of urls) {
    // a page that could not be read is not a pass (15/10: Git Bash rewrote "/guides" into "C:/Program Files/Git/guides"
    // — run with MSYS_NO_PATHCONV=1 — and the scan still printed PASS)
    if (!u.startsWith("/")) { unread++; console.log(`${u}\tNOT A PATH (Git Bash? set MSYS_NO_PATHCONV=1)`); continue; }
    let html;
    try {
      const res = await fetch(base + u);
      if (!res.ok) { unread++; console.log(`${u}\tHTTP ${res.status}`); await res.body?.cancel(); continue; } // drain: an unread body crashes node on exit (Windows)
      html = await res.text();
    } catch (e) { unread++; console.log(`${u}\tFETCH FAILED ${e.message}`); continue; }
    const hits = scanHtml(html);
    if (hits.length) {
      flaggedPages++; flaggedRuns += hits.length;
      console.log(`${u}\t${hits.length} flagged`);
      for (const h of hits) {
        const key = h.text;
        if (!distinct.has(key)) distinct.set(key, { chain: h.chain, pages: [] });
        distinct.get(key).pages.push(u);
        if (VERBOSE) console.log(`   [${h.chain}] ${h.text.slice(0, 160)}`);
      }
    }
  }
  console.log("");
  console.log(`# English-sentence leak scan — ${urls.length} page(s) · base ${base}`);
  console.log(`flagged runs: ${flaggedRuns} · distinct texts: ${distinct.size} · pages with a flag: ${flaggedPages}/${urls.length}`);
  if (distinct.size) {
    console.log("");
    console.log("| n | pages (first 3) | element | text |");
    console.log("|---|---|---|---|");
    for (const [text, info] of distinct) console.log(`| ${info.pages.length} | ${info.pages.slice(0, 3).join(" · ")} | ${info.chain} | ${text.slice(0, 200)} |`);
  }
  console.log("");
  if (unread) console.log(`unreadable pages: ${unread} (not scanned = not passed)`);
  console.log(flaggedPages === 0 && !unread ? `PASS 0/${urls.length}` : `FAIL ${flaggedPages}/${urls.length}${unread ? ` · ${unread} unreadable` : ""}`);
  process.exitCode = flaggedPages === 0 && !unread ? 0 : 1; // not process.exit(): exiting with a socket still open crashes node on Windows
}

main().catch((e) => { console.error(e); process.exit(2); });
