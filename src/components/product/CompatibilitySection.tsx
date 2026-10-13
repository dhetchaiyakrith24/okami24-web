"use client";

import type { Product } from "@/types/catalog";
import { Plug, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { compatLabelTh, compatNoteTh } from "@/i18n/compat-copy-th";
import type { ProductCopyTh } from "@/i18n/product-copy-th";
import { thaiTypographyNode } from "@/lib/thai-typography";

/** `copyTh` = PRODUCT_COPY_TH[product.slug], from the server page (SEO ฉ batch 4 — keeps the table out of the browser). */
export function CompatibilitySection({ product, copyTh }: { product: Product; copyTh?: ProductCopyTh }) {
  const { dict, locale } = useLocale();
  if (product.compatibility.length === 0 && product.whoIsThisFor.length === 0) return null;
  // Round 30.4ค batches 3–4 (owner 2026-09-15): a Thai visitor reads the compatibility labels/notes
  // from compat-copy-th.ts (keyed by the English string; an overlay note of "" shows no note) and the
  // "เหมาะกับใคร" bullets from the product's `whoIsThisFor` overlay in product-copy-th.ts (keyed by
  // index). Anything without an entry keeps its English text. Markup is exactly what it was.
  const th = locale === "th";
  const whoTh = th ? copyTh?.whoIsThisFor : undefined;

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {product.compatibility.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Plug size={18} className="text-steel" aria-hidden />
              <h2 className="font-display text-xl font-semibold text-foreground">{dict.product.compatibilityTitle}</h2>
            </div>
            <ul className="flex flex-col gap-3">
              {product.compatibility.map((c, i) => {
                const label = th ? compatLabelTh(c.label) : c.label;
                const note = th ? compatNoteTh(c.note) : c.note;
                return (
                  <li key={i} className="rounded-xl border border-surface-border-soft bg-surface-1 p-4">
                    <p className="text-sm font-semibold text-foreground">{th ? thaiTypographyNode(label) : label}</p>
                    {note && <p className="mt-1 text-xs text-foreground-muted">{th ? thaiTypographyNode(note) : note}</p>}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {product.whoIsThisFor.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-ember" aria-hidden />
              <h2 className="font-display text-xl font-semibold text-foreground">{dict.product.whoIsThisForTitle}</h2>
            </div>
            <ul className="flex flex-col gap-3">
              {product.whoIsThisFor.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden />
                  {whoTh?.[i] ? thaiTypographyNode(whoTh[i]) : point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
