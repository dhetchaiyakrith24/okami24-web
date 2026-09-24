"use client";

import type { Product } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpecChip } from "@/components/ui/SpecChip";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { specLabelTh } from "@/i18n/spec-labels-th";
import { PRODUCT_COPY_TH } from "@/i18n/product-copy-th";
import { thaiTypographyNode } from "@/lib/thai-typography";
import { ThaiText } from "@/components/i18n/ThaiText";
import { verifiedRows } from "@/lib/verified-specs";

export function SpecSheet({ product }: { product: Product }) {
  const { dict, locale } = useLocale();
  // Data round (owner 2026-09-24, question 1 ก): an unverified row is not shown at all — it used to be listed with an
  // "ยังไม่ยืนยัน" badge, which still put an unsourced number in front of the customer. No verified row → no section
  // (ProductHero hides its "ดูสเปก" button by the same test).
  const rows = verifiedRows(product.specifications);
  if (rows.length === 0) return null;
  // Round 30.4ค batch 2 (owner 2026-09-15): a Thai visitor reads each chip's VALUE from the product's
  // `specifications` overlay in product-copy-th.ts (keyed by spec key); a key without an entry keeps
  // the data value (numbers / units / model names need no translation).
  const valuesTh = locale === "th" ? PRODUCT_COPY_TH[product.slug]?.specifications : undefined;

  return (
    <section id="specifications" className="scroll-mt-20 border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow={dict.product.specsEyebrow}
          title={dict.product.specsTitle}
          // Round 30.4 batch 1: both ledes were hardcoded English and showed on every Thai/Chinese
          // product page — now dictionary strings (types.ts `product.specsUnverifiedNote` / `specsAllVerifiedNote`).
          // Every row shown is verified now, so only the "all verified" line applies (specsUnverifiedNote is unused).
          description={dict.product.specsAllVerifiedNote}
        />
        {/* Round 30.4ค batch 1 (owner 2026-09-15): a Thai visitor reads each chip's label from the
            spec-labels-th.ts overlay (keyed by the English data label) and the label row drops the mono
            tracking; the value is the data string in every locale. Markup is exactly what it was. */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((spec) => {
            const labelTh = locale === "th" ? specLabelTh(spec.label) : undefined;
            return (
              <SpecChip
                key={spec.key}
                spec={spec}
                label={labelTh}
                value={valuesTh?.[spec.key] ? thaiTypographyNode(valuesTh[spec.key]) : undefined}
                thaiLabel={labelTh !== undefined && labelTh !== spec.label}
                unverifiedLabel={<ThaiText>{dict.product.unverifiedBadge}</ThaiText>}
                unverifiedTitle={dict.product.unverifiedTooltip}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
