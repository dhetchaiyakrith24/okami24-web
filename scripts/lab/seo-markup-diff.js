/* eslint-disable */
// Recipe kept from _incoming/seo-f/b4r/markup-diff.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Server-HTML markup diff, every sitemap URL: before origin vs after origin.
// Strips <script> blocks (RSC payload + chunk lists change by design), Next build ids and hashed asset names,
// then compares the remaining markup. Prints per-page SAME/DIFF + the first differing window.
// usage: node markup-diff.js <beforeOrigin> <afterOrigin> <outDir>
const fs = require("fs");
const path = require("path");
const [before, after, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const norm = (h, origin) =>
  h
    .replace(/<script\b[\s\S]*?<\/script>/g, "")
    .replace(/<link[^>]+(?:\/_next\/static\/[^>]*)>/g, "")
    .replace(/\/_next\/static\/[^"' )]+/g, "/_next/static/X")
    .replace(new RegExp(origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "ORIGIN")
    .replace(/https:\/\/okami24\.store/g, "ORIGIN")
    // Cloudflare e-mail obfuscation on the live site only
    .replace(/<a href="\/cdn-cgi\/l\/email-protection[^"]*"[^>]*>[\s\S]*?<\/a>/g, "EMAIL")
    .replace(/<span class="__cf_email__"[^>]*>[\s\S]*?<\/span>/g, "EMAIL")
    .replace(/data-cfemail="[^"]*"/g, "")
    // build-hash query on generated OG/Twitter images, and a meta whose position in the streamed head varies per build
    .replace(/(opengraph|twitter)-image(-[a-z0-9]+)?\?[a-z0-9]+/g, "$1-image?H")
    .replace(/<meta name="next-size-adjust" content=""\/>/g, "");
(async () => {
  const sm = await (await fetch(before + "/sitemap.xml")).text();
  const paths = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  let same = 0;
  const diffs = [];
  for (const p of paths) {
    const [a, b] = await Promise.all([before, after].map(async (o) => norm(await (await fetch(o + p)).text(), o)));
    if (a === b) { same++; continue; }
    let i = 0;
    while (i < a.length && a[i] === b[i]) i++;
    diffs.push({ path: p, at: i, before: a.slice(Math.max(0, i - 120), i + 200), after: b.slice(Math.max(0, i - 120), i + 200) });
    fs.writeFileSync(path.join(out, p.replace(/\//g, "_") + ".before.html"), a);
    fs.writeFileSync(path.join(out, p.replace(/\//g, "_") + ".after.html"), b);
  }
  fs.writeFileSync(path.join(out, "diffs.json"), JSON.stringify(diffs, null, 1));
  console.log(`markup-diff: ${same}/${paths.length} SAME · ${diffs.length} DIFF`);
  for (const d of diffs.slice(0, 5)) console.log("DIFF", d.path, "\n  before:", d.before, "\n  after: ", d.after);
})();
