# OKami24 web shop (okami24.store)

Next.js + TypeScript + Tailwind + SQLite, hosted on Render (not Vercel). Converted from the NOVA VAPOR demo
(create-next-app boilerplate replaced 2026-09-27, round B "housekeeping").

Where things are — each has one home, the others point to it:

- Rules for any assistant working here: `CLAUDE.md` (it loads `.claude/TEAM_RULES.md` and the central-rules copy
  `.claude/rules/central-rules.md`).
- Current state and the paste block for a new chat: `docs/HANDOFF.md` §16 · standing tools and verify commands: §17.
- Business facts (brand, pricing authority, stock, payment): `docs/BUSINESS_SOURCE_OF_TRUTH.md`.
- Working from the cloud (Claude Code on the web): `docs/CLOUD.md` · rollback and recovery: `docs/RECOVERY.md` ·
  deploy: `docs/DEPLOY-RENDER.md`.
- Round instruction files: `docs/rounds/` · round records: `docs/cloud-results/`.

First run on a fresh clone: `node scripts/prepare-clone.js` (ends `prepare-clone: READY`), then `npm run dev`.
