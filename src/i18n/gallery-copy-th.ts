/**
 * OKami24 — round 30.4ค batch 5 (owner-approved 2026-09-15): Thai captions for the official-photo
 * gallery on the flagship product pages (`ProductAsset.angle`, role "detail").
 *
 * Presentation-layer only, keyed by the ENGLISH caption exactly as it appears in
 * `src/data/products/*.ts` — the data files stay the canonical English source; the image `alt`
 * text is not touched here (SEO round). Read by ProductGallery.tsx when the locale is Thai; a
 * caption without an entry keeps its English text, and English/Chinese visitors keep the data
 * captions by construction. The Thai caption names what the picture shows in the words the page
 * already uses (หัวพอต GPP · หน้าจอ · ไฟบอกสถานะ · ชุดสี) rather than translating photographer's
 * terms like "hero" (docs/THAI_STYLE.md §3 · §7 "รอบ 30.4ค ก้อน 5").
 */
export const GALLERY_CAPTIONS_TH: Record<string, string> = {
  "Campaign hero": "ภาพแคมเปญ",
  "Pod detail": "หัวพอต GPP",
  "Hero / styled shot": "ภาพสตูดิโอ",
  "Alternate colourway, 3/4 angle": "ชุดสีอื่น มุมเฉียง",
  "Screen / interface detail": "หน้าจอ",
  "Studio shot": "ภาพสตูดิโอ",
  "Feature detail": "ไฟบอกสถานะ",
};

/** Thai caption for a gallery photo, or the data caption when there is no entry. */
export function galleryCaptionTh(angle: string): string {
  return GALLERY_CAPTIONS_TH[angle] ?? angle;
}
