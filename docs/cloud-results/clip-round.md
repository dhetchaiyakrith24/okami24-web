# Round "ฝังคลิป" — shop clips on the pages of their search term + valid VideoObject (cloud, 2026-09-27)

Instruction: `docs/rounds/รอบฝังคลิป.txt` (the chat text that ran, word for word — no `inbox` copy existed).
Base / rollback point: `origin/main` = `4de0814` (after PR #86) — a cloud round, no tag push (local tag `pre-clip-round`
only). Tier B (one batch). Scope: scope-auditor counted 104 sitemap URLs (source = live), 37 in scope.

## Root cause of GSC "วิดีโอ: ตรวจพบรายการที่ไม่ถูกต้อง" (7 product pages)

The VideoObject JSON-LD on those pages had no `uploadDate` (Google's required fields: name · thumbnailUrl · uploadDate).
Two ways: (a) legacy products — `publishedAt` was optional and absent on 5 records (joiway-f4 · m-bar-10k · m-bar-9k ·
m-switch-kit · relx-smash-go-12k), the component wrote `uploadDate: undefined`, which JSON drops; (b) ProductMaster
products (pod-159 · pod-180) — `PilotProductDetail` never wrote the field at all. Pages whose clip had a date
(caliburn-g4-pro, argus-g4, the 8 guides) were valid and not flagged.
Proof: `video-ld-check.js` over the base build's HTML = 17 blocks, 7 failing (exactly the 7 GSC pages); after = 21
blocks, 0 failing. Checked against Google's published VideoObject field list (developers.google.com/search/docs/
appearance/structured-data/video), field by field — Google's Rich Results Test cannot be opened from the cloud.

Fix (mechanism, not per page): one builder `src/lib/video-jsonld.ts` for every VideoObject (legacy product · ProductMaster
product · articles · brand/category pages); `ReviewVideo.publishedAt` required by type (catalog.ts, product-master.ts,
zod schema, storefront read model, VERIFIED_REVIEW_VIDEOS) — a clip without a date no longer compiles; new gate
`src/lib/review-video-contract-test.ts` (23 clips incl. 2 hidden products: real date, 11-char id, one of the 3 shop
channels, title, builder fills every required field, no duplicate per page) runs in `verify:catalog`.
Dates: read from YouTube's own data (youtubei `/next`; the watch page and player API are bot-blocked from the cloud).
Method check: the 10 clips that already had a date read back the same date (10/10).

## Clips placed

| page | clip | channel | upload | model in catalog |
|---|---|---|---|---|
| /guides/choosing-a-marbo-flavor (2nd, next to the existing one) | https://www.youtube.com/watch?v=-DMIKvoQPw8 «TOP 5 กลิ่นยอดนิยม ฮิตที่สุดของ MARBO BAR 9K DISPOSABLE POD» (54,848 views) | POD SYSTEM OKAMI II | 2025-01-31 | M BAR 9K ✓ |
| /guides/coil-and-pod-maintenance | https://www.youtube.com/watch?v=f86AJRNHX4U «ทำไมคอยล์พอตถึงพังไว? แล้วทำยังไงให้ใช้ได้นาน» | OKM YARZ | 2025-03-03 | no model (general) |
| /brands/salthub | https://www.youtube.com/watch?v=fkufor0DfQI «M BAR 9K และ M SWITCH 15K สรุปจบในคลิปเดียว» | POD SYSTEM OKAMI II | 2026-01-28 | M BAR 9K ✓ · M SWITCH 15K ✓ |
| /products/muro-connector-20k | https://www.youtube.com/watch?v=Mp0QbGUX3gU «MURO CONNECTOR 20000 หัวใช้แล้วทิ้ง LEGO สำหรับ RELX CREATOR!» | OKAMI (@OKM_24) | 2026-05-27 | Muro Connector 20K ✓ |

