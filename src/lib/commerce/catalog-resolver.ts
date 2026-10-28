// Deliberately NOT `import "server-only"` — this module does no I/O (no DB, no cookies, no fs;
// it only reads the already-in-memory published-catalog array, same trust level as
// storefront-preview-read-model.ts, which carries no such guard either). Kept importable from a
// plain `tsx` contract-test run (see catalog-resolver-contract-test.ts and this repo's established
// self-executing-runner convention in scripts/verify-catalog.ts) — `server-only`'s Node entry
// throws unconditionally outside a bundler's "react-server" condition, which would break that.
import { getPublishedProductBySlug } from "@/data/shipnity-seed/storefront-preview-read-model";
import { getCatalogItem, type CatalogItem } from "@/lib/catalog-index";
import { getProduct } from "@/data/products";
import type { LiveLookup } from "@/lib/stock/live-rules";

/**
 * A cart/order line's reference into the catalog. `origin` is carried through for
 * labeling/analytics only — it is NOT what gates purchasability (see the architecture-review
 * note on `resolveProductRef` below). Every legacy-origin ref happens to fail today because the
 * legacy catalog has no price data at all (see catalog-index.ts: "the legacy catalog has no
 * price"), but that is a fact about today's DATA, not a rule hard-coded against the origin.
 */
export interface ProductRef {
  origin: "product-master" | "legacy";
  slug: string;
  variantId: string | null;
}

export type ResolveFailureReason =
  | "not-found"
  | "not-purchasable"
  | "variant-required"
  | "variant-not-found"
  | "out-of-stock";

export interface ResolvedLine {
  ref: ProductRef;
  productSlug: string;
  variantId: string | null;
  displayName: string;
  variantLabel: string | null;
  /** THB, integer, straight from the owner-approved `sellingPrice` — never client-supplied. */
  unitPrice: number;
}

export type ResolveResult =
  | { ok: true; line: ResolvedLine }
  | { ok: false; reason: ResolveFailureReason; detail: string };

/**
 * The single place cart display and checkout submission both call to turn a stored reference
 * into a priced, stock-checked line. Always re-reads the live published catalog — never trusts a
 * cached price/name/stock value from the cart table or from the client. Call this again at
 * checkout submission even if it was just called to render the cart; do not assume the two calls
 * will agree (that disagreement is exactly the "stale inventory / price changed mid-checkout"
 * case this function exists to catch).
 *
 * ARCHITECTURE REVIEW (2026-09-02): this used to open with `if (ref.origin === "legacy") reject`
 * — correct in effect, wrong in shape. That modeled "Legacy source → permanently not
 * purchasable," when the real rule is "no authoritative commerce price → not purchasable."
 * Rewritten to check price presence through `getCatalogItem()` (catalog-index.ts's origin-
 * agnostic unifier) FIRST, origin-blind — today every legacy item still fails this exact same
 * check, because `sellingPrice` is `null` for all of them (a fact about current data, not a rule
 * about the source), but a future legacy record that gains a real owner-approved price would
 * become purchasable automatically, with no code change here. Never invents a price for a legacy
 * item — this only changes WHAT is checked (price presence, not origin), never adds one.
 */
/** `live` (Shipnity link step 4, owner 28/10): the warehouse's live stock — the server passes `liveLookup()`
 *  (src/lib/stock/live.ts); left out (tests, scripts) = the build-time stock alone, exactly as before. A live "in" sells an
 *  option the build marked out; a live "out" blocks one the build sells; no answer keeps the build. The owner's sold-out
 *  list is inside the live answer, so it still wins.
 *  `item` (staff stock book, 29/10): the caller already holds this slug's entry from `allCatalogItems()` — passing it skips
 *  `getCatalogItem`, which rebuilds the whole catalog on every call (the book asks ~1,000 times; checker #978 measured
 *  1.6 s that also stalled the cart). It must be the entry for `ref.slug`; the cart and checkout never pass it. */
