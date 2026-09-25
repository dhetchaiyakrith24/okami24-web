/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// Read-only head/link audit of every sitemap page on a running site (title · description · canonical · robots ·
// og:title · H1 · JSON-LD types · internal links in <main> · images without alt).
//   node scripts/head-audit.js <base> <outDir>
//   base = https://okami24.store (live) or http://localhost:3412 (test server) — sitemap origins are rebased to it
// Writes: <outDir>/head-audit.tsv (one row per page) · <outDir>/inbound.json (internal links INTO each path,
// counted from <main> of every page) · <outDir>/ld/<path>.json (raw ld+json blocks per page).
// Before/after = run on both bases into two outDirs, then diff the .tsv files.
const fs = require("fs");
const path = require("path");

const base = process.argv[2];
const outDir = process.argv[3];
if (!base || !outDir) {
  console.error("usage: node scripts/head-audit.js <base> <outDir>");
  process.exit(2);
}
const ldDir = path.join(outDir, "ld");
fs.mkdirSync(ldDir, { recursive: true });

const strip = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

async function fetchText(url) {
  const r = await fetch(url, { headers: { "user-agent": "okami24-head-audit/1.0 (read-only)" } });
  return { status: r.status, text: await r.text() };
}

async function main() {
  const sm = await fetchText(base + "/sitemap.xml");
  // The sitemap carries SITE_URL origins; rebase to the origin being measured (same as og-gate.js).
  const urls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, base));
  console.log(`sitemap: ${urls.length} urls`);
  const rows = [];
  const inbound = {};
  for (const u of urls) {
    const p = new URL(u).pathname;
    let status, html;
    try {
      ({ status, text: html } = await fetchText(u));
    } catch (e) {
      rows.push({ path: p, status: "ERR " + e.message });
      continue;
    }
    // invisible chars the typography layer inserts (WORD JOINER, NBSP — .claude/LESSONS.md 1ข)
    const clean = html.replace(/[\u2060\u00A0]/g, "");
    const title = decode((clean.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1] || "");
    const desc = decode((clean.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "");
    const canon = (clean.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
    const robots = (clean.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || "";
    const ogTitle = decode((clean.match(/<meta property="og:title" content="([^"]*)"/) || [])[1] || "");
    const h1s = [...clean.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => decode(strip(m[1])));
    const ldRaw = [...clean.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    const ldTypes = ldRaw.map((raw) => {
      try {
        const j = JSON.parse(raw);
        const t = (x) => x && x["@type"];
        if (Array.isArray(j)) return j.map(t).join("+");
        if (j["@graph"]) return "graph:" + j["@graph"].map(t).join("+");
        return t(j) || "?";
      } catch {
        return "BAD";
      }
    });
    const ldFile = path.join(ldDir, (p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "__")) + ".json");
    fs.writeFileSync(ldFile, JSON.stringify(ldRaw.map((r) => { try { return JSON.parse(r); } catch { return { BAD: r }; } }), null, 1));
    const mainHtml = (clean.match(/<main[\s\S]*?<\/main>/) || [clean])[0];
    const mainNoScript = mainHtml.replace(/<script[\s\S]*?<\/script>/g, "");
    const links = [...mainNoScript.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1].replace(/\/$/, "") || "/");
    for (const l of new Set(links)) {
      if (l === p) continue;
      (inbound[l] = inbound[l] || []).push(p);
    }
    const imgs = [...clean.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
    const noAlt = imgs.filter((t) => !/alt="[^"]+"/.test(t)).length;
    const mainText = strip(mainNoScript);
    const scripts = (clean.match(/<script/g) || []).length;
    rows.push({
      path: p,
      status,
      bytes: html.length,
      scripts,
      title,
      tlen: [...title].length,
      desc,
      dlen: [...desc].length,
      canon,
      robots,
      ogTitle,
      h1: h1s.join(" | "),
      h1count: h1s.length,
      ld: ldTypes.join(","),
      linksProducts: new Set(links.filter((l) => l.startsWith("/products/"))).size,
      linksGuides: new Set(links.filter((l) => l.startsWith("/guides/"))).size,
      linksAll: new Set(links).size,
      imgs: imgs.length,
      noAlt,
      mainChars: mainText.length,
      thaiChars: (mainText.match(/[฀-๿]/g) || []).length,
    });
    process.stdout.write(`${status} ${p} ${html.length}b\n`);
    await new Promise((r) => setTimeout(r, 250));
  }
  const cols = Object.keys(rows.find((r) => r.title !== undefined) || rows[0]);
  const tsv = [cols.join("\t"), ...rows.map((r) => cols.map((c) => String(r[c] ?? "").replace(/[\t\n\r]/g, " ")).join("\t"))].join("\n");
  fs.writeFileSync(path.join(outDir, "head-audit.tsv"), tsv);
  const inboundSummary = Object.fromEntries(
    Object.entries(inbound)
      .sort((a, b) => a[1].length - b[1].length)
      .map(([k, v]) => [k, { count: v.length, from: v }])
  );
  fs.writeFileSync(path.join(outDir, "inbound.json"), JSON.stringify(inboundSummary, null, 1));
  console.log(`done: ${rows.length} pages → ${outDir}/head-audit.tsv, inbound.json, ld/`);
}
main().catch((e) => { console.error(e); process.exit(1); });
