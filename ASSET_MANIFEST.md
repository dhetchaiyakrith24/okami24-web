# Asset Manifest

Real official photography sourced under the **real-first hybrid** asset strategy: every
catalog product is checked against its manufacturer's official site first; when a trustworthy
isolated/studio product image is available it's used as that product's `role: "card"` asset
(shown in the catalog card, product hero, compare picker, and home page) and any additional
angle/detail shots become `role: "detail"` assets (shown only in the product-page gallery).
When no trustworthy official image can be sourced, the product falls back to the original
parametric `DeviceGlyph` SVG illustration — DeviceGlyph is never deleted, only superseded per
product as real imagery is found.

This is a non-commercial design/engineering demonstration project. These images remain the
property of their respective brands; they are used here for illustrative/reference purposes
only, are not redistributed for commercial use, and are not sourced from third-party retailers.

## Brand — OKami24 (owner-supplied)

| Asset | Source | Original filename | Local file | Purpose | Accessed |
|---|---|---|---|---|---|
| OKami24 logo (red variant) | Owner-supplied Google Drive folder (`logo-okami-Edited.png`, public link) | `logo-okami-Edited.png` (3708×3708, RGBA) | `public/brand/okami-logo-red.png` (568×480) | Header/Footer wordmark. Cropped tight to the badge's real alpha bounding box only — no redrawing/re-tracing, proportions preserved, original left untouched. | 2026-08-30 |
| OKami24 favicon | Same source, same crop | — | `src/app/icon.png` (512×512) | Site favicon/app icon. Same tight crop, then padded with transparent pixels to a 1:1 square (content itself not stretched/distorted) since the source badge isn't natively square. | 2026-08-30 |

`--accent-red` (`#8d0000`) in `src/app/globals.css` was colour-sampled directly from this logo file (most common red pixel value in the crop) rather than invented. A second file in the same folder, `OKAMI.png`, was also inspected — it's a purple/violet colourway, not the requested red variant, so it wasn't used.

## UWELL — myuwell.com (10/10 products have a card image)

| Product | Source URL | Original filename | Local file | Purpose | Accessed |
|---|---|---|---|---|---|
| Caliburn G5 | https://files.myuwell.com/uwell/ow-product-color/Mystic%20Forest-...png (via myuwell.com/products/caliburn) | `Mystic Forest-...png` | `caliburn-g5/card.png` | **card** — isolated, transparent | 2026-08-29 |
| Caliburn G5 | https://files.myuwell.com/uwell/ow-home-banner/G5-banner-...jpg (via myuwell.com) | `G5-banner-...jpg` | `caliburn-g5/hero.jpg` | detail — campaign banner | 2026-08-29 |
| Caliburn G5 | https://files.myuwell.com/uwell/product/caliburn-g5/pc/pic3-yandan.webp | `pic3-yandan.webp` | `caliburn-g5/detail-01.webp` | detail — pod close-up, transparent | 2026-08-29 |
| Caliburn G5 Lite | https://files.myuwell.com/uwell/product/caliburn-g5-lite/pc/spe5-1.webp (via myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se) | `spe5-1.webp` | `caliburn-g5-lite/card.webp` | **card** — isolated | 2026-08-29 |
| Caliburn G5 Lite SE | https://files.myuwell.com/uwell/product/caliburn-g5-lite/pc/spe5-2.webp | `spe5-2.webp` | `caliburn-g5-lite-se/card.webp` | **card** — isolated | 2026-08-29 |
| Caliburn G4 Pro KOKO | https://files.myuwell.com/uwell/ow-product-color/Cosmic%20Gray-...png (via myuwell.com/products/caliburn) | `Cosmic Gray-...png` | `caliburn-g4-pro-koko/card.png` | **card** — isolated, transparent | 2026-08-29 |
| Caliburn G4 Pro | https://files.myuwell.com/uwell/ow-product-color/Pearl%20Silver-...png | `Pearl Silver-...png` | `caliburn-g4-pro/card.png` | **card** — isolated, transparent | 2026-08-29 |
| Caliburn G4 | https://files.myuwell.com/uwell/product/caliburn-g4/pc/2.webp (via myuwell.com/caliburn/caliburn-g4) | `2.webp` | `caliburn-g4/card.webp` | **card** — isolated, transparent | 2026-08-29 |
| Caliburn G4 Mini | https://files.myuwell.com/uwell/product/caliburn-g4-mini/pc/1.webp (via myuwell.com/caliburn/caliburn-g4-mini) | `1.webp` | `caliburn-g4-mini/card.webp` | **card** — isolated, transparent | 2026-08-29 |
| Caliburn G4 Classic | https://files.myuwell.com/uwell/ow-product-color/Classic%20Silver-...png | `Classic Silver-...png` | `caliburn-g4-classic/card.png` | **card** — isolated, transparent | 2026-08-29 |
| Caliburn G3 Pro | https://files.myuwell.com/uwell/product/caliburnG3Pro/pack1.webp (via myuwell.com/caliburn/caliburn-g3-pro) | `pack1.webp` | `caliburn-g3-pro/card.png` | **card** — locally cropped: the source is a 16-colourway grid with no single-device shot, so the "Space Gray" cell was cropped out with `sharp` (Node) to get one isolated device. Original grid not saved. | 2026-08-29 |
| Caliburn G3 Pro KOKO | https://files.myuwell.com/uwell/product/caliburn-g3-pro-koko/power-y.webp (via myuwell.com/caliburn/caliburn-g3-pro-koko) | `power-y.webp` | `caliburn-g3-pro-koko/card.webp` | **card** — isolated pair (front+back), transparent | 2026-08-29 |

