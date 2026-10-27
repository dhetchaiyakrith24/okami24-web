"use client";

import { usePathname } from "next/navigation";
import { CheckCircle2, Globe, MessageCircle, Tag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * Round 30.4ข batch 5 (owner, 2026-09-17): a short "why buy here" strip above the footer on every
 * page — four claims the shop can actually stand behind today (genuine products · straight
 * prices · a real admin answers · specs checked against the brand's official site). The wording
 * lives in the dictionary (`trust.items`, three languages, owner-approved Thai); nothing here may
 * promise free shipping, a warranty, or a payment method — see THAI_STYLE §7 "รอบ 30.4ข ก้อน 5".
 *
 * Layout (owner picked "row" over "cards" from the designer's two mock-ups): a flat strip, four
 * items in one row from `lg`, a 2×2 grid below. On phones the icon sits above the text — with the
 * icon beside it the 163px cell left 129px for the heading and "เช็คกับเว็บทางการ" wrapped, which
 * pushed the second row out of line (designer). Padding is deliberately tighter than a section
 * (py-8 / lg:py-10) so it reads as a strip before the footer, not a section of the page.
 *
 * Icons are lucide only (the site's icon set) — CheckCircle2 and Globe were already in use; Tag
 * and MessageCircle come from the same set.
 */
const ICONS = [CheckCircle2, Tag, MessageCircle, Globe] as const;

/** The one lookalike product (owner 27/10, docs/HANDOFF.md §18): no "ของแท้" anywhere on its page, so item 0 (genuine products)
 *  is left out there. Every other page keeps all four items. */
const NO_GENUINE_CLAIM_PATHS = new Set(["/products/marbo-10k-clone"]);

export function TrustBar() {
  const { dict } = useLocale();
  const pathname = usePathname();
  const items = NO_GENUINE_CLAIM_PATHS.has(pathname) ? dict.trust.items.slice(1) : dict.trust.items;
  return (
    <section aria-label={dict.trust.ariaLabel} data-trust-bar className="border-t border-surface-border-soft bg-surface-0">
      <Container className="py-8 lg:py-10">
        <ul className={`grid grid-cols-2 gap-x-6 gap-y-7 lg:gap-x-10 ${items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
          {items.map((item) => {
            const Icon = ICONS[dict.trust.items.indexOf(item)] ?? CheckCircle2;
            return (
              <li key={item.title} className="flex flex-col gap-2 lg:flex-row lg:gap-3">
                <Icon size={22} strokeWidth={1.75} aria-hidden className="shrink-0 text-ember lg:mt-0.5" />
                <div className="flex flex-col gap-1">
                  <p className="font-display text-base font-semibold leading-tight text-foreground">{item.title}</p>
                  <p className="text-sm leading-relaxed text-foreground-muted">{item.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
