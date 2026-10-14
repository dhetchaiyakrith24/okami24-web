---
name: thai-check
description: Gate every change to copy shown on the OKami24 site before it is committed — Thai, English or Chinese, in dictionaries, product data, page components, head/meta or JSON-LD. Use it on every batch that touches site text, and when the checker needs the Thai-copy gates (the checker reads this file directly). It runs the English-leak scan (the touched pages + the pages that show that text; the whole sitemap only for a part every page shares — TEAM_RULES 13.5), the raw-invisible-character scan, the forbidden-word grep, the head/JSON-LD and en/zh checks, and applies the copy principles (unverifiable = unsaid, no health/price/guarantee claims, numbers need a verified spec row, no negation left where a line break flips the meaning, product facts from the manufacturer only). It points at the locked-word and permanent-exception tables in THAI_STYLE instead of copying them.
---

# Thai copy check

This skill is the **gate procedure** for site copy. The wording rules themselves live in
`docs/THAI_STYLE.md` (the single source of truth for Thai on the site — read it on every round
that touches copy, per the read-first list in skill `round-open` step 1) and are **not copied here**: a word list
copied into a second file drifts. Every gate below is either a script whose output decides, or a
pointer to the table that decides.

The `checker` agent reads this file directly (it has no skill tool). **Source gates (2 · 4 · 5)
run on every batch that touched anything under `src/`** — they read the repo, need no server and
take seconds. **Page gates (1 · 3) run when copy a visitor can see changed** — page text, head/meta,
Open Graph or JSON-LD (`.claude/TEAM_RULES.md` 13.5 #2 (ข), owner 2026-09-27/28). Long results go to
a file under `_incoming/<round>/` and the path is cited in field 4 of its report.

## When this applies

- Any batch that adds, edits or moves text a visitor can see: dictionaries, `product-copy`,
  page components, service pages, brand/category data, titles, meta, Open Graph, JSON-LD.
- Any batch that touches the typography mechanism or the components it wraps.
- The checker's pass on such a batch, and the round close (skill `round-close` runs the same
  scan set).

## Gates (all must pass; the script decides, not the reader)

