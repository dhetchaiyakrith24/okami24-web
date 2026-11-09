"use client";

import { startTransition, useActionState, useState } from "react";
import { changeAddressAction, type AddressEditState } from "./address-actions";
import { rememberStaffName, useStaffName } from "@/app/staff/_components/staff-name";

const IDLE: AddressEditState = { error: null };
const FIELD = "flex flex-col gap-1.5 text-sm text-foreground-muted";
const INPUT =
  "min-h-12 rounded-lg border border-surface-border bg-surface-1 px-3 text-base text-foreground placeholder:text-foreground-dim focus:border-ember focus:outline-none";

export interface EditableAddress {
  recipientName: string;
  phone: string;
  line1: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

/**
 * "แก้ที่อยู่จัดส่ง" (LINE_ORDERS_GAPS.md #7) — the fields start on the order's address; the server checks it with the web's
 * address rule and keeps the old one in the history. Sent by hand (onSubmit), like the LINE order form, so a refused save
 * keeps what was typed.
 */
export function AddressEdit({ orderNumber, from, address, shipnityNote }: { orderNumber: string; from: string; address: EditableAddress; shipnityNote: boolean }) {
  const [state, action, pending] = useActionState(changeAddressAction, IDLE);
  const [f, setF] = useState(address);
  const [by, setBy] = useStaffName();
  const set = (k: keyof EditableAddress) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

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
      {shipnityNote && <p className="text-sm text-unverified">ถ้าคีย์ออเดอร์นี้ใน Shipnity แล้ว แก้ใน Shipnity ด้วย หรือแจ้งแอดมินคลัง</p>}
      <label className={FIELD}>
        ชื่อผู้รับ
        <input name="recipientName" value={f.recipientName} onChange={set("recipientName")} autoComplete="off" required className={INPUT} />
      </label>
      <label className={FIELD}>
        เบอร์ผู้รับ
        <input name="phone" value={f.phone} onChange={set("phone")} inputMode="tel" autoComplete="off" required className={INPUT} />
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
      <label className={FIELD}>
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
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-surface-border px-6 text-base font-semibold text-foreground hover:border-foreground-dim disabled:opacity-50 sm:w-fit"
      >
        {pending ? "กำลังบันทึก…" : "บันทึกที่อยู่ใหม่"}
      </button>
    </form>
  );
}
