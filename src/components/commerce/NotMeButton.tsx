"use client";

import { useFormStatus } from "react-dom";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { notMeAction } from "@/app/checkout/actions";
import { cn } from "@/lib/utils";

function NotMeSubmit() {
  const { pending } = useFormStatus();
  const { dict } = useLocale();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-10 px-1 py-2 text-sm text-foreground-muted underline-offset-4 hover:text-foreground hover:underline disabled:opacity-60"
    >
      {dict.checkout.notMeCta}
    </button>
  );
}

/**
 * "ไม่ใช่ฉัน / เปลี่ยนเบอร์" (owner 10/11, T2-06): a quiet text button wherever checkout shows the remembered buyer's
 * name/address. It ends this device's phone session (notMeAction) and goes back to the phone step; the memory itself stays
 * for everyone who does not press it.
 */
export function NotMeButton({ className }: { className?: string }) {
  return (
    <form action={notMeAction} className={cn("self-start", className)} data-not-me>
      <NotMeSubmit />
    </form>
  );
}
