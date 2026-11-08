"use client";

import Link from "next/link";
import { useState } from "react";
import { matchesSearch } from "@/lib/staff/customer-card-rules";
import { formatBaht, formatShortDateTime } from "@/app/staff/_components/format";
import { LIST_CLASS } from "@/app/staff/_components/OrderRow";

export interface CustomerSearchRow {
  id: number;
  phone: string;
  names: string[];
  orderCount: number;
  paidTotal: number;
  lastOrderAt: string;
}

/** The customer list with its search box. The search runs here in the page, so a phone number typed by staff never goes
 *  into an address or a server log. */
export function CustomerSearch({ rows }: { rows: CustomerSearchRow[] }) {
  const [query, setQuery] = useState("");
  const shown = rows.filter((r) => matchesSearch(query, r.phone, r.names));
  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5 text-sm text-foreground-muted">
        ค้นด้วยเบอร์โทรหรือชื่อ
        <input
          type="search"
          inputMode="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="เช่น 0812 หรือ สมชาย"
          className="min-h-12 rounded-lg border border-surface-border bg-surface-1 px-3 text-base text-foreground placeholder:text-foreground-dim focus:border-ember focus:outline-none"
        />
      </label>
      {shown.length === 0 ? (
        <p className="text-sm text-foreground-dim">ไม่พบลูกค้า</p>
      ) : (
        <ul className={LIST_CLASS}>
          {shown.map((r) => (
            <li key={r.id}>
              <Link href={`/staff/customers/${r.id}`} className="flex min-h-16 flex-col justify-center gap-1 px-4 py-3 hover:bg-surface-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate font-semibold text-foreground">{r.names[0] ?? r.phone}</span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">{formatBaht(r.paidTotal)}</span>
                </div>
                <div className="flex items-baseline justify-between gap-3 text-sm text-foreground-muted">
                  <span className="min-w-0 truncate tabular-nums">
                    {r.phone} · {r.orderCount} ออเดอร์
                  </span>
                  <span className="shrink-0 text-xs">ล่าสุด {formatShortDateTime(r.lastOrderAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
