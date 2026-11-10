/**
 * The strip at the top of every page of the TEST copy (src/lib/test-site.ts — owner 10/11): the tester, and anyone who
 * lands there by accident, sees at once that this is not the shop. The root layout renders it only while
 * `OKAMI24_TEST_SITE=on`; the live site never has it.
 *
 * It also carries the page's `noindex, nofollow` (React hoists the <meta> into <head>), on top of the X-Robots-Tag header
 * next.config.ts sends on every response — a page whose own metadata says "index" is still overruled, because a crawler
 * follows the strictest robots rule it finds.
 */
export function TestSiteBanner() {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <div role="note" className="bg-yellow-300 px-4 py-2 text-center text-sm font-bold text-black">
        เว็บทดสอบ — ไม่ใช่ร้านจริง
      </div>
    </>
  );
}
