"use client";

import { formatPuffs } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * "10,000 พัฟ" / "10,000 puffs" / "10,000 口" in the visitor's language.
 *
 * Exists for one reason: ProductCard is a Server Component with no locale in reach, and until
 * round 30.2 it printed the English "puffs" on every card in every language. The word now comes
 * from the dictionary (docs/THAI_STYLE.md §3), which means it has to be read on the client — this
 * is the smallest client boundary that does that: one number in, one string out, no markup of
 * its own, so the card's layout is exactly what it was.
 */
export function PuffCount({ count }: { count: number }) {
  const { dict } = useLocale();
  return <>{formatPuffs(count, dict.catalog.puffUnit)}</>;
}
