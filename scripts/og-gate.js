// OKami24 — share-card gate over the WHOLE sitemap (round "share-deadend", 2026-09-22).
//
//   node scripts/og-gate.js [--base http://localhost:3412] [--verbose]
//
// Why it exists: until this round the root layout's `openGraph.title`/`description` were
// inherited by every page that did not set its own, so 52 of the 105 pages in the sitemap AT THE
// TIME (it is smaller now — the count is read from the run, never from this comment) shared one share
// card. Nothing on the site could see that — the pages looked right, only the card was wrong.
// This gate reads the real HTML of every URL in <base>/sitemap.xml and fails when:
//
//   (1) og:title or og:description is missing;
//   (2) og:title is not the page's own <title>, or og:description is not its meta description
//       (the owner's rule: a share card never contradicts the search result — round SEO ก,
//       2026-09-21 — and the way this round keeps the two in step without copying strings).
//       The site-name suffix of the <title> template ("… — OKami24") may be absent from
//       og:title: a share card already carries og:site_name, and the 53 product pages have
//       always set the bare product title there. Anything else must match character for
//       character;
//   (3) og:image is missing (a card with no image is what the old code was protecting against);
//   (4) two different URLs share one og:title.
//
// (4) has no allow-list on purpose: today every page's <title> is unique, so a duplicate means
// two pages really do present themselves as the same thing. If a legitimate pair ever needs to
// share a title, add it here with the reason, in the file — not as a silent pass.
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const base = opt("--base", "http://localhost:3412").replace(/\/$/, "");
const verbose = args.includes("--verbose");

/** Pairs of URLs allowed to share one og:title, with the reason. Empty today. */
const ALLOWED_DUPLICATE_TITLES = [];

const pick = (html, re) => { const m = html.match(re); return m ? m[1].trim() : null; };
const decode = (s) =>
  s === null
    ? null
    : s
        .replace(/&quot;/g, '"')
        .replace(/&#x27;|&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/\s+/g, " ")
        .trim();

async function getText(url) {
  const res = await fetch(url, { headers: { "user-agent": "okami24-og-gate/1.0" } });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.text();
}

(async () => {
  const sitemap = await getText(`${base}/sitemap.xml`);
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, base));
  if (urls.length === 0) throw new Error("sitemap has no <loc> — is the server up?");

  const rows = [];
  for (const url of urls) {
    const html = await getText(url);
    const head = html.slice(0, html.indexOf("</head>") + 7);
    rows.push({
      path: url.replace(base, "") || "/",
      title: decode(pick(head, /<title[^>]*>([\s\S]*?)<\/title>/)),
      desc: decode(pick(head, /<meta name="description" content="([^"]*)"/)),
      ogTitle: decode(pick(head, /<meta property="og:title" content="([^"]*)"/)),
      ogDesc: decode(pick(head, /<meta property="og:description" content="([^"]*)"/)),
      ogImage: pick(head, /<meta property="og:image" content="([^"]*)"/),
      twTitle: decode(pick(head, /<meta name="twitter:title" content="([^"]*)"/)),
    });
  }

  // The <title> template adds the site name; a card that leaves it off still reflects its page.
  const withoutSiteName = (t) => (t === null ? null : t.replace(/\s+—\s+OKami24(\s+\(OKM\))?$/, "").trim());

  // Round "backlink" (2026-09-22): a product card's title may add the catalog price that its own
  // description already states — "… ของแท้ ฿2,490" — because a link preview cuts the description
  // short and the price is why the admin sent the link. Nothing else may differ: the price has to
  // be a ฿-number appended to the page's own title AND appear in that page's og:description, so a
  // typed or stale number cannot slip through here.
  const titleMatches = (r) => {
    const bare = withoutSiteName(r.title);
    if (r.ogTitle === r.title || r.ogTitle === bare) return true;
    for (const base of [r.title, bare]) {
      if (base === null || !r.ogTitle.startsWith(base + " ")) continue;
      const tail = r.ogTitle.slice(base.length + 1).trim();
      if (/^฿[\d,]+$/.test(tail) && (r.ogDesc ?? "").includes(tail)) return true;
    }
    return false;
  };

  const missing = rows.filter((r) => !r.ogTitle || !r.ogDesc);
  const mismatched = rows.filter((r) => r.ogTitle && r.title && !titleMatches(r));
  const descMismatched = rows.filter((r) => r.ogDesc && r.desc && r.ogDesc !== r.desc);
  const noImage = rows.filter((r) => !r.ogImage);
  const twMismatched = rows.filter((r) => r.twTitle && r.ogTitle && r.twTitle !== r.ogTitle);

  const byTitle = new Map();
  for (const r of rows) {
    if (!r.ogTitle) continue;
    byTitle.set(r.ogTitle, [...(byTitle.get(r.ogTitle) ?? []), r.path]);
  }
  const allowed = new Set(ALLOWED_DUPLICATE_TITLES.map((p) => [...p.paths].sort().join("|")));
  const duplicates = [...byTitle.entries()]
    .filter(([, paths]) => paths.length > 1)
    .filter(([, paths]) => !allowed.has([...paths].sort().join("|")));

  if (verbose) for (const r of rows) console.log(`${r.path}\n  og:title ${r.ogTitle}\n  og:desc  ${(r.ogDesc ?? "").slice(0, 80)}`);

  const say = (label, list, fmt) => {
    console.log(`${label}: ${list.length}`);
    for (const x of list.slice(0, 10)) console.log(`   ${fmt(x)}`);
    if (list.length > 10) console.log(`   … ${list.length - 10} more`);
  };
  console.log(`pages checked: ${rows.length}`);
  say("missing og:title/og:description", missing, (r) => `${r.path} (title=${r.ogTitle} desc=${r.ogDesc})`);
  say("og:title ≠ <title>", mismatched, (r) => `${r.path}\n     <title> ${r.title}\n     og      ${r.ogTitle}`);
  say("og:description ≠ meta description", descMismatched, (r) => `${r.path}\n     meta ${r.desc}\n     og   ${r.ogDesc}`);
  say("missing og:image", noImage, (r) => r.path);
  say("twitter:title ≠ og:title", twMismatched, (r) => `${r.path} (${r.twTitle} vs ${r.ogTitle})`);
  say("duplicate og:title across pages", duplicates, ([t, paths]) => `"${t}" → ${paths.join(", ")}`);

  const failed = missing.length + mismatched.length + descMismatched.length + noImage.length + twMismatched.length + duplicates.length;
  console.log(failed === 0 ? `\nPASS share-card gate: ${rows.length}/${rows.length} pages carry their own card` : `\nFAIL share-card gate: ${failed} problem(s)`);
  process.exit(failed === 0 ? 0 : 1);
})().catch((e) => {
  console.error(String(e));
  process.exit(1);
});