## SALTHUB — salthub.com (9/9 products have a card image)

| Product | Source URL | Original filename | Local file | Purpose | Accessed |
|---|---|---|---|---|---|
| M Bar 10K | https://www.salthub.com/wp-content/uploads/2026/02/MBar_10K.webp (via salthub.com/mbar-10k/) | `MBar_10K.webp` | `m-bar-10k/card.webp` | **card** — isolated | 2026-08-29 |
| M Bar 10K | https://img.salthub.com/mbar10k/MBar10K_01.webp | `MBar10K_01.webp` | `m-bar-10k/angle-01.webp` | detail — campaign banner | 2026-08-29 |
| M Bar 10K | https://img.salthub.com/mbar10k/MBar10K_02.webp | `MBar10K_02.webp` | `m-bar-10k/angle-02.webp` | detail — studio shot | 2026-08-29 |
| M Bar 10K | https://img.salthub.com/mbar10k/MBar10K_03.webp | `MBar10K_03.webp` | `m-bar-10k/angle-03.webp` | detail — feature callout | 2026-08-29 |
| M Bar 9K | https://www.salthub.com/wp-content/uploads/2025/05/m_bar_9k.webp | `m_bar_9k.webp` | `m-bar-9k/card.webp` | **card** — isolated | 2026-08-29 |
| M Bar 15K | https://www.salthub.com/wp-content/uploads/2025/05/m_bar_15k.webp | `m_bar_15k.webp` | `m-bar-15k/card.webp` | **card** — isolated | 2026-08-29 |
| M Switch Kit | https://www.salthub.com/wp-content/uploads/2025/08/m_bar_switch.webp | `m_bar_switch.webp` | `m-switch-kit/card.webp` | **card** — isolated | 2026-08-29 |
| M Switch Pod | https://www.salthub.com/wp-content/uploads/2025/08/m_bar_switch_pod.webp | `m_bar_switch_pod.webp` | `m-switch-pod/card.webp` | **card** — isolated (shown in "Cola" flavor variant, SALTHUB's own default card image) | 2026-08-29 |
| M Bar Pod | https://www.salthub.com/wp-content/uploads/2025/08/m_bar_switch_pod_v1.webp | `m_bar_switch_pod_v1.webp` | `m-bar-pod/card.webp` | **card** — isolated (shown in "Grape Aloe" flavor variant) | 2026-08-29 |
| Zero Pro | https://www.salthub.com/wp-content/uploads/2025/05/zero_pro.webp | `zero_pro.webp` | `zero-pro/card.webp` | **card** — isolated | 2026-08-29 |
| Zero Nano | https://www.salthub.com/wp-content/uploads/2025/06/zero_nano.webp | `zero_nano.webp` | `zero-nano/card.webp` | **card** — isolated | 2026-08-29 |
| Zero Cartridge | https://www.salthub.com/wp-content/uploads/2025/05/zero_cartridge.webp | `zero_cartridge.webp` | `zero-cartridge/card.webp` | **card** — isolated (shown in "Strawberry Zero" flavor variant) | 2026-08-29 |

## VOOPOO — voopoo.com / shop.voopoo.com (9/9 products have a card image)

