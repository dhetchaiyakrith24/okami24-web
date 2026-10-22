---
name: kien-thai
description: Audit checklist for Thai copy on okami24.store — structural frames (f1–f7), mechanical AI tells, grammar and taste rules that make Thai read like a person wrote it. Used by the thai-copy agent and by Friday when writing or editing site copy (product pages, guides, head/meta, FAQ), after docs/THAI_STYLE.md. Not for Friday's reports to the owner. THAI_STYLE and the thai-copy agent win on every conflict.
---

> **Source:** `chakrit/kien-thai` → `skills/kien-thai/` · commit `3695c889a23538e97ddae45c53e8b894730b41f5` · read 23/10/2026
> (98 GitHub stars · skills.sh 124 installs · MIT). Vetted per skill `find-skills` steps C–D: every file read raw at the pinned
> sha, `scripts/skill-scan.js` 65 flags all benign, 0 hidden characters (raw copies: `_incoming/skill-vet/kien-thai-3695c88/`).
> **OKami24 copy** (owner 23/10: blind A/B test "1-2 ผสมกัน โดยรวมคิดว่าน่าจะโอเครและธรรมชาติขึ้น" → adopted as a checklist
> beside thai-copy, not as a writing workflow of its own).
> **Kept word for word:** `references/ai-tells.md` · `craft.md` · `grammar.md` · `forbidden-phrases.md` · `style-rules.md`, and
> the upstream SKILL.md sections "Why this skill exists" + frames f1–f7 + "Person deixis" + "Stylistic conventions" (below).
> **Changed (6 code spans on 5 lines):** a Thai example ending in "!" right before a closing backtick (craft 42 ×2, forbidden-phrases 27–28,
> style-rules 145) — the "!" moved out of the code span as "(+ !)", because that pattern reads as a load-time command
> (find-skills step C). Frontmatter + this head rewritten.
> **Dropped:** upstream frontmatter (it triggered on any Thai prose) · "Best output" model route + `scripts/` (local LLM
> via ollama + a multi-GB download — code execution, central §9) · "Workflow / edit / translate / References" sections (ASK
> steps clash with TEAM_RULES 13.3; translate-from-English clashes with thai-copy "write Thai first") · `register.md`
> (exclamation marks, slang, CTA and bracket-gloss registers we never write; the one register we use is the shop voice in THAI_STYLE §2) ·
> `examples.md` (illustrative invented numbers) · `exemplars.md` (other brands' copyrighted excerpts, one superlative claim).
> Pointers inside the kept files to `register.md`, `examples.md`, the `kode-thai` loop or `corpus/` = not here; the audit
> loop here is thai-copy + skill `thai-check`.

# How OKami24 uses this (wins over the upstream text below)

1. Write or edit with `docs/THAI_STYLE.md` and `.claude/agents/thai-copy.md` first (voice, locked words, forbidden words,
   word-break rules). Then run this file's frames f1–f7 and `references/ai-tells.md` · `grammar.md` · `forbidden-phrases.md` ·
   `craft.md` · `style-rules.md` as an audit pass on every sentence; fix what they flag unless a rule below says otherwise.
2. Facts never change in the audit: numbers, model names, maker claims stay exactly as the source says (thai-check).
3. Shop vernacular wins over the classifier rule: "พอต 1 ตัว" stays (THAI_STYLE §2).

**Upstream rules NOT used here — THAI_STYLE / thai-copy decide instead:**
- Loan words: the four-bucket guide, Bucket 2 "transliterate a brand with the Latin name in brackets", Bucket 4
  coin-and-gloss, `inline-def-parenthetical`, `parenthetical-aside`, `foreign-name-format` → THAI_STYLE §2 four layers
  (brand and model names in English; no bracket that explains a term, owner 04/10).
- `mai-yamok-spacing` without a space → always a space before ๆ (THAI_STYLE §4).
- An exclamation mark anywhere, `cta-bang` / `generic-reassurance` "softened", CTA models (`ลองใช้ฟรี…`) → no exclamation mark, no selling CTA, no
  free/trial offer; ordering points to LINE only.
- `empty-intensifier` leaving `อย่างมีประสิทธิภาพ` alone, and `ที่แท้จริง…เสมอ` as praise → both are filler / guarantee
  wording we cut (thai-copy · THAI_STYLE §3).
- `numeric-anchor` → a number only from a verified spec row (thai-check); never an invented one.
- "ASK the user" for register, voice or gender → the shop voice is fixed; taste is picked, not asked (TEAM_RULES 13.3).
- `เช็ค → ตรวจสอบ` (Register 6) → "เช็ค" stays (THAI_STYLE §5).

---

# kien-thai (upstream text from here — kept word for word except the "!" lines named above)

## Why this skill exists

AI-produced Thai imports English's discourse mechanics whole-cloth and adds
politeness/connective padding by default. Native readers feel the friction —
re-reading, skimming, abandoning. Surface-level rules ("don't use ทั้งนี้")
treat symptoms; the seven frames below are the structural cause. Granular
rules in `references/ai-tells.md` (mechanical), `references/grammar.md`
(surface), and `references/craft.md` (taste) become applications of the
frames — many auto-resolve once the frames are right.


### `f1` *(frame · all-registers · structural)*

**Frame 1 — Topic-comment over subject-verb-object.** English defaults to SVO.
Thai often fronts the topic (whatever the sentence is *about*)
and then comments on it. When the English source has a heavy subject ("the fact that
X is..."), calquing it into Thai produces `การที่...นั้น...` chains that no Thai
reader produces unprompted.

- English (SVO): `The system processes this data every five minutes.`
- Calqued: `ระบบประมวลผลข้อมูลพวกนี้ทุก ๆ 5 นาที`
- Topicalized: `ข้อมูลพวกนี้ ระบบจะ process ทุก 5 นาที`

Heuristic: if the English subject is heavy, abstract, or really the patient of the
verb, front it as topic in Thai.

Covers `non-adversative-thuk` (ถูก-passive) and `garn-thi-tham-hai` (การที่...ทำให้).

### `f2` *(frame · all-registers · structural)*

**Frame 2 — Condition, time, and frame go first.** English puts conditions and
time-frames after the main clause: "X happens when Y" /
"X if Y". Thai prefers the inverse: condition first, main clause after.

- English: `The DB starts timing out when traffic spikes.`
- Calqued: `DB จะเริ่ม timeout เมื่อ traffic พุ่งสูง`
- Native: `พอ traffic พุ่งสูง DB ก็เริ่ม timeout`

Common Thai openers for fronted conditions/times: `พอ...ก็...`, `ถ้า...จะ...`,
`เมื่อ...`, `ตอน...`, `หาก...`.

Covers `tirai-frame-closure`, `frame-scoped-ko`, and `whenever-calque` —
conditional frames require paired closure/linker (see `references/grammar.md`,
`references/ai-tells.md`).

### `f3` *(frame · all-registers · structural)*

**Frame 3 — Sentence boundaries via space and paragraph, not period.**
English uses a period after every sentence. Modern Thai web writing
(blog, marketing, explainer, news) uses periods sparingly. Sentence boundaries are
carried by spaces and paragraph breaks; periods are reserved for end-of-paragraph
snap or genuinely terminal statements.

- AI density: `ระบบทำงานเร็วขึ้น. ใช้ memory น้อยลง. ทีมพอใจมาก.`
- Native: `ระบบทำงานเร็วขึ้น ใช้ memory น้อยลง ทีมพอใจมาก`

Heuristic: drop mid-paragraph periods; let space carry the boundary. Keep periods
only where a snap or finality is genuinely intended.

The Royal Institute's *หลักเกณฑ์การเว้นวรรค* formalizes a two-tier space system —
clause-internal vs sentence boundary. Modern keyboards emit a single ASCII space
either way, so the distinction surfaces as visual rhythm. Treat: short single
space within a clause; paragraph break at sentence boundaries.

Covers `mid-paragraph-period` (period spam — see `references/ai-tells.md`).

### `f4` *(frame · all-registers · structural)*

**Frame 4 — Closure via sentence-final particles.** English doesn't need
closure particles. Thai uses a small inventory of them to wrap
clauses cleanly: `ด้วย` (also/too — closes additive thoughts), `แล้ว` (completion,
transition), `ไป` (movement away/done), `อยู่` (ongoing state), `เลย` (intensification
or "right then"), `ก็แล้วกัน` (let's just leave it / decision), `อยู่ดี`
(still / nonetheless), `ต่างหาก` (contrastive correction — "actually X, not Y").

Note on `แล้ว` variants (per Olsson 2013 on Thai iamitive): bare `แล้ว`
(`f4/laeo-completion`) alone marks completion / "by now". `X แล้ว ก็ Y` adds
sequence + pacing (see Frame 6). `เสร็จแล้ว` (`f4/set-laeo-perfective`) is the
perfective-completion variant — action finished, with finality beyond just temporal
completion. Pick the form that matches whether the close needs pure completion,
sequenced flow, or finished-action force.

When AI omits these because the English source has no equivalent token, Thai
sentences feel dangling — like the writer trailed off.

- Dangling: `repo นี้ไม่ได้มากับกฎอย่างเดียว มี eval harness ผูกกับ claude และ codex`
- Closed: `repo นี้ไม่ได้มากับกฎอย่างเดียว มี eval harness ผูกกับ claude และ codex ด้วย`

**ด้วย additive closure** (`f4/duai-additive`): especially watch for
`ไม่ได้...อย่างเดียว`, `ไม่ใช่แค่...`, `ไม่เพียงแต่...` frames — they almost always
need a closure particle to finish the implicit "also Y".

**ต่างหาก closure** (`f4/targhak-closure`): contrastive correction frames
(`ไม่ได้ X อยู่ที่/เป็น/คือ Y`) take `ต่างหาก` — Thai's emphatic-correction particle
that closes the "actually it's Y, not X" thought.

- Dangling: `ปัญหาส่วนใหญ่ไม่ได้อยู่ที่ยอดขาย อยู่ที่ต้นทุน`
- Closed: `ปัญหาส่วนใหญ่ไม่ได้อยู่ที่ยอดขาย อยู่ที่ต้นทุนต่างหาก`

Covers `dangling-additive-frame` and `seam-connective-missing` (audit-mode
catches for the missing-between-clause-beat family).

### `f5` *(frame · all-registers · structural)*

**Frame 5 — Cohesion via zero anaphora and demonstratives.** English needs
explicit pronouns: *it / they / he / she / this / that*. Thai has three
main strategies that AI underuses:

1. **Zero anaphora** (`f5/zero-anaphora`) — once the topic is established, drop the subject entirely.
   Re-state only when control changes. A paragraph beginning `เราเรียนรู้จากความผิดพลาด...`
   can run several sentences before *เรา* needs to reappear.
2. **Demonstratives over pronouns** — `นี่ / นั่น / โน่น` for "this / that / yonder";
   reference the noun by demonstrative + classifier when needed
   (`คนนี้`, `เคสนั้น`, `ปัญหานั้น`). AI overuses `มัน`, `เขา`, `พวกเขา` because they
   map to English `it / he / they`.
3. **Demonstrative as inter-clause bridge** (`f5/demo-bridge`) — between clauses where English would
   repeat the subject, Thai uses a demonstrative referring back to the just-stated
   fact: `ตรงนี้แหละที่...`, `นี่คือเหตุผลที่...`, `ส่วนนี้...`. Especially valuable
   for problem→solution pivots (see also Frame 7).

   - Dangling: `ของค้างก็กลายเป็นต้นทุนเงียบ ระบบนี้ช่วย...`
   - Bridged: `ของค้างก็กลายเป็นต้นทุนเงียบ ตรงนี้แหละที่ระบบช่วยได้`

<!-- Native side lifted from corpus/curated/tech-writing/somkiat-bun-testing.md;
     Calqued side manufactured by re-inserting `มัน` at each VP head. -->
- Calqued: `bun ได้ปล่อย feature ต่าง ๆ ออกมามากมาย มันปรับปรุงเรื่องของ performance จากการ build มันลดการใช้งาน memory ในขณะ runtime และมันยังปรับปรุงแนวทางการทดสอบอีกด้วย`
- Native: `bun ได้ปล่อย feature ต่าง ๆ ออกมามากมาย ทั้งการปรับปรุงเรื่องของ performance จากการ build และลดการใช้งาน memory ในขณะ runtime รวมทั้งยังได้ปรับปรุงแนวทางการทดสอบอีกด้วย`

**Caveat — zero anaphora has limits.** Aggressive subject-drop creates subjectless
robot-prose when the referent isn't recoverable from context. If a clause starts
with a connective (`เพราะ...`, `ดังนั้น...`, `ส่วน...`) and immediately presents a
verb without a topic, restore reference via a demonstrative bridge or a
topic-comment restructure rather than reaching for `มัน` (banned by `dummy-man`).

- Robot: `เพราะรับประกัน output rate`
- Native (bridge): `เพราะแบบนี้ output rate จะคงที่`
- Native (restored topic): `algorithm นี้รับประกัน output rate`

### `f6` *(frame · all-registers · structural)*

**Frame 6 — Pacing via ก็.** `ก็` is a uniquely Thai pacing particle. It marks
expectation, sequence, mild
concession, and "as expected" causation. English has no direct equivalent, so AI
drops it, and Thai prose without ก็ reads choppy or robotic.

- Without ก็: `พอ traffic ขึ้น DB เริ่มอืด`
- With ก็: `พอ traffic ขึ้น DB ก็เริ่มอืด`

**ก็ as pacing particle** (`f6/ko-pacing`). Common patterns: `พอ X ก็ Y`, `X แล้ว ก็ Y`, `ถ้า X ก็ Y`, `เลย...ก็...`,
`X ไม่ทัน ก็เลย Y`. Standalone `แล้ว` (without `ก็`) also bridges sequenced action
clauses where English would use no connective:

- Choppy: `ถ่ายรูปบิลจากตลาด ระบบอ่านรายการให้เอง`
- Bridged: `ถ่ายรูปบิลแล้วระบบจะอ่านรายการให้เอง`

**Sub-pattern: ก็ as topic-resumptive bridge** (`f6/ko-resumptive`; formalized in
Takahashi 2023 on ก็ as a pragmatic particle). When a sentence states a topic and then offers a
comment that would otherwise feel clipped, ก็ at the start of the comment gives
the natural "as expected / belongs together" beat. AI tends to write the comment
without ก็ and produce a snap that lands wrong.

- Clipped: `ในรายการนี้ ไม่มีคอลัมนิสต์ดังคนไหน เป็นความตั้งใจ`
- Bridged: `ในรายการนี้ ไม่มีคอลัมนิสต์ดังคนไหน ก็เป็นความตั้งใจ`

Use ก็ as breath/rhythm, not as a connective replacement. Don't force it where it
doesn't fit; do allow it where Thai naturally wants the beat.

### `f7` *(frame · all-registers · structural)*

**Frame 7 — Pivots via question, demonstrative, or simple แต่.** English pivots
between ideas using formal connectives: *however*, *moreover*,
*on the other hand*, *furthermore*. Thai prose pivots more often via:

1. **Rhetorical question** (`f7/question-pivot`) — `แล้วถ้า X ล่ะ?`, `นั่นแปลว่ายังไง?`, `ทำไมถึงเป็นแบบนั้น?`.
2. **Demonstrative bridge** (`f7/demo-pivot`) — `ตรงนี้แหละ...`, `นี่คือเหตุผลที่...` (see also Frame 5).
3. **Simple `แต่`** (`f7/tae-pivot`) — replaces `อย่างไรก็ตาม` in roughly half of its English occurrences.

- AI pivot: `อย่างไรก็ตาม การใช้งานในระดับ production มีข้อจำกัด`
- Native pivot: `แต่พอเอาขึ้น production จริง ก็มีอะไรให้ปวดหัวอีก`
- Native (question pivot): `แล้วถ้าโหลดเพิ่มอีกสิบเท่าล่ะ? ตรงนี้แหละที่เริ่มน่าสนใจ`

**Special case — problem-list to solution pivot** (`f7/problem-solution-pivot`). After listing 2–3 reader
pain-points, AI tends to dive straight into the product/solution clause without a
pivot, producing bullet-list cadence. Insert a question pivot, demonstrative bridge,
or contrastive `แต่` to mark the shift.

- Bullet-cadence: `ของหมดก็เสียยอดขาย ของค้างก็กลายเป็นต้นทุนเงียบ ระบบนี้ช่วย...`
- Pivoted (question): `ของหมดก็เสียยอดขาย ของค้างก็กลายเป็นต้นทุนเงียบ — แล้วทำไงให้คุมของได้แม่น?`
- Pivoted (demonstrative): `ของหมดก็เสียยอดขาย ของค้างก็กลายเป็นต้นทุนเงียบ ตรงนี้แหละที่ระบบนี้ช่วยได้`

Heuristic: every "however" you'd write, ask whether a question or just `แต่` would
do better. Drop one in two.

## Person deixis (apply before drafting any piece with a reader)

Identify three roles before drafting: **1st** (speaker), **2nd** (addressee),
**3rd** (product / concept / third party). Most critical for Marketing.

The single rule AI breaks most: **never substitute the audience's demographic
noun** (`เจ้าของร้าน`, `ผู้ใช้`, `นักลงทุน`, `ผู้ประกอบการ`) for `คุณ` in body
copy. Demographic nouns frame headers and categories; `คุณ` is the active
2nd-person referent.

- Bad: `เครื่องมือนี้ทำให้เจ้าของร้านเห็นภาพจริงของร้านตัวเอง`
- Good: `ระบบนี้ช่วยให้คุณเห็นภาพจริงของร้านได้ทันที`

Once a deixis frame is established for a stretch of prose — including the
**implicit-2nd-person** frame where no pronoun is named but the reader is the
addressee — the rest of the passage must hold it (`deixis-continuity` in
register.md). Don't slip an indefinite-someone (`ใคร`, `คน`, `ใครๆ`) into an
implicit-2nd-person passage; promote it to a modifier (`โดยไม่รู้ตัว`) instead.

Full per-register deixis defaults, brand mood / gender / formality voice
attributes, and the Krungsri "body in `เรา`, advisory in `คุณ`" pattern live
in `references/register.md`.

## Stylistic conventions (apply on top of the frames)

Surface-level voice fine-tuning lives in `references/style-rules.md` (positive
rules: sentence shape, verbs over nouns, openers/closings, concreteness, voice,
ทับศัพท์, translation craft) and `references/craft.md` (soft taste rules).

