/**
 * Test copy of the site (owner 10/11: an outside tester tests a SEPARATE Render service, never the live shop or real
 * customer data). One environment variable on that service only:
 *
 *   OKAMI24_TEST_SITE=on    this server is the test copy
 *   anything else / unset   the live shop — nothing in this file changes anything
 *
 * What "on" does (each place names this file):
 *  - every page: a visible banner (TestSiteBanner) + `noindex, nofollow` (layout meta + an X-Robots-Tag header on every
 *    response, next.config.ts) · robots.txt disallows everything and names no sitemap · sitemap.xml is empty;
 *  - nothing leaves the server: the LINE bot (client.ts), EasySlip (easyslip.ts), the off-site backup (offsite.ts), the
 *    warehouse order push and the whole /wp-json API Shipnity connects to (webhooks.ts, wp-json route) and LINE sign-in
 *    (providers.ts — its channel only knows the live address) are off even when their keys are pasted by mistake.
 *    Google sign-in stays: it is how the tester signs in as customer, admin and owner;
 *  - the order page shows a fake bank account and no PromptPay QR, so nobody can pay the shop real money from it;
 *  - an empty database is filled with obviously fake customers, orders in every status and slips (test-site-seed.ts).
 *
 * Read at module load (build time for the prerendered pages, start time for the server) — the test service sets it in
 * its own Environment and builds with it; the live service never has it.
 *
 * Guard: the flag together with the live address is refused at load, so the live site can never deindex itself or
 * show the banner because a row was copied to the wrong service — the build fails loudly instead.
 */

const LIVE_HOSTS = ["okami24.store", "www.okami24.store"];

export function isTestSite(env: Record<string, string | undefined> = process.env): boolean {
  return (env.OKAMI24_TEST_SITE ?? "").trim().toLowerCase() === "on";
}

/** The one refusal: test flag + live address. Pure, so the contract test can run it. */
export function testSiteProblem(env: Record<string, string | undefined> = process.env): string | null {
  if (!isTestSite(env)) return null;
  let host = "";
  try {
    host = new URL((env.SITE_URL ?? "").trim()).hostname.toLowerCase();
  } catch {
    return null; // src/lib/seo.ts already refuses a missing or broken SITE_URL in production
  }
  return LIVE_HOSTS.includes(host)
    ? `OKAMI24_TEST_SITE=on with SITE_URL=${env.SITE_URL} — the test flag belongs on the test service only (docs/เว็บทดสอบ-Render.md). Remove OKAMI24_TEST_SITE from this service, or give the test service its own address.`
    : null;
}

const problem = testSiteProblem();
if (problem) throw new Error(problem);

export const TEST_SITE = isTestSite();

/** What the order page shows instead of the shop's real account while TEST_SITE is on. */
export const TEST_PAYMENT_ACCOUNT = {
  bankName: { th: "ธนาคารทดสอบ (ไม่มีจริง)", en: "Test bank (not real)", zh: "测试银行（非真实）" },
  accountName: "บัญชีทดสอบ — ห้ามโอนเงินจริง",
  accountNumber: "000-0-00000-0",
} as const;
