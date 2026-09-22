"use client";

import Link from "next/link";
import { CONTACT } from "@/data/contact";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { ThaiText } from "@/components/i18n/ThaiText";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ABOUT } from "@/i18n/about-copy";
import type { Brand } from "@/types/catalog";

/**
 * Body of /about in the active language — round 6 "about3lang", batch B2 (2026-09-23).
 *
 * Why this file exists: `src/app/about/page.tsx` was a Server Component with the whole page written
 * into it as Thai literals, so an English or Chinese visitor read a Thai page. `useLocale()` is a
 * client hook, so the body had to move; the route keeps `metadata`, the JSON-LD and the catalog
 * read, and passes the brand list down as props.
 *
 * Three things here are load-bearing and must survive any later edit:
 *
 * 1. **The Thai is not re-rendered through anything new.** `ABOUT.th` holds the exact literals that
 *    used to sit in the route — this component does NOT call `useServiceCopy`, because that helper
 *    runs `thaiTypographyDeep` over the whole copy object and would silently add WORD JOINERs to
 *    Thai the owner has not approved for them. The batch's proof is the page's rendered Thai text,
 *    hashed before against after.
 * 2. **`<ThaiText>` stays on exactly the two places that had it** — the Compliance paragraph and
 *    each brand lede — and nowhere else. It is what applies the render-time typography for `th`
 *    only; moving it, or adding it to a third place, changes bytes.
 * 3. **The brand lede follows the brand pages' own rule** (owner ruling, round open 2026-09-23):
 *    `locale === "th" ? descriptionTh : description`, the same line `BrandPageHeader.tsx` uses. A
 *    Chinese visitor reads the English lede here exactly as they already do on /brands/[slug] —
 *    the ledes are not this round's copy and were not translated.
 */
export function AboutContent({ brands }: { brands: Brand[] }) {
  const { locale } = useLocale();
  const c = ABOUT[locale];
  const link = "text-foreground hover:text-red";
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} description={c.lede} />
      <Container className="max-w-2xl py-12 lg:py-16">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">{c.whoTitle}</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">{c.who}</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">{c.selectionTitle}</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              {c.selection.beforeCount}
              {brands.length}
              {c.selection.afterCount}
              <span className="text-verified">{c.selection.verified}</span>
              {c.selection.between}
              <span className="text-unverified">{c.selection.unverified}</span>
              {c.selection.tail}
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">{c.afterSaleTitle}</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">{c.afterSale}</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">{c.contactTitle}</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              {c.contact.beforeLine}
              <Link href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer" className={link}>
                {CONTACT.lineId}
              </Link>
              {c.contact.afterLine}
            </p>
            <p className="mt-3 text-sm text-foreground-muted">
              {c.readMore.label}
              <Link href="/how-to-order" className={link}>
                {c.readMore.howToOrder}
              </Link>
              {" · "}
              <Link href="/shipping" className={link}>
                {c.readMore.shipping}
              </Link>
              {" · "}
              <Link href="/contact" className={link}>
                {c.readMore.contact}
              </Link>
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">{c.photosTitle}</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">{c.photos}</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">{c.complianceTitle}</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              {/* THAI_STYLE §5 group ก text — wording untouchable; <ThaiText> only adds the owner's
                  render-time joiners (round 30.4ค closing, 2026-09-16 — THAI_STYLE §5/§6), Thai locale only. */}
              <ThaiText>{c.compliance}</ThaiText>
            </p>
          </section>

          <section>
            <span className="label-mono text-xs text-foreground-dim">{c.brandsLabel}</span>
            <ul className="mt-4 flex flex-col gap-3">
              {brands.map((b) => (
                <li key={b.id} className="rounded-xl border border-surface-border-soft bg-surface-1 p-4">
                  <Link href={`/brands/${b.slug}`} className="font-semibold text-foreground hover:text-ember">
                    {b.name}
                  </Link>
                  {/* Round 30.4 wiring ข1: the Thai lede approved in 30.3ข (every brand on the storefront
                      has one); `description` is the English fallback — and, since round 6, what an en/zh
                      visitor reads, the same rule BrandPageHeader.tsx applies on /brands/[slug]. */}
                  <p className="mt-1 text-sm text-foreground-muted">
                    <ThaiText>{locale === "th" ? (b.descriptionTh ?? b.description) : b.description}</ThaiText>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Container>
    </>
  );
}
