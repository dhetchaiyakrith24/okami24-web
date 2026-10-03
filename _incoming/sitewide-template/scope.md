# Scope — round "sitewide template, brand by brand" (scope-auditor 03/10, read at 34aece7; live sitemap = 109 URLs, matches source)

Sitemap 109 = static 12 + categories 6 + legacy products 37 + ProductMaster (PM) products 18 + brands 12 + guides 14 + technology 5 + e-liquid 5.
Only caliburn-g5 has storyLayout "stage", an article and STORY_COPY · ANATOMY_SHEETS = caliburn-g5 + m-bar-10k.
"split" (storyDetails without stage) today: m-bar-10k · m-bar-9k · m-switch-kit · infy-20k · muro-sc-8000.
PM pages (PilotProductDetail) have no ProductHero / ProductMoreDetails / brand logo / story mechanism.

| batch | pages (legacy unless marked PM) |
|---|---|
| 1 UWELL | caliburn-g5-lite (8 colours, lineup 1) · caliburn-g5-lite-se (8, 1) · caliburn-g4 (8, 1) · caliburn-g4-mini (12, 1) · caliburn-g4-classic (4, 1) · caliburn-g4-pro (8, no lineup) · caliburn-g4-pro-koko (9, 2) · caliburn-g3-pro (16, 2) · caliburn-g3-pro-koko (8, 2) · PM coil-53 · coil-55 · coil-74 · coil-94 |
| 2 VOOPOO | argus-g4 (8, 2) · argus-g4-mini (8, 2) · argus-p3 (7, 1) · argus-g3-mini (9, 2) · drag-6 (7, 1; colour images off-limits) · drag-s3 (7, 2) · drag-x3 (7, 2) · vmate-i3 (7, 1) · PM coil-1 · 38 · 56 · 68 · 72 · 83 · 87 · OFF: vinci-s |
| 3 SALTHUB | m-bar-10k (split, 4 posters + anatomy) · m-bar-9k (split, grid only) · m-bar-15k (= M Switch Kit duplicate, 3b(5)) · m-switch-kit (split, 1 poster) · m-switch-pod · zero-pro · zero-nano · zero-cartridge |
| 4 RELX/JOIWAY/TFIT | relx-smash-go-12k · relx-creator · joiway-f3 · joiway-f4 · (tfit-m-power-20k hidden/404) |
| 5 small brands | infy-20k (split) · wotofo-nexbar-18k · mood-monster-14k · muro-3ml · muro-sc-8000 (split) · muro-connector-20k · PM coil-54 (NEVOKS) · coil-70 (DOTMOD) · coil-89 (RINCOE) · PM pod-180 (nexBar CLEAR) · SKE / instabar / LAMBDA / Kardinal = no page in the sitemap |
| 6 IQOS | PM iqosheet-16 · iqosheet-18 |
| OFF | caliburn-g5 (template) · vinci-s · pod-159 (Esko, own PR) · service pages how-to-order · shipping · warranty · contact |

Shared parts and their reach (checker page list):
- ProductHero.tsx → the 37 legacy product pages only · ProductMoreDetails / stage → today the 6 split/stage pages + any page a batch turns on.
- story-copy.ts · product-articles.ts · anatomy-sheet-copy.ts → per slug only.
- brand data file (uwell.ts …) / card image / name / colour count → home (flagship rail, Caliburn rail, VOOPOO rail, product index), /products,
  category pages, /brands/<brand>, RelatedProducts on product pages + guides/technology.
- globals.css / dictionaries → every page (visible-text whole sitemap, 13.5 #5).
- UWELL guides that show UWELL cards: open-system-vs-disposable · understanding-mtl-vs-dtl · coil-and-pod-maintenance ·
  choosing-wattage-and-airflow · fixing-no-draw-and-blinking-light · comparing-caliburn-models · technology/onboard-touch-displays.

Batch 1 checker list: the 9 UWELL legacy slugs above · controls that must not change: caliburn-g5 · vinci-s · m-bar-10k · argus-g4 ·
card/image changes add: / · /products · /products/pod-systems · /brands/uwell · the 7 UWELL guide pages above.

Friday's calls 03/10 (report item 3): pages with no batch in the file → batch 3 (zero-* · m-switch-pod · m-bar-15k, brand SALTHUB) and
batch 5 (mood-monster-14k · muro-* · pod-180) · PM pages (coils, IQOS): images/cards to the standard only — no story mechanism is built
on PilotProductDetail in this round (shared by 18 pages, coils have no maker posters); IQOS revisits this in batch 6 ·
batch 1 split into PRs: 1a G5 Lite + G5 Lite SE · 1b G4 + G4 mini + G4 Classic · 1c G4 Pro + G4 Pro KOKO · 1d G3 Pro + G3 Pro KOKO.
