"use client";

import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { renderInline } from "@/components/content/render-inline";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypographyNode } from "@/lib/thai-typography";
import type { CategoryGuideCopy } from "@/i18n/category-guide-copy";
import type { CategorySpecRow } from "@/lib/category-spec-table";
import type { BrandRow, LineupRow } from "@/lib/disposable-lineup";
import { baht, thousands } from "@/components/catalog/lineup-format";

// Its own chunk (round SEO full 07/11): only /products/disposables has this table, and this block now also sits on the home page.
const DisposableCompareTable = dynamic(() => import("@/components/catalog/DisposableCompareTable").then((m) => m.DisposableCompareTable));

/**
 * Round SEO pod (30/10): the text block page-1 rivals carry under their category grid and ours lacked
 * (SEO_LANDSCAPE §10) — how the families on the page differ, a line-up table from verified spec rows, and a short
 * shopping FAQ whose Thai Q/A is also the page's FAQPage JSON-LD (built on the server page). The FAQ is <details>, as in
 * ProductEditorialFaq: the answers carry inline links and stay in the server HTML while closed. Only a category with an
 * entry in CATEGORY_GUIDE_COPY renders it; `copy` and `rows` are this page's slice (server props, LESSONS 37).
 * Parts reused from pages that already passed: SectionHeading, the editorial FAQ markup, the article inline-link renderer and the
 * editorial compare-table rules.
 */
/** `stack` (category + brand pages; the home page has its own guide deck): from 3 families up, on a wide and tall enough
 *  screen the families become the stacked deck of the home guides (src/app/category-families.css, designer 13/11; owner
 *  13/11 → default). Below that the hooks do nothing; the extra wrappers keep the gaps the Container gave. */
