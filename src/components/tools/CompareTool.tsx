"use client";

"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/catalog";
import { getProduct } from "@/data/products";
import { ProductPicker } from "@/components/tools/ProductPicker";
import { brandName, categoryName, familyName, formatBattery, formatPuffs, formatWattage } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Dictionary } from "@/i18n/dictionaries";

interface Row {
  label: string;
  values: string[];
}

function classificationRows(products: Product[], dict: Dictionary): Row[] {
  const t = dict.compare;
  return [
    { label: t.rowBrand, values: products.map((p) => brandName(p.brandId)) },
    { label: t.rowFamily, values: products.map((p) => familyName(p.familyId)) },
    { label: t.rowCategory, values: products.map((p) => categoryName(p.categoryId)) },
    { label: t.rowBattery, values: products.map((p) => formatBattery(p.attributes.batteryMah)) },
    { label: t.rowOutput, values: products.map((p) => formatWattage(p.attributes.wattageMin, p.attributes.wattageMax)) },
    { label: t.rowRatedPuffs, values: products.map((p) => formatPuffs(p.attributes.puffCount)) },
    { label: t.rowCapacity, values: products.map((p) => (p.attributes.capacityMl ? `${p.attributes.capacityMl}mL` : "—")) },
    { label: t.rowScreen, values: products.map((p) => screenLabel(p, dict)) },
    { label: t.rowDrawStyle, values: products.map((p) => p.attributes.drawStyle) },
    { label: t.rowPortability, values: products.map((p) => titleCase(p.attributes.portability.replace("-", " "))) },
    { label: t.rowBeginnerFriendly, values: products.map((p) => (p.attributes.beginnerFriendly ? t.yes : t.no)) },
    { label: t.rowCharging, values: products.map((p) => p.attributes.chargingType) },
    { label: t.rowDimensions, values: products.map((p) => p.attributes.dimensions ?? "—") },
    { label: t.rowWeight, values: products.map((p) => (p.attributes.weightG ? `${p.attributes.weightG}g` : "—")) },
  ].filter((row) => row.values.some((v) => v && v !== "—"));
}

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function screenLabel(p: Product, dict: Dictionary) {
  switch (p.attributes.screenType) {
    case "none":
      return dict.catalog.screenNone;
    case "led-indicator":
      return dict.catalog.screenLed;
    case "color-display":
      return `${dict.catalog.screenColor}${p.attributes.screenSize ? ` (${p.attributes.screenSize})` : ""}`;
    case "touchscreen":
      return `${dict.catalog.screenTouch}${p.attributes.screenSize ? ` (${p.attributes.screenSize})` : ""}`;
  }
}

function verifiedSpecRows(products: Product[]): Row[] {
  if (products.length < 2) return [];
  const [first, ...rest] = products;
  const sharedLabels = first.specifications
    .map((s) => s.label)
    .filter((label) => rest.every((p) => p.specifications.some((s) => s.label === label)));

  return sharedLabels
    .map((label) => {
      const entries = products.map((p) => p.specifications.find((s) => s.label === label)!);
      const allVerified = entries.every((e) => e.sourceStatus === "verified");
      if (!allVerified) return null;
      return { label, values: entries.map((e) => e.value) };
    })
    .filter((row): row is Row => Boolean(row));
}

export function CompareTool({ initialSlugs }: { initialSlugs: string[] }) {
  const { dict } = useLocale();
  const [slugs, setSlugs] = useState<string[]>(initialSlugs);
  const products = useMemo(() => slugs.map((s) => getProduct(s)).filter((p): p is Product => Boolean(p)), [slugs]);

  const classification = useMemo(() => classificationRows(products, dict), [products, dict]);
  const specs = useMemo(() => verifiedSpecRows(products), [products]);

  function addProduct(slug: string) {
    setSlugs((prev) => (prev.includes(slug) || prev.length >= 4 ? prev : [...prev, slug]));
  }
  function removeProduct(slug: string) {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  }

  return (
    <div className="flex flex-col gap-12">
      <ProductPicker selected={products} onAdd={addProduct} onRemove={removeProduct} />

      {products.length < 2 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-surface-border py-16 text-center">
          <p className="font-display text-xl font-semibold text-foreground">{dict.compare.addAtLeastTwoTitle}</p>
          <p className="max-w-sm text-sm text-foreground-muted">{dict.compare.addAtLeastTwoHint}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <ComparisonTable title={dict.compare.classificationTitle} rows={classification} />
          <ComparisonTable title={dict.compare.verifiedSpecsTitle} rows={specs} emptyNote={dict.compare.verifiedSpecsEmptyNote} />

          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">{dict.compare.bestFitFor}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <div key={p.slug} className="rounded-xl border border-surface-border-soft bg-surface-1 p-4">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="mt-2 text-xs leading-relaxed text-foreground-muted">{p.whoIsThisFor[0]}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-foreground-dim">{dict.compare.disclaimer}</p>
          </div>
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
                      {v || "—"}
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