export function resolveProductRef(ref: ProductRef, live?: LiveLookup, item?: CatalogItem): ResolveResult {
  const catalogItem = item?.slug === ref.slug ? item : getCatalogItem(ref.slug);
  if (!catalogItem) {
    return { ok: false, reason: "not-found", detail: `No catalog entry for slug "${ref.slug}".` };
  }
  if (catalogItem.sellingPrice === null) {
    return { ok: false, reason: "not-purchasable", detail: `"${ref.slug}" has no owner-approved selling price yet.` };
  }

  // A price exists. Since 2026-09-05 that can be either half of the catalog: ProductMaster
  // (publication-approvals.ts) or legacy (legacy-price-approvals.ts). The index's own provenance
  // tag decides which variant/stock lookup applies — never the caller-supplied `ref.origin`.
  if (catalogItem.origin === "legacy") return resolveLegacyRef(ref, catalogItem, live);

  const product = getPublishedProductBySlug(ref.slug);
  if (!product) {
    return { ok: false, reason: "not-found", detail: `No published product for slug "${ref.slug}".` };
  }

  let variantLabel: string | null = null;
  let availabilityStatus = product.availabilityStatus;

  if (product.variants.length > 0) {
    if (ref.variantId === null) {
      return { ok: false, reason: "variant-required", detail: `"${ref.slug}" requires a variant selection.` };
    }
    const variant = product.variants.find((v) => v.id === ref.variantId);
    if (!variant) {
      return { ok: false, reason: "variant-not-found", detail: `Variant "${ref.variantId}" not found on "${ref.slug}".` };
    }
    variantLabel = variant.label;
    availabilityStatus = variant.availabilityStatus;
    const now = live?.(product.slug, variant.id, variant.label);
    if (now === "in") availabilityStatus = "in-stock";
    else if (now === "out") availabilityStatus = "out-of-stock";
    // KNOWN LIMITATION: StorefrontProductView's toView() never reads ProductVariant.pricingOverride
    // (see storefront-preview-read-model.ts), so every published variant today inherits the
    // product-level sellingPrice. No currently-published product sets a pricingOverride, so this
    // is not a live bug — but if one ever does, this resolver and toView() must be updated
    // together, or a variant will be mispriced. Flagged in the final report's follow-up list.
  }

  if (product.variants.length === 0) {
    const now = live?.(product.slug);
    if (now === "in") availabilityStatus = "in-stock";
    else if (now === "out") availabilityStatus = "out-of-stock";
  }

  // CORRECTED (owner architecture review): this used to only block an explicit "out-of-stock" and
  // let "unknown" through, on the assumption that every publishable product came from Shipnity's
  // own "have stock" list. That assumption no longer holds — `VERIFIED_ADDITIONAL_VARIANTS` (see
  // active-catalog-to-product-master.ts) deliberately publishes manufacturer-verified option
  // values with NO Shipnity operational signal at all (`availability: {status: "unknown", source:
  // "manual"}`), precisely so catalog/content truth isn't blocked on live stock truth. Docs
  // §4 draws that same line: Shipnity is the operational stock reference, ProductMaster is the
  // content layer, and the two are not the same fact. Reading "unknown" here doesn't mean the
  // item is unavailable — it means this codebase has no live signal either way — but §6's own
  // policy ("stock > 0: available; otherwise don't sell, keep the page up") only ever authorizes
  // selling on a CONFIRMED positive signal, so anything short of a confirmed "in-stock" must be
  // blocked at this money boundary the same way a confirmed zero would be. The storefront UI
  // enforces this same rule already (ProductMasterVariantPicker's dimming, PilotProductDetail's
  // out-of-stock gate) — this was the one place server-side enforcement still lagged the client.
  if (availabilityStatus !== "in-stock") {
    return {
      ok: false,
      reason: "out-of-stock",
      detail: `"${ref.slug}"${variantLabel ? ` (${variantLabel})` : ""} is not confirmed in stock.`,
    };
  }

  return {
    ok: true,
    line: {
      ref,
      productSlug: product.slug,
      variantId: ref.variantId,
      displayName: product.displayName,
      variantLabel,
      // catalogItem.sellingPrice, not product.sellingPrice — already verified non-null above, and
      // catalog-index.ts derives it from this same published record's sellingPrice, so the two
      // are guaranteed identical whenever both are non-null.
      unitPrice: catalogItem.sellingPrice,
    },
  };
}

