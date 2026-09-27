import type { ReviewVideo } from "@/types/catalog";

/**
 * Round "clip" (2026-09-27): shop clips on brand and category pages, keyed by the page path. Only a clip from one
 * of the shop's own three channels (@OKM_24 "OKAMI" · @PODSYSTEM-OKAMI-II "POD SYSTEM OKAMI II" · @OKMYARZ
 * "OKM YARZ") that ranks on Google's page 1 for the page's own search term (docs/SEO_LANDSCAPE.md §4), and whose
 * models are all still in the catalog. Title, channel and upload date are read from YouTube's own video data.
 * A path not listed here renders no clip section and no VideoObject.
 */
export const COLLECTION_VIDEOS: Record<string, ReviewVideo> = {
  // "m bar" — this clip ranks #3 on page 1 (SEO_LANDSCAPE §4). Models: M BAR 9K (m-bar-9k) + M SWITCH 15K (m-switch-kit).
  "/brands/salthub": { videoId: "fkufor0DfQI", title: "M BAR 9K และ M SWITCH 15K สรุปจบในคลิปเดียว", channelName: "POD SYSTEM OKAMI II", publishedAt: "2026-01-28" },
};
