# Batches 3+4 — known-answer test on round data 2

Before = build of `0ef8c0f` (round data 2's base, in worktree `_incoming/tools-round/wt-before`, served on 3412 from its
build copy) · After = live okami24.store (= `08ed625` / `e05a6ab`; `git diff 08ed625 e05a6ab -- src public` empty).
Scans: `data2-before/` and `data2-after/` — 104 pages × th,en,zh × 390,1440 = 624 files each, 0 failures.

## tier-b-proof (visible-text diff) — `data2-diff/`
First diff: 990 changes / 222 groups; most were "20Flavor" → "20 Flavor" style whitespace between sibling elements
(same screen). Fix: the comparison ignores whitespace (header of scripts/visible-text.js says why). Re-diff:
**612 changes in 189 distinct groups, 24 pages, 0 one-side files.**

Answer set = `_incoming/round-data2/cards-diff-th.md` + `cards-diff-enzh.md` (9 distinct card changes):
| answer (card) | found as |
|---|---|
| iqosheet-16 390 «2380mAh»→«3 สี», 1440 «แบต 2380mAh·3 สี»→«3 สี» | groups 7 (390) + 5/6 (1440: "แบต 2380mAh" and "·" removed; "3 สี" unchanged once whitespace is ignored) — th/en/zh |
| iqosheet-18 390 «»→«2 สี» (1440 unchanged) | group 8 (+ en/zh 4/12) · 1440 correctly NOT reported |
| coil-54, coil-55 «»→«ความจุ 2mL» both widths | groups 15/16 (+ en/zh) |
| coil-94, coil-1, coil-72 390 «»→«4 ค่าโอห์ม» | group 20 (+ en/zh) |
| coil-38 390 «»→«2 ค่าโอห์ม» | group 28 (+ en/zh) |
| coil-68 390 «»→«ความจุ 3.5mL», 1440 «1 สี»→«ความจุ 3.5mL·1 สี» | groups 29 (390), 26 + 27 "·" (1440) (+ en/zh) |
All 9 found; nothing in the answer set missed.

Changes beyond the answer set (all explained — none is a regression):
- coil-54/55/68 product pages: new spec rows + a "Specifications" / "Reference sources" block with the maker URLs
  (round data 2 batch 1 "new spec rows") · coil-87: row "การเชื่อมต่อ: แม่เหล็ก" removed (batch 2) · iqosheet-16/18:
  battery rows rewritten/added (batch 2).
- iqosheet-18: a related-guide link "อ่านต่อ → วิธีดูแลแบตเตอรี่และการชาร์จ" appeared — a side effect of the new battery
  row (the guide box keys on battery); **not listed in round data 2's owner-table**.
- **Finding (live site, not fixed — site untouchable this round): 10 new Thai strings are shown to English and Chinese
  visitors** on coil-54/55/68 + iqosheet-16/18 (the new spec rows have no en/zh text): ความจุ · คอยล์ในกล่อง ·
  หัวพอตเปล่า ใช้กับคอยล์ SPL10 · 3.5mL (รุ่นมาตรฐาน) เติมด้านบน · หัวพอตเปล่า ใช้กับคอยล์ ITO · ใช้ได้กับ ·
  แบตเตอรี่กล่องชาร์จ (Pocket Charger) · 2700mAh ชาร์จเต็มประมาณ 135 นาที · แบตเตอรี่ตัวสูบ (Holder) · ผ่านสาย USB-C (มีในกล่อง).
  Same class as the carried "Shipnity Thai on en/zh" item; round data 2's own gates did not see it.

Shot plan (`data2-diff/shots.md`): first version = 1 image per distinct group = 210 → over 13.10 #15. Now: Thai only
(en/zh proven word for word by changes.md), fewest pages covering every change, one image per page section →
**28 images (6 before · 22 after)**, each tied to its change groups.

## merge-pack — `../b4/data2-owner-table.md`
Built from data2-diff + head-audit before (`b4/data2-head-before`, 3412) / after (`b1/new/head`, live) + round data 2's extras.
Head rows: 2 (coil-87 and iqosheet-16 meta description) = exactly the 2 meta rows of the old owner-table.
Old owner-table ★ items → new table: coil-68 ความจุ / คอยล์ในกล่อง / ใช้ได้กับ → ★18/★13+19/★20+21 · coil-54 คอยล์ในกล่อง → ★13+14 ·
iqosheet-16 two battery rows + charging → ★25–29 · iqosheet-18 same rows → ★28, ★30–32 · wording options (labels,
135 นาที, meta) → the same rows + head rows. **All old ★ items present; none missing.**
Extra in the new table (the old one lacked them): card-line rows ★1–9 (in the old file as a plain table, not ★) · the
iqosheet-18 guide link ★33–36 · the new Specifications/Reference-sources blocks ★10, ★15–17, ★22 · the EN/ZH columns
show the Thai leak above directly.

Rebuild command (merge-pack test):
`node scripts/merge-pack.js --out _incoming/tools-round/b4/data2-owner-table.md --round "round data 2 (test)" --visible _incoming/tools-round/b3/data2-diff --head _incoming/tools-round/b4/data2-head-before _incoming/tools-round/b1/new/head --extras _incoming/round-data2/extras.md`
