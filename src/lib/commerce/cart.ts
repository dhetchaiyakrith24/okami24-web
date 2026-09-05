import "server-only";
import { cookies } from "next/headers";
import crypto from "node:crypto";
import { getDb } from "@/lib/db/client";
import { getSession } from "./session";
import { resolveProductRef, type ProductRef, type ResolveFailureReason } from "./catalog-resolver";
import { getCatalogItem } from "@/lib/catalog-index";
import { priceLine, computeOrderTotals, type OrderTotals, type PricedLine } from "./pricing";

const CART_COOKIE = "okami24_cart";
const cookieOpts = { httpOnly: true, sameSite: "lax" as const, path: "/", secure: process.env.NODE_ENV === "production" };

interface CartItemRow {
  id: number;
  product_slug: string;
  variant_id: string | null;
  quantity: number;
}

/**
 * Read-only cart id lookup — safe to call from a plain Server Component (page render), which
 * Next.js forbids from ever calling `cookies().set()`/`.delete()` (only a Server Action or Route
 * Handler may write cookies — see the bug this replaced, below). Never creates a cart row and
 * never writes a cookie; a visitor with no cart yet simply has no cart id.
 *
 * Still finds a logged-in customer's existing cart even if their cart cookie is missing (a new
 * device/browser, or a cleared cookie) — read-only, so this doesn't re-attach the cookie itself;
 * the next real mutation (add/update/remove, all Server Actions) does that via `getOrCreateCartId`.
 */
async function peekCartId(): Promise<string | null> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE)?.value;
  const db = getDb();

  if (existing) {
    const row = db.prepare("SELECT id FROM carts WHERE id = ?").get(existing) as { id: string } | undefined;
    if (row) return row.id;
  }

  const session = await getSession();
  if (session) {
    const own = db.prepare("SELECT id FROM carts WHERE customer_id = ? ORDER BY id DESC LIMIT 1").get(session.id) as
      | { id: string }
      | undefined;
    if (own) return own.id;
  }

  return null;
}

/**
 * Resolves the current visitor's cart id, creating one if needed. A cart starts anonymous
 * (customer_id NULL) and is claimed the moment we find the visitor already has a session — this
 * is the guest-cart-to-account merge point referenced in the mission brief, kept intentionally
 * simple: it claims the ONE cart the visitor's cookie already points to rather than merging line
 * items across multiple carts (see the final report's known-limitations list for why).
 *
 * WRITES a cookie (via `cookieStore.set`), which Next.js only permits inside a Server Action or
 * Route Handler — never call this from a plain page/layout render. `getCart()` below (used by
 * `/cart` and by `placeOrder()`'s re-validation) deliberately uses the read-only `peekCartId()`
 * instead; only `addToCart`/`setCartItemQuantity`/`removeCartItem` (all invoked exclusively from
 * "use server" actions in src/app/cart/actions.ts) call this one.
 */
async function getOrCreateCartId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE)?.value;
  const db = getDb();
  const session = await getSession();

  if (existing) {
    const row = db.prepare("SELECT id, customer_id FROM carts WHERE id = ?").get(existing) as
      | { id: string; customer_id: number | null }
      | undefined;
    if (row) {
      if (session && row.customer_id === null) {
        db.prepare("UPDATE carts SET customer_id = ? WHERE id = ?").run(session.id, row.id);
      }
      return row.id;
    }
  }

  if (session) {
    const own = db.prepare("SELECT id FROM carts WHERE customer_id = ? ORDER BY id DESC LIMIT 1").get(session.id) as
      | { id: string }
      | undefined;
    if (own) {
      cookieStore.set(CART_COOKIE, own.id, cookieOpts);
      return own.id;
    }
  }

  const id = crypto.randomBytes(16).toString("hex");
  db.prepare("INSERT INTO carts (id, customer_id) VALUES (?, ?)").run(id, session?.id ?? null);
  cookieStore.set(CART_COOKIE, id, cookieOpts);
  return id;
}

