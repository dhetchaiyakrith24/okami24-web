/**
 * Round "clip" (2026-09-27): the one VideoObject JSON-LD builder. Every page that shows a shop clip
 * (legacy product · ProductMaster product · guide/technology article · brand/category page) emits its
 * block through here, so a field Google requires cannot go missing on one page type again — GSC had
 * flagged 7 product pages "invalid video item" because `uploadDate` was optional and absent there.
 * Google's required fields: name, thumbnailUrl, uploadDate (`ReviewVideo.publishedAt` is required by
 * type); description and embedUrl are recommended and always filled. Key order and values match the
 * block the product page emitted before this round, so a page whose clip already had a date renders
 * the exact same JSON (the SEO-baseline pages must not change until 05/10).
 */
import type { ReviewVideo } from "@/types/catalog";

export function videoObjectJsonLd(video: ReviewVideo, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description,
    thumbnailUrl: [`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`],
    uploadDate: video.publishedAt,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
  };
}
