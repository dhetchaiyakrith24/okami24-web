import type { Dictionary } from "@/i18n/dictionaries";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";

const AXIS_CODE_KEYS = {
  color: "axisColor",
  flavor: "axisFlavor",
  resistance: "axisResistance",
  size: "axisSize",
  strength: "axisStrength",
} as const;

/**
 * Translates a pilot product's variant axis ("color"/"flavor"/etc, from `optionAxisCode`) through
 * the active locale's dictionary. Falls back to the pre-baked Thai `optionAxisLabel` only if the
 * code is missing/unrecognized — never silently drops it. Shared by PilotProductCard and
 * PilotProductDetail; both used to read `optionAxisLabel` directly, which is always Thai
 * regardless of locale (see the Phase 3.2.1 report §LANGUAGE FIX RESULT for why that was a bug).
 */
export function pilotAxisLabel(dict: Dictionary, product: StorefrontProductView): string | null {
  const key = product.optionAxisCode ? AXIS_CODE_KEYS[product.optionAxisCode as keyof typeof AXIS_CODE_KEYS] : undefined;
  return key ? dict.pilot[key] : product.optionAxisLabel;
}
