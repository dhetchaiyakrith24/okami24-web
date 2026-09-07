import "server-only";

/**
 * Online ordering switch — **owner decision 2026-09-07**: "ปิดการสั่งซื้อชั่วคราว เหตุผล: ข้อมูลสินค้า
 * ยังไม่นิ่ง" — the catalogue stays fully browsable (products, prices, colours/flavours, specs,
 * images, categories, search, compare), but the way to BUY is LINE @okm24 instead of the cart,
 * until the owner turns the cart back on. Recorded as a dated exception to BSOT §8 ("the site is
 * the primary channel"), not a change of policy.
 *
 * One environment variable decides it, read on the server only:
 *
 *   OKAMI24_ORDERING=on    cart, checkout, "Add to cart" — the shop as built
 *   anything else / unset  ordering is OFF (the safe default: an unset variable on a fresh host
 *                          must never open a checkout the owner has not switched on)
 *
 * render.yaml declares it as "off". **To turn ordering back on: change the value to "on" in the
 * Render dashboard (Environment) and choose "Save, rebuild, and deploy"** — a rebuild, not just a
 * restart, because the static pages (the catalogue, the product pages, the layout's header) read
 * this at build time and are served as prerendered HTML. Locally: `OKAMI24_ORDERING=on npm run
 * dev` (or `.env.local`, which is gitignored) brings the cart back for testing.
 *
 * What the switch does NOT touch, on purpose: nothing is deleted or renamed. The cart, checkout,
 * session and order code stay exactly as they were; `/orders/<n>` (the order-status page) and the
 * "I have paid" action keep working for orders that already exist, including the owner's test
 * order. `sold-out.ts` is not involved. Every consumer of this flag is a `server-only` file or a
 * Server Component that passes a boolean prop down — client components never read env.
 */
export const ORDERING_ENABLED = (process.env.OKAMI24_ORDERING ?? "").trim().toLowerCase() === "on";

/** Where the cart and checkout routes send a visitor while ordering is off. The query string is
 *  what makes /products show the "order on LINE" notice (LineOrderingNotice.tsx). */
export const ORDERING_PAUSED_REDIRECT = "/products?order=line";
