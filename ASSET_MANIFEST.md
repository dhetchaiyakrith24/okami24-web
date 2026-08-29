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

## UWELL — myuwell.com

| Product | Source URL | Original filename | Local file | Purpose | Accessed |
|---|---|---|---|---|---|
| Caliburn G5 | https://files.myuwell.com/uwell/ow-home-banner/G5-banner-3840-1620-20260421160504521.jpg (via myuwell.com) | `G5-banner-3840-1620-...jpg` | `public/assets/products/caliburn-g5/hero.jpg` | detail (campaign banner, white bg + tagline text — not isolated enough for card use) | 2026-08-29 |
| Caliburn G5 | https://files.myuwell.com/uwell/product/caliburn-g5/pc/pic3-yandan.webp (via myuwell.com/caliburn/caliburn-g5) | `pic3-yandan.webp` | `public/assets/products/caliburn-g5/detail-01.webp` | detail (pod/cartridge close-up, transparent bg — not the full device) | 2026-08-29 |

## SALTHUB — salthub.com

| Product | Source URL | Original filename | Local file | Purpose | Accessed |
|---|---|---|---|---|---|
| M Bar 10K | https://img.salthub.com/mbar10k/MBar10K_01.webp (via salthub.com/mbar-10k/) | `MBar10K_01.webp` | `public/assets/products/m-bar-10k/angle-01.webp` | detail (campaign banner, "Timeless Elegance") | 2026-08-29 |
| M Bar 10K | https://img.salthub.com/mbar10k/MBar10K_02.webp | `MBar10K_02.webp` | `public/assets/products/m-bar-10k/angle-02.webp` | detail (studio shot, night-sky backdrop) | 2026-08-29 |
| M Bar 10K | https://img.salthub.com/mbar10k/MBar10K_03.webp | `MBar10K_03.webp` | `public/assets/products/m-bar-10k/angle-03.webp` | detail (feature callout — mini display / LED / RGB mode indicator) | 2026-08-29 |

## VOOPOO — voopoo.com / shop.voopoo.com

No assets yet. Both domains were unreachable in the prior session (WebFetch: DNS failure on
`www.voopoo.com`, HTTP 403 on `shop.voopoo.com`; Browser tool: persistent "Policy check
temporarily unavailable" on every content-read call, even though navigation itself sometimes
succeeded). Being retried as part of the real-first sourcing pass below.

## Pending — real-first sourcing pass (this session)

Background research is in progress to find isolated/transparent `role: "card"` product shots
for all 28 catalog products (not just the 3 flagships), per the approved real-first hybrid
strategy. This section will be filled in with confirmed sources as images are downloaded;
products without a trustworthy official isolated image keep the `DeviceGlyph` fallback and are
noted explicitly rather than left silently unexplained.
