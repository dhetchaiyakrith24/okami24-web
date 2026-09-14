"use client";

import { useMemo, useState } from "react";
import { getCatalogItem, type CatalogItem } from "@/lib/catalog-index";
import { ProductPicker } from "@/components/tools/ProductPicker";
import { familyName, formatBattery, formatPuffs, formatWattage } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { specLabelTh } from "@/i18n/spec-labels-th";
import { categoryName as categoryNameOf } from "@/lib/utils";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Compares any two-to-four CURRENTLY VISIBLE catalog products — legacy or published
 * ProductMaster. It previously read `getProduct`/`allProducts` directly, so a published
 * ProductMaster product (a real, purchasable catalog product with a real price) simply could not
 * be compared at all.
 *
 * The honest part: only the legacy half has the normalized `attributes` block (battery, wattage,
 * screen, draw style, …) — it is genuinely `null` on ProductMaster records, which have no
 * manufacturer attribute evidence behind them. Rather than fabricate values or exclude
 * ProductMaster products from the tool, an attribute a product does not have renders as "—", the
 * same as every other missing cell, and a note is shown whenever the selection actually mixes the
 * two so the blanks are explained rather than read as "this device has no battery."
 *
 * Rows that are empty for EVERY selected product are dropped entirely (unchanged behavior) —
 * comparing two coils never shows a screen row at all.
 */

interface Row {
  label: string;
  values: string[];
}

const EM_DASH = "—";

function screenLabel(item: CatalogItem, dict: Dictionary): string {
  const a = item.attributes;
  if (!a) return EM_DASH;
  switch (a.screenType) {
    case "none":
      return dict.catalog.screenNone;
    case "led-indicator":
      return dict.catalog.screenLed;
    case "color-display":
      return `${dict.catalog.screenColor}${a.screenSize ? ` (${a.screenSize})` : ""}`;
    case "touchscreen":
      return `${dict.catalog.screenTouch}${a.screenSize ? ` (${a.screenSize})` : ""}`;
    default:
      // undefined — e-liquid products carry no screen concept at all, same honest "—" as any
      // other missing attribute (see this file's own header comment).
      return EM_DASH;
  }
}

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function classificationRows(items: CatalogItem[], dict: Dictionary): Row[] {
  const t = dict.compare;
  return [
    { label: t.rowBrand, values: items.map((p) => p.brandName) },
    // ProductMaster records deliberately carry no familyId (no family record exists for most of
    // them) — "—" is the honest value, not a fabricated family name.
    { label: t.rowFamily, values: items.map((p) => (p.familyId ? familyName(p.familyId) : EM_DASH)) },
    { label: t.rowCategory, values: items.map((p) => categoryNameOf(p.categoryId)) },
    // Price exists only on the ProductMaster half — the legacy catalog has no price field at all
    // (see docs/BUSINESS_SOURCE_OF_TRUTH.md), so "—" here means "no price on file", never "free".
    { label: t.rowPrice, values: items.map((p) => (p.sellingPrice !== null ? `฿${p.sellingPrice.toLocaleString("en-US")}` : EM_DASH)) },
    // Variant options exist only on the ProductMaster half.
    { label: t.rowOptions, values: items.map((p) => (p.variantLabels.length > 0 ? p.variantLabels.join(", ") : EM_DASH)) },
    { label: t.rowBattery, values: items.map((p) => (p.attributes ? formatBattery(p.attributes.batteryMah) : EM_DASH)) },
    { label: t.rowOutput, values: items.map((p) => (p.attributes ? formatWattage(p.attributes.wattageMin, p.attributes.wattageMax) : EM_DASH)) },
    { label: t.rowRatedPuffs, values: items.map((p) => (p.attributes ? formatPuffs(p.attributes.puffCount, dict.catalog.puffUnit) : EM_DASH)) },
    { label: t.rowCapacity, values: items.map((p) => (p.attributes?.capacityMl ? `${p.attributes.capacityMl}mL` : EM_DASH)) },
    { label: t.rowScreen, values: items.map((p) => screenLabel(p, dict)) },
    { label: t.rowDrawStyle, values: items.map((p) => p.attributes?.drawStyle ?? EM_DASH) },
    { label: t.rowPortability, values: items.map((p) => (p.attributes?.portability ? titleCase(p.attributes.portability.replace("-", " ")) : EM_DASH)) },
    { label: t.rowBeginnerFriendly, values: items.map((p) => (p.attributes ? (p.attributes.beginnerFriendly ? t.yes : t.no) : EM_DASH)) },
    { label: t.rowCharging, values: items.map((p) => p.attributes?.chargingType ?? EM_DASH) },
    { label: t.rowDimensions, values: items.map((p) => p.attributes?.dimensions ?? EM_DASH) },
    { label: t.rowWeight, values: items.map((p) => (p.attributes?.weightG ? `${p.attributes.weightG}g` : EM_DASH)) },
  ].filter((row) => row.values.some((v) => v && v !== EM_DASH));
}

/** Shared, independently-verified manufacturer facts. Both halves carry `specifications` with a
 *  real `sourceStatus`, so this works across the boundary unchanged — a spec row is shown only
 *  when EVERY selected product has that same label AND every one of them is `verified`. */
