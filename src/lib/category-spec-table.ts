import type { Product } from "@/types/catalog";
import { verifiedRows } from "@/lib/verified-specs";

/**
 * Round SEO pod (30/10): the line-up table under a category grid (CategoryGuide) — battery, top wattage and pod/tank
 * size per model, read from each product's VERIFIED spec rows only (never typed here; an unverified or missing row
 * leaves the cell empty, which the component shows as a dash). Built on the server so only this page's rows reach the
 * browser (LESSONS 37).
 */
export interface CategorySpecRow {
  slug: string;
  name: string;
  /** "1600 mAh" · "external" (the maker says the cell is a separate 18650/21700) · null = no verified number. */
  battery: string | null;
  /** "35 W" — the top of the first stated range. */
  power: string | null;
  /** "3 mL" or "2.5–3 mL" (every mL figure in the pod/tank row). */
  capacity: string | null;
}

function batteryCell(value: string | undefined): string | null {
  if (!value) return null;
  const mah = /([\d,]+)\s*mAh/i.exec(value);
  if (mah) return `${mah[1].replace(/,/g, "")} mAh`;
  return /external/i.test(value) ? "external" : null;
}

function powerCell(value: string | undefined): string | null {
  if (!value) return null;
  // "5–35W (0.4Ω pod); 5–25W (0.6Ω)" → the first segment only; "Up to 30W" → 30.
  const watts = [...value.split(";")[0].matchAll(/(\d+)\s*W\b/g)].map((m) => Number(m[1]));
  return watts.length ? `${Math.max(...watts)} W` : null;
}

function capacityCell(value: string | undefined): string | null {
  if (!value) return null;
  const ml = [...value.matchAll(/(\d+(?:\.\d+)?)\s*mL/gi)].map((m) => Number(m[1]));
  if (!ml.length) return null;
  const lo = Math.min(...ml);
  const hi = Math.max(...ml);
  return lo === hi ? `${hi} mL` : `${lo}–${hi} mL`;
}

export function categorySpecRows(products: readonly Product[]): CategorySpecRow[] {
  return products
    .map((p) => {
      const rows = verifiedRows(p.specifications);
      const v = (key: string) => rows.find((r) => r.key === key)?.value;
      return {
        slug: p.slug,
        name: p.displayName,
        battery: batteryCell(v("battery")),
        power: powerCell(v("output")),
        capacity: capacityCell(v("pod") ?? v("tank")),
      };
    })
    .filter((r) => [r.battery, r.power, r.capacity].filter(Boolean).length >= 2);
}