export function CategoryGuide({ copy, rows, brands = [], lineup = [], stack = false }: { copy: Partial<Record<"th" | "en" | "zh", CategoryGuideCopy>>; rows: CategorySpecRow[]; brands?: BrandRow[]; lineup?: LineupRow[]; stack?: boolean }) {
  const { locale } = useLocale();
  const c = copy[locale] ?? copy.en ?? copy.th;
  if (!c) return null;
  const t = (s: string) => (locale === "th" ? thaiTypographyNode(s) : s);
  const dash = <span className="text-foreground-dim">—</span>;
  const table = c.table;
  const brandTable = c.brandTable;
  const deck = stack && c.families.length >= 3;

  return (
    <>
      <section className="border-t border-surface-border-soft py-14 lg:py-20">
        <Container className="flex flex-col gap-10">
          <div className={deck ? "okc-fam-wrap flex flex-col gap-10" : "flex flex-col gap-10"}>
          {/* "\n\n" in an intro = a new short paragraph (owner 04/11: the intros read 9–15 lines on a phone). */}
          <div className="okc-fam-head">
          <SectionHeading
            title={t(c.heading)}
            description={
              <span className="block max-w-3xl">
                {c.intro.split("\n\n").map((para, i) => (
                  <span key={i} className={i ? "mt-3 block" : "block"}>
                    {renderInline(para, locale, `intro-${i}`)}
                  </span>
                ))}
              </span>
            }
          />
          </div>
          <div className={deck ? "okc-fams grid gap-8 md:grid-cols-3" : "grid gap-8 md:grid-cols-3"}>
            {c.families.map((f, i) => (
              <div key={i} className={deck ? "okc-fam flex flex-col gap-3" : "flex flex-col gap-3"} style={deck ? ({ "--i": i, "--n": c.families.length } as CSSProperties) : undefined}>
                <h3 className="font-display text-xl leading-snug font-semibold text-foreground">{t(f.heading)}</h3>
                <p className="text-sm leading-relaxed text-foreground-muted">{renderInline(f.body, locale, `family-${i}`)}</p>
              </div>
            ))}
          </div>
          </div>
          {brandTable && brands.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-3 lg:gap-8">
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-2xl leading-tight font-semibold tracking-tight text-foreground [text-wrap:balance]">{t(brandTable.heading)}</h3>
                <p className="text-sm leading-relaxed text-foreground-muted">{renderInline(brandTable.lede, locale, "brand-lede")}</p>
              </div>
              <div className="lg:col-span-2">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-surface-border">
                      <th scope="col" className="whitespace-nowrap py-3 pr-3 text-left font-medium text-foreground-muted">{t(brandTable.brand)}</th>
                      <th scope="col" className="whitespace-nowrap py-3 pl-2 text-right font-medium text-foreground-muted">{t(brandTable.models)}</th>
                      <th scope="col" className="whitespace-nowrap py-3 pl-3 text-right font-medium text-foreground-muted">{t(brandTable.from)}</th>
                      <th scope="col" className="whitespace-nowrap py-3 pl-3 text-right font-medium text-foreground-muted">{t(brandTable.topPuffs)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map((b) => (
                      <tr key={b.slug} className="border-b border-surface-border-soft">
                        <th scope="row" className="py-3 pr-3 text-left font-medium text-foreground">
                          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
                            <Link href={`/brands/${b.slug}`} className="whitespace-nowrap underline decoration-foreground-dim underline-offset-4 transition-colors hover:text-ember hover:decoration-ember">
                              {b.name}
                            </Link>
                            {b.bestSeller && <span className="inline-flex h-[19px] items-center rounded-full border border-ember/60 bg-ember-soft px-1.5 text-[11px] leading-none font-semibold whitespace-nowrap text-foreground">{t(brandTable.bestSeller)}</span>}
                          </span>
                        </th>
                        <td className="py-3 pl-2 text-right font-display text-[15px] font-semibold tabular-nums text-foreground">{b.models}</td>
                        <td className="py-3 pl-3 text-right font-display text-[15px] font-semibold tabular-nums whitespace-nowrap text-foreground">{b.fromPrice !== null ? baht(b.fromPrice) : dash}</td>
                        <td className="py-3 pl-3 text-right font-display text-[15px] font-semibold tabular-nums whitespace-nowrap text-foreground">
                          {b.topPuffs !== null ? `${thousands(b.topPuffs)}${b.topPuffsPlus ? "+" : ""}` : dash}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-4 text-xs text-foreground-dim">{t(brandTable.note)}</p>
              </div>
            </div>
          )}
          {c.compareTable && lineup.length > 0 && <DisposableCompareTable copy={c.compareTable} rows={lineup} />}
          {table && rows.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-2xl leading-tight font-semibold tracking-tight text-foreground">{t(table.heading)}</h3>
              <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[30rem] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-surface-border">
                      <th scope="col" className="whitespace-nowrap py-3 pr-3 text-left font-medium text-foreground-muted">{t(table.model)}</th>
                      <th scope="col" className="whitespace-nowrap py-3 pr-3 text-left font-medium text-foreground-muted">{t(table.battery)}</th>
                      <th scope="col" className="whitespace-nowrap py-3 pr-3 text-left font-medium text-foreground-muted">{t(table.power)}</th>
                      <th scope="col" className="whitespace-nowrap py-3 text-left font-medium text-foreground-muted">{t(table.capacity)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.slug} className="border-b border-surface-border-soft">
                        <th scope="row" className="py-3 pr-3 text-left font-medium text-foreground">
                          <Link href={`/products/${r.slug}`} className="whitespace-nowrap underline decoration-foreground-dim underline-offset-4 transition-colors hover:text-ember hover:decoration-ember">
                            {r.name}
                          </Link>
                        </th>
                        <td className="py-3 pr-3 whitespace-nowrap text-foreground">{r.battery === "external" ? t(table.externalCell) : (r.battery ?? dash)}</td>
                        <td className="py-3 pr-3 whitespace-nowrap text-foreground">{r.power ?? dash}</td>
                        <td className="py-3 whitespace-nowrap text-foreground">{r.capacity ?? dash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-foreground-dim">{t(table.note)}</p>
            </div>
          )}
        </Container>
      </section>
      <section className="border-t border-surface-border-soft bg-surface-1 py-14 lg:py-20">
        <Container>
          <h2 className="font-display text-[length:var(--text-h2)] leading-[0.95] font-semibold tracking-tight text-foreground">{t(c.faqHeading)}</h2>
          <div className="mt-8 max-w-3xl border-t border-surface-border">
            {c.faq.map((f, i) => (
              <details key={i} className="group border-b border-surface-border py-4" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-medium text-foreground lg:text-lg [&::-webkit-details-marker]:hidden">
                  <span>{t(f.question)}</span>
                  <span className="mt-1 text-foreground-dim transition-transform group-open:rotate-180" aria-hidden>
                    ↓
                  </span>
                </summary>
                <p className="mt-3 text-base leading-relaxed text-foreground-muted">{renderInline(f.answer, locale, `faq-${i}`)}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
