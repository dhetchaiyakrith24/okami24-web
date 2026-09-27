/**
 * Round SEO ข (owner ruling 2026-09-21): the two JSON-LD blocks an article page adds when its
 * record carries the optional fields — FAQPage from the Thai Q/A (what the crawler reads is the
 * Thai HTML, same reasoning as /faq) and VideoObject for the one confirmed OKami24-channel clip
 * (same shape as ProductReviewSection's, which is the reference). Kept out of src/lib/seo.ts
 * because that file was just landed by round ก and is on the round's do-not-touch list.
 */
import { faqPageJsonLd } from "@/lib/seo";
import { plainText } from "@/lib/article-text";
import { getDictionary } from "@/i18n/dictionaries";
import { videoObjectJsonLd } from "@/lib/video-jsonld";
import type { ArticleFAQItem, ArticleReviewVideo } from "@/types/catalog";

// FAQ text is plain: if a `[text](href)` ever lands in a Q/A string, only its label survives
// (checker flag 6(e), batch 2.5) — JSON-LD and the accordion never show the bracket syntax.
export function articleFaqJsonLd(items: ArticleFAQItem[] | undefined) {
  if (!items || items.length === 0) return null;
  return faqPageJsonLd(items.map((i) => ({ question: plainText(i.question), answer: plainText(i.answer) })));
}

export function articleVideoJsonLd(video: ArticleReviewVideo | undefined, articleTitle: string) {
  if (!video) return null;
  // Plain dictionary string (no render-time Thai typography), like the product page's block.
  return videoObjectJsonLd(video, `${video.channelName} — ${getDictionary("th").product.reviewVideoEyebrow}: ${articleTitle}`);
}

/** Round "clip": one VideoObject per clip the article shows (`reviewVideo` first, then `moreVideos`). */
export function articleVideosJsonLd(videos: (ArticleReviewVideo | undefined)[], articleTitle: string) {
  return videos.map((v) => articleVideoJsonLd(v, articleTitle)).filter((b) => b !== null);
}
