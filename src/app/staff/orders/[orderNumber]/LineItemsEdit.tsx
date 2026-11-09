"use client";

import { startTransition, useActionState, useState } from "react";
import { changeItemsAction, type LineOrderState } from "@/app/staff/line-order/actions";
import { ItemPicker, type PickProduct, type PickRow } from "@/app/staff/line-order/ItemPicker";
import type { PickSlip } from "@/app/staff/line-order/LineOrderForm";
import { formatBaht, formatShortDateTime } from "@/app/staff/_components/format";
import { rememberStaffName, useStaffName } from "@/app/staff/_components/staff-name";
import { decideShipping, UNKNOWN_VISITOR } from "@/lib/commerce/shipping-rules";

const IDLE: LineOrderState = { error: null };
const INPUT =
  "min-h-12 rounded-lg border border-surface-border bg-surface-1 px-3 text-base text-foreground placeholder:text-foreground-dim focus:border-ember focus:outline-none";

/**
 * "เพิ่มสินค้าในออเดอร์" on a keyed LINE order before it goes to the warehouse (LINE_ORDERS_GAPS.md #3; rules =
 * src/lib/staff/line-order-edit-rules.ts). The new total and "โอนเพิ่ม" shown here are for reading: a LINE order has no member,
 * so its shipping is the web's tier on the subtotal; the server works everything out again on save.
 */
export function LineItemsEdit({
  orderNumber,
  from,
  approved,
  moneyIn,
  oldTotal,
  discount,
  lines,
  products,
  slips,
}: {
  orderNumber: string;
  from: string;
  approved: boolean;
  /** A slip is linked or the money is confirmed: lines may only go up (the old ones carry `min`). */
  moneyIn: boolean;
  oldTotal: number;
  /** A special price on the order (migration 0028) stays as given: THB off the catalogue total. */
  discount: number;
  lines: PickRow[];
  products: PickProduct[];
  slips: PickSlip[];
}) {
  const [state, action, pending] = useActionState(changeItemsAction, IDLE);
  const [rows, setRows] = useState<PickRow[]>(lines);
  const [slipRef, setSlipRef] = useState("");
  const [hand, setHand] = useState(false);
  const [by, setBy] = useStaffName();

  const subtotal = rows.reduce((n, r) => n + r.price * r.quantity, 0);
  const total = subtotal + decideShipping(subtotal, UNKNOWN_VISITOR).fee - discount;
  const diff = total - oldTotal;
  const items = JSON.stringify(rows.map((r) => ({ slug: r.slug, variantId: r.variantId, quantity: r.quantity })));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
        rememberStaffName(by);
      }}
      className="flex flex-col gap-3"
    >
      <input type="hidden" name="orderNumber" value={orderNumber} />
      {from && <input type="hidden" name="from" value={from} />}
      <input type="hidden" name="items" value={items} />
      <p className="text-xs text-foreground-muted">ลูกค้าขอเพิ่ม = เพิ่มในออเดอร์นี้ ไม่ต้องคีย์ใหม่ · ค่าส่งคิดครั้งเดียว</p>
      {moneyIn && <p className="text-xs text-unverified">ลูกค้าโอนแล้ว — เพิ่มได้ ลดหรือเอาออกไม่ได้</p>}
      <ItemPicker products={products} rows={rows} setRows={setRows} />
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <p className="text-xs text-foreground-muted">ยอดใหม่ (รวมค่าส่ง)</p>
          <p className="text-xl font-semibold tabular-nums text-foreground">{formatBaht(total)}</p>
        </div>
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <p className="text-xs text-foreground-muted">{diff >= 0 ? "ลูกค้าต้องโอนเพิ่ม" : "ยอดลดลง"}</p>
          <p className="text-xl font-semibold tabular-nums text-foreground">{formatBaht(Math.abs(diff))}</p>
        </div>
      </div>

      <fieldset className="flex flex-col gap-1">
        <legend className="mb-1 text-sm text-foreground-muted">สลิปที่โอนเพิ่ม (บอทตรวจแล้ว ยังไม่ผูกออเดอร์)</legend>
        {slips.map((s) => (
          <label key={s.transRef} className="flex min-h-12 items-center gap-3 rounded-lg px-2 hover:bg-surface-2">
            <input type="radio" name="slipRef" value={s.transRef} checked={slipRef === s.transRef} onChange={() => setSlipRef(s.transRef)} className="size-5 accent-[var(--color-ember)]" />
            <span className={`font-semibold tabular-nums ${s.amountSatang === diff * 100 ? "text-verified" : "text-foreground"}`}>{formatBaht(s.amountSatang / 100)}</span>
            <span className="text-sm text-foreground-muted">โอน {formatShortDateTime(s.transferredAt)}</span>
          </label>
        ))}
        <label className="flex min-h-12 items-center gap-3 rounded-lg px-2 hover:bg-surface-2">
          <input type="radio" name="slipRef" value="none" checked={slipRef === "none"} onChange={() => setSlipRef("none")} className="size-5 accent-[var(--color-ember)]" />
          <span className="text-sm text-foreground">ไม่มีสลิปในรายการ</span>
        </label>
      </fieldset>
      {approved && slipRef === "none" && (
        <label className="flex min-h-12 items-center gap-3 rounded-lg border border-unverified/50 px-3 text-sm text-foreground">
          <input type="checkbox" name="handConfirmed" value="1" checked={hand} onChange={(e) => setHand(e.target.checked)} className="size-5 shrink-0 accent-[var(--color-ember)]" />
          เห็นเงินส่วนต่างเข้าบัญชีร้านในแอปธนาคารแล้ว
        </label>
      )}
      <label className="flex flex-col gap-1.5 text-sm text-foreground-muted">
        คนแก้
        <input name="by" value={by} onChange={(e) => setBy(e.target.value)} maxLength={40} autoComplete="off" required className={INPUT} />
      </label>
      {state.error && (
        <p role="alert" className="rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending || rows.length === 0 || slipRef === "" || diff === 0 || (approved && slipRef === "none" && !hand)}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-ember px-6 text-base font-semibold text-[#181008] hover:bg-ember-strong disabled:opacity-50 sm:w-fit"
      >
        {pending ? "กำลังบันทึก…" : "บันทึกรายการใหม่"}
      </button>
    </form>
  );
}
