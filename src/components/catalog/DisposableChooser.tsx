"use client";

import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypographyNode } from "@/lib/thai-typography";
import { baht, BrandSplitName, groupLabel, thousands } from "@/components/catalog/lineup-format";
import type { ChooserCopy } from "@/i18n/category-guide-copy";
import type { ChooserGroup, DisposableChooserData, LineupRow } from "@/lib/disposable-lineup";

/**
 * Round "disposable pod" block 1 (05/11, designer): pick a disposable by puffs or by budget, on the page itself. Native
 * <details> as in the page's FAQ, so every group stays in the server HTML while closed and nothing needs JS. Each closed
 * line already answers the question (how many models, at what price). The real price only: no struck label, no sale chip.
 * Rows and copy are this page's slice (server props, LESSONS 37).
 */
function Row({ row, unit }: { row: LineupRow; unit: string }) {
  return (
    <li className="border-t border-surface-border-soft first:border-t-0">
      <Link href={`/products/${row.slug}`} className="group/row flex min-h-11 items-center gap-3 py-2">
        <span className="min-w-0 flex-1 text-sm font-medium text-foreground underline decoration-foreground-dim underline-offset-4 group-hover/row:text-ember">
          <BrandSplitName name={row.name} />
        </span>
        {row.puffs !== null && (
          <span className="shrink-0 whitespace-nowrap text-xs tabular-nums text-foreground-muted">
            {thousands(row.puffs)}
            {row.puffsPlus ? "+" : ""} {unit}
          </span>
        )}
        <span className="w-11 shrink-0 text-right font-display text-[15px] leading-tight font-bold tabular-nums text-foreground lg:text-base">{row.price !== null ? baht(row.price) : ""}</span>
      </Link>
    </li>
  );
}

function Groups({ title, groups, meta, copy, unit, t }: { title: string; groups: ChooserGroup[]; meta: (g: ChooserGroup) => string; copy: ChooserCopy; unit: string; t: (s: string) => React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-1 p-5 lg:p-6">
      <h3 className="font-display text-xl leading-snug font-semibold text-foreground">{t(title)}</h3>
      <div className="mt-3">
        {groups.map((g, i) => (
          <details key={g.key} className="group border-b border-surface-border-soft last:border-b-0" open={i === 0}>
            <summary className="flex min-h-12 cursor-pointer list-none flex-wrap items-baseline gap-x-3 py-3 [&::-webkit-details-marker]:hidden">
              <span className="text-base font-medium text-foreground group-open:text-ember-strong">{t(groupLabel(g, copy))}</span>
              <span className="ml-auto whitespace-nowrap text-xs text-foreground-muted">{t(meta(g))}</span>
              <span className="text-foreground-dim transition-transform group-open:rotate-180" aria-hidden>
                ↓
              </span>
            </summary>
            <ul className="pb-3">
              {g.rows.map((r) => (
                <Row key={r.slug} row={r} unit={unit} />
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}

export function DisposableChooser({ copy, data }: { copy: Partial<Record<"th" | "en" | "zh", ChooserCopy>>; data: DisposableChooserData }) {
  const { locale, dict } = useLocale();
  const c = copy[locale] ?? copy.en ?? copy.th;
  if (!c) return null;
  const t = (s: string) => (locale === "th" ? thaiTypographyNode(s) : s);
  const unit = dict.catalog.puffUnit;
  const span = (lo: number | null, hi: number | null, f: (n: number) => string) => (lo === null || hi === null ? "" : lo === hi ? f(lo) : `${f(lo)}–${f(hi)}`);
  const count = (n: number) => (n === 1 ? c.modelCountOne : c.modelCount).replace("{n}", String(n));
  const withCount = (n: number, rest: string) => (rest ? `${count(n)} · ${rest}` : count(n));
  const puffMeta = (g: ChooserGroup) => withCount(g.rows.length, span(g.lo, g.hi, baht));
  const budgetMeta = (g: ChooserGroup) => withCount(g.rows.length, g.lo === null ? "" : `${span(g.lo, g.hi, thousands)} ${unit}`);

  return (
    <section className="flex flex-col gap-8 border-t border-surface-border-soft pt-10 lg:gap-10 lg:pt-12">
      <SectionHeading title={t(c.heading)} titleClassName="leading-[1.15] [text-wrap:balance]" description={data.minPrice !== null ? t(c.lede.replace("{min}", baht(data.minPrice))) : undefined} />
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start lg:gap-6">
          <Groups title={c.puffPanelTitle} groups={data.puffGroups} meta={puffMeta} copy={c} unit={unit} t={t} />
          <Groups title={c.budgetPanelTitle} groups={data.budgetGroups} meta={budgetMeta} copy={c} unit={unit} t={t} />
        </div>
        <p className="text-xs text-foreground-dim">{t(c.note)}</p>
        <a href="#all-models" className="w-fit text-sm font-medium text-ember underline-offset-4 hover:underline">
          {t(c.jump)}
        </a>
      </div>
    </section>
  );
}
