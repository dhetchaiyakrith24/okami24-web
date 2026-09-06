"use client";

import type { Product } from "@/types/catalog";
import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * "15 กลิ่น" / "8 สี" on a catalogue card.
 *
 * Owner decision 2026-09-06, after seeing the two options side by side at real phone size: the
 * opening image stays a single clear flavour, and the fact that a product has many of them is said
 * in words instead. A 15-flavour lineup rendered into a catalogue card gives each flavour ~17px —
 * unreadable — while this line is legible at every size.
 *
 * A client component on purpose: `ProductCard` is rendered from both server components
 * (`ProductRail`) and client ones (`CatalogBrowser`, `FinderTool`), and only this leaf needs the
 * locale, so the card itself stays server-renderable.
 *
 * Shown only from 2 options up — "1 flavour" is noise, not information.
 */
export function OptionCountBadge({ product }: { product: Product }) {
  const { locale, dict } = useLocale();
  const flavors = product.flavorVariants?.length ?? 0;
  const colors = product.colorVariants?.length ?? 0;
  // No legacy product carries both axes; if one ever does, the larger count is the one worth saying.
  const [count, template] =
    flavors >= colors ? [flavors, dict.catalog.optionCountFlavors] : [colors, dict.catalog.optionCountColors];
  if (count < 2) return null;
  // `Badge` styles its text with `.label-mono` — mono face, 0.08em tracking, uppercase. That reads as
  // a technical chip in Latin script and as a mistake in Thai: the mono face carries no Thai glyphs
  // so the text falls back to a different font mid-card, and letter-spacing pulls Thai apart because
  // Thai does not letter-space. Thai is the shop's default language, so it gets the sans face and
  // normal tracking here. Only this badge is touched; every other chip keeps the style it has.
  //
  // The `!` matters: `.label-mono` lives in globals.css *after* `@import "tailwindcss"`, so at equal
  // specificity it wins on source order and a plain `tracking-normal` silently does nothing.
  return (
    <Badge tone="steel" className={locale === "th" ? "font-sans! tracking-normal! normal-case!" : undefined}>
      {template.replace("{n}", String(count))}
    </Badge>
  );
}
