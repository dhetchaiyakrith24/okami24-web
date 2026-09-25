/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// Every product card's phone line (data-card-spec-phone) and desktop line (data-card-spec) on every page,
// read from the server-rendered HTML (both lines are in the HTML at every width; CSS decides which one shows).
//   node scripts/card-lines.js <base> <paths.txt> <out.json> [locales=th,en,zh]
//   base      = origin to read, e.g. https://okami24.store (live) or http://localhost:3412 (test server)
//   paths.txt = one site path per line (pages that render product cards)
// Locale is chosen per request with the okami24_locale cookie. Output:
// { "<locale> <path>": [ { slug, kind, phone, desktop } ... ] } — diff two outputs with scripts/card-lines-diff.js.
// Typical before/after: run once on the old build, once on the new, then card-lines-diff.
const fs = require("fs");
const [base, pathsFile, out, locArg] = process.argv.slice(2);
const locales = (locArg || "th,en,zh").split(",");
const paths = fs.readFileSync(pathsFile, "utf8").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
const text = (html) => html.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/\s+/g, " ").trim();

function cards(html) {
  const res = [];
  const re = /data-card-spec-phone="(\w+)"[^>]*>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(html))) {
    const before = html.slice(0, m.index);
    const href = [...before.matchAll(/href="\/products\/([^"?#]+)"/g)].pop();
    const after = html.slice(m.index);
    const d = after.match(/data-card-spec="\w+"[^>]*>([\s\S]*?)<\/div>/);
    res.push({ slug: href ? href[1] : "?", kind: m[1], phone: text(m[2]), desktop: d ? text(d[1]) : null });
  }
  return res;
}

(async () => {
  const result = {};
  for (const loc of locales) {
    for (const p of paths) {
      const r = await fetch(base + p, { headers: { cookie: `okami24_locale=${loc}` }, redirect: "follow" });
      const html = await r.text();
      const c = cards(html);
      if (c.length) result[`${loc} ${p}`] = c;
      process.stdout.write(`${loc} ${p} ${r.status} cards=${c.length}\n`);
      await new Promise((ok) => setTimeout(ok, 150));
    }
  }
  fs.writeFileSync(out, JSON.stringify(result, null, 1));
  console.log(`pages with cards: ${Object.keys(result).length}`);
})();
