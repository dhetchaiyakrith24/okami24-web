"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product, Specification } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { renderInline } from "@/components/content/ArticleBody";
import type { EditorialCopy, EditorialImage } from "@/data/product-editorial";
import type { ProductCopyTh } from "@/i18n/product-copy-th";
import { verifiedRows } from "@/lib/verified-specs";
import { thaiTypography, thaiTypographyNode } from "@/lib/thai-typography";
import { cn } from "@/lib/utils";
import { ProductReviewSection } from "@/components/product/ProductReviewSection";

/**
 * Editorial product body — round "M Bar 9K redesign" (owner 23/10 picked draft F: "calm, the article, the details and the
 * spec are the stars"). Rendered by page.tsx in place of the review/more-details/spec/FAQ sections for a slug that has
 * an entry in src/data/product-editorial.ts, so every other product page is untouched.
 *
 *  - Main: the article (left, 7/12) beside a sticky spec panel (right, 4/12) on desktop; on phones the spec comes first.
 *    The big spec numbers are read from the product's VERIFIED rows (never typed here); a row that is not verified drops
 *    its stat. Then the flavours as compact name chips per group (a chip picks that flavour in the hero, `#option-<id>`)
 *    with an "all photos" expander, then the 9K-vs-sibling table read from both products' verified rows.
 *  - Faq: the page's own FAQ (its FAQPage JSON-LD is built from the same Thai copy on the server page).
 *
 * `copy` = this slug's copy per locale (server prop — the table never reaches other pages' bundles). Thai text goes
 * through thaiTypography at render, like every other component.
 */
type CopyByLocale = Partial<Record<"th" | "en" | "zh", EditorialCopy>>;

function useCopy(copy: CopyByLocale) {
  const { locale } = useLocale();
  const c = copy[locale] ?? copy.en ?? copy.th!;
  const t = (s: string) => (locale === "th" ? thaiTypographyNode(s) : s);
  return { locale, c, t };
}

/** "Up to 9,000" → 9,000 · "600mAh rechargeable" → 600 + mAh · "1.0Ω" → 1.0 + Ω (the first number in the row, as written). */
function statOf(value: string): { num: string; unit: string } | null {
  const m = /(\d[\d,.]*)\s*(mAh|mg|Ω|mL|W)?/.exec(value);
  return m ? { num: m[1], unit: m[2] ?? "" } : null;
}

function rowValue(rows: Specification[], key: string, th: Record<string, string> | undefined, locale: string): string | null {
  const r = rows.find((x) => x.key === key);
  if (!r) return null;
  return locale === "th" && th?.[key] ? th[key] : r.value;
}

function Figure({ image, caption, product }: { image: EditorialImage; caption: string; product: Product }) {
  const { locale } = useLocale();
  const t = (s: string) => (locale === "th" ? thaiTypographyNode(s) : s);
  const flavours = product.flavorVariants ?? [];
  const pick = (ids: string[]) => ids.map((id) => flavours.find((f) => f.id === id)).filter((f) => f !== undefined);
  if (image.kind === "image") {
    return (
      <figure className="my-6">
        <Image src={image.src} alt={image.alt[locale] ?? image.alt.en} width={image.width} height={image.height} sizes="(min-width: 1024px) 760px, 100vw" className="h-auto w-full" />
        <figcaption className="mt-3 text-center text-xs text-foreground-dim">{t(caption)}</figcaption>
      </figure>
    );
  }
  const items = pick(image.ids);
  return (
    <figure className="my-6 rounded-2xl border border-surface-border-soft bg-surface-1 px-4 py-6 text-center">
      <div className={cn("justify-center", image.kind === "packs" ? "grid grid-cols-2 justify-items-center gap-4 sm:flex sm:items-end sm:gap-6" : "flex items-end gap-3 sm:gap-5")}>
        {items.map((f) => {
          const src = image.kind === "packs" ? f.boxImage : f.image;
          if (!src) return null;
          return (
            <div key={f.id} className={cn("relative overflow-hidden", image.kind === "packs" ? "h-[190px] w-[84px]" : "h-52 w-20 sm:h-72 sm:w-28")}>
              {/* the device renders carry wide transparent margins: cover + scale crops them so the device fills its box */}
              <Image src={src.src} alt={src.alt} fill loading="eager" sizes={image.kind === "packs" ? "84px" : "300px"} className={image.kind === "packs" ? "object-contain" : "scale-110 object-cover"} />
            </div>
          );
        })}
      </div>
      <figcaption className="mt-4 text-xs text-foreground-dim">{t(caption)}</figcaption>
    </figure>
  );
}

