# Product page template — Caliburn G5 (round "G5 template", owner 02/10)

> Status: written 03/10 (batch 6). **Lock = the owner's word "ล็อก" on the live G5 page** — until then [รอเจ้าของ].
> The reference page is `/products/caliburn-g5`. Every product page in the site-wide round is brought to this shape, brand by
> brand. This file says WHAT a finished page has and where each rule lives; it does not copy rules that have their own home:
> images = `docs/IMAGE_SPEC.md` · Thai words = `docs/THAI_STYLE.md` · owner rulings = HANDOFF §18 · the owner's eye =
> `.claude/agents/designer.md` "Owner eye" · checks = `.claude/TEAM_RULES.md` 13.5. A rule changed in its home is changed here
> only if this file names it wrongly.

## 1. The page, top to bottom

| # | part | what it must be | data / file |
|---|---|---|---|
| 1 | Hero photo | opens on the card: the maker's render, upright, 4:5 (`openOnCardPhoto`) · colour/flavour photos by swipe, each the maker's render tilted 12° (new work; approved upright sets stay until redone) · the all-options image last ("ทั้งหมด"; two groups "ทั้งหมด 1 / 2" when 7+ devices would shrink in one square) | product data `image` · `colorVariants[].image` · `lineupImage` (+ `lineupImage2`) · IMAGE_SPEC §0 items 5 + 8 |
| 2 | Hero text | the brand's own logo in place of the brand chip, linked to `/brands/<slug>`; the row keeps the chip height whatever the logo, so the title starts at the same height on every page · family chip · name · short description · price read live | `src/lib/brand-logos.ts` (`scale` per logo so letters read one size; a logo is listed only after it was seen at size on a real page) · HANDOFF §18 "Brand logos" |
| 3 | More details — heading | eyebrow + "รายละเอียดเพิ่มเติม" + the maker credit line · a lede only when it gives a reason to scroll (G5 has none — it repeated the credit line) | `product-articles.ts` `lede` (optional) |
| 4 | Cover | the maker's campaign image; a cut-out (`transparent`) floats with no frame, a small gap under the text — never behind the heading or lede (Owner eye 5 · LESSONS พ13); a maker crop at the file edge gets a soft alpha fade, never drawn | `storyCover` · e.g. `_incoming/g5-template/b6/cover-fade.js` |
| 5 | Exploded view | the maker's own parts view with labelled close-ups ("ไล่ดูทีละส่วน") — labels name the part in the shortest form; close-ups = native maker pixels (Lanczos + light unsharp), never an AI upscale on anything with text (LESSONS พ12); a crop never cuts screen text | `ANATOMY_SHEETS[slug]` (anatomy-sheet-copy.ts) |
| 6 | Highlight chips | numbered chips (2 per row on phones, one row from lg) jumping to each block | automatic from `features[]` with `image` |
| 7 | Story blocks | one per maker poster: number · title · subline · poster · caption chips · body · points · optional link · credit. Desktop: poster 7/12 beside text 5/12, sides and backgrounds alternate. Phone: centred, poster between title and text, block gaps `py-5` | `features[]` (poster) + `story-copy.ts` (th/en/zh) · `storyLayout: "stage"` |
| 8 | All options grid | every colour/flavour the maker offers (catalog completeness rule) — tile = photo + swatch + name; on stage pages a tile selects that option in the hero (`#option-<id>`) | automatic from `colorVariants` / `flavorVariants` |
| 9 | Article | buyer-question H3 blocks, centred column on desktop; only questions the posters do not answer (comparisons, which-one-for-whom, what fits), ≤ 3 inline links | `product-articles.ts` `sections` |
| 10 | Spec table · fits-with · who-it's-for · FAQ · related | verified rows only; every number in the story/article points at a verified row | product data `specifications` / `faqs` |

Split-layout pages (M Bar 10K, M Bar 9K, M Switch Kit, INFY 20K, MURO SC 8000) keep `storyLayout: "split"` until their own
brand turn; moving a page to "stage" is part of that page's turn, not a side effect.

## 2. Images

- Standard, sources, credits, cut-outs, tilt, all-options layouts = `docs/IMAGE_SPEC.md` §0 (items 5, 7, 8).
- Looked at with the owner's eye before the checker: `.claude/agents/designer.md` "Owner eye" (100 % on dark + at 390/1440).
- Posters are the maker's own, shown whole at their own proportions (headlines are printed in them; a crop cuts words);
  a portrait poster gets the narrow column.

## 3. Text

- Length: 1,000–3,500 unique Thai characters of main content (spec table not counted) — HANDOFF §18, measured on the
  rendered page.
- **One fact at most twice** outside the spec table (same ruling). In practice (G5, 03/10): inside one story block the
  points state the facts and the body tells the why — the body never restates a point, a point never restates the title;
  exploded-view labels name the part only; the article answers a different buyer question and links instead of re-telling
  a poster.
- Story text: title short (the chip bar shows it) · subline one line · body 1–2 sentences · points = short facts, each number
  with its `specKey` (dropped while the row is not verified).
- Three languages for every new sentence (th/en/zh); Thai through `thai-copy`; gates = skill `thai-check`; a compound split or
  a negation left at a line end (wordbreak-scan) is reworded, single words alone on a last line are left (HANDOFF §17).
- Facts from the maker only (HANDOFF §18 "Product facts") · no claim THAI_STYLE §3 forbids · prices never typed.

## 4. Links from images (round G5 batch 3 — `_incoming/g5-template/b3-image-links.md` is the worked table)

| image | goes to |
|---|---|
| colour/flavour tile in the all-options grid | that option in the hero (`#option-<id>`) |
| poster of a pod/coil/cartridge | the shop page of the pods that fit (catalog-relationships) |
| poster of a technology the site explains | its `/technology/<slug>` page |
| poster of something a buying guide explains (e.g. airflow → MTL vs DTL) | that `/guides/<slug>` page |
| brand logo in the hero | `/brands/<slug>` |
| anything else | not a link, no hover lift |

Every link: a text link under the block too (`story-copy.ts` `link`), checked with curl (200) before merge.

## 5. Motion

Posters and the all-options grid reveal on scroll with the CSS class `okami-reveal` only (globals.css): scroll-driven, opacity +
transform, no script, no package; reduced motion, no JavaScript or an old browser = shown at once; nothing shifts. Video and
other motion = the decoration round.

## 6. A page is done when

1. every part of §1 the product type has is there (disposables / pod-replacement products: no all-options image — IMAGE_SPEC
   §0 item 5; a part the maker has no material for is left out, never filled with AI or made-up text);
2. the text is inside §3's band and no fact appears more than twice outside the spec table;
3. every clickable-looking image goes where §4 says;
4. the batch's checks pass (13.5: tier B before/after 390 + 1440, visible-text on the touched pages + controls — the whole
   sitemap when a shared part changed, wordbreak when Thai changed, gallery-probe 0 FLASH/STUCK), the Owner eye list has no ✗,
   and the checker passes;
5. the owner has seen it on the live site ("passed the checks" ≠ "owner approved").
