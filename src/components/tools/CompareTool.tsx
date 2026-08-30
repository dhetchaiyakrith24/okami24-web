"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/catalog";
import { getProduct } from "@/data/products";
import { ProductPicker } from "@/components/tools/ProductPicker";
import { brandName, categoryName, familyName, formatBattery, formatPuffs, formatWattage } from "@/lib/utils";

interface Row {
  label: string;
  values: string[];
}

function classificationRows(products: Product[]): Row[] {
  return [
    { label: "Brand", values: products.map((p) => brandName(p.brandId)) },
    { label: "Family", values: products.map((p) => familyName(p.familyId)) },
    { label: "Category", values: products.map((p) => categoryName(p.categoryId)) },
    { label: "Battery", values: products.map((p) => formatBattery(p.attributes.batteryMah)) },
    { label: "Output", values: products.map((p) => formatWattage(p.attributes.wattageMin, p.attributes.wattageMax)) },
    { label: "Rated puffs", values: products.map((p) => formatPuffs(p.attributes.puffCount)) },
    { label: "Capacity", values: products.map((p) => (p.attributes.capacityMl ? `${p.attributes.capacityMl}mL` : "—")) },
    { label: "Screen", values: products.map((p) => screenLabel(p)) },
    { label: "Draw style", values: products.map((p) => p.attributes.drawStyle) },
    { label: "Portability", values: products.map((p) => titleCase(p.attributes.portability.replace("-", " "))) },
    { label: "Beginner-friendly", values: products.map((p) => (p.attributes.beginnerFriendly ? "Yes" : "No")) },
    { label: "Charging", values: products.map((p) => p.attributes.chargingType) },
    { label: "Dimensions", values: products.map((p) => p.attributes.dimensions ?? "—") },
    { label: "Weight", values: products.map((p) => (p.attributes.weightG ? `${p.attributes.weightG}g` : "—")) },
  ].filter((row) => row.values.some((v) => v && v !== "—"));
}

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function screenLabel(p: Product) {
  switch (p.attributes.screenType) {
    case "none":
      return "None";
    case "led-indicator":
      return "LED indicator";
    case "color-display":
      return `Colour display${p.attributes.screenSize ? ` (${p.attributes.screenSize})` : ""}`;
    case "touchscreen":
      return `Touchscreen${p.attributes.screenSize ? ` (${p.attributes.screenSize})` : ""}`;
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
  const [slugs, setSlugs] = useState<string[]>(initialSlugs);
  const products = useMemo(() => slugs.map((s) => getProduct(s)).filter((p): p is Product => Boolean(p)), [slugs]);

  const classification = useMemo(() => classificationRows(products), [products]);
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
          <p className="font-display text-xl font-semibold text-foreground">Add at least two products</p>
          <p className="max-w-sm text-sm text-foreground-muted">Search above to add devices — you can compare up to four at once.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <ComparisonTable title="Classification" rows={classification} />
          <ComparisonTable
            title="Verified Specifications"
            rows={specs}
            emptyNote="No shared attribute was independently verified across every selected product, so no specification rows are shown here."
          />

          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">Best fit for</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <div key={p.slug} className="rounded-xl border border-surface-border-soft bg-surface-1 p-4">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="mt-2 text-xs leading-relaxed text-foreground-muted">{p.whoIsThisFor[0]}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-foreground-dim">
              These notes describe fit, not rank — OKami24 doesn&apos;t declare a universal &ldquo;winner&rdquo; between devices built for different use cases.
            </p>
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
