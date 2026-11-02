"use client";

import { Check } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/**
 * Where the customer is in checkout (address-step look A, owner 03/11): phone → address → review → transfer. Phones get one
 * pill ("ขั้นที่ 2 จาก 4 · ที่อยู่"), wider screens the whole row with the done steps ticked. The fourth step is the order page,
 * which shows the bank account itself and is not a checkout page, so it carries no bar.
 */
export function CheckoutSteps({ current, className }: { current: 1 | 2 | 3; className?: string }) {
  const { dict } = useLocale();
  const t = dict.checkout;
  const steps = [t.stepPhone, t.stepAddress, t.stepReview, t.stepPay];
  return (
    <nav aria-label={t.stepsLabel} className={cn("text-xs", className)}>
      <p className="inline-flex rounded-full bg-ember-soft px-3 py-1 font-semibold text-ember-strong sm:hidden">
        {t.stepOf.replace("{n}", String(current)).replace("{total}", String(steps.length))} · {steps[current - 1]}
      </p>
      <ol className="hidden flex-wrap gap-2 sm:flex">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = n < current;
          const now = n === current;
          return (
            <li
              key={label}
              aria-current={now ? "step" : undefined}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
                now ? "bg-ember-soft font-semibold text-ember-strong" : "bg-surface-2",
                done ? "text-foreground-muted" : !now && "text-foreground-dim",
              )}
            >
              {done ? <Check size={12} aria-hidden /> : <span aria-hidden>{n}</span>}
              {label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
