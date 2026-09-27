"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { ArticleFAQItem, ArticleReviewVideo, GuideSection } from "@/types/catalog";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypographyNode } from "@/lib/thai-typography";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { hideThaiClipTitle, ProductReviewVideo } from "@/components/product/ProductReviewVideo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { INLINE_LINK, plainText } from "@/lib/article-text";

/**
 * Content-level i18n fix (owner quality review, 2026-09-02) — shared by Guides and Technology
 * detail pages. `translated` is an optional per-locale override supplied by the page (from
 * guides-copy.ts / technology-copy.ts); REPLACES `sections` when the current locale has a real
 * translation, otherwise falls back to the English `sections` — never blank, never a partial mix
 * of two languages within one article.
 *
 * Round SEO ข (owner ruling 2026-09-21, Q1=ก): the same component now also renders, when the
 * record carries them, inline links inside a paragraph (`[text](href)`), H3 sub-blocks
 * (`section.subsections`), a Q/A block (`faq` — the /faq accordion reused, never its overlay) and
 * one confirmed OKami24-channel clip (`video`). Every one of these is optional; an article with
 * none of them renders exactly as before this round (tier-B proof: pixel-identical before/after on
 * all 12 pages, `_incoming/seo-b/diff-before-after.md`).
 */

function isInternal(href: string): boolean {
  return href.startsWith("/");
}

/** Splits one paragraph into text runs and links. Thai typography is applied per text run and per
 *  link label, so the render-time NBSP/joiner rules keep working around a link (a link boundary is
 *  not a break opportunity in itself — the segmenter reads across inline elements). */
function renderInline(text: string, locale: string, keyPrefix: string): ReactNode[] {
  const t = (s: string) => (locale === "th" ? thaiTypographyNode(s) : s);
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const m of text.matchAll(INLINE_LINK)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(t(text.slice(last, idx)));
    const [, label, href] = m;
    // whitespace-nowrap: a link label never wraps mid-word (owner condition, batch 3 — the scan
    // caught "พอตใช้แล้ว|ทิ้ง" and "ช่อง|ลม" inside labels at 390); labels stay ≤ 4 words / ~30 chars.
    const cls = "whitespace-nowrap font-medium text-foreground underline decoration-foreground-dim underline-offset-4 transition-colors hover:text-ember hover:decoration-ember";
    out.push(
      isInternal(href) ? (
        <Link key={`${keyPrefix}-l${n}`} href={href} className={cls}>
          {t(label)}
        </Link>
      ) : (
        // A brand-site source citation (§ข-4): same contract as SourceNote — new tab, nofollow.
        <a key={`${keyPrefix}-l${n}`} href={href} target="_blank" rel="noopener noreferrer nofollow" className={cls}>
          {t(label)}
        </a>
      ),
    );
    last = idx + m[0].length;
    n++;
  }
  if (last < text.length) out.push(t(text.slice(last)));
  return out;
}

export function ArticleBody({
  sections,
  translated,
  faq,
  translatedFaq,
  video,
  moreVideos,
}: {
  sections: GuideSection[];
  translated?: Partial<Record<"th" | "zh", GuideSection[]>>;
  /** English Q/A (fallback), same replace-per-locale rule as `sections`. */
  faq?: ArticleFAQItem[];
  translatedFaq?: Partial<Record<"th" | "zh", ArticleFAQItem[]>>;
  video?: ArticleReviewVideo;
  moreVideos?: ArticleReviewVideo[];
}) {
  const { locale, dict } = useLocale();
  const activeSections = (locale === "th" || locale === "zh" ? translated?.[locale] : undefined) ?? sections;
  const activeFaq = (locale === "th" || locale === "zh" ? translatedFaq?.[locale] : undefined) ?? faq;

  return (
    <div className="flex flex-col gap-10">
      {activeSections.map((section, i) => (
        <div key={i} className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-semibold text-foreground">{locale === "th" ? thaiTypographyNode(section.heading) : section.heading}</h2>
          {section.paragraphs.map((p, pi) => (
            <p key={pi} className="text-base leading-relaxed text-foreground-muted">
              {renderInline(p, locale, `s${i}p${pi}`)}
            </p>
          ))}
          {section.subsections?.map((sub, si) => (
            <div key={`sub${si}`} className="mt-3 flex flex-col gap-3">
              <h3 className="font-display text-xl font-semibold text-foreground">{locale === "th" ? thaiTypographyNode(sub.heading) : sub.heading}</h3>
              {sub.paragraphs.map((p, pi) => (
                <p key={pi} className="text-base leading-relaxed text-foreground-muted">
                  {renderInline(p, locale, `s${i}sub${si}p${pi}`)}
                </p>
              ))}
            </div>
          ))}
        </div>
      ))}
      {video && !moreVideos?.length && (
        // ProductReviewVideo already carries its own eyebrow, title and channel line — no
        // SectionHeading on top (the demo render showed the pair doubled).
        // Round 10B: on en/zh a Thai clip title is not shown (0 Thai text on the en/zh guide pages, owner 2026-09-24).
        <ProductReviewVideo video={video} eyebrow={dict.product.reviewVideoEyebrow} watchOnYoutubeLabel={dict.product.watchOnYoutube} hideTitle={hideThaiClipTitle(locale, video.title)} />
      )}
      {video && moreVideos && moreVideos.length > 0 && (
        // Round "clip": an article with a second shop clip shows the cards side by side from sm up, stacked on a phone,
        // under one eyebrow (designer: a second eyebrow read as a new section).
        <div className="flex flex-col gap-3">
          <span className="label-mono text-xs text-foreground-dim">{dict.product.reviewVideoEyebrow}</span>
          <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
            {[video, ...moreVideos].map((v) => (
              <ProductReviewVideo key={v.videoId} video={v} watchOnYoutubeLabel={dict.product.watchOnYoutube} hideTitle={hideThaiClipTitle(locale, v.title)} compact />
            ))}
          </div>
        </div>
      )}
      {activeFaq && activeFaq.length > 0 && (
        <div className="flex flex-col gap-6">
          <SectionHeading eyebrow={dict.product.faqEyebrow} title={dict.faq.pageTitle} titleClassName="text-2xl" />
          {/* ids are namespaced so FAQAccordion's /faq overlay lookup never matches — the text passed here is already the active locale's.
              border-b closes the accordion's last row (designer, batch 2.5) — article column only, /faq untouched */}
          <div className="border-b border-surface-border-soft">
            <FAQAccordion items={activeFaq.map((item, i) => ({ id: `article-faq-${i}`, question: plainText(item.question), answer: plainText(item.answer) }))} />
          </div>
        </div>
      )}
    </div>
  );
}
