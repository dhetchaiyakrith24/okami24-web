"use client";

import type { ReviewVideo } from "@/types/catalog";
import { hideThaiClipTitle, ProductReviewVideo } from "@/components/product/ProductReviewVideo";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * Round "clip" (2026-09-27): the shop clip on a brand or category page (src/data/collection-videos.ts), under the
 * product grid so it never pushes the products down. The same link-out thumbnail card as the product and article
 * pages — no YouTube script or iframe loads. Its VideoObject JSON-LD is emitted by the page (server side).
 * Renders nothing when the page has no clip.
 */
export function CollectionReviewVideo({ video, contextName }: { video: ReviewVideo | undefined; contextName: string }) {
  const { dict, locale } = useLocale();
  if (!video) return null;
  return (
    <div className="max-w-2xl">
      <ProductReviewVideo video={video} eyebrow={dict.product.reviewVideoEyebrow} watchOnYoutubeLabel={dict.product.watchOnYoutube} hideTitle={hideThaiClipTitle(locale, video.title)} contextName={contextName} />
    </div>
  );
}
