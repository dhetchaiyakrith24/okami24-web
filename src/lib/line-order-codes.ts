import { SHIPNITY_SKU_MAP } from "@/data/stock/sku-map";
import { absoluteUrl } from "@/lib/seo";

/** The codes one product page needs for its LINE order message (19/10): warehouse code per option, and a fallback. */
export type LineOrderCodes = { byOption: Record<string, string>; fallback: string; pageUrl: string };

/**
 * Server-side only — the whole SKU map must not reach the browser (pre-checker gate "client"); the page passes just
 * this product's slice. Per option: its Shipnity Max code; an option with no SKU (null) or an unconfirmed one ("check")
 * falls back to the product's Max parent code, else the page slug — always something the admin can look up.
 */
export function lineOrderCodes(slug: string): LineOrderCodes {
  const entry = SHIPNITY_SKU_MAP[slug];
  const usable = (v: string | null | undefined) => (v && v !== "check" ? v : null);
  const productCode = entry && "product" in entry ? usable(entry.product) : null;
  const fallback = productCode ?? usable(entry?.parent) ?? slug;
  const byOption: Record<string, string> = {};
  if (entry?.options) for (const [id, v] of Object.entries(entry.options)) byOption[id] = usable(v) ?? fallback;
  // The page link in the message is the canonical site address (SITE_URL), never the host a test server runs on.
  return { byOption, fallback, pageUrl: absoluteUrl(`/products/${slug}`) };
}
