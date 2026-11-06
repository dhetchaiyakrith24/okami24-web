"use client";

import { useActionState } from "react";
import { checkBillAction, type BillCheckState } from "@/app/staff/owner/actions";

const IDLE: BillCheckState = { error: null };
const FIELD = "flex flex-col gap-1.5 text-sm text-foreground-muted";
const INPUT = "min-h-11 rounded-lg border border-surface-border-soft bg-surface-2 px-3 text-sm text-foreground";

/** The week's two warehouse files → the check. Read in memory on the server; only what the check found is kept. */
export function BillUpload({ from, to }: { from: string; to: string }) {
  const [state, action, pending] = useActionState(checkBillAction, IDLE);
  return (
    <form action={action} className="flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-4">
      <label className={FIELD}>
        บิลคลัง (.xlsx)
        <input name="bill" type="file" accept=".xlsx" required className="min-h-11 text-sm text-foreground" />
      </label>
      <label className={FIELD}>
        ไฟล์เรตรอบเดียวกัน (.xlsx)
        <input name="rates" type="file" accept=".xlsx" required className="min-h-11 text-sm text-foreground" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={FIELD}>
          เริ่มรอบ
          <input name="from" type="datetime-local" defaultValue={from} required className={INPUT} />
        </label>
        <label className={FIELD}>
          จบรอบ
          <input name="to" type="datetime-local" defaultValue={to} required className={INPUT} />
        </label>
      </div>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-fit items-center rounded-full bg-ember px-5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "กำลังเทียบ…" : "เทียบบิล"}
      </button>
    </form>
  );
}
