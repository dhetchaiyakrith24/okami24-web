#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Whole-site SEO re-audit — same measures as Cowork's 2026-09-16 baseline:
// HTTP status · canonical · H1 count · <html lang> · server time · HTML size · images (alt / lazy) ·
// internal links (broken?) · short meta description (<50) · short title (<20) · pages without JSON-LD.
// Usage: node scripts/site-audit.js [--base https://okami24.store] [--out _incoming/round9/audit-before]
// Writes <out>.json (per page) and <out>.md (summary). Read-only against the site.

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const arg = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};
const BASE = arg("--base", "https://okami24.store").replace(/\/$/, "");
const OUT = arg("--out", "_incoming/round9/audit");
const CONCURRENCY = Number(arg("--concurrency", "4"));

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
const len = (s) => [...s].length;
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? decode(m[2] ?? m[3] ?? "") : null;
};

async function timedFetch(url, opts = {}) {
  const t0 = performance.now();
  const res = await fetch(url, { redirect: "manual", ...opts });
  const ttfb = performance.now() - t0;
  const body = opts.method === "HEAD" ? "" : await res.text();
  return { res, ttfb, body };
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k], k);
      }
    }),
  );
  return out;
}

function auditHtml(url, html) {
  const noScript = html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  const head = (html.match(/<head[\s\S]*?<\/head>/i) || [""])[0];
  const title = decode((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1].trim());
  const descTag = head.match(/<meta[^>]+name=["']description["'][^>]*>/i);
  const desc = descTag ? attr(descTag[0], "content") || "" : "";
  const canonTag = head.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  const canonical = canonTag ? attr(canonTag[0], "href") : null;
  const lang = attr((html.match(/<html[^>]*>/i) || [""])[0], "lang");
  const h1 = (noScript.match(/<h1\b/gi) || []).length;
  const jsonld = (html.match(/<script[^>]+type=["']application\/ld\+json["']/gi) || []).length;
  const imgs = noScript.match(/<img\b[^>]*>/gi) || [];
  const img = { total: imgs.length, altAttr: 0, altNonEmpty: 0, lazy: 0 };
  for (const t of imgs) {
    const a = attr(t, "alt");
    if (a !== null) img.altAttr++;
    if (a && a.trim()) img.altNonEmpty++;
    if ((attr(t, "loading") || "").toLowerCase() === "lazy") img.lazy++;
  }
  const hrefs = new Set();
  for (const m of noScript.matchAll(/<a\b[^>]*\shref=("([^"]*)"|'([^']*)')/gi)) {
    let h = decode(m[2] ?? m[3] ?? "");
    if (!h || h.startsWith("#") || /^(mailto|tel|javascript):/i.test(h)) continue;
    try {
      const u = new URL(h, url);
      if (u.origin !== new URL(BASE).origin) continue;
      u.hash = "";
      hrefs.add(u.pathname + u.search);
    } catch {}
  }
  return { title, titleLen: len(title), desc, descLen: len(desc), canonical, lang, h1, jsonld, img, links: [...hrefs] };
}

(async () => {
  const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1].trim()));
  console.error(`sitemap: ${urls.length} URLs`);

  const pages = await pool(urls, CONCURRENCY, async (url) => {
    try {
      const { res, ttfb, body } = await timedFetch(url);
      const row = { url, status: res.status, ms: Math.round(ttfb), bytes: Buffer.byteLength(body) };
      if (res.status === 200) Object.assign(row, auditHtml(url, body));
      else row.location = res.headers.get("location");
      return row;
    } catch (e) {
      return { url, status: 0, error: String(e) };
    }
  });

  // Internal links: check every distinct target once (GET, no redirect follow).
  const targets = [...new Set(pages.flatMap((p) => p.links || []))].sort();
  const linkStatus = {};
  await pool(targets, CONCURRENCY, async (t) => {
    try {
      const r = await fetch(BASE + t, { redirect: "manual" });
      await r.arrayBuffer();
      linkStatus[t] = { status: r.status, location: r.headers.get("location") };
    } catch (e) {
      linkStatus[t] = { status: 0, error: String(e) };
    }
  });
  const broken = targets.filter((t) => linkStatus[t].status >= 400 || linkStatus[t].status === 0);
  const redirected = targets.filter((t) => linkStatus[t].status >= 300 && linkStatus[t].status < 400);

  const ok = pages.filter((p) => p.status === 200);
  const sum = (f) => ok.reduce((a, p) => a + f(p), 0);
  const imgTotal = sum((p) => p.img.total);
  const canonWrong = ok.filter((p) => {
    if (!p.canonical) return true;
    const c = new URL(p.canonical, p.url);
    const u = new URL(p.url);
    return c.origin + c.pathname.replace(/\/$/, "") !== u.origin + u.pathname.replace(/\/$/, "");
  });
  const summary = {
    at: new Date().toISOString(),
    base: BASE,
    pages: urls.length,
    http200: ok.length,
    non200: pages.filter((p) => p.status !== 200).map((p) => `${p.status} ${p.url}`),
    canonicalWrong: canonWrong.map((p) => `${p.url} -> ${p.canonical}`),
    h1Not1: ok.filter((p) => p.h1 !== 1).map((p) => `${p.h1} ${p.url}`),
    langNotTh: ok.filter((p) => p.lang !== "th").map((p) => `${p.lang} ${p.url}`),
    serverMsAvg: Math.round(sum((p) => p.ms) / ok.length),
    serverMsMax: Math.max(...ok.map((p) => p.ms)),
    htmlKbAvg: Math.round(sum((p) => p.bytes) / ok.length / 1024),
    htmlKbMax: Math.round(Math.max(...ok.map((p) => p.bytes)) / 1024),
    htmlMaxUrl: ok.reduce((a, p) => (p.bytes > a.bytes ? p : a)).url,
    images: imgTotal,
    imagesAltAttrPct: +((sum((p) => p.img.altAttr) / imgTotal) * 100).toFixed(1),
    imagesAltNonEmptyPct: +((sum((p) => p.img.altNonEmpty) / imgTotal) * 100).toFixed(1),
    imagesLazyPct: +((sum((p) => p.img.lazy) / imgTotal) * 100).toFixed(1),
    internalLinkTargets: targets.length,
    internalLinksBroken: broken.map((t) => `${linkStatus[t].status} ${t}`),
    internalLinksRedirect: redirected.map((t) => `${linkStatus[t].status} ${t} -> ${linkStatus[t].location}`),
    descShort50: ok.filter((p) => p.descLen < 50).map((p) => `${p.descLen} ${p.url}`),
    titleShort20: ok.filter((p) => p.titleLen < 20).map((p) => `${p.titleLen} ${p.url} "${p.title}"`),
    noJsonLd: ok.filter((p) => p.jsonld === 0).map((p) => p.url),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(`${OUT}.json`, JSON.stringify({ summary, pages, linkStatus }, null, 2));
  const n = (a) => (Array.isArray(a) ? a.length : a);
  const md = [
    `# Site audit ${summary.at} — ${BASE}`,
    "",
    "| measure | value |",
    "|---|---|",
    `| pages in sitemap | ${summary.pages} |`,
    `| HTTP 200 | ${summary.http200} |`,
    `| canonical wrong | ${n(summary.canonicalWrong)} |`,
    `| H1 not exactly 1 | ${n(summary.h1Not1)} |`,
    `| lang not th | ${n(summary.langNotTh)} |`,
    `| server ms avg / max | ${summary.serverMsAvg} / ${summary.serverMsMax} |`,
    `| HTML KB avg / max | ${summary.htmlKbAvg} / ${summary.htmlKbMax} (${summary.htmlMaxUrl}) |`,
    `| images | ${summary.images} |`,
    `| alt attr % / non-empty % | ${summary.imagesAltAttrPct} / ${summary.imagesAltNonEmptyPct} |`,
    `| lazy % | ${summary.imagesLazyPct} |`,
    `| internal link targets | ${summary.internalLinkTargets} |`,
    `| internal links broken | ${n(summary.internalLinksBroken)} |`,
    `| internal links redirecting | ${n(summary.internalLinksRedirect)} |`,
    `| meta description < 50 | ${n(summary.descShort50)} |`,
    `| title < 20 | ${n(summary.titleShort20)} |`,
    `| pages without JSON-LD | ${n(summary.noJsonLd)} |`,
    "",
    "## Lists",
    ...Object.entries(summary)
      .filter(([, v]) => Array.isArray(v) && v.length)
      .flatMap(([k, v]) => [`### ${k} (${v.length})`, ...v.map((x) => `- ${x}`), ""]),
  ].join("\n");
  fs.writeFileSync(`${OUT}.md`, md);
  console.log(md.split("## Lists")[0]);
})();
