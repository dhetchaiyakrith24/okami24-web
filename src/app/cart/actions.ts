"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addToCart, setCartItemQuantity, removeCartItem, getCartCount } from "@/lib/commerce/cart";
import type { ProductRef } from "@/lib/commerce/catalog-resolver";
import { getCatalogItem } from "@/lib/catalog-index";
import { ORDERING_ENABLED, ORDERING_PAUSED_REDIRECT } from "@/lib/commerce/ordering-mode";

function readVariantId(formData: FormData): string | null {
  const raw = formData.get("variantId");
  return typeof raw === "string" && raw.length > 0 ? raw : null;
}

/** Online ordering off (owner 2026-09-07): the buttons that post here are not rendered, but a
 *  form kept open in a tab, or a hand-made POST, still must not touch a cart. Same destination as
 *  the /cart page itself. */
function refuseWhileOrderingOff(): void {
  if (!ORDERING_ENABLED) redirect(ORDERING_PAUSED_REDIRECT);
}

/** Returns whether the line went in and the cart's new item count — the product page plays the add moment and updates
 *  the floating cart button only on `ok` (cart UX batch B, owner 24/10). A refused add changes nothing, as before;
 *  `limit` = refused because the cart already holds all the warehouse has (owner 28/10 "Cap it") — the page says so. */
export async function addToCartAction(formData: FormData): Promise<{ ok: boolean; count: number; limit?: number }> {
  refuseWhileOrderingOff();
  const slug = String(formData.get("slug") ?? "");
  // origin is provenance for labeling only (see resolveProductRef) — read it from the catalog
  // index rather than assuming ProductMaster, now that priced legacy products are purchasable.
  const ref: ProductRef = { origin: getCatalogItem(slug)?.origin ?? "product-master", slug, variantId: readVariantId(formData) };
  const quantity = Number(formData.get("quantity") ?? "1") || 1;
  const result = await addToCart(ref, quantity);
  // No revalidatePath("/cart") here (owner 29/10 "รู้สึกหน่วง"): called from a product page it wiped the browser's whole
  // route cache, so the page re-rendered and re-fetched every link on it before this answer reached the cart button
  // (~1 s measured on the test build). /cart reads cookies, so it is rendered fresh on every visit anyway (router cache
  // for dynamic pages = 0 s since Next 15). The quantity/remove actions below run ON /cart and keep theirs.
  return { ok: result.ok, count: await getCartCount(), ...(!result.ok && result.limit !== undefined ? { limit: result.limit } : {}) };
}

export async function updateQuantityAction(formData: FormData): Promise<void> {
  refuseWhileOrderingOff();
  const slug = String(formData.get("slug") ?? "");
  const variantId = readVariantId(formData);
  const quantity = Number(formData.get("quantity") ?? "0") || 0;
  await setCartItemQuantity(slug, variantId, quantity);
  revalidatePath("/cart");
}

export async function removeItemAction(formData: FormData): Promise<void> {
  refuseWhileOrderingOff();
  const slug = String(formData.get("slug") ?? "");
  const variantId = readVariantId(formData);
  await removeCartItem(slug, variantId);
  revalidatePath("/cart");
}
