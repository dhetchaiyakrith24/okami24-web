"use client";

import type { Product } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductReviewVideo } from "@/components/product/ProductReviewVideo";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * Wrapper around `ProductReviewVideo` for the Legacy Product Detail page — renders nothing when
 * the product has no confirmed `reviewVideo` (owner mandate, 2026-09-03: "do not attach
 * loosely-related videos merely to create SEO content"). Also emits `VideoObject` JSON-LD when a
 * video is present, since a real, on-page, user-visible video review genuinely qualifies for it
 * (see https://schema.org/VideoObject) — this still lands in the server-rendered HTML (Next SSRs
 * client components too) even though the player itself only loads client-side on click.
 */
export function ProductReviewSection({ product }: { product: Product }) {
  const { dict } = useLocale();
  if (!product.reviewVideo) return null;
  const { videoId, title, channelName, publishedAt } = product.reviewVideo;

  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description: `${channelName} — ${dict.product.reviewVideoEyebrow}: ${product.displayName}`,
    thumbnailUrl: [`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`],
    uploadDate: publishedAt,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
  };

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow={dict.product.reviewVideoEyebrow} title={product.displayName} />
        <div className="max-w-2xl">
          <ProductReviewVideo video={{ videoId, title, channelName }} eyebrow={dict.product.reviewVideoEyebrow} watchOnYoutubeLabel={dict.product.watchOnYoutube} />
        </div>
      </Container>
    </section>
  );
}