export interface CartLineView extends PricedLine {
  /** Set when this stored line no longer resolves cleanly (removed from sale, went out of stock,
   *  variant removed, etc). The line stays visible with quantity/slug so the customer can see
   *  what needs attention, but it is excluded from `totals` and must be excluded from checkout. */
  problem?: ResolveFailureReason;
}

export interface CartView {
  /** `null` for a visitor who has never added anything yet — no cart row exists, and none is
   *  created just to look. `lines` is always `[]` whenever this is `null`. */
  cartId: string | null;
  lines: CartLineView[];
  totals: OrderTotals;
  hasProblems: boolean;
}

export async function getCart(): Promise<CartView> {
  const cartId = await peekCartId();
  if (cartId === null) {
    return { cartId: null, lines: [], totals: computeOrderTotals([]), hasProblems: false };
  }
  const rows = getDb()
    .prepare("SELECT id, product_slug, variant_id, quantity FROM cart_items WHERE cart_id = ? ORDER BY id")
    .all(cartId) as CartItemRow[];

  const lines: CartLineView[] = rows.map((row) => {
    const ref: ProductRef = { origin: getCatalogItem(row.product_slug)?.origin ?? "product-master", slug: row.product_slug, variantId: row.variant_id };
    const resolved = resolveProductRef(ref);
    if (!resolved.ok) {
      return {
        productSlug: row.product_slug,
        variantId: row.variant_id,
        displayName: row.product_slug,
        variantLabel: null,
        unitPrice: 0,
        quantity: row.quantity,
        lineTotal: 0,
        problem: resolved.reason,
      };
    }
    return priceLine(resolved.line, row.quantity);
  });

  const totals = computeOrderTotals(lines.filter((l): l is PricedLine => !("problem" in l && l.problem)));
  return { cartId, lines, totals, hasProblems: lines.some((l) => l.problem !== undefined) };
}

export async function addToCart(ref: ProductRef, quantity: number): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 20) {
    return { ok: false, error: "Invalid quantity." };
  }
  const resolved = resolveProductRef(ref);
  if (!resolved.ok) return { ok: false, error: resolved.detail };

  const cartId = await getOrCreateCartId();
  const db = getDb();
  const existing = db
    .prepare("SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_slug = ? AND variant_id IS ?")
    .get(cartId, ref.slug, ref.variantId) as { id: number; quantity: number } | undefined;

  if (existing) {
    db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ?").run(existing.quantity + quantity, existing.id);
  } else {
    db.prepare("INSERT INTO cart_items (cart_id, product_slug, variant_id, quantity) VALUES (?, ?, ?, ?)").run(
      cartId,
      ref.slug,
      ref.variantId,
      quantity
    );
  }
  db.prepare("UPDATE carts SET updated_at = datetime('now') WHERE id = ?").run(cartId);
  return { ok: true };
}

export async function setCartItemQuantity(
  productSlug: string,
  variantId: string | null,
  quantity: number
): Promise<void> {
  const cartId = await getOrCreateCartId();
  const db = getDb();
  if (quantity <= 0) {
    db.prepare("DELETE FROM cart_items WHERE cart_id = ? AND product_slug = ? AND variant_id IS ?").run(
      cartId,
      productSlug,
      variantId
    );
  } else {
    db.prepare(
      "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_slug = ? AND variant_id IS ?"
    ).run(Math.min(quantity, 20), cartId, productSlug, variantId);
  }
  db.prepare("UPDATE carts SET updated_at = datetime('now') WHERE id = ?").run(cartId);
}

export async function removeCartItem(productSlug: string, variantId: string | null): Promise<void> {
  await setCartItemQuantity(productSlug, variantId, 0);
}

export async function clearCart(cartId: string): Promise<void> {
  getDb().prepare("DELETE FROM cart_items WHERE cart_id = ?").run(cartId);
}

export async function getCurrentCartId(): Promise<string> {
  return getOrCreateCartId();
}
