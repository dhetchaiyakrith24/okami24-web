"use client";

import { useFormStatus } from "react-dom";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { notMeAction } from "@/app/checkout/actions";
import { cn } from "@/lib/utils";

/**
 * "ไม่ใช่ฉัน / เปลี่ยนเบอร์" (owner 10/11, T2-06): a quiet text button where checkout shows the number this device remembers.
 * It sits INSIDE another form (the address form, under the phone field) and posts to notMeAction instead of that form's own
 * action; formNoValidate so the empty required address fields do not stop it. notMeAction ends this device's phone session
 * and goes back to the phone step; the memory itself stays for everyone who does not press it.
 */
export function NotMeButton({ className }: { className?: string }) {
  const { pending } = useFormStatus();
  const { dict } = useLocale();
  return (
    <button
      type="submit"
      formAction={notMeAction}
      formNoValidate
      disabled={pending}
      data-not-me
      className={cn(
        "min-h-10 self-start px-1 py-2 text-sm text-foreground-muted underline-offset-4 hover:text-foreground hover:underline disabled:opacity-60",
        className
      )}
    >
      {dict.checkout.notMeCta}
    </button>
  );
}
