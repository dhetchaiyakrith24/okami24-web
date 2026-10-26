/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// B5 step 1 (owner 26/10: "Start B5 step 1 … record it against the in/out status for 7 days, with no website changes"):
// logs the order-entry picker's per-code `available` count (inventory − reserved, read in the same pass as the button
// states — scripts/order-entry-stock.browser.js → window.__oeCounts) beside the in/out snapshot that order-entry-stock.js
// wrote. Nothing here touches the site or src/; the log lives in _incoming/ (not in git).
//
//   node scripts/stock-count-log.js <counts.txt> <oe-snap.txt> [--log <file.jsonl>]   one hourly read → one log line
//   node scripts/stock-count-log.js --report [--log <file.jsonl>] [--days 7]          the summary for the owner
//
// Done (HANDOFF §16 B5 ①): every read for 7 days has count > 0 exactly where the picker's button says "เพิ่ม" (in) —
// `mismatch` stays empty. A code whose count is missing (-1) or that is in one read and not the other is listed too.
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(name);
  if (i === -1) return dflt;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const report = args.includes("--report");
if (report) args.splice(args.indexOf("--report"), 1);
const logFile = opt("--log", path.join("_incoming", "stock-api", "count-log.jsonl"));
const days = Number(opt("--days", "7"));
const byCode = (a, b) => a.localeCompare(b, "en", { numeric: true });

if (report) {
  const lines = fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : [];
  const since = Date.now() - days * 86_400_000;
  const runs = lines.filter((l) => Date.parse(l.at) >= since);
  if (!runs.length) {
    console.log(`stock-count-log: no reads in the last ${days} day(s) (${logFile})`);
    process.exit(0);
  }
  const everMismatch = new Map();
  for (const r of runs) for (const m of r.mismatch) everMismatch.set(m.code, (everMismatch.get(m.code) || 0) + 1);
  const clean = runs.filter((r) => r.mismatch.length === 0 && r.missingCount.length === 0 && r.onlyOneSide.length === 0).length;
  const first = runs[0].at, last = runs[runs.length - 1].at;
  const lowNow = runs[runs.length - 1].low;
  console.log(`stock-count-log report · ${runs.length} read(s) from ${first} to ${last} · ${clean} clean`);
  console.log(`  count vs button disagreed on ${everMismatch.size} code(s)${everMismatch.size ? ": " + [...everMismatch].sort((a, b) => byCode(a[0], b[0])).map(([c, n]) => `${c}×${n}`).join(", ") : ""}`);
  const shown = lowNow.slice(0, 20).map(([c, n]) => `${c}=${n}`).join(", ");
  console.log(`  low (1–3 left) in the latest read: ${lowNow.length} code(s)${lowNow.length ? ": " + shown + (lowNow.length > 20 ? " …" : "") : ""}`);
  const spanDays = (Date.parse(last) - Date.parse(first)) / 86_400_000;
  console.log(spanDays >= days - 0.5 && clean === runs.length ? "READY - the count is as trustworthy as the button for every read" : `NOT YET - ${spanDays.toFixed(1)} of ${days} day(s), ${runs.length - clean} read(s) with a difference`);
  process.exit(0);
}

const [countsFile, snapFile] = args;
if (!countsFile || !snapFile) {
  console.error("usage: node scripts/stock-count-log.js <counts.txt> <oe-snap.txt> [--log <file.jsonl>]  |  --report [--days 7]");
  process.exit(1);
}
// Same entry shape as the compact read: "SKU:n.n.n" (options SKU-1..n in order) or "SKU:n.n@CODE|CODE".
// The same skip rules as order-entry-stock.js: not a warehouse code ("test", "Close", "Set-Coil-1-14") = skipped, and an
// option carrying ANOTHER product's code (Pod-156's 14th option is coded "Pod-147") is a warehouse slip, not that stock.
const CODE = /^[A-Za-z]+-\d+(?:-\d+)?$/;
const entries = fs.readFileSync(countsFile, "utf8").trim().split(",").map((entry) => {
  const m = /^(.+?):(-?\d+(?:\.-?\d+)*)(?:@(.+))?$/.exec(entry.trim());
  if (!m) { console.error(`bad entry: ${entry}`); process.exit(1); }
  const nums = m[2].split(".").map(Number);
  const codes = m[3] ? m[3].split("|") : nums.map((_, i) => `${m[1]}-${i + 1}`);
  if (codes.length !== nums.length) { console.error(`${m[1]}: ${codes.length} codes for ${nums.length} counts`); process.exit(1); }
  return { sku: m[1], nums, codes };
});
const productCodes = new Set(entries.map((e) => e.sku));
const counts = new Map();
for (const { sku, nums, codes } of entries) {
  codes.forEach((c, i) => {
    if (!CODE.test(c) || (c !== sku && productCodes.has(c))) return;
    counts.set(c, counts.has(c) ? Math.min(counts.get(c), nums[i]) : nums[i]);
  });
}
const state = new Map(fs.readFileSync(snapFile, "utf8").trim().split(",").map((p) => p.trim().split("=")).map(([k, v]) => [k, Number(v)]));

const mismatch = [], missingCount = [], onlyOneSide = [], low = [];
for (const [code, s] of state) {
  if (!counts.has(code)) { onlyOneSide.push(code); continue; } // product-level codes (no option of their own) land here
  const n = counts.get(code);
  if (n < 0) { missingCount.push(code); continue; }
  if ((n > 0 ? 1 : 0) !== s) mismatch.push({ code, button: s, count: n });
  if (n >= 1 && n <= 3) low.push([code, n]);
}
for (const code of counts.keys()) if (!state.has(code)) onlyOneSide.push(code);
low.sort((a, b) => byCode(a[0], b[0]));
// Product-level codes are in the snapshot only (their state = any option in), never a disagreement by themselves.
const productLevel = onlyOneSide.filter((c) => state.has(c) && !/-\d+-\d+$/.test(c) && [...counts.keys()].some((k) => k.startsWith(`${c}-`)));
const realOnlyOne = onlyOneSide.filter((c) => !productLevel.includes(c)).sort(byCode);
const line = {
  at: new Date().toISOString(),
  read: path.basename(snapFile),
  codes: counts.size,
  inByCount: [...counts.values()].filter((n) => n > 0).length,
  units: [...counts.values()].filter((n) => n > 0).reduce((a, b) => a + b, 0),
  mismatch,
  missingCount: missingCount.sort(byCode),
  onlyOneSide: realOnlyOne,
  low,
};
fs.mkdirSync(path.dirname(logFile), { recursive: true });
fs.appendFileSync(logFile, JSON.stringify(line) + "\n");
console.log(`stock-count-log: ${line.codes} codes · ${line.inByCount} with a count > 0 · ${line.low.length} low (1–3) · mismatch ${mismatch.length} · missing ${missingCount.length} · one side only ${realOnlyOne.length} → ${logFile}`);
if (mismatch.length) console.log(`  MISMATCH (button vs count): ${mismatch.map((m) => `${m.code} button ${m.button} count ${m.count}`).join(", ")}`);
if (realOnlyOne.length) console.log(`  one side only: ${realOnlyOne.join(", ")}`);
