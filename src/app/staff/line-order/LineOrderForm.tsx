"use client";

import { startTransition, useActionState, useState, useTransition } from "react";
import { createLineOrderAction, parsePasteAction, type LineOrderState } from "@/app/staff/line-order/actions";
import { formatBaht, formatShortDateTime } from "@/app/staff/_components/format";
import { rememberStaffName, useStaffName } from "@/app/staff/_components/staff-name";
import { ItemPicker, rowLabel, type PickProduct, type PickRow } from "./ItemPicker";

export type { PickProduct } from "./ItemPicker";

export interface PickSlip {
  transRef: string;
  amountSatang: number;
  transferredAt: string;
}

const IDLE: LineOrderState = { error: null };
const FIELD = "flex flex-col gap-1.5 text-sm text-foreground-muted";
const INPUT =
  "min-h-12 rounded-lg border border-surface-border bg-surface-1 px-3 text-base text-foreground placeholder:text-foreground-dim focus:border-ember focus:outline-none";
const CARD = "flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-4";

/**
 * The LINE-order form. Every field is held in state, so a refused save (wrong postcode, slip of another amount…) keeps what
 * staff typed — and the form is sent by hand (onSubmit), not through `action=`, because React resets a form after an
 * `action=` submit: the picked slip's radio then showed empty while the next save would have gone without a slip. Prices here are the web prices for reading only; the server prices the order again and adds shipping.
 */
export function LineOrderForm({ products, slips }: { products: PickProduct[]; slips: PickSlip[] }) {
  const [state, action, pending] = useActionState(createLineOrderAction, IDLE);
  const [f, setF] = useState({ customerPhone: "", recipientName: "", recipientPhone: "", line1: "", subdistrict: "", district: "", province: "", postalCode: "" });
  const [keyedBy, setKeyedBy] = useStaffName();
  const [rows, setRows] = useState<PickRow[]>([]);
  const [slipRef, setSlipRef] = useState("");
  const [notDup, setNotDup] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

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
      const newRows: PickRow[] = [];
      for (const it of r.items) {
        const p = products.find((x) => x.slug === it.slug);
        const o = p?.options.find((x) => x.id === it.variantId);
        if (p && o) newRows.push({ slug: p.slug, variantId: o.id, label: rowLabel(p, o), price: p.price, quantity: it.quantity });
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
        rememberStaffName(keyedBy);
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
        <ItemPicker products={products} rows={rows} setRows={setRows} />
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
      {/* LINE_ORDERS_GAPS.md #2: a recent order of the same phone and total — open it first; save only with the tick. */}
      {state.duplicateOf && (
        <div className="flex flex-col gap-2 rounded-xl border border-unverified/50 bg-unverified/10 px-4 py-3 text-sm text-foreground">
          <a href={`/staff/orders/${encodeURIComponent(state.duplicateOf)}`} target="_blank" rel="noopener" className="inline-flex min-h-11 w-fit items-center font-semibold text-ember underline underline-offset-4">
            เปิดออเดอร์ {state.duplicateOf}
          </a>
          <p className="text-foreground-muted">ลูกค้าขอเพิ่มของ = ใช้ &ldquo;เพิ่มสินค้าในออเดอร์&rdquo; ในออเดอร์นั้น</p>
          <label className="flex min-h-12 items-center gap-3">
            <input type="checkbox" name="notDuplicate" value="1" checked={notDup} onChange={(e) => setNotDup(e.target.checked)} className="size-5 shrink-0 accent-[var(--color-ember)]" />
            ไม่ใช่ออเดอร์ซ้ำ — ลูกค้าสั่งอีกออเดอร์จริง
          </label>
        </div>
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
