"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { CATEGORY_CRUMBS, ROOT_CRUMB } from "@/i18n/category-crumbs";

/** A breadcrumb word in the visitor's language (owner 12/11): the server HTML carries Thai (the default locale, what Google
 *  reads); an en/zh visitor's browser swaps it. `id` = a category id, or "root" for หน้าแรก. */
export function CategoryCrumbText({ id, fallback }: { id: string; fallback: string }) {
  const { locale } = useLocale();
  const crumb = id === "root" ? ROOT_CRUMB : CATEGORY_CRUMBS[id];
  return <>{crumb ? crumb[locale] : fallback}</>;
}