/**
 * Legacy-catalog half of the money boundary (2026-09-05, owner instruction: every product in the
 * owner's Shipnity price export must be purchasable). Same shape as the ProductMaster branch:
 * a variant is required whenever the product offers any (colour OR flavour — the legacy schema
 * allows both axes, and a variantId is looked up across both), an unknown id is rejected, and
 * the price is the index's approved one, never anything client-supplied.
 *
 * STOCK RULE FOR LEGACY — a deliberate, TEMPORARY exception to the ProductMaster rule above.
 * ProductMaster variants carry a real Shipnity signal, so anything short of a confirmed
 * "in-stock" is blocked. Legacy variants carry NO Shipnity signal at all (their `availability`
 * is hand-maintained; nearly all read "unknown"), so applying the same rule here would block the
 * entire legacy catalog — i.e. no cart button anywhere, which is the opposite of the owner's
 * instruction. The owner set the operating default on 2026-09-06 instead: options explicitly
 * marked "out-of-stock" (the colours/flavours added that day) are blocked; everything else sells.
 * When Shipnity stock is wired to the legacy catalog, collapse this back to the confirmed-positive
 * rule and delete this comment. The client-side gate in ProductHero mirrors exactly this rule.
 */
function resolveLegacyRef(ref: ProductRef, catalogItem: CatalogItem, live?: LiveLookup): ResolveResult {
  const product = getProduct(ref.slug);
  if (!product || catalogItem.sellingPrice === null) {
    return { ok: false, reason: "not-found", detail: `No legacy product for slug "${ref.slug}".` };
  }
  const options = [
    ...(product.colorVariants ?? []).map((v) => ({ id: v.id, label: v.name, availability: v.availability ?? "unknown" })),
    ...(product.flavorVariants ?? []).map((v) => ({ id: v.id, label: v.name, availability: v.availability })),
  ].map((o) => {
    const now = live?.(product.slug, o.id, o.label);
    return now === "in" ? { ...o, availability: "in-stock" as const } : now === "out" ? { ...o, availability: "out-of-stock" as const } : o;
  });
  const productNow = options.length === 0 ? live?.(product.slug) : null;
  const productAvailability = productNow === "in" ? "in-stock" : productNow === "out" ? "out-of-stock" : product.availability;

  // A product without options that has no SKU in the warehouse (applySoldOut, stock round batch 2b).
  if (options.length === 0 && productAvailability === "out-of-stock") {
    return { ok: false, reason: "out-of-stock", detail: `"${ref.slug}" is out of stock.` };
  }

  let variantLabel: string | null = null;
  if (options.length > 0) {
    if (ref.variantId === null) {
      return { ok: false, reason: "variant-required", detail: `"${ref.slug}" requires a colour/flavour selection.` };
    }
    const option = options.find((o) => o.id === ref.variantId);
    if (!option) {
      return { ok: false, reason: "variant-not-found", detail: `Variant "${ref.variantId}" not found on "${ref.slug}".` };
    }
    if (option.availability === "out-of-stock") {
      return { ok: false, reason: "out-of-stock", detail: `"${ref.slug}" (${option.label}) is out of stock.` };
    }
    variantLabel = option.label;
  }

  return {
    ok: true,
    line: {
      ref,
      productSlug: product.slug,
      variantId: ref.variantId,
      displayName: product.displayName,
      variantLabel,
      unitPrice: catalogItem.sellingPrice,
    },
  };
}
