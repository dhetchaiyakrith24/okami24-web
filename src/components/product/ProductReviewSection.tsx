"use client";

import type { Product } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { hideThaiClipTitle, ProductReviewVideo } from "@/components/product/ProductReviewVideo";
import { videoObjectJsonLd } from "@/lib/video-jsonld";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Wrapper around `ProductReviewVideo` for the Legacy Product Detail page — renders nothing when
 * the product has no confirmed `reviewVideo` (owner mandate, 2026-09-03: "do not attach
 * loosely-related videos merely to create SEO content"). Also emits `VideoObject` JSON-LD when a
 * video is present, since a real, on-page, user-visible video review genuinely qualifies for it
 * (see https://schema.org/VideoObject) — this still lands in the server-rendered HTML (Next SSRs
 * client components too) even though the player itself only loads client-side on click.
 */
export function ProductReviewSection({ product }: { product: Product }) {
  const { dict, locale } = useLocale();
  if (!product.reviewVideo) return null;
  const { videoId, title, channelName } = product.reviewVideo;

  // JSON-LD stays plain: the untransformed dictionary, not the context copy with render-time Thai typography.
  const videoJsonLd = videoObjectJsonLd(product.reviewVideo, `${channelName} — ${getDictionary(locale).product.reviewVideoEyebrow}: ${product.displayName}`);
  // Round "clip": the en/zh title rule of the articles (hideThaiClipTitle).
  const hideTitle = hideThaiClipTitle(locale, title);

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow={dict.product.reviewVideoEyebrow} title={product.displayName} />
        <div className="max-w-2xl">
          <ProductReviewVideo video={{ videoId, title, channelName }} eyebrow={dict.product.reviewVideoEyebrow} watchOnYoutubeLabel={dict.product.watchOnYoutube} hiddenTitleLabel={dict.product.reviewVideoHiddenTitle} hideTitle={hideTitle} contextName={product.displayName} />
        </div>
      </Container>
    </section>
  );
}