The earlier "Policy check temporarily unavailable" Browser-tool error was confirmed to be a
session-wide outage (reproduced even on example.com), not a voopoo.com-specific block; the
retry worked around it with direct `curl` (pinning DNS for `www.voopoo.com`, which failed to
resolve locally but works via `--resolve` to a known-good IP).

| Product | Source URL | Original filename | Local file | Purpose | Accessed |
|---|---|---|---|---|---|
| ARGUS G4 | https://sen.voopoo.com.cn/www-voopoo/static/dist/uploads/202606/20260611/argus-g4.png (via voopoo.com/argus-series/argus-g4) | `argus-g4.png` | `argus-g4/card.png` | **card** — isolated; cropped locally with sharp to remove a third-party review-site award badge in the corner | 2026-08-29 |
| ARGUS G4 | https://sen.voopoo.com.cn/www-voopoo/static/dist/images/product/detail/argus-g4/part11/pro1.webp (via voopoo.com/argus-series/argus-g4) | `pro1.webp` | `argus-g4/hero.webp` | detail — styled hero shot, gold/lilac colourway on a satin surface | 2026-08-29 |
| ARGUS G4 | https://sen.voopoo.com.cn/www-voopoo/static/dist/images/product/detail/argus-g4/part5-pro2.webp | `part5-pro2.webp` | `argus-g4/detail-angle.webp` | detail — alternate colourway (blue/pink), angled isolated shot | 2026-08-29 |
| ARGUS G4 | https://sen.voopoo.com.cn/www-voopoo/static/dist/images/product/detail/argus-g4/part5-pro1.webp | `part5-pro1.webp` | `argus-g4/detail-screen.webp` | detail — screen/interface close-up (wattage, battery, resistance, lock) | 2026-08-29 |
| ARGUS G4 mini | https://sen.voopoo.com.cn/www-voopoo/static/dist/uploads/202606/20260611/argus-g4-mini.png | `argus-g4-mini.png` | `argus-g4-mini/card.png` | **card** — isolated; badge cropped | 2026-08-29 |
| ARGUS P3 | https://sen.voopoo.com.cn/www-voopoo/static/dist/uploads/202512/20251226/argus-p3.png | `argus-p3.png` | `argus-p3/card.png` | **card** — isolated; badge cropped | 2026-08-29 |
| ARGUS G3 mini | https://img-va.myshopline.com/image/store/1747294110724/argus-G3-MINI-(11).jpg (via shop.voopoo.com/products/argus-g3-mini, on VOOPOO's own storefront CDN) | `argus-G3-MINI-(11).jpg` | `argus-g3-mini/card.png` | **card** — original showed the device next to its retail box; cropped locally with sharp to isolate the device alone | 2026-08-29 |
| DRAG 6 | https://sen.voopoo.com.cn/www-voopoo/static/dist/uploads/202606/20260611/DRAG-6.png (via voopoo.com/drag-series/drag-6) | `DRAG-6.png` | `drag-6/card.png` | **card** — isolated; 4 stacked award badges cropped | 2026-08-29 |
| DRAG S3 | https://sen.voopoo.com.cn/www-voopoo/static/dist/uploads/202606/20260603/drag-S3.png | `drag-S3.png` | `drag-s3/card.png` | **card** — isolated; 3 stacked award badges cropped | 2026-08-29 |
| DRAG X3 | https://sen.voopoo.com.cn/www-voopoo/static/dist/uploads/202606/20260603/drag-X3.png | `drag-X3.png` | `drag-x3/card.png` | **card** — isolated; 3 stacked award badges cropped | 2026-08-29 |
| VINCI S | https://sen.voopoo.com.cn/www-voopoo/static/dist/images/product/detail/vinci-s/part15-pro2.png (via voopoo.com/vinci-series/vinci-s) | `part15-pro2.png` | `vinci-s/card.png` | **card** — isolated, no badge, used as-is | 2026-08-29 |
| VMATE i3 | https://sen.voopoo.com.cn/www-voopoo/static/dist/uploads/202509/20250912/vmate-i3.png (via voopoo.com/v-series/vmate-i3) | `vmate-i3.png` | `vmate-i3/card.png` | **card** — isolated, no badge, used as-is | 2026-08-29 |

