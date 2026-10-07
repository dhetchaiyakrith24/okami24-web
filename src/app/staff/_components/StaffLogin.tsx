"use client";

import { useActionState } from "react";
import { staffLoginAction, type StaffLoginState } from "@/app/staff/actions";

const initialState: StaffLoginState = { error: null };

function message(state: StaffLoginState): string | null {
  if (state.error === "empty") return "กรุณาใส่รหัสทีมงาน";
  if (state.error === "wrong") return "รหัสไม่ถูกต้อง ลองใหม่อีกครั้ง";
  if (state.error === "locked")
    return `ใส่รหัสผิดหลายครั้งแล้ว ระบบพักการเข้าสู่ระบบไว้ชั่วคราว ลองใหม่ในอีก ${state.retryMinutes ?? 15} นาที`;
  return null;
}

export function StaffLogin() {
  const [state, formAction, pending] = useActionState(staffLoginAction, initialState);
  const error = message(state);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-xl border border-surface-border-soft bg-surface-1 p-5">
      <label className="flex flex-col gap-1.5 text-sm text-foreground-muted" htmlFor="staff-password">
        รหัสทีมงาน
        <input
          id="staff-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="rounded-md border border-surface-border bg-surface-2 px-3 py-3 text-base text-foreground"
        />
      </label>
      {error && (
        <p role="alert" className="text-sm leading-relaxed text-danger">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-full bg-ember px-6 py-3 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong disabled:opacity-60"
      >
        {pending ? "กำลังตรวจรหัส…" : "เข้าสู่ระบบ"}
      </button>
      <p className="text-xs leading-relaxed text-foreground-dim">อยู่ในระบบได้ 12 ชั่วโมง แล้วจะให้ใส่รหัสใหม่</p>
    </form>
  );
}
