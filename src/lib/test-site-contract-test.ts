/**
 * Test copy of the site — contract (src/lib/test-site.ts, owner 10/11):
 *   1. the flag reads "on" only, and the flag together with the live address is refused (so the live site can never
 *      deindex itself by a copied row);
 *   2. the off-site backup stays off on the test copy even with all four settings present;
 *   3. every place the flag must reach still checks it (a refactor that drops one fails here);
 *   4. every server-side `fetch` to another host is in the list of outbound calls below, each with its test-site answer —
 *      a new outbound call has to be added here, which forces the question "what does the test copy do with it?".
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */
import fs from "node:fs";
import path from "node:path";
import { isTestSite, testSiteProblem } from "./test-site";
import { offsiteConfig } from "./backup/offsite";

const ROOT = path.join(__dirname, "..", "..");
const results: { name: string; passed: boolean; detail: string }[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

// 1. the flag
check("flag on", isTestSite({ OKAMI24_TEST_SITE: "on" }) && isTestSite({ OKAMI24_TEST_SITE: " ON " }));
check("flag off by default", !isTestSite({}) && !isTestSite({ OKAMI24_TEST_SITE: "1" }) && !isTestSite({ OKAMI24_TEST_SITE: "true" }));
check("live address + flag refused", testSiteProblem({ OKAMI24_TEST_SITE: "on", SITE_URL: "https://okami24.store" }) !== null);
check("www live address + flag refused", testSiteProblem({ OKAMI24_TEST_SITE: "on", SITE_URL: "https://www.okami24.store/" }) !== null);
check("test address + flag fine", testSiteProblem({ OKAMI24_TEST_SITE: "on", SITE_URL: "https://okami24-test.onrender.com" }) === null);
check("live address without flag fine", testSiteProblem({ SITE_URL: "https://okami24.store" }) === null);

// 2. off-site backup
const offsite = {
  OKAMI24_OFFSITE_ENDPOINT: "https://abc123.r2.cloudflarestorage.com",
  OKAMI24_OFFSITE_BUCKET: "okami24-backups",
  OKAMI24_OFFSITE_KEY_ID: "keyid-12345678",
  OKAMI24_OFFSITE_SECRET: "secret-1234567890abcdef",
};
check("off-site on for the live site", offsiteConfig(offsite) !== null);
check("off-site off on the test copy", offsiteConfig({ ...offsite, OKAMI24_TEST_SITE: "on" }) === null);

// 3. every guard still reads the flag
const GUARDED: Record<string, RegExp> = {
  "src/lib/line/client.ts": /function secret\(\): string \| null \{\s*\/\/[^\n]*\n\s*if \(TEST_SITE\) return null;[\s\S]*function token\(\): string \| null \{\s*if \(TEST_SITE\) return null;/,
  "src/lib/staff/easyslip.ts": /function apiKey\(\): string \| null \{\s*\/\/[^\n]*\n\s*if \(TEST_SITE\) return null;/,
  "src/lib/backup/offsite.ts": /if \(isTestSite\(env\)\) return null;/,
  "src/lib/woo/webhooks.ts": /export function orderCreatedTargets\(\)[^\n]*\{\n\s*\/\/[^\n]*\n\s*if \(TEST_SITE\) return \[\];/,
  "src/app/wp-json/[[...path]]/route.ts": /if \(TEST_SITE\) return new NextResponse\(null, \{ status: 404 \}\);/,
  "src/lib/members/providers.ts": /if \(provider === "line"\) \{\s*\/\/[^\n]*\n\s*if \(TEST_SITE\) return null;/,
  "src/app/orders/[orderNumber]/page.tsx": /order\.status === "pending_payment" && TEST_SITE\)[\s\S]*TEST_PAYMENT_ACCOUNT, hasQr: false, qrHasAmount: false/,
  "src/app/orders/[orderNumber]/payment-qr/route.ts": /if \(TEST_SITE\) return new NextResponse\(null, \{ status: 404 \}\);/,
  "src/app/robots.ts": /if \(TEST_SITE\) return \{ rules: \{ userAgent: "\*", disallow: "\/" \} \};/,
  "src/app/sitemap.ts": /if \(TEST_SITE\) return \[\];/,
  "next.config.ts": /TEST_SITE \? \[\{ key: "X-Robots-Tag", value: "noindex, nofollow" \}\] : \[\]/,
  "src/instrumentation.ts": /if \(TEST_SITE\) \{[\s\S]*seedTestSite\(getDb\(\)\)/,
};
for (const [file, re] of Object.entries(GUARDED)) {
  const text = fs.readFileSync(path.join(ROOT, file), "utf8").replace(/\r\n/g, "\n");
  check(`guard in ${file}`, re.test(text));
}
const layout = fs.readFileSync(path.join(ROOT, "src/app/layout.tsx"), "utf8");
check("layout: banner and default noindex", layout.includes("{TEST_SITE ? <TestSiteBanner /> : null}") && layout.includes("TEST_SITE ? { robots: { index: false, follow: false } }"));

// 4. every outbound fetch is known. Same-origin calls (a string starting with "/") are the browser talking to this site.
const OUTBOUND: Record<string, string> = {
  "src/components/layout/LineClickTracker.tsx": "not outbound — LINE_CLICK_ENDPOINT is this site's own /api/metrics/line-click",
  "src/lib/backup/offsite.ts": "off-site backup — offsiteConfig() is null on the test copy",
  "src/lib/line/client.ts": "LINE bot — no secret/token on the test copy",
  "src/lib/members/providers.ts": "sign-in token exchange — Google stays (the tester signs in with it), LINE is off",
  "src/lib/staff/easyslip.ts": "EasySlip — no key on the test copy",
  "src/lib/woo/order-push.ts": "warehouse order push — orderCreatedTargets() is empty on the test copy",
};
const found = new Set<string>();
function walk(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith("-contract-test.ts")) {
      const text = fs.readFileSync(full, "utf8");
      for (const m of text.matchAll(/\bfetch\(\s*([^,)]*)/g)) {
        if (/^["'`]\//.test(m[1].trim())) continue;
        found.add(path.relative(ROOT, full).replace(/\\/g, "/"));
      }
    }
  }
}
walk(path.join(ROOT, "src"));
for (const file of found) check(`outbound call known: ${file}`, file in OUTBOUND, "add it to OUTBOUND with what the test copy does with it");
for (const file of Object.keys(OUTBOUND)) check(`outbound list current: ${file}`, found.has(file), "no fetch there any more — drop it from OUTBOUND");

const failed = results.filter((r) => !r.passed);
for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.passed || !r.detail ? "" : ` — ${r.detail}`}`);
console.log(`\ntest-site contract: ${results.length - failed.length}/${results.length} passed`);
if (failed.length > 0) process.exit(1);