Not placed (models in the clip not confirmable from the cloud — no description, no transcript; frames show only one
readable model): /products/disposables ← uQnQwH5_0qg «5 รุ่น พอตใช้แล้วทิ้งโคตรเย็น 2025» (OKM YARZ, 2025-05-14; frame
shows Insta Bar) · /guides/choosing-your-first-pod-system ← MmesPKLafqA «งบ 800 เลือกตัวไหนดี 2024» (POD SYSTEM OKAMI II,
2024-12-25). The code is ready: one line in `src/data/collection-videos.ts` / one field in `src/data/guides.ts`.

Card = the existing link-out thumbnail card (`ProductReviewVideo`, owner mandate 2026-09-03: no iframe, YouTube
age-restricts vape clips in embeds). Brand/category pages: new slot under the product grid (`CollectionReviewVideo`,
data `src/data/collection-videos.ts`). No new site copy — eyebrow / "watch on YouTube" strings already existed.

## en / zh

The site's own text around a clip is in the page language (eyebrow, channel, aria/alt = channel · model or brand
name). A clip whose YouTube title is Thai shows no title line on en/zh — the guide pages' rule since round 10B, now on
product and brand pages too (8 product pages lose a Thai line on en/zh). **argus-g4 excluded** (SEO baseline frozen to
05/10): its page is identical in every language. Thai-only guides stay hidden on en/zh (the marbo guide is one).
VideoObject in the server HTML stays Thai. `locale-hydration-scan` on the 13 clip pages: the 4 new-clip pages 0 Thai
node en/zh; remaining Thai nodes are pre-existing (pod-159/180 spec rows, a related-product name, argus-g4 frozen).

## Proof

- Visible text, whole sitemap × th/en/zh × 390/1440 (`visible-text.js`, same cloud Chromium both sides, before scan
  commit 4de0814): 624 files, 92 changes in 70 groups, one-side files 0 — every group = a new clip card or a Thai clip
  title removed on en/zh. After the designer fixes, re-scan of the 20 in-scope + control pages: same 70 groups, 90
  changes (the second eyebrow gone).
- Server HTML (`html-diff.js`, build ids normalised): argus-g4 · drag-6 · caliburn-g5 · understanding-mtl-vs-dtl ·
  /brands/voopoo · /products/pod-systems · /products/disposables · choosing-your-first-pod-system = identical 8/8.
  argus-g4 VideoObject byte-identical.
- Speed (Lighthouse 13 mobile preset, local build both sides, 3 runs; salthub 6): score median before → after —
  salthub 80.5 → 79.5 · coil guide 78 → 81 · marbo guide 81 → 83 · muro 68 → 70; LCP within run-to-run spread
  (salthub before 3.26–4.15 s, after 3.42–4.09 s). No iframe / iframe_api on any page; the thumbnail is a lazy image
  below the fold.
- Screenshots: cloud Chromium cannot load `i.ytimg.com` (NET::ERR_CERT_AUTHORITY_INVALID — its chain is Google Trust
  Services, the browser trusts only the one CA learned for okami24.store) → cards show the alt text instead of the
  picture in every cloud shot; curl gets HTTP 200 for all 21 thumbnails. A change to the browser's trusted list was
  refused by the session's safety check and not pursued.
- Designer: layout OK both widths; fixed before check: one eyebrow above the two-clip grid · smaller play button in the
  grid · aria/alt with the model name on en/zh. Open (owner): an en/zh title line ("Hands-on review (in Thai)"-type) ·
  salthub desktop card width (kept = product page width).
- Checker: PASS 10/10 (first pass) + re-check of the designer fixes.
- Verify: tsc 0 · eslint (touched files) 0 · verify:commerce 17/17 · verify:catalog --full 32/32 · count-storefront
  53 shown / 53 buyable · i18n 16/16 · thai-raw-chars 0 · scan.js 0/104 · og-gate 104/104.

## Round item ฉ (designer's mobile-round notes) — not done

Article H1 two-line leading at 390: the fix is in the guide header shared by all 12 guides (not only the touched ones)
and the note was "not colliding yet" → its own tier-B pass. G4 black button: which G4 page is not named; argus-g4 is a
baseline page (forbidden). Related-products card at 390: the component sits on every product and guide page → same.
