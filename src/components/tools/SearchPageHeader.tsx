"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** Split out of search/page.tsx so the page itself can stay a plain (non-"use client") async
 *  Server Component reading `searchParams`, while this one small heading still picks up the
 *  visitor's locale from the same client context SearchTool already uses.
 *  Round 30.4ข batch 4 (owner, 2026-09-17): the eyebrow is `footer.tools`, the same label /compare
 *  and /finder use (all three sit under "Tools" in the footer) — the old "ค้นหา" eyebrow repeated
 *  the H1 "ค้นหาสินค้า". */
export function SearchPageHeader() {
  const { dict } = useLocale();
  return <PageHeader eyebrow={dict.footer.tools} title={dict.search.title} />;
}
