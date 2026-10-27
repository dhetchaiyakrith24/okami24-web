# SEO push 27/10 — four audits and what was fixed (side chat `seo-push-2710`)

Owner goal 27/10: push everything SEO and tidy the small details that matter — product-page articles and guides first.
Measured on a local production build of main b4882b15 (port 3430, `OKAMI24_ORDERING=on`), 176 sitemap pages.
Raw files: `_incoming/seo-push-2710/` (products.txt · head-base/head-audit.tsv · inbound.json).

## 1. Product-page completeness (`npx tsx scripts/product-completeness.ts --gaps`)

95 storefront products (46 legacy + 49 published ProductMaster).

| Gap | Count | Notes |
|---|---|---|
| "จุดเด่น / รายละเอียดเพิ่มเติม" heading with nothing but the grid (owner's MURO screenshot) | 2 → **0** | infy-20k · muro-sc-8000 — articles added (th/en/zh). M Bar 9K was a false hit: it renders PRODUCT_EDITORIAL (redesign 23/10), which already has its article. |
| Legacy product with no article | 18 → 16 | caliburn-g3 · drag-x · vinci-s · m-switch-pod · zero-nano · zero-cartridge · relx-infinity-2-plus · nexpod-15k · mood-monster-14k · muro-3ml · muro-connector-20k · foli-bar-15k · vazer-one-pod · next-pro-2-beyond · muro-freebase · muro-salt-nic. All but caliburn-g3 have no `storyDetails` section, so they show no empty heading; an article needs the section turned on (tier B). |
| Published (ProductMaster) pages | 49 | The published page has **no article slot at all** (PilotProductDetail). Giving them one = a component change → its own round. |
| Option without a photo | 19 products | worst: relx-creator-pod-20k 31/31 · relx-infinity-pro-2-pod 27/42 · sup-zero-22k 16/16 · vazer-one-pod 16/21 · wotofo-nexbar-18k 11/31. Image work = IMAGE_SPEC round, not done here. |
| < 2 verified spec rows | 30 | mostly e-liquid, Muro, published pods — maker data is thin or absent. |

## 2. Guides (/guides) — 33 content guides + the DNS help page

* All 33 are finished (no placeholder, no truncated paragraph). Every §9.2 gap keyword now has its page.
* Main keyword (SEO_LANDSCAPE §0/§9): 28 own one. No keyword of their own: reading-a-spec-sheet · argus-g4-vs-caliburn-g5 ·
  choosing-a-terea-flavor · iqos-iluma-i-one-vs-iluma-i · pg-vg-in-e-liquid.
* Keyword missing from the meta: choosing-a-marbo-flavor (meta says M Bar, never Marbo) · comparing-caliburn-models (no
  "Caliburn") · disposable-vs-switch-pod · open-system-vs-disposable ("ต่างกันยังไง") · refilling-a-pod ("เติมน้ำยา").
* No in-body image: what-is-a-pod-system · quit-smoking-with-a-pod · choosing-a-pod-flavor · checking-a-genuine-pod ·
  iqos-iluma-i-reset-and-charging · choosing-a-terea-flavor · iqos-iluma-i-one-vs-iluma-i · how-to-vape-without-coughing.
  No guide has a hero image; Article JSON-LD uses the site share image.
* No clip: 8 guides, and the docs name no matching shop clip for any of them.
* "31 main channels": not found anywhere in docs/ or .claude/. The shop has 3 channels (SEO_LANDSCAPE §8). → question for the owner.
* Doc drift: SEO_LANDSCAPE L63/L128/L512 still list refilling-a-pod and how-long-a-pod-device-lasts as missing; §4 names
  clips htDb9aXyIqI / 4DoUt2ABgmU as embedded but neither is in src/ (one-clip-per-page rule 19/10).
* "Not sold on our site" lines (owner rule 27/10 (a)) — **fixed**: RELX Pod Pro 2 (2 places) → /products/relx-infinity-pro-2-pod ·
  bottled e-liquid (2 guides) → /products/e-liquid · PnP X coils (DRAG X3 FAQ, th/en/zh) → /products/coil-92.
  RELX Pod and RELX Pod Pro (non-Pro-2) are still not listed — listing them = catalog work from Shipnity.

## 3. Internal links

Internal links do affect SEO: they are how Google finds pages, they tell it what a page is about (the link text), and
they pass a share of a page's weight to the pages it links.

* Fixed: every product page now links at least one article (95/95; e-liquid pages had none). 11 e-liquid pages → the salt
  nic / PG-VG / refilling guides.
* Fixed: the brand chip on product pages links the brand page for every brand (before: only brands with a logo file —
  7 brand pages had a single inbound link, from /about).
* Left: 11 articles are not linked from any product page (fixing-a-burnt-pod · fixing-a-leaking-pod · taking-a-pod-on-a-plane ·
  quit-smoking-with-a-pod · how-long-a-pod-device-lasts · choosing-a-disposable · choosing-a-pod-flavor · checking-a-genuine-pod ·
  how-to-vape-without-coughing · cant-open-the-website · technology/gesture-and-triple-tap-control). The product box holds 3
  and rule order is priority (LESSONS 35) — needs a deliberate re-rank, not a quick add.
* /technology and /privacy have no link from any page body (header/footer only) — low impact.

## 4. Page-1 head standard (`scripts/head-audit.js`, 176 pages)

Clean: status 200 · one H1 · canonical · no duplicate title/meta/H1 · JSON-LD on 172. Ranked by impact:

1. Done here — not-sold lines, empty product sections, product→brand and e-liquid→guide links (above).
2. Meta over 160 (cut in results): iqos-iluma-i-reset-and-charging 221 · iqos-iluma-i-one-vs-iluma-i 227 · choosing-a-terea-flavor 208 · /brands/lambda 163.
3. Keyword gaps in guide metas (section 2).
4. Thin pages (< 300 Thai characters in <main>): /brands/rincoe · dotmod · ske · nevoks · heated-tobacco-consumables · 4 published e-liquid/pod pages.
5. Guide titles over 60 characters: 16 (Thai marks count; not a hard rule in SEO_LANDSCAPE §7.2).
6. No JSON-LD: /how-to-order · /shipping · /warranty · /privacy (low).
"Images without alt" in the raw count = option-chip thumbnails with `alt=""` next to their text label — correct, not a gap.
