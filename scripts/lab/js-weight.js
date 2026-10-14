 
// Recipe kept from _incoming/seo-f/b4r/js-weight.js (copied 2026-10-15, housekeeping 3n) — see .claude/LESSONS.md (speed lesson)
// for when it helped. Usage below; origins = two running builds (before/after), e.g. http://localhost:3412 and :3413.
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// JS each page loads at first paint: every /_next/static/chunks/*.js the server HTML references, raw + gzip bytes.
// usage: node js-weight.js <originA> <originB> /path ...
const zlib = require("zlib");
const [a, b, ...paths] = process.argv.slice(2);
const cache = new Map();
async function weight(origin, p) {
  const html = await (await fetch(origin + p)).text();
  const urls = [...new Set([...html.matchAll(/\/_next\/static\/chunks\/[^"'\s)]+\.js/g)].map((m) => m[0]))];
  let raw = 0, gz = 0;
  for (const u of urls) {
    const key = origin + u;
    if (!cache.has(key)) {
      const buf = Buffer.from(await (await fetch(key)).arrayBuffer());
      cache.set(key, [buf.length, zlib.gzipSync(buf).length]);
    }
    const [r, g] = cache.get(key);
    raw += r; gz += g;
  }
  return { n: urls.length, raw, gz };
}
(async () => {
  const kb = (x) => Math.round(x / 1024);
  for (const p of paths) {
    const [x, y] = [await weight(a, p), await weight(b, p)];
    console.log(`${p.padEnd(40)} files ${x.n}→${y.n} · raw ${kb(x.raw)}→${kb(y.raw)} KB · gzip ${kb(x.gz)}→${kb(y.gz)} KB (${Math.round((1 - y.gz / x.gz) * 100)}% less)`);
  }
})();
