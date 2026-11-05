"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * Round "disposable pod" block 2 (05/11): every disposable's product page points at the one page that owns the term,
 * /products/disposables (docs/SEO_LANDSCAPE.md §0), with the words a shopper searches. The crumb text replaces the shared
 * short name on these pages only; the link closes the related-products section, as the home rails' "see all" pill.
 */
export function DisposablesCrumb() {
  const { dict } = useLocale();
  return <>{dict.product.disposablesCrumb}</>;
}

export function DisposablesAllLink() {
  const { dict } = useLocale();
  return (
    <Link href="/products/disposables" className="mt-5 flex h-12 items-center justify-center rounded-full border border-surface-border text-sm font-semibold text-foreground transition-colors hover:border-ember hover:text-ember lg:mx-auto lg:w-fit lg:px-8">
      {dict.product.disposablesAllLink}
    </Link>
  );
}
