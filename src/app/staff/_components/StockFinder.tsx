"use client";

import { useMemo, useState } from "react";
import type { StockProduct } from "@/lib/staff/stock-book";

/**
 * The search half of /staff/stock (owner 29/10 — a customer asks "ตัวนี้เหลืออะไรบ้าง" on LINE): type part of a model,
 * brand or flavour; each matching product opens with every option — the ones that sell now first (with the warehouse
 * count when Shipnity reported one), then the sold-out ones greyed — and one button copies the in-stock list as a
 * ready LINE reply. All data comes from the server render; nothing here asks the server again.
 */

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

function replyText(p: StockProduct): string {
  const inStock = p.options.filter((o) => o.sells);
  if (inStock.length === 0) return `${p.name} ตอนนี้หมดทุกแบบค่ะ`;
  if (inStock.length === 1 && inStock[0].id === null) return `${p.name} มีพร้อมส่งค่ะ`;
  return `${p.name} ที่มีพร้อมส่งตอนนี้ค่ะ\n${inStock.map((o) => `• ${o.name}`).join("\n")}`;
}

function CopyReply({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          /* clipboard blocked — staff can still read the list off the screen */
        }
      }}
      className="min-h-11 shrink-0 rounded-full border border-surface-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-foreground-dim"
    >
      {done ? "คัดลอกแล้ว" : "คัดลอกตอบลูกค้า"}
    </button>
  );
}

export function StockFinder({ products }: { products: StockProduct[] }) {
  const [q, setQ] = useState("");
  const query = norm(q);
  const hits = useMemo(() => {
    if (query.length < 2) return [];
    return products
      .map((p) => {
        const head = norm(`${p.brand ?? ""} ${p.name}`);
        const optionHit = p.options.some((o) => norm(o.name).includes(query));
        return { p, score: head.includes(query) ? 2 : optionHit ? 1 : 0 };
      })
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((h) => h.p);
  }, [products, query]);

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-foreground">พิมพ์ชื่อรุ่น ยี่ห้อ หรือกลิ่น</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="เช่น infy · relx · cola"
          autoComplete="off"
          className="min-h-12 rounded-xl border border-surface-border bg-surface-1 px-4 text-base text-foreground placeholder:text-foreground-dim focus:border-ember focus:outline-none"
        />
      </label>

      {query.length >= 2 && hits.length === 0 && <p className="text-sm text-foreground-muted">ไม่พบสินค้าที่ตรงกับ “{q.trim()}”</p>}

      {hits.map((p) => {
        const selling = p.options.filter((o) => o.sells);
        const out = p.options.filter((o) => !o.sells);
        const single = p.options.length === 1 && p.options[0].id === null;
        return (
          <section key={p.slug} className="flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col">
                {p.brand && <span className="text-xs text-foreground-dim">{p.brand}</span>}
                <span className="font-semibold text-foreground">{p.name}</span>
                <span className="text-xs text-foreground-muted">
                  ฿{p.price.toLocaleString("th-TH")} ·{" "}
                  {single ? (selling.length ? "มีของ" : "หมด") : `มีของ ${selling.length} จาก ${p.options.length} แบบ`}
                </span>
              </div>
              <CopyReply text={replyText(p)} />
            </div>
            {!single && (
              <ul className="flex flex-wrap gap-2">
                {selling.map((o) => (
                  <li key={o.id} className="rounded-full border border-verified/40 bg-verified/10 px-3 py-1 text-sm text-foreground">
                    {o.name}
                    {o.qty !== null && <span className="ml-1.5 tabular-nums text-foreground-muted">· {o.qty}</span>}
                  </li>
                ))}
                {out.map((o) => (
                  <li key={o.id} className="rounded-full border border-surface-border-soft px-3 py-1 text-sm text-foreground-dim line-through decoration-foreground-dim/60">
                    {o.name}
                  </li>
                ))}
              </ul>
            )}
            {single && selling[0]?.qty != null && <span className="text-sm text-foreground-muted">คลังเหลือ {selling[0].qty} ชิ้น</span>}
          </section>
        );
      })}
    </div>
  );
}
