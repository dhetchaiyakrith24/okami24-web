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

## VOOPOO — voopoo.com / shop.voopoo.com (0/9 — in progress)

Both domains were unreachable in the prior research session (WebFetch: DNS failure on
`www.voopoo.com`, HTTP 403 on `shop.voopoo.com`; Browser tool: persistent "Policy check
temporarily unavailable" on every content-read call). A dedicated retry is in progress as part
of this real-first sourcing pass; all 9 VOOPOO products currently use the `DeviceGlyph`
fallback pending its result.

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
