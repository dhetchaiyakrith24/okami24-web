"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { renderInline } from "@/components/content/ArticleBody";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypographyNode } from "@/lib/thai-typography";
import type { CategoryGuideCopy } from "@/i18n/category-guide-copy";
import type { CategorySpecRow } from "@/lib/category-spec-table";

/**
 * Round SEO pod (30/10): the text block page-1 rivals carry under their category grid and ours lacked
 * (SEO_LANDSCAPE §10) — how the families on the page differ, a line-up table from verified spec rows, and a short
 * shopping FAQ whose Thai Q/A is also the page's FAQPage JSON-LD (built on the server page). The FAQ is <details>, as in
 * ProductEditorialFaq: the answers carry inline links and stay in the server HTML while closed. Only a category with an
 * entry in CATEGORY_GUIDE_COPY renders it; `copy` and `rows` are this page's slice (server props, LESSONS 37).
 * Parts reused from pages that already passed: SectionHeading, the editorial FAQ markup, the article inline-link renderer and the
 * editorial compare-table rules.
 */
export function CategoryGuide({ copy, rows }: { copy: Partial<Record<"th" | "en" | "zh", CategoryGuideCopy>>; rows: CategorySpecRow[] }) {
  const { locale } = useLocale();
  const c = copy[locale] ?? copy.en ?? copy.th;
  if (!c) return null;
  const t = (s: string) => (locale === "th" ? thaiTypographyNode(s) : s);
  const dash = <span className="text-foreground-dim">—</span>;

  return (
    <>
      <section className="border-t border-surface-border-soft py-14 lg:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading title={t(c.heading)} description={<span className="block max-w-3xl">{renderInline(c.intro, locale, "intro")}</span>} />
          <div className="grid gap-8 md:grid-cols-3">
            {c.families.map((f, i) => (
              <div key={i} className="flex flex-col gap-3">
                <h3 className="font-display text-xl leading-snug font-semibold text-foreground">{t(f.heading)}</h3>
                <p className="text-sm leading-relaxed text-foreground-muted">{renderInline(f.body, locale, `family-${i}`)}</p>
              </div>
            ))}
          </div>
          {rows.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-2xl leading-tight font-semibold tracking-tight text-foreground">{t(c.table.heading)}</h3>
              <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[30rem] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-surface-border">
                      <th scope="col" className="whitespace-nowrap py-3 pr-3 text-left font-medium text-foreground-muted">{t(c.table.model)}</th>
                      <th scope="col" className="whitespace-nowrap py-3 pr-3 text-left font-medium text-foreground-muted">{t(c.table.battery)}</th>
                      <th scope="col" className="whitespace-nowrap py-3 pr-3 text-left font-medium text-foreground-muted">{t(c.table.power)}</th>
                      <th scope="col" className="whitespace-nowrap py-3 text-left font-medium text-foreground-muted">{t(c.table.capacity)}</th>
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
                        <td className="py-3 pr-3 whitespace-nowrap text-foreground">{r.battery === "external" ? t(c.table.externalCell) : (r.battery ?? dash)}</td>
                        <td className="py-3 pr-3 whitespace-nowrap text-foreground">{r.power ?? dash}</td>
                        <td className="py-3 whitespace-nowrap text-foreground">{r.capacity ?? dash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-foreground-dim">{t(c.table.note)}</p>
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
