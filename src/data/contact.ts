export const CONTACT = {
  // Owner correction (2026-09-03): the visible LINE handle is lowercase "@okm24" — a prior
  // capitalization ("@okM24") was used consistently across the site and docs/BUSINESS_SOURCE_OF_
  // TRUTH.md §3 before this fix; corrected everywhere it appeared, not just here.
  lineId: "@okm24",
  lineUrl: "https://lin.ee/QNJWw6o",
  // 19/10: the OA's basic ID — lin.ee/QNJWw6o redirects to line.me/R/ti/p/@662nqfjy (curl). LINE's ready-message link
  // (oaMessage) takes it; "@okm24" stays the handle the site shows.
  lineBasicId: "@662nqfjy",
  youtubeUrl: "https://www.youtube.com/@OKMYARZ",
  // Owner 2026-09-06 (PAGE_COPY answer 8 / 10): the shop's official written channel — shown on
  // the contact page and named as the PDPA contact. BSOT §3.
  email: "okamisalt@gmail.com",
} as const;