export function ProductEditorialMain({ product, sibling, copy, copyTh, siblingCopyTh }: { product: Product; sibling?: Product; copy: CopyByLocale; copyTh?: ProductCopyTh; siblingCopyTh?: ProductCopyTh }) {
  const { locale, c, t } = useCopy(copy);
  const rows = verifiedRows(product.specifications);
  const stats = c.spec.stats
    .map((s) => {
      const r = rows.find((x) => x.key === s.specKey);
      const v = r && statOf(r.value);
      return v ? { ...s, ...v } : null;
    })
    .filter((s) => s !== null);
  const flavours = product.flavorVariants ?? [];
  const sibRows = sibling ? verifiedRows(sibling.specifications) : [];

  const specPanel = (
    <div id="specifications" className="scroll-mt-20 rounded-2xl border border-surface-border bg-surface-1 p-5 sm:p-6 lg:sticky lg:top-24">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">{t(c.spec.title)}</h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{t(c.spec.lede)}</p>
      <dl className="mt-5 grid grid-cols-2 border-t border-l border-surface-border">
        {stats.map((s) => (
          <div key={s.specKey} className="border-r border-b border-surface-border px-4 py-4">
            <dd className="font-display text-4xl leading-none font-semibold text-foreground">
              {s.num}
              {s.unit && <span className="ml-1 text-lg font-medium text-foreground-muted">{s.unit}</span>}
            </dd>
            <dt className="mt-2 text-sm text-foreground-muted">{t(s.label)}</dt>
          </div>
        ))}
      </dl>
      <dl className="mt-2">
        {c.spec.rows.map((r) => {
          const v = r.specKey ? rowValue(rows, r.specKey, copyTh?.specifications, locale) : r.value;
          if (!v) return null;
          return (
            <div key={r.label} className="flex justify-between gap-4 border-b border-surface-border-soft py-3 text-sm">
              <dt className="text-foreground-muted">{t(r.label)}</dt>
              <dd className="text-right text-foreground">{t(v)}</dd>
            </div>
          );
        })}
      </dl>
      <p className="mt-3 text-xs text-foreground-dim">
        <span className="text-ember" aria-hidden>
          ✓{" "}
        </span>
        {t(c.spec.source)}
      </p>
    </div>
  );

  const vsCell = (p: Product, pRows: Specification[], th: ProductCopyTh | undefined, key: string, numberOnly?: boolean) => {
    if (key === "flavours") return String((p.flavorVariants ?? []).length);
    if (numberOnly) {
      const r = pRows.find((x) => x.key === key);
      const v = r && statOf(r.value);
      return v ? v.num + v.unit : "—";
    }
    return rowValue(pRows, key, th?.specifications, locale) ?? "—";
  };

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-12 lg:py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:order-2 lg:col-span-4">{specPanel}</aside>
          <div className="min-w-0 lg:order-1 lg:col-span-8 lg:max-w-3xl">
            <h2 className="font-display text-[length:var(--text-h2)] leading-[0.95] font-semibold tracking-tight text-foreground">{t(c.article.title)}</h2>
            {c.tocLabel && (
              <nav aria-label={c.tocLabel} className="mt-6 border-l border-surface-border pl-4">
                <p className="text-xs text-foreground-dim">{t(c.tocLabel)}</p>
                <ol className="mt-2 flex flex-col gap-1.5 text-sm">
                  {c.article.sections.map((s, i) =>
                    s.heading ? (
                      <li key={i}>
                        <a href={`#detail-${i}`} className="text-foreground-muted transition-colors hover:text-ember">
                          {t(s.heading)}
                        </a>
                      </li>
                    ) : null,
                  )}
                </ol>
              </nav>
            )}
            <div className="mt-6 flex flex-col">
              {c.article.sections.map((s, i) => (
                <div key={i} id={s.heading ? `detail-${i}` : undefined} className={cn("scroll-mt-24", s.heading ? "mt-10 first:mt-2" : "mt-2")}>
                  {s.heading && <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-foreground lg:text-2xl">{t(s.heading)}</h3>}
                  {s.paragraphs.map((p, pi) => (
                    <p key={pi} className="mt-3 text-base leading-relaxed text-foreground-muted lg:text-[1.0625rem] lg:leading-8">
                      {renderInline(p, locale, `e${i}p${pi}`)}
                    </p>
                  ))}
                  {s.image && <Figure image={s.image} caption={s.image.caption[locale] ?? s.image.caption.en} product={product} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-14 border-t border-surface-border-soft pt-12 lg:grid-cols-12 lg:gap-16">
          <div id="flavours" className="scroll-mt-20 lg:col-span-7">
            <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight text-foreground">{t(c.flavours.title)}</h2>
            {/* photos per group (the article above names every flavour; the hero has the chips) — a tile picks it in the hero */}
            {c.flavours.groups.map((g) => {
              const items = g.ids.map((id) => flavours.find((f) => f.id === id)).filter((f) => f !== undefined);
              if (items.length === 0) return null;
              return (
                <div key={g.label} className="mt-6">
                  <h3 className="text-sm text-foreground-muted">
                    {t(g.label)} <span className="text-foreground-dim">· {items.length}</span>
                  </h3>
                  <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {items.map((f) => (
                      <li key={f.id} className="overflow-hidden rounded-lg border border-surface-border-soft bg-surface-1 text-center transition-colors has-[a:hover]:border-ember">
                        <a
                          href={`#option-${f.id}`}
                          onClick={(e) => {
                            // the same tile twice = no hashchange; ask the hero again (ProductMoreDetails does the same)
                            if (window.location.hash === `#option-${f.id}`) {
                              e.preventDefault();
                              window.dispatchEvent(new HashChangeEvent("hashchange"));
                            }
                          }}
                          className="block"
                        >
                          {f.image && (
                            <div className="relative aspect-[3/4] overflow-hidden">
                              <Image src={f.image.src} alt={f.image.alt} fill sizes="(min-width: 1024px) 11vw, 34vw" className="scale-125 object-cover" />
                            </div>
                          )}
                          <span className="block px-1 pb-2 text-[11px] leading-tight text-foreground">{f.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <p className="mt-5 text-xs text-foreground-dim">{t(c.flavours.note)}</p>
          </div>

          {sibling && (
            <div className="lg:col-span-5">
              <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight text-foreground">{t(c.compare.title)}</h2>
              <table className="mt-5 w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-surface-border">
                    <th className="w-[34%] py-3" />
                    <th className="py-3 text-left font-display text-lg font-semibold text-foreground">{product.name}</th>
                    <th className="py-3 text-left font-display text-lg font-medium text-foreground-muted">{sibling.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {c.compare.rows.map((r) => (
                    <tr key={r.key} className="border-b border-surface-border-soft">
                      <th scope="row" className="py-3 pr-2 text-left font-normal text-foreground-muted">{t(r.label)}</th>
                      <td className="py-3 pr-2 font-medium text-foreground">{t(vsCell(product, rows, copyTh, r.key, r.numberOnly))}</td>
                      <td className="py-3 text-foreground-muted">{t(vsCell(sibling, sibRows, siblingCopyTh, r.key, r.numberOnly))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link href={`/products/${sibling.slug}`} className="mt-4 inline-block border-b border-ember pb-0.5 text-sm text-foreground">
                {t(c.compare.link)}
              </Link>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

/** The shop clip with this page's own sentence-case heading (ProductReviewSection keeps its VideoObject JSON-LD). */
export function EditorialClip({ product, copy }: { product: Product; copy: CopyByLocale }) {
  const { locale, c } = useCopy(copy);
  const title = c.clipTitle ? (locale === "th" ? thaiTypography(c.clipTitle) : c.clipTitle) : undefined;
  return <ProductReviewSection product={product} title={title} />;
}

export function ProductEditorialFaq({ copy }: { copy: CopyByLocale }) {
  const { locale, c, t } = useCopy(copy);
  // <details>, not FAQAccordion: the answers carry inline links and stay in the server HTML while closed (FAQPage JSON-LD
  // on the server page is built from the same Thai copy).
  return (
    <section className="border-b border-surface-border-soft bg-surface-1 py-14 lg:py-20">
      <Container>
        <h2 className="font-display text-[length:var(--text-h2)] leading-[0.95] font-semibold tracking-tight text-foreground">{t(c.faq.title)}</h2>
        <div className="mt-8 max-w-3xl border-t border-surface-border">
          {c.faq.items.map((f, i) => (
            <details key={i} className="group border-b border-surface-border py-4" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-medium text-foreground lg:text-lg [&::-webkit-details-marker]:hidden">
                <span>{t(f.question)}</span>
                <span className="mt-1 text-foreground-dim transition-transform group-open:rotate-180" aria-hidden>
                  ↓
                </span>
              </summary>
              <p className="mt-3 text-base leading-relaxed text-foreground-muted">{renderInline(f.answer, locale, `f${i}`)}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
