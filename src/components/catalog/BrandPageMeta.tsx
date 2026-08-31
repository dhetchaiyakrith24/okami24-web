"use client";

import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { ProductFamily } from "@/types/catalog";

/** Split out of brands/[brand]/page.tsx for the same reason as CategoryPageHeader.tsx — just the
 *  "Official site ↗" link needs the locale dictionary, so only this small fragment becomes a
 *  client component rather than the whole page. Family names are real taxonomy (like brand/model
 *  names) and stay untranslated. */
export function BrandPageMeta({ families, referenceUrl }: { families: ProductFamily[]; referenceUrl: string }) {
  const { dict } = useLocale();
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      {families.map((f) => (
        <Badge key={f.id} tone="steel">
          {f.name}
        </Badge>
      ))}
      <a href={referenceUrl} target="_blank" rel="noopener noreferrer nofollow" className="label-mono ml-2 text-xs text-foreground-dim hover:text-foreground-muted">
        {dict.product.officialSite}
      </a>
    </div>
  );
}
