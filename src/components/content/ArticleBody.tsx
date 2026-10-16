"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ArticleFAQItem, ArticleReviewVideo, GuideSection, StoryImage } from "@/types/catalog";
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
export function renderInline(text: string, locale: string, keyPrefix: string): ReactNode[] {
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

/** Section poster (owner 16/10). The product page's poster card (rounded, hairline border, black ground) and its credit
 *  line, so a poster looks the same wherever it appears. From md up a tall poster is narrowed so it stays about 760px
 *  high (designer 16/10: a 560px cap made the DRAG S3 coil labels unreadable at 1440); phones keep the full width. */
function ArticleFigure({ img, linkLabel }: { img: StoryImage; linkLabel: string }) {
  const maxWidth = img.height > img.width ? Math.round((760 * img.width) / img.height) : undefined;
  return (
    <figure
      className="mx-auto mt-3 flex w-full flex-col gap-2 md:max-w-[var(--figure-max)]"
      style={maxWidth ? ({ "--figure-max": `${maxWidth}px` } as CSSProperties) : undefined}
    >
      <div className={img.transparent ? undefined : "overflow-hidden rounded-2xl border border-surface-border-soft bg-black"}>
        <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 768px) 720px, 100vw" className="block h-auto w-full" />
      </div>
      <figcaption className="label-mono text-[0.6rem] text-foreground-dim" lang="en">
        © {img.sourceName}
        {img.sourceUrl && (
          <>
            {" · "}
            <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="transition-colors hover:text-foreground hover:underline">
              {linkLabel}
            </a>
          </>
        )}
      </figcaption>
    </figure>
  );
}

export function ArticleBody({
  sections,
  translated,
  faq,
  translatedFaq,
  video,
  sourceNote,
}: {
  sections: GuideSection[];
  translated?: Partial<Record<"th" | "zh", GuideSection[]>>;
  /** English Q/A (fallback), same replace-per-locale rule as `sections`. */
  faq?: ArticleFAQItem[];
  translatedFaq?: Partial<Record<"th" | "zh", ArticleFAQItem[]>>;
  video?: ArticleReviewVideo;
  /** Round SEO ฉ batch 4 (designer option C): one closing line — who wrote it, where product facts come from, which
   *  shop channel the clips on this page are from (names read from those clips). Guides only; off by default. */
  sourceNote?: boolean;
}) {
  const { locale, dict } = useLocale();
  const activeSections = (locale === "th" || locale === "zh" ? translated?.[locale] : undefined) ?? sections;
  const activeFaq = (locale === "th" || locale === "zh" ? translatedFaq?.[locale] : undefined) ?? faq;
  const channels = [...new Set([...activeSections.map((s) => s.video?.channelName), video?.channelName].filter((c): c is string => Boolean(c)))];
  const noteText = channels.length > 0 ? dict.guides.sourceNote.replace("{channels}", channels.join(dict.guides.channelJoiner)) : dict.guides.sourceNoteNoClip;

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
              {sub.image && <ArticleFigure img={sub.image} linkLabel={dict.product.gallerySourceLinkLabel} />}
            </div>
          ))}
          {section.image && <ArticleFigure img={section.image} linkLabel={dict.product.gallerySourceLinkLabel} />}
          {section.video && (
            // Owner 05/10: a shop clip about this section's subject, after its text — the same card as the article's clip.
            <div className="mt-3">
              <ProductReviewVideo video={section.video} eyebrow={dict.product.reviewVideoEyebrow} watchOnYoutubeLabel={dict.product.watchOnYoutube} hiddenTitleLabel={dict.product.reviewVideoHiddenTitle} hideTitle={hideThaiClipTitle(locale, section.video.title)} />
            </div>
          )}
        </div>
      ))}
      {video && (
        // ProductReviewVideo already carries its own eyebrow, title and channel line — no
        // SectionHeading on top (the demo render showed the pair doubled).
        // Round 10B: on en/zh a Thai clip title is not shown (0 Thai text on the en/zh guide pages, owner 2026-09-24).
        <ProductReviewVideo video={video} eyebrow={dict.product.reviewVideoEyebrow} watchOnYoutubeLabel={dict.product.watchOnYoutube} hiddenTitleLabel={dict.product.reviewVideoHiddenTitle} hideTitle={hideThaiClipTitle(locale, video.title)} />
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
      {sourceNote && (
        // The FAQ block above already ends on a rule (border-b) — a second rule here stacked two lines with a gap between.
        <p className={`${activeFaq && activeFaq.length > 0 ? "-mt-4" : "border-t border-surface-border-soft pt-6"} text-xs leading-relaxed text-foreground-dim`}>{locale === "th" ? thaiTypographyNode(noteText) : noteText}</p>
      )}
    </div>
  );
}