1. **English sentence leak on the Thai site — `node scripts/scan.js`** against the running test
   server (how to build and start it: `docs/HANDOFF.md` §17). Pages: `--pages "<paths>"` = the
   touched pages + the pages that show that text (brand · category · `/products` · home);
   without `--pages` it walks every URL in the sitemap — only for a part every page shares
   (TEAM_RULES 13.5 #2 (ข) and #5). It flags visible text runs that read as an English sentence to
   a Thai visitor; what counts as a flag, what is skipped (`lang="en"` elements, brand slogans) and
   the extra allow-list flag are defined in the script's own header comment — do not restate them.
   **Pass = zero flagged runs and zero unreadable pages** (the script prints `PASS 0/<pages>`
   and exits non-zero otherwise · Git Bash: `MSYS_NO_PATHCONV=1` or the paths get rewritten). If anything is flagged: report every text with its page —
   never assume a flag is intentional. A brand name, model name, category name or slogan that
   gets flagged means the script is wrong: report that separately, do not allow-list it silently.

2. **Raw invisible characters in the source — `node scripts/thai-raw-chars-check.js`.** The
   no-break space and the word joiner may exist on the rendered Thai page only; in the repo's
   source, copy, data and docs the raw count must be **0** (the script scans the folders it names
   and exits non-zero on any hit). The mechanism file itself builds the characters from code
   points, so even it holds none.

3. **Invisible glue = render time only, one mechanism file.** The glue is inserted at render,
   for the Thai locale only, by the **single mechanism file that THAI_STYLE names in its
   "กลไก typography" section** (the file was renamed once already — read the name there, never
   from memory; a second mechanism file appearing, including the deleted predecessor that section
   records, = fail). What the mechanism glues (space before ๆ, number–unit, the two-word model
   names, the owner's word-joiner exceptions bound to specific sentences) is listed in that
   section; adding an item = the file is locked (TEAM_RULES 13.7 【แตะได้】 — `scripts/guard-tool.js` asks the owner). Title, meta, Open Graph, JSON-LD and
   the en/zh locales read the raw strings: every page's `<head>` and JSON-LD must contain **0**
   of the two characters, and en/zh after hydration must contain **0** Thai text nodes —
   checked with `scripts/locale-hydration-scan.js` on the touched pages (curl cannot: SSR always
   renders Thai). The `/about` compliance sentence is the one `within` exception and is not to be
   reused elsewhere (THAI_STYLE "กลุ่ม ก" row + the mechanism section).

4. **Forbidden words in the source — grep all of `src/`** with every word in the **"ห้ามใช้"
   column of the locked-word table in THAI_STYLE ("คำที่ล็อกแล้ว"), the whole table**, plus the
   misspellings and stray forms found in earlier rounds:
   `พอตี|แท่ง|หัวหอม|คาร์ทริดจ์|ตลับ|ดิสโพส|ลูกเล่น|เซลล์แบต` — must be **0**, except the spots the
   permanent-exception table (THAI_STYLE "กลุ่ม ก — ยกเว้นถาวร") lists explicitly. Count with
   Node code points, not `grep "[ก-๙]"` on Git Bash (byte-range false positive). Beware
   "พอดี" is not "พอด" — never replace across a whole file.

5. **Forbidden claims in new text, every language** — the single list is THAI_STYLE
   "คำ/ประโยคที่ห้ามในข้อความใหม่ทุกภาษา" (free shipping, guarantee, payment channels, pointing at
   the cart, "ที่สุด"/superlatives without a number, health / safety / quit-smoking / official
   endorsement, zh 保证) and its one exception (health / quitting ARTICLES, both sides, foreign official
   sources — written in the same THAI_STYLE line). Grep the new strings against it before the checker does.

## Principles every new or edited sentence must pass

- **Unverifiable = unsaid, in every language.** A fact, number, price, condition or delivery
  time that cannot be traced to the data or to `docs/BUSINESS_SOURCE_OF_TRUTH.md` does not go
  into the sentence (THAI_STYLE, same paragraph as the forbidden-claims list).
- **No health, price or guarantee claim** — see gate 5.
- **Every number on a page points at a verified spec row.** A number whose spec row is marked
  unverified is cut, not softened (the pattern the card-headline spec file set; the reason the
  brands page dropped puff counts for one brand and kept them for another).
- **Negation position.** No "ไม่ / ยังไม่ / ไม่ใช่" where a line break would leave it at a line
  end and flip the meaning — put it at the start of the string or rewrite positively; the
  sentence ends on a phrase of two or more words, or on a number + unit / an English name the
  mechanism glues (the rule thai-copy applied row by row in THAI_STYLE_LOG's round tables).
- **Manufacturer source only.** A product fact on the site — compatibility notes included — comes
  from the manufacturer (its site, poster or manual); a retailer page is not a source, and a new
  sentence citing one ("retailer page states") fails this gate. The rule and its only named
  exceptions: THAI_STYLE §5 "ขยายเป็นทุกที่บนเว็บ" (owner ruling, round "cloud", replaces the old
  retailer-page allowance). The Thai, English and Chinese sentences cite the same source.
- **Numbers and model names stay exactly as in the source**; brand and model names are English
  always (THAI_STYLE layer rule); a Thai word glued to an English one gets a space (THAI_STYLE
  typing rules).

## Who does the wording

- Text that **already exists on the site**, or **new** text (a sentence that does not exist yet, a script, a
  customer reply, en/zh): the `thai-copy` agent (edit mode / write mode) — it returns text only and edits nothing.
- Customer-facing sentences and words outside the locked-word table: no stop to ask — `.claude/TEAM_RULES.md` 13.3
  (last paragraph) + 13.8 · the table changes only by the owner's ruling, written in THAI_STYLE first, then in code.
