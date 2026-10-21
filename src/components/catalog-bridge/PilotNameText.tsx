"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { pilotName } from "@/i18n/product-names-en";

/** A warehouse-listed product's name as plain text for a server-rendered spot (the breadcrumb): the
 *  stored name for Thai visitors, the English overlay of product-names-en.ts for en/zh. */
export function PilotNameText({ slug, name }: { slug: string; name: string }) {
  const { locale } = useLocale();
  return <>{pilotName(slug, name, locale)}</>;
}
