/**
 * Round "clip" (2026-09-27): the one VideoObject JSON-LD builder. Every page that shows a shop clip
 * (legacy product · ProductMaster product · guide/technology article · brand/category page) emits its
 * block through here, so a field Google requires cannot go missing on one page type again — GSC had
 * flagged 7 product pages "invalid video item" because `uploadDate` was optional and absent there.
 * Google's required fields: name, thumbnailUrl, uploadDate (`ReviewVideo.publishedAt` is required by
 * type); description and embedUrl are recommended and always filled. Key order and values match the
 * block the product page emitted before this round, so a page whose clip already had a date renders
 * the exact same JSON (the SEO-baseline pages must not change until 05/10).
 *
 * `uploadDate` carries a time zone (GSC 2026-09-26 warned on the valid clips: "uploadDate has no time
 * zone" / "invalid DateTime"). The data holds only the day YouTube shows, so the value is the start of
 * that day in the shop's time zone (Asia/Bangkok, +07:00) — a nominal time, not a read upload time.
 * `frozen` (the SEO-baseline pages until 05/10) keeps the old date-only value so those pages stay
 * byte-identical; it lifts with TITLE_PRICE_HOLD_UNTIL_2026_10_05.
 */
import type { ReviewVideo } from "@/types/catalog";

export function uploadDateTime(publishedAt: string): string {
  return `${publishedAt}T00:00:00+07:00`;
}

export function videoObjectJsonLd(video: ReviewVideo, description: string, { frozen = false }: { frozen?: boolean } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description,
    thumbnailUrl: [`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`],
    uploadDate: frozen ? video.publishedAt : uploadDateTime(video.publishedAt),
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
  };
}
