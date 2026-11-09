"use client";

import { startTransition, useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { createLineOrderAction, parsePasteAction, type LineOrderState } from "@/app/staff/line-order/actions";
import { formatBaht, formatShortDateTime } from "@/app/staff/_components/format";

export interface PickProduct {
  slug: string;
  name: string;
  price: number;
  options: { id: string | null; name: string }[];
}

export interface PickSlip {
  transRef: string;
  amountSatang: number;
  transferredAt: string;
}

interface Row {
  slug: string;
  variantId: string | null;
  label: string;
  price: number;
  quantity: number;
}

const IDLE: LineOrderState = { error: null };
const FIELD = "flex flex-col gap-1.5 text-sm text-foreground-muted";
const INPUT =
  "min-h-12 rounded-lg border border-surface-border bg-surface-1 px-3 text-base text-foreground placeholder:text-foreground-dim focus:border-ember focus:outline-none";
const CARD = "flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-4";
const NAME_KEY = "okami24-line-order-keyed-by";

function readName(): string {
  try {
    return typeof window === "undefined" ? "" : (window.localStorage.getItem(NAME_KEY) ?? "");
  } catch {
    return "";
  }
}

/**
 * The LINE-order form. Every field is held in state, so a refused save (wrong postcode, slip of another amount…) keeps what
 * staff typed — and the form is sent by hand (onSubmit), not through `action=`, because React resets a form after an
 * `action=` submit: the picked slip's radio then showed empty while the next save would have gone without a slip. Prices here are the web prices for reading only; the server prices the order again and adds shipping.
 */
export function LineOrderForm({ products, slips }: { products: PickProduct[]; slips: PickSlip[] }) {
  const [state, action, pending] = useActionState(createLineOrderAction, IDLE);
  const [f, setF] = useState({ customerPhone: "", recipientName: "", recipientPhone: "", line1: "", subdistrict: "", district: "", province: "", postalCode: "" });
  const [keyedBy, setKeyedBy] = useState("");
  // The last name typed on this phone, after hydration (the server has no storage to render it from).
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one read of browser storage after mount
  useEffect(() => setKeyedBy((now) => now || readName()), []);
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState("");
  const [slipRef, setSlipRef] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

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
      return [...prev, { slug: p.slug, variantId: o.id, label: o.id ? `${p.name} · ${o.name}` : p.name, price: p.price, quantity: 1 }];
    });
    setQuery("");
  };
  const subtotal = rows.reduce((n, r) => n + r.price * r.quantity, 0);
  const items = JSON.stringify(rows.map((r) => ({ slug: r.slug, variantId: r.variantId, quantity: r.quantity })));

  // Paste → prefill (owner 10/11 gap hunt): the server reads the text; this only fills the boxes — the admin checks every one.
  const [paste, setPaste] = useState("");
  const [pasteNote, setPasteNote] = useState<{ filled: number; unmatched: string[] } | null>(null);
  const [reading, startReading] = useTransition();
  const fill = () =>
    startReading(async () => {
      const r = await parsePasteAction(paste);
      if (!r) return;
      const fields = { customerPhone: r.customerPhone, recipientName: r.recipientName, line1: r.line1, subdistrict: r.subdistrict, district: r.district, province: r.province, postalCode: r.postalCode };
      const got = Object.entries(fields).filter(([, v]) => v);
      setF((p) => ({ ...p, ...Object.fromEntries(got) }));
      const newRows: Row[] = [];
      for (const it of r.items) {
        const p = products.find((x) => x.slug === it.slug);
        const o = p?.options.find((x) => x.id === it.variantId);
        if (p && o) newRows.push({ slug: p.slug, variantId: o.id, label: o.id ? `${p.name} · ${o.name}` : p.name, price: p.price, quantity: it.quantity });
      }
      if (newRows.length > 0) setRows(newRows);
      setPasteNote({ filled: got.length + newRows.length, unmatched: r.unmatched });
    });

  return (
    <>
    <section className={`${CARD} mb-4`}>
      <h2 className="text-base font-semibold text-foreground">วางข้อความออเดอร์จาก LINE</h2>
      <textarea
        value={paste}
        onChange={(e) => setPaste(e.target.value)}
        rows={5}
        placeholder={"ชื่อผู้รับ\nที่อยู่ ต. อ. จ. รหัสไปรษณีย์\nเบอร์โทร\nรุ่น กลิ่น x จำนวน"}
        className="rounded-lg border border-surface-border bg-surface-1 px-3 py-2 text-base text-foreground placeholder:text-foreground-dim focus:border-ember focus:outline-none"
      />
      <button
        type="button"
        onClick={fill}
        disabled={reading || paste.trim().length === 0}
        className="inline-flex min-h-11 w-fit items-center rounded-full border border-surface-border px-5 text-sm font-semibold text-foreground hover:border-foreground-dim disabled:opacity-50"
      >
        {reading ? "กำลังอ่าน…" : "เติมฟอร์มจากข้อความ"}
      </button>
      {pasteNote && (
        <div className="flex flex-col gap-1 text-sm">
          <p className="text-foreground-muted">เติมให้ {pasteNote.filled} ช่อง · ตรวจทุกช่องก่อนบันทึก</p>
          {pasteNote.unmatched.length > 0 && (
            <p className="text-unverified">
              อ่านสินค้าไม่ออก เลือกเองจากช่องค้นหา: {pasteNote.unmatched.join(" · ")}
            </p>
          )}
        </div>
      )}
    </section>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
        try {
          window.localStorage.setItem(NAME_KEY, keyedBy.trim());
        } catch {
          /* a blocked storage only means the name is typed again next time */
        }
      }}
      className="flex flex-col gap-4"
    >
      <section className={CARD}>
        <h2 className="text-base font-semibold text-foreground">ลูกค้า</h2>
        <label className={FIELD}>
          เบอร์โทรลูกค้า (เบอร์ที่ใช้หาออเดอร์)
          <input name="customerPhone" value={f.customerPhone} onChange={set("customerPhone")} inputMode="tel" autoComplete="off" required className={INPUT} />
        </label>
      </section>

      <section className={CARD}>
        <h2 className="text-base font-semibold text-foreground">ส่งถึง</h2>
        <label className={FIELD}>
          ชื่อผู้รับ
          <input name="recipientName" value={f.recipientName} onChange={set("recipientName")} autoComplete="off" required className={INPUT} />
        </label>
        <label className={FIELD}>
          เบอร์ผู้รับ (เว้นว่าง = เบอร์ลูกค้า)
          <input name="recipientPhone" value={f.recipientPhone} onChange={set("recipientPhone")} inputMode="tel" autoComplete="off" className={INPUT} />
        </label>
        <label className={FIELD}>
          บ้านเลขที่ หมู่ ซอย ถนน
          <input name="line1" value={f.line1} onChange={set("line1")} autoComplete="off" required className={INPUT} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={FIELD}>
            ตำบล/แขวง
            <input name="subdistrict" value={f.subdistrict} onChange={set("subdistrict")} autoComplete="off" required className={INPUT} />
          </label>
          <label className={FIELD}>
            อำเภอ/เขต
            <input name="district" value={f.district} onChange={set("district")} autoComplete="off" required className={INPUT} />
          </label>
          <label className={FIELD}>
            จังหวัด
            <input name="province" value={f.province} onChange={set("province")} autoComplete="off" required className={INPUT} />
          </label>
          <label className={FIELD}>
            รหัสไปรษณีย์
            <input name="postalCode" value={f.postalCode} onChange={set("postalCode")} inputMode="numeric" maxLength={5} autoComplete="off" required className={INPUT} />
          </label>
        </div>
      </section>

      <section className={CARD}>
        <h2 className="text-base font-semibold text-foreground">สินค้า</h2>
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
                    <button type="button" aria-label="ลดจำนวน" onClick={() => setRows((p) => p.map((x, j) => (j === i ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x)))} className="size-11 rounded-full border border-surface-border text-lg text-foreground">
                      −
                    </button>
                    <span className="w-8 text-center tabular-nums text-foreground">{r.quantity}</span>
                    <button type="button" aria-label="เพิ่มจำนวน" onClick={() => setRows((p) => p.map((x, j) => (j === i ? { ...x, quantity: Math.min(50, x.quantity + 1) } : x)))} className="size-11 rounded-full border border-surface-border text-lg text-foreground">
                      +
                    </button>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-sm tabular-nums text-foreground">{formatBaht(r.price * r.quantity)}</span>
                    <button type="button" onClick={() => setRows((p) => p.filter((_, j) => j !== i))} className="min-h-11 px-2 text-sm text-danger">
                      เอาออก
                    </button>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm text-foreground-muted">
          ค่าสินค้า <span className="font-semibold tabular-nums text-foreground">{formatBaht(subtotal)}</span> · ค่าส่งระบบคิดให้ตามกติกาเดียวกับเว็บ
        </p>
        <input type="hidden" name="items" value={items} />
      </section>

      <section className={CARD}>
        <h2 className="text-base font-semibold text-foreground">สลิป</h2>
        <p className="text-sm text-foreground-muted">สลิปที่บอทตรวจแล้ว ยังไม่ผูกกับออเดอร์ไหน ใน 3 วันล่าสุด · ยอดต้องเท่ายอดออเดอร์รวมค่าส่ง</p>
        <ul className="flex flex-col gap-1">
          {slips.map((s) => (
            <li key={s.transRef}>
              <label className="flex min-h-12 items-center gap-3 rounded-lg px-2 hover:bg-surface-2">
                <input type="radio" name="slipRef" value={s.transRef} checked={slipRef === s.transRef} onChange={() => setSlipRef(s.transRef)} className="size-5 accent-[var(--color-ember)]" />
                <span className="font-semibold tabular-nums text-foreground">{formatBaht(s.amountSatang / 100)}</span>
                <span className="text-sm text-foreground-muted">โอน {formatShortDateTime(s.transferredAt)}</span>
              </label>
            </li>
          ))}
          <li>
            <label className="flex min-h-12 items-center gap-3 rounded-lg px-2 hover:bg-surface-2">
              <input type="radio" name="slipRef" value="none" checked={slipRef === "none"} onChange={() => setSlipRef("none")} className="size-5 accent-[var(--color-ember)]" />
              <span className="text-sm text-foreground">ไม่มีสลิปในรายการ — ยืนยันยอดเงินเองในหน้าออเดอร์</span>
            </label>
          </li>
        </ul>
      </section>

      <section className={CARD}>
        <label className={FIELD}>
          คนคีย์ออเดอร์
          <input name="keyedBy" value={keyedBy} onChange={(e) => setKeyedBy(e.target.value)} maxLength={40} autoComplete="off" required className={INPUT} />
        </label>
      </section>

      {state.error && (
        <p role="alert" className="rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending || rows.length === 0 || slipRef === ""}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-ember px-6 text-base font-semibold text-[#181008] hover:bg-ember-strong disabled:opacity-50"
      >
        {pending ? "กำลังบันทึก…" : "บันทึกออเดอร์ LINE"}
      </button>
    </form>
    </>
  );
}
