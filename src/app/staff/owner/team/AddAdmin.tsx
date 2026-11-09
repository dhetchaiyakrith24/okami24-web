"use client";

import { useActionState } from "react";
import { addAdminAction, type AddAdminState } from "@/app/staff/owner/team/actions";

const INPUT = "min-h-11 rounded-xl border border-surface-border bg-surface-0 px-3 text-base text-foreground";

/** "เพิ่มแอดมิน": a name the owner recognises + the Google address the person signs in with. */
export function AddAdmin() {
  const [state, action, pending] = useActionState<AddAdminState, FormData>(addAdminAction, { error: null });
  return (
    <form action={action} className="dash-card flex flex-col gap-3">
      <h2 className="font-semibold text-foreground">เพิ่มแอดมิน</h2>
      <label className="flex flex-col gap-1.5 text-sm text-foreground-muted">
        ชื่อที่จะโชว์
        <input name="name" maxLength={30} required autoComplete="off" placeholder="เช่น ICE" className={INPUT} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm text-foreground-muted">
        อีเมล Google ที่เขาใช้
        <input name="email" type="email" inputMode="email" maxLength={254} required autoComplete="off" autoCapitalize="none" placeholder="ชื่อ@gmail.com" className={INPUT} />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      {state.added && <p className="text-sm text-verified">เพิ่ม {state.added} แล้ว — ให้เขากด &ldquo;เข้าสู่ระบบด้วย Google&rdquo; ที่หน้าทีมงาน</p>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-ember px-6 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "กำลังเพิ่ม…" : "เพิ่มเป็นแอดมิน"}
      </button>
      <p className="text-xs leading-relaxed text-foreground-dim">แอดมินเห็นงานทุกอย่างในหน้าทีมงาน ยกเว้นทุน กำไร และบิลคลัง</p>
    </form>
  );
}