function verifiedSpecRows(items: CatalogItem[]): Row[] {
  if (items.length < 2) return [];
  const [first, ...rest] = items;
  const sharedLabels = first.specifications
    .map((s) => s.label)
    .filter((label) => rest.every((p) => p.specifications.some((s) => s.label === label)));

  return sharedLabels
    .map((label) => {
      const entries = items.map((p) => p.specifications.find((s) => s.label === label)!);
      const allVerified = entries.every((e) => e.sourceStatus === "verified");
      if (!allVerified) return null;
      return { label, values: entries.map((e) => e.value) };
    })
    .filter((row): row is Row => Boolean(row));
}

export function CompareTool({ initialSlugs }: { initialSlugs: string[] }) {
  const { dict, locale } = useLocale();
  const [slugs, setSlugs] = useState<string[]>(initialSlugs);
  const items = useMemo(() => slugs.map((s) => getCatalogItem(s)).filter((p): p is CatalogItem => Boolean(p)), [slugs]);

  const classification = useMemo(() => classificationRows(items, dict), [items, dict]);
  // Round 30.4ค batch 1 (owner 2026-09-15): the row header is the same Thai chip label the product
  // page shows (spec-labels-th.ts) so /compare and the PDP call one field one name. Rows are still
  // matched on the English data label above; only the displayed string changes, and only for Thai.
  const specs = useMemo(() => {
    const rows = verifiedSpecRows(items);
    return locale === "th" ? rows.map((row) => ({ ...row, label: specLabelTh(row.label) })) : rows;
  }, [items, locale]);
  // Only worth explaining when the selection genuinely mixes a product that has the attribute
  // block with one that doesn't — not whenever a single cell happens to be empty.
  const hasMixedAttributeCoverage = items.some((i) => i.attributes) && items.some((i) => !i.attributes);
  // `attributes` (battery/puffs/capacity/etc, driving the classification rows above) has no
  // per-field provenance of its own — `specifications` is the only place a product's evidence
  // quality is actually recorded. A product like RELX Creator or TFIT M Power, where research
  // could not independently confirm the numbers, has every specification `sourceStatus:
  // "unverified"`; using that (rather than `editorialTag`, which also carries pure curation
  // labels like "Flagship"/"Tier-1 priority" that would false-positive here) ties this warning to
  // the same truth signal `verifiedSpecRows` below already trusts.
  const hasUncertainItems = items.some((i) => i.specifications.some((s) => s.sourceStatus === "unverified"));
  const bestFitItems = items.filter((i) => i.whoIsThisFor.length > 0);

  function addProduct(slug: string) {
    setSlugs((prev) => (prev.includes(slug) || prev.length >= 4 ? prev : [...prev, slug]));
  }
  function removeProduct(slug: string) {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  }

  return (
    <div className="flex flex-col gap-12">
      <ProductPicker selected={items} onAdd={addProduct} onRemove={removeProduct} />

      {items.length < 2 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-surface-border py-16 text-center">
          <p className="font-display text-xl font-semibold text-foreground">{dict.compare.addAtLeastTwoTitle}</p>
          <p className="max-w-sm text-sm text-foreground-muted">{dict.compare.addAtLeastTwoHint}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <ComparisonTable title={dict.compare.classificationTitle} rows={classification} />
          {hasUncertainItems && <p className="-mt-6 text-xs leading-relaxed text-ember">{dict.compare.uncertainSpecsNote}</p>}
          {hasMixedAttributeCoverage && <p className="-mt-6 text-xs leading-relaxed text-foreground-dim">{dict.compare.mixedCoverageNote}</p>}
          <ComparisonTable title={dict.compare.verifiedSpecsTitle} rows={specs} emptyNote={dict.compare.verifiedSpecsEmptyNote} />

          {bestFitItems.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">{dict.compare.bestFitFor}</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {bestFitItems.map((p) => (
                  <div key={p.slug} className="rounded-xl border border-surface-border-soft bg-surface-1 p-4">
                    <p className="text-sm font-semibold text-foreground">{p.name}</p>
                    <p className="mt-2 text-xs leading-relaxed text-foreground-muted">{p.whoIsThisFor[0]}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-foreground-dim">{dict.compare.disclaimer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ComparisonTable({ title, rows, emptyNote }: { title: string; rows: Row[]; emptyNote?: string }) {
  if (rows.length === 0) {
    return (
      <div>
        <h2 className="mb-3 font-display text-xl font-semibold text-foreground">{title}</h2>
        {emptyNote && <p className="text-sm text-foreground-muted">{emptyNote}</p>}
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 font-display text-xl font-semibold text-foreground">{title}</h2>
      <div className="overflow-x-auto rounded-xl border border-surface-border-soft">
        <table className="w-full min-w-[500px] border-collapse text-sm">
          <tbody>
            {rows.map((row) => {
              const allSame = row.values.every((v) => v === row.values[0]);
              return (
                <tr key={row.label} className="border-b border-surface-border-soft last:border-b-0">
                  <th scope="row" className="label-mono w-40 shrink-0 bg-surface-1 p-3 text-left text-[0.65rem] font-medium text-foreground-dim">
                    {row.label}
                  </th>
                  {row.values.map((v, i) => (
                    <td key={i} className={`p-3 text-foreground ${!allSame ? "bg-steel-soft/40" : ""}`}>
                      {v || EM_DASH}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
