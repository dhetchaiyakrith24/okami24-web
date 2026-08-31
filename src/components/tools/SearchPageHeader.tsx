"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** Split out of search/page.tsx so the page itself can stay a plain (non-"use client") async
 *  Server Component reading `searchParams`, while this one small heading still picks up the
 *  visitor's locale from the same client context SearchTool already uses. */
export function SearchPageHeader() {
  const { dict } = useLocale();
  return <PageHeader eyebrow={dict.search.eyebrow} title={dict.search.title} />;
}
