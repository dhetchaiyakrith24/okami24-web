"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ScrollHintFrame } from "@/components/ui/ScrollHintFrame";
import { thaiTypographyNode } from "@/lib/thai-typography";
import { baht, BrandSplitName, thousands } from "@/components/catalog/lineup-format";
import { pilotName } from "@/i18n/product-names-en";
import type { CompareTableCopy } from "@/i18n/category-guide-copy";
import type { LineupRow } from "@/lib/disposable-lineup";

/**
 * Round "disposable pod" block 3 (05/11, designer): every model on the page, side by side. Five columns fit a 390 phone with
 * no sideways scroll because the units sit in the header; narrower than that the existing measured frame takes over, with
 * the model column sticky (border-separate, as collapsed borders do not travel with a sticky cell). An empty cell is a dim
 * dash: a figure no verified row states is never filled in. Rows are this page's slice (server props, LESSONS 37).
 */
const numberCell = "border-b border-surface-border-soft py-3 pl-2.5 text-right font-display text-[15px] leading-tight font-semibold tabular-nums whitespace-nowrap text-foreground lg:text-base";
const headBase = "border-b border-surface-border pb-2 align-bottom text-xs font-medium whitespace-nowrap text-foreground-muted";
const headCell = `${headBase} pl-2.5 text-right`;

export function DisposableCompareTable({ copy, rows }: { copy: CompareTableCopy; rows: LineupRow[] }) {
  const { locale } = useLocale();
  const t = (s: string) => (locale === "th" ? thaiTypographyNode(s) : s);
  const empty = (
    <>
      <span aria-hidden className="text-foreground-dim">
        —
      </span>
      <span className="sr-only">{copy.unconfirmed}</span>
    </>
  );
  return (
    <div id="all-models" className="grid scroll-mt-24 gap-4 lg:grid-cols-3 lg:gap-8">
      <h3 className="font-display text-2xl leading-tight font-semibold tracking-tight text-foreground">{t(copy.heading)}</h3>
      <div className="min-w-0 lg:col-span-2">
        <ScrollHintFrame frameClassName="">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <caption className="sr-only">{copy.heading}</caption>
            <thead>
              <tr>
                <th scope="col" className={`${headBase} text-left`}>{t(copy.model)}</th>
                <th scope="col" className={headCell}>{t(copy.puffs)}</th>
                <th scope="col" className={headCell}>{copy.ml}</th>
                <th scope="col" className={headCell}>{copy.mah}</th>
                <th scope="col" className={headCell}>{t(copy.price)}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug}>
                  <th scope="row" className="sticky left-0 z-10 border-b border-surface-border-soft bg-surface-0 py-3 pr-2 text-left font-medium whitespace-nowrap text-foreground">
                    <Link href={`/products/${r.slug}`} className="underline decoration-foreground-dim underline-offset-4 transition-colors hover:text-ember hover:decoration-ember">
                      <BrandSplitName name={pilotName(r.slug, r.name, locale)} />
                    </Link>
                  </th>
                  <td className={numberCell}>{r.puffs !== null ? `${thousands(r.puffs)}${r.puffsPlus ? "+" : ""}` : empty}</td>
                  <td className={numberCell}>{r.capacityMl !== null ? r.capacityMl : empty}</td>
                  <td className={numberCell}>{r.batteryMah !== null ? r.batteryMah : empty}</td>
                  <td className={`${numberCell} font-bold`}>{r.price !== null ? baht(r.price) : empty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollHintFrame>
        <p className="mt-4 text-xs text-foreground-dim">{t(copy.note)}</p>
      </div>
    </div>
  );
}
