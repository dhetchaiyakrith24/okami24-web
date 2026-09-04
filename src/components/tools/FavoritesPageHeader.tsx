"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** Same pattern as ComparePageHeader.tsx. Title reuses `nav.favorites`. */
export function FavoritesPageHeader() {
  const { dict } = useLocale();
  return <PageHeader eyebrow={dict.favorites.eyebrow} title={dict.nav.favorites} description={dict.favorites.pageDescription} />;
}
