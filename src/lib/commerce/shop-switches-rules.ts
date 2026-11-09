/**
 * The owner's switches (owner 08/11 "รวมระบบสวิทเปิดปิดนั้นนี้เองด้วย") — pure, so the contract test runs them under plain tsx.
 * Three things the owner can do from /staff/owner without a deploy: stop the cart, close the site for a while, hide a product.
 * Each one takes effect at once and turns back the same way. Why not the OKAMI24_ORDERING setting: it is read at build, so it
 * needs a rebuild and a Render login.
 */

export interface ShopSwitches {
  cartOff: boolean;
  siteClosed: boolean;
  /** Product slugs hidden from the shop. */
  hidden: string[];
  /** LINE orders keyed on /staff/line-order may go to the warehouse by the order page's send button (owner list ก11, way 2).
   *  Off until the owner turns it on: while off the admin keeps keying LINE orders into Shipnity as before. */
  lineToWarehouse: boolean;
}

export const ALL_OPEN: ShopSwitches = { cartOff: false, siteClosed: false, hidden: [], lineToWarehouse: false };

/** A slug goes into a CSS selector on every page, so nothing else gets through. */
const SLUG = /^[a-z0-9][a-z0-9-]{0,119}$/;
export const isSlug = (value: unknown): value is string => typeof value === "string" && SLUG.test(value);

/** A damaged or missing file must never close the shop: anything unreadable reads as open. */
export function parseSwitches(raw: string | null): ShopSwitches {
  if (!raw) return ALL_OPEN;
  try {
    const data = JSON.parse(raw) as Partial<ShopSwitches> | null;
    if (typeof data !== "object" || data === null) return ALL_OPEN;
    return {
      cartOff: data.cartOff === true,
      siteClosed: data.siteClosed === true,
      hidden: Array.isArray(data.hidden) ? [...new Set(data.hidden.filter(isSlug))] : [],
      lineToWarehouse: data.lineToWarehouse === true,
    };
  } catch {
    return ALL_OPEN;
  }
}

/**
 * What stays up while the site is closed: customers who already ordered can still see their order and send a slip, and the
 * sign-in pages stay so the owner can come back. /staff, /api and files never reach the check (matcher in src/proxy.ts).
 */
export function staysOpenWhileClosed(pathname: string): boolean {
  return /^\/(orders|account\/login)(\/|$)/.test(pathname);
}

/** The slug a product page address names, when that product is hidden. Decoded first: /products/%61bc is /products/abc. */
export function hiddenProductOf(pathname: string, hidden: readonly string[]): string | null {
  let path = pathname;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    // A broken escape is no product's address.
  }
  const slug = /^\/products\/([^/]+)\/?$/.exec(path)?.[1]?.toLowerCase();
  return slug && hidden.includes(slug) ? slug : null;
}

/** The rule that takes hidden products' cards off prerendered pages, applied after load. Cards carry data-card-slug. */
export function hiddenCardsCss(hidden: readonly string[]): string {
  const safe = hidden.filter(isSlug);
  if (safe.length === 0) return "";
  const cards = safe.map((slug) => `[data-card-slug="${slug}"],li:has(> [data-card-slug="${slug}"])`).join(",");
  return `${cards}{display:none!important}`;
}

/** Answered with status 503 and Retry-After, so Google reads "back soon" and does not drop the pages. */
export const CLOSED_PAGE = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>ปิดปรับปรุงชั่วคราว · OKami24</title>
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0e0e10;color:#f3f1ec;font-family:system-ui,sans-serif;text-align:center;padding:24px;box-sizing:border-box}
h1{font-size:28px;margin:0 0 12px}p{margin:0 0 20px;color:#b1afb2;line-height:1.6}
a{display:inline-block;padding:12px 24px;border-radius:999px;background:#ff6a2c;color:#17181b;font-weight:600;text-decoration:none}
</style>
</head>
<body>
<main>
<h1>ปิดปรับปรุงชั่วคราว</h1>
<p>เว็บจะกลับมาเร็ว ๆ นี้ค่ะ ระหว่างนี้สอบถามและสั่งซื้อทาง LINE ได้เลย</p>
<a href="LINE_URL">ทักไลน์ OKami24</a>
</main>
</body>
</html>
`;
