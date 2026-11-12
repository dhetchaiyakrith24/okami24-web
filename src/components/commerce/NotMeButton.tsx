"use client";

import { useFormStatus } from "react-dom";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { notMeAction } from "@/app/checkout/actions";
import { cn } from "@/lib/utils";

/**
 * "ไม่ใช่ฉัน / เปลี่ยนเบอร์" (owner 10/11, T2-06): a quiet text button where checkout shows the number this device remembers.
 * It sits INSIDE a form (the address form under the phone field, or its own small form on /orders with from=orders) and
 * posts to notMeAction instead of that form's own action; formNoValidate so the empty required address fields do not stop
 * it. notMeAction ends this device's phone session and goes back to the phone step (or an empty /orders); the memory
 * itself stays for everyone who does not press it.
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
        // Checker 12/11: on a phone a grey label did not read as tappable — always underlined (the site's link look,
        // CategoryGuide) and a 44px touch target; still quieter than the form's own button.
        "inline-flex min-h-11 items-center self-start px-1 text-sm text-foreground-muted underline decoration-foreground-dim underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground disabled:opacity-60",
        className
      )}
    >
      {dict.checkout.notMeCta}
    </button>
  );
}
