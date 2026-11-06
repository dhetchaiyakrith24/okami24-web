---
name: product-images
description: Make new product pictures for the OKami24 site in one order — search what already exists → find the model photo → credits → 1–3 samples → the full set → picture gates → watermark → checker → comparison image to the owner → merge. Use it before any Higgsfield credit is spent or any `generate_image` call for a product picture, when the owner says "ทำรูป", "สร้างรูป", "รูปสินค้าใหม่", "รูปกลิ่น", "รูปการ์ด", and from skill product-listing when a product has no usable picture. It points at IMAGE_SPEC and TEAM_RULES 13.5 and holds no rule of its own. Not for putting an old picture back (13.5 — no comparison needed).
---

# Product images

The **procedure** for new product pictures — no rule of its own. Rules: `docs/IMAGE_SPEC.md` §0 item 7 · §3 · §7 ·
`.claude/TEAM_RULES.md` 13.5 "รูปสินค้าใหม่". What a skill may name = 13.2 "สกิลเขียนอะไรได้".

**Only two waits for the owner:** the credit yes (Step 4) and the comparison image before merge (Step 10). Any other stop
= 13.3, never this file. While one wait runs, do the work it does not block (central §12 item 14).

Picture exists already, or a maker photo goes up as it is (no AI, no remake) = Steps 1–3, 7, 10.
An existing AI picture also takes Step 8. A maker photo gets no watermark (IMAGE_SPEC §3).

## Step 1 — Read

- `docs/IMAGE_SPEC.md` §0 items 5 · 7 · 8, §3, §7. Item 7 is the one place for AI pictures.
- `grep -n "^## " .claude/LESSONS-images.md`, then open the lessons that match the product (skill `round-open` Step 1).
- `.claude/agents/designer.md` "Owner eye". `docs/IMAGE_PROMPTS.md` when the picture is a studio remake (§0 item 8).

## Step 2 — Search what exists, before any credit

The mistake this step exists for was made twice (LESSONS-images พ21 · พ23). Owner 02/11: "รูปหาจากในคลังโฟเดอร์ก่อน + Higg".
Search all four (IMAGE_SPEC §0 item 7 "ดูของเดิมก่อนทำใหม่" · LESSONS-images พ23 · พ24):

