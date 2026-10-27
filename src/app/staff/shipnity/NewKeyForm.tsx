"use client";

import { useActionState } from "react";
import { createWooKeyAction, type NewKeyState } from "@/app/staff/shipnity/actions";
import { CopyBlock } from "@/app/staff/_components/CopyBlock";

/** Make a key pair; the pair is shown once, right here, for staff to send to the warehouse. */
export function NewKeyForm({ siteUrl }: { siteUrl: string }) {
  const [state, formAction, pending] = useActionState<NewKeyState, FormData>(createWooKeyAction, null);

  if (state) {
    return (
      <section className="flex flex-col gap-3 rounded-xl border border-ember/40 bg-surface-1 p-5">
        <h2 className="text-base font-semibold text-foreground">คีย์ใหม่ — ก๊อปเก็บตอนนี้ ปิดหน้านี้แล้วจะไม่เห็นอีก</h2>
        <p className="text-sm leading-relaxed text-foreground-muted">
          ส่งให้คลังทางแชทส่วนตัวเท่านั้น ห้ามส่งในกลุ่ม · คลังกรอกใน Shipnity: ตั้งค่า → เชื่อมต่อช่องทางอื่น → เชื่อมต่อเว็บไซต์
        </p>
        {[
          ["Url", siteUrl],
          ["ck", state.consumerKey],
          ["cs", state.consumerSecret],
        ].map(([name, text]) => (
          <div key={name} className="flex flex-col gap-1 [&_pre]:break-all">
            <span className="label-mono text-xs text-foreground-dim">{name}</span>
            <CopyBlock text={text} label={`ก๊อป ${name}`} doneLabel="ก๊อปแล้ว" outline />
          </div>
        ))}
      </section>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-5">
      <label className="flex flex-col gap-1.5 text-sm text-foreground-muted" htmlFor="woo-key-name">
        ชื่อคีย์ (ไว้จำว่าให้ใคร)
        <input
          id="woo-key-name"
          name="description"
          defaultValue="Shipnity คลัง"
          maxLength={80}
          className="rounded-md border border-surface-border bg-surface-2 px-3 py-3 text-base text-foreground"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 rounded-full bg-ember px-5 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong disabled:opacity-50"
      >
        {pending ? "กำลังสร้าง…" : "สร้างคีย์ให้คลัง"}
      </button>
    </form>
  );
}
