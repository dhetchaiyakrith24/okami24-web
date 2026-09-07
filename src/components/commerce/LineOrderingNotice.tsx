"use client";

import { useSearchParams } from "next/navigation";
import { CONTACT } from "@/data/contact";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * The one-line explanation a visitor sees on /products after /cart or /checkout sent them here
 * while online ordering is off (src/lib/commerce/ordering-mode.ts — owner decision 2026-09-07).
 * Shown only when the URL carries `?order=line`, which only those redirects add, so a visitor who
 * simply opened the catalogue never sees it. The page itself stays static: this reads the query
 * string client-side (under a Suspense boundary in products/page.tsx) rather than making the
 * whole catalogue page dynamic.
 *
 * Wording is the owner's pick (2026-09-07, option A): "ordering on LINE is faster right now" —
 * the tone is "this is the easier way", never "the shop is closed".
 */
export function LineOrderingNotice() {
  const params = useSearchParams();
  const { dict } = useLocale();
  if (params.get("order") !== "line") return null;
  return (
    // Text and button stay one group on the left with a fixed gap, and the card never grows past
    // ~3xl — at 1440px a full-width card put the two on opposite ends with two thirds of empty
    // panel between them (designer, 2026-09-07). On a phone the button simply wraps under the text.
    <div
      role="status"
      className="mb-8 flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-surface-border bg-surface-1 px-5 py-4"
    >
      <p className="text-sm text-foreground">{dict.catalog.lineOrderingNotice}</p>
      <a
        href={CONTACT.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-ember px-5 py-2.5 text-sm font-semibold tracking-tight text-[#181008] transition-colors duration-200 hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-ember"
      >
        {dict.catalog.lineOrderingCta}
      </a>
    </div>
  );
}
