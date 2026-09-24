@AGENTS.md

@.claude/TEAM_RULES.md

กฎการทำงานของทีม = หมวด 13 ที่ `.claude/TEAM_RULES.md` (ดึงเข้ามาที่บรรทัดบน · ย้ายจาก `~/.claude/CLAUDE.md` 2026-09-25) ·
หมวด 1–11 ยังอยู่ที่ `~/.claude/CLAUDE.md` · handoff ในรีโปนี้ = สกิล `okami24-handoff` เท่านั้น

`AGENTS.md` (imported on line 1, rewritten by `next dev`) binds only when code under `src/` is being changed; on a round that
does not touch `src/` its Next.js reading list does not apply. If `next dev` rewrites `AGENTS.md`, commit that change as a
separate `chore` commit, never inside a feature commit (RULES_INDEX row 69, 2026-09-17).

# Business context

This project is being converted from the NOVA VAPOR demo into the production website for
**OKami24**. Before making any production/business/architecture decision (catalog data
model, pricing, stock, checkout flow, customer accounts, etc.), read
[docs/BUSINESS_SOURCE_OF_TRUTH.md](docs/BUSINESS_SOURCE_OF_TRUTH.md) — it is the
authoritative source for brand, product-source-of-truth, pricing authority, stock policy,
payment model, and known TBDs. Do not infer or invent business rules; if something isn't
covered there, treat it as unresolved rather than guessing.

**Catalog completeness rule (owner, 2026-09-06):** every product must show **every colour and every
flavour the manufacturer offers, even ones the shop has no stock of**. Never drop a colour/flavour/image
because "we don't sell it" — stock, "Sold out" and greyed-out states are the cart/stock system's job
later, not a reason to cut catalog truth. Image standards live in `docs/IMAGE_SPEC.md`.

If instructions conflict, resolve in this order: (1) the current user's explicit instruction in chat,
(2) the team rules — `.claude/TEAM_RULES.md` (section 13, incl. its web-specific §3/§6/§8 block) first, then
`~/.claude/CLAUDE.md` §1–11; where they differ, the exceptions written in section 13 (13.9 · 13.7 · 13.10) win over
§1–11, exactly as when both lived in one file, (3) `docs/BUSINESS_SOURCE_OF_TRUTH.md` — a conflict with it is
not resolved silently, it is a stop-and-ask case (13.4 #5), (4) `docs/THAI_STYLE.md` for anything about
Thai wording on the site, (5) this file, (6) implementation assumptions. Never silently overwrite business
rules in the source-of-truth doc. (RULES_INDEX row 15, owner ruling 2026-09-17)