All 9 source images are opaque white-studio-background PNGs/JPG hosted on VOOPOO's own domains
(`voopoo.com.cn` CDN used by voopoo.com, and the Shopline CDN backing the official
shop.voopoo.com storefront) — not third-party retailers. 7 of the 9 originals carried small
review-site award badges (igeekphone, MUSE Design Awards, Top Vapelier, Versed Vaper) baked
into the top-left corner; since every source image shared the same plain white background and
device position, those badges were cropped out locally with `sharp` (Node) before use, keeping
only the isolated device.

## Notes on card-image quality

Per the approved real-first brief, priority order was: isolated/transparent PNG-WebP product
renders > clean studio photography on a plain background > campaign banners (used only as
`detail` gallery supplements, never as the primary `card` image). Two UWELL cards are
borderline and worth flagging for human review:
- **Caliburn G3 Pro** required a manual crop from a 16-colourway comparison grid (no
  single-device shot exists on the official page) — the crop may show a sliver of the
  neighbouring colourway at the edges.
- **Caliburn G3 Pro KOKO** shows two devices (front+back) at an angle rather than one flat
  studio shot, since that was the only non-lifestyle, non-pod-closeup image available.

## ProductMaster / Shipnity preview pilot — Phase 2.9

Distinct from the 28-product legacy catalog above: these assets belong to `ProductMasterInput`
drafts sourced from Shipnity (see `src/data/shipnity-seed/`), wired only into the isolated,
`noindex`, production-guarded `/preview/product-master` route (`src/data/shipnity-seed/
active-catalog-to-product-master.ts`, `VERIFIED_MEDIA`). Not linked from the live catalog; every
underlying record stays `publicationStatus: "unpublished"`.

Researched for all 5 Phase 2.7 minimum-enriched candidates (Coil-53/56/74/87/92). Only one
passed every check — the other 4 keep the DEV `PreviewProductGlyph` fallback:

| Shipnity ID | Product | Result | Reason |
|---|---|---|---|
| Coil-56 | VOOPOO PnP-X Cartridge (Silver) | **Used** | See table below |
| Coil-92 | VOOPOO PnP X Coil | Rejected | Only candidate source (VOOPOO's own Shopline CDN, `PNP-X-0-15-NEW.png`) carries an embedded XMP `TC260:AIGC` tag — `Label:"1"`, `ProduceID` path containing `aigc_inpaint` — i.e. the file is self-flagged by its own metadata as AI-generated/AI-inpainted content. Excluded per owner media policy ("never use ... AI-recreated images"), even though the CDN host itself is first-party. |
| Coil-53 | UWELL Caliburn G2 coil | No image used | No official isolated coil-only shot found; all UWELL gallery images show the assembled pod with the coil installed, not the bare coil, so none could serve as an accurate coil-only card image. |
| Coil-74 | UWELL Caliburn X pod | No image used | Same category-level gap — no official bare-pod isolated shot located. |
| Coil-87 | VOOPOO TPP Pod | No image used | VOOPOO's official TPP Pod Tank product page (`shop.voopoo.com/products/tpp-pod-tank-kit`, `voopoo.com/pnp-platform/tpp-pod-tank.html`) redirects to the site homepage and site search returns no results — the product appears discontinued/delisted from VOOPOO's current official storefront. |

| Product | Source URL | Original filename | Local file | Purpose | Accessed |
|---|---|---|---|---|---|
| Coil-56 (VOOPOO PnP-X Cartridge, Silver) | https://img-va.myshopline.com/image/store/1747294110724/dtl-silver.jpg (via shop.voopoo.com/products/pnp-x-cartridge) | `dtl-silver.jpg` (600×600 jpeg, one unit isolated from a 2-pack retail photo) | `coil-56/card.webp` (284×451 webp, transparent) | **card** — cropped locally with `sharp` to isolate a single cartridge unit and remove the retail box/second unit, trimmed to natural silhouette, original plain-white studio background removed locally (threshold-based alpha keying on near-white/low-saturation pixels) to match the site's transparent-card convention, modestly upscaled (~2.3×) with `lanczos3` + sharpen since the native crop region was small (~115×189px before padding) | 2026-08-31 |

Shows the **Silver** colorway specifically — this product has 3 active colors (Black/Gray/
Silver) but only one was sourced with a verified official photo. The `alt` text names the
Silver colorway explicitly rather than implying the image represents every variant; per-variant
card images are not wired up in this pilot (`ProductMasterInput.assets` is product-level, not
per-variant). The locally-applied background removal is a simple threshold-based technique (not
ML segmentation) — edges are clean at this display size but, like the two UWELL cards flagged
above, worth a human glance if the asset is later reused at a larger size.
