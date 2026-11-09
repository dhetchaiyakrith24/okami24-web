"use client";

import { useMemo, useState } from "react";
import { formatBaht } from "@/app/staff/_components/format";

export interface PickProduct {
  slug: string;
  name: string;
  price: number;
  options: { id: string | null; name: string }[];
}

export interface PickRow {
  slug: string;
  variantId: string | null;
  label: string;
  price: number;
  quantity: number;
  /** A line already on a paid order: it may go up, never below this or off the order (line-order-edit-rules.ts). */
  min?: number;
}

const FIELD = "flex flex-col gap-1.5 text-sm text-foreground-muted";
const INPUT =
  "min-h-12 rounded-lg border border-surface-border bg-surface-1 px-3 text-base text-foreground placeholder:text-foreground-dim focus:border-ember focus:outline-none";

export const rowLabel = (p: PickProduct, o: PickProduct["options"][number]) => (o.id ? `${p.name} · ${o.name}` : p.name);

/** Search a model or flavour, tap to add, − / + / เอาออก per line — the LINE order form and "แก้รายการสินค้า" share it. Prices
 *  here are for reading only: the server prices again. */
export function ItemPicker({ products, rows, setRows }: { products: PickProduct[]; rows: PickRow[]; setRows: (f: (prev: PickRow[]) => PickRow[]) => void }) {
  const [query, setQuery] = useState("");
  const found = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const out: { product: PickProduct; option: PickProduct["options"][number] }[] = [];
    for (const p of products) {
      const nameHit = p.name.toLowerCase().includes(q);
      for (const o of p.options) if (nameHit || o.name.toLowerCase().includes(q)) out.push({ product: p, option: o });
      if (out.length >= 30) break;
    }
    return out.slice(0, 30);
  }, [query, products]);

  const add = (p: PickProduct, o: PickProduct["options"][number]) => {
    setRows((prev) => {
      const i = prev.findIndex((r) => r.slug === p.slug && r.variantId === o.id);
      if (i >= 0) return prev.map((r, j) => (j === i ? { ...r, quantity: Math.min(50, r.quantity + 1) } : r));
      return [...prev, { slug: p.slug, variantId: o.id, label: rowLabel(p, o), price: p.price, quantity: 1 }];
    });
    setQuery("");
  };

  return (
    <>
      <label className={FIELD}>
        ค้นรุ่นหรือกลิ่น
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="พิมพ์อย่างน้อย 2 ตัว" autoComplete="off" className={INPUT} />
      </label>
      {query.trim().length >= 2 && found.length === 0 && <p className="text-sm text-foreground-dim">ไม่พบสินค้าที่ขายได้ตอนนี้</p>}
      {found.length > 0 && (
        <ul className="flex max-h-72 flex-col divide-y divide-surface-border-soft overflow-y-auto rounded-lg border border-surface-border-soft">
          {found.map(({ product, option }) => (
            <li key={`${product.slug}|${option.id ?? ""}`}>
              <button type="button" onClick={() => add(product, option)} className="flex min-h-12 w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-surface-2">
                <span className="min-w-0 text-sm text-foreground">
                  {product.name}
                  {option.id && <span className="text-foreground-muted"> · {option.name}</span>}
                </span>
                <span className="shrink-0 text-sm tabular-nums text-foreground-muted">{formatBaht(product.price)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {rows.length > 0 && (
        <ul className="flex flex-col gap-2">
          {rows.map((r, i) => (
            <li key={`${r.slug}|${r.variantId ?? ""}`} className="flex flex-col gap-2 rounded-lg border border-surface-border-soft bg-surface-2 p-3">
              <span className="text-sm text-foreground">{r.label}</span>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="ลดจำนวน"
                    disabled={r.quantity <= Math.max(1, r.min ?? 1)}
                    onClick={() => setRows((p) => p.map((x, j) => (j === i ? { ...x, quantity: Math.max(1, x.min ?? 1, x.quantity - 1) } : x)))}
                    className="size-11 rounded-full border border-surface-border text-lg text-foreground disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-8 text-center tabular-nums text-foreground">{r.quantity}</span>
                  <button type="button" aria-label="เพิ่มจำนวน" onClick={() => setRows((p) => p.map((x, j) => (j === i ? { ...x, quantity: Math.min(50, x.quantity + 1) } : x)))} className="size-11 rounded-full border border-surface-border text-lg text-foreground">
                    +
                  </button>
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-sm tabular-nums text-foreground">{formatBaht(r.price * r.quantity)}</span>
                  {r.min === undefined && (
                    <button type="button" onClick={() => setRows((p) => p.filter((_, j) => j !== i))} className="min-h-11 px-2 text-sm text-danger">
                      เอาออก
                    </button>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