1. `public/assets/products/`.
2. Every `manifest.csv` under `C:\Users\dhetc\OKami24-assets\`.
3. Higgsfield history in both places: MCP `show_generations` misses work made in the web app, so also read the Assets page
   (how = LESSONS-images พ23).
4. Javis's sales-picture Drive, the brand's folder (LESSONS-images พ23).

Measure what you find with a script, never from a thumbnail (`npx tsx scripts/product-image.ts info <file>` · พ23).
Usable = use it, compare it with the real product found on the web (§0 item 7 "ขั้นของเจ้าของ"), and spend no credit.
A set that would replace pictures already on the site = 13.3 #5, even when a note says OK (พ24).
Keep a line for the report: where you searched, what you found (§0 item 7).

## Step 3 — Find the model photo

- Search order = §0 item 7 "ลำดับหา". The model is the highest-quality picture found, even a poor one (§0 item 7).
- No single photo covers both body and flavour = §0 item 7 "ต้นแบบ 2 ชั้น".
- Another shop's picture = a model only, never on the site (§0 item 7 · §2).
- Reject and check files with skill `catalog-research` Step 4 (metadata, exact variant).
- Record the source in `_incoming/<source>/SOURCE.md` before anything enters `public/` (IMAGE_SPEC §5).
- Pick the method from the lessons of Step 1: one master picture plus a script often covers every option.

## Step 4 — Credits (wait 1)

Rule = §0 item 7 "เครดิต". Wait = 13.3 #2 (always, no 30-minute default).

1. `generate_image` with `get_cost: true` gives the credits per picture. No job is submitted.
2. Tell the owner the product and credits per picture, and wait for a yes in that chat. Say this before every set.
3. A yes covers only the products the owner names (§0 item 7 · LESSONS-images พ21).

No yes = no picture. Non-credit work goes on. A listing run marks the product as waiting (skill `product-listing` Step 4).

## Step 5 — Samples: 1–3 pictures

Owner 02/11: "ทดลองสร้าง 1-3 รูปก่อน จากผ่านค่อยสร้างใหม่ทั้งหมด". Owner 06/11: **Friday looks at the samples herself**;
the owner sees the full comparison in Step 10. Nothing goes to the owner here (13.5 "ไม่ส่งร่างระหว่างทำ").

Check each sample:
- `node scripts/ai-fidelity-sheet.js <real model of that option> <AI picture> <sheet.png>`, then the eye list of §7 "ตรวจรูป AI".
  Passing numbers do not prove the flavour is right: read the flavour name on the picture.
- Edges on the dark background beside the model picture (LESSONS-images พ21).
- Failed = fix the model, not the prompt (LESSONS-images 22). A refused model route = LESSONS-images พ22 · 29.

## Step 6 — The full set

Only after the samples pass. A set not priced in Step 4 = Step 4 again first.

- Every option gets a picture (§0 item 7). Same product size and position on every option, measured (§0 item 7 owner 23/10 (ก) ·
  owner 02/11 "ขนาดนั้นมันต้องเท่ากัน"). Shared cut-out = LESSONS-images 32.
- Picture form per product type = §0 items 4–5 and §4 "คำตัดสินเก่าที่ยังใช้".
- `npx tsx scripts/process-images.ts --dry-run`, then the real run. Read the first column of every report line:
  `written`, not `kept-existing`. A picture that was ever live gets a new file name (LESSONS-images พ6).
- Provenance = §0 item 7 "บอกที่มาตรง ๆ". Store our own files = §0 item 7 "เก็บรูปที่เราทำ", with the `manifest.csv` row.
- Pod system all-options image = §0 item 5, made by script from the passed pictures.

## Step 7 — Picture gates

`docs/IMAGE_SPEC.md` §7 merge item (1) and "ตรวจรูป AI":
- `npx tsx scripts/image-sharpness-gate.ts --base origin/main` ends `PASS`.
- `npx tsx scripts/product-image.ts audit`.
- The fidelity sheet of Step 5 for every AI file. Open the real thing on desktop and phone (§7).


## Step 8 — Watermark

Which pictures, strength, and when = IMAGE_SPEC §3. Maker pictures used as they are get none.

1. Look at each file first: one that carries the mark already is skipped (§3).
2. `node scripts/watermark.js --dry-run --keep C:\Users\dhetc\OKami24-assets\<YYYY-MM>\watermark-originals <paths>`, then the real run.
3. A path built by a template = fix it by hand in the same commit and pass `--template-refs` (head of the script).

The watermark renames files and their references, so it runs before the checker: `Checker: PASS` must name the final head (13.4).

## Step 9 — Checker

Draft PR → `node scripts/pre-checker-gate.js` → `checker` (13.4 · 13.7). Proof level = 13.5. The PR stays draft until the owner's yes: `gh pr ready` once (13.7).

## Step 10 — Comparison image to the owner (wait 2)

Rule = 13.5 "รูปสินค้าใหม่". Merge waits for the owner's yes, with no 30-minute default (13.3 last list).

1. Send the `ai-fidelity-sheet` file of **every** new picture in the chat, built from the `--keep` originals. Model = the maker's picture or the best other shop's.
2. One line per picture: "รุ่นตรงไหม เพี้ยนตรงไหน คมแค่ไหน" (§7).
3. Say so in that message when the form is new to the owner, or the model may not be the shop's real version (§7).
4. No comparison needed = the cases 13.5 lists.

Before writing ตรง / ผ่าน, open the final file you are sending (LESSONS-images พ24).

## Step 11 — Merge and after

1. Merge = 13.7, inside its allowed hours, after the owner's yes of Step 10.
2. Deploy success, then curl the touched pages (13.5 #2 (ฉ)). A stale picture suspected = `node scripts/stale-image-audit.js`.
3. Old/new shots at 390 with `--dpr 3` and at 1440 in the report (§7 item (3)); old = a build of main on the test server.
4. Report (central §12 item 10): where you searched · credits spent · what the owner has and has not approved.
5. Visitor-visible change = skill `seo-after-publish`. New lesson = `.claude/LESSONS-images.md` (central §12 item 27).
