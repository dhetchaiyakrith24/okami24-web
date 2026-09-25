#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Owner-rules check (round "owner rules", 2026-09-25) — re-runnable proof that the central file's new §12
// "ทำงานกับเจ้าของ" and the slimmed .claude/TEAM_RULES.md lost nothing:
//   1. every non-empty line of the old central file / old TEAM_RULES that is gone now is listed in
//      scripts/owner-rules-map.json, and its "to" anchor is found verbatim where the map says (lost = 0)
//   2. no map entry points at a line that did not disappear (stale = 0)
//   3. central §12 has exactly the declared number of items, numbered 1..N
//   4. every "หมวด 12 ข้อ N" pointer in TEAM_RULES / agents / skills / docs names an existing item
//   5. .claude/GLOBAL_RULES_MIRROR.md (below its marker) == the central text: .claude/rules/central-rules.md (the
//      synced copy, round "central-rules") or, before the first sync, ~/.claude/CLAUDE.md (skipped when neither)
// Usage: node scripts/owner-rules-check.js [--map=scripts/<map>.json]   · exit 0 = PASS. Line endings ignored.
//   default map = scripts/owner-rules-map.json (round "owner rules", frozen at its close tag)
//   scripts/rules-trim-map.json = round "rules trim" (TEAM_RULES shortened, provenance moved to a log file)
// Map options: "frozen": {"teamRef"} reads TEAM_RULES + mirror from that git tag instead of the working tree (the live
// mirror == central check still runs) · "oldCentralRef" reads the old central text from the mirror at that tag ·
// "logFile" adds a third target "log". Entry kinds (default = anchor: "to" found in "in"):
//   "trim"  — every "removed" piece is verbatim in the old line AND in the log, and the old line with those pieces cut
//             (spaces collapsed) is a line of the new file — proof that only those pieces left the line
//   "moved" — the whole old line is verbatim in the log
//   "reword"— "removed" pieces verbatim in old line + log, and "to" found in "in" (wording change: checker reads it)
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const repo = path.resolve(__dirname, '..');
const norm = (s) => s.replace(/\r\n/g, '\n');
const rd = (p) => norm(fs.readFileSync(p, 'utf8'));
const mapArg = (process.argv.find((a) => a.startsWith('--map=')) || '').slice(6) || path.join('scripts', 'owner-rules-map.json');
const decl = JSON.parse(rd(path.join(repo, mapArg)));
const fails = [];
const fail = (m) => fails.push(m);
const gitShow = (ref, p) => norm(execSync(`git show ${ref}:${p}`, { cwd: repo, encoding: 'utf8' }));
const marker = '<!-- MIRROR-BEGIN -->\n';
const body = (raw, what) => {
  const i = raw.indexOf(marker);
  if (i < 0) { fail(`mirror: marker line missing (${what})`); return ''; }
  return raw.slice(i + marker.length);
};
const squash = (s) => s.replace(/ {2,}/g, ' ').trim();

// inputs
const frozen = decl.frozen || null;
const oldCentral = (decl.oldCentralRef ? body(gitShow(decl.oldCentralRef, '.claude/GLOBAL_RULES_MIRROR.md'), decl.oldCentralRef) : rd(path.join(repo, decl.oldCentral))).split('\n');
const oldTeam = gitShow(decl.oldTeamRef, '.claude/TEAM_RULES.md').split('\n');
const team = frozen ? gitShow(frozen.teamRef, '.claude/TEAM_RULES.md') : rd(path.join(repo, '.claude', 'TEAM_RULES.md'));
const mirror = body(rd(path.join(repo, '.claude', 'GLOBAL_RULES_MIRROR.md')), 'working tree');
// the live central text (round "central-rules", 2026-09-26): the synced copy .claude/rules/central-rules.md (same in
// the cloud); before the first sync, ~/.claude/CLAUDE.md, which then still holds the full text
const copyPath = path.join(repo, '.claude', 'rules', 'central-rules.md');
let central = null;
let centralFrom = '.claude/rules/central-rules.md';
if (fs.existsSync(copyPath)) central = rd(copyPath);
else { centralFrom = '~/.claude/CLAUDE.md'; try { central = rd(path.join(os.homedir(), '.claude', 'CLAUDE.md')); } catch { /* cloud */ } }
const liveCentral = central === null ? mirror : central; // the mirror stands in when the real file is not readable
const centralText = frozen ? body(gitShow(frozen.teamRef, '.claude/GLOBAL_RULES_MIRROR.md'), frozen.teamRef) : liveCentral;
const log = decl.logFile ? rd(path.join(repo, decl.logFile)) : '';
if (frozen) console.log(`frozen at ${frozen.teamRef}: TEAM_RULES + central from git (live mirror sync still checked)`);

// 5. mirror
if (central === null) console.log('central: no .claude/rules/central-rules.md and ~/.claude/CLAUDE.md not readable — mirror used as the central text; mirror sync SKIPPED');
// once the synced copy exists the mirror is superseded (kept only until the cloud test): a later central change makes
// it stale on purpose — reported, not failed. Before the first sync it still has to match ~/.claude/CLAUDE.md.
else if (mirror !== central && centralFrom === '.claude/rules/central-rules.md') console.log('note: GLOBAL_RULES_MIRROR.md differs from the synced copy — superseded mirror, retire it after the cloud test (not a failure)');
else if (mirror !== central) fail(`mirror: GLOBAL_RULES_MIRROR.md differs from ${centralFrom}`);
else console.log(`mirror = ${centralFrom}`);

// 1–2. removed lines vs map
const texts = { central: centralText, team, log };
const newLines = { central: new Set(centralText.split('\n')), team: new Set(team.split('\n')) };
const squashedNew = { central: new Set(centralText.split('\n').map(squash)), team: new Set(team.split('\n').map(squash)) };
const oldLines = { central: oldCentral, team: oldTeam };
let removed = 0; let lost = 0; let stale = 0; const kinds = {};
for (const k of ['central', 'team']) {
  oldLines[k].forEach((l, i) => {
    if (!l.trim() || newLines[k].has(l)) return;
    removed++;
    const at = `${k} line ${i + 1}`;
    const m = decl.map.find((e) => e.file === k && i + 1 >= e.lines[0] && i + 1 <= e.lines[1]);
    if (!m) { lost++; fail(`lost: ${at} gone and not mapped: ${l.slice(0, 70)}`); return; }
    const kind = m.kind || 'anchor';
    kinds[kind] = (kinds[kind] || 0) + 1;
    const bad = (msg) => { lost++; fail(`lost: ${at} (${kind}) ${msg}`); };
    if (kind === 'moved') { if (!log.includes(l.trim())) bad('whole line not found verbatim in the log'); return; }
    for (const p of m.removed || []) {
      if (!l.includes(p)) bad(`piece not in the old line: "${p.slice(0, 50)}"`);
      const core = p.replace(/^[\s·—(]+|[\s·—):]+$/g, ''); // separators around a cut piece are not provenance
      if (core && !log.includes(core)) bad(`piece not in the log: "${core.slice(0, 50)}"`);
    }
    if (kind === 'trim') {
      let rest = l;
      for (const p of m.removed || []) rest = rest.replace(p, '');
      if (!squashedNew[k].has(squash(rest))) bad(`old line minus the pieces is not a line of the new file: "${squash(rest).slice(0, 70)}"`);
      return;
    }
    if (!texts[m.in].includes(m.to)) bad(`mapped to "${m.to.slice(0, 50)}" — not found in ${m.in}`);
  });
}
for (const m of decl.map) {
  const anyGone = [];
  for (let n = m.lines[0]; n <= m.lines[1]; n++) {
    const l = oldLines[m.file][n - 1];
    if (l !== undefined && l.trim() && !newLines[m.file].has(l)) anyGone.push(n);
  }
  if (!anyGone.length) { stale++; fail(`stale map entry: ${m.file} lines ${m.lines.join('-')} did not disappear`); }
}

// 3. §12 items
const c = centralText.split('\n');
const s12 = c.findIndex((l) => /^## 12\\\. /.test(l));
const items = s12 < 0 ? [] : c.slice(s12).map((l) => (l.match(/^(\d+)\. /) || [])[1]).filter(Boolean).map(Number);
if (s12 < 0) fail('§12: heading "## 12\\." not found in the central text');
else if (items.length !== decl.sectionItems || items.some((n, i) => n !== i + 1)) fail(`§12: items ${items.join(',')} — expected 1..${decl.sectionItems}`);

// 4. pointers into §12
const skip = new Set(['node_modules', '.git', '.next', '_incoming', 'archive']);
let ptrs = 0;
// the central file points into its own §12 from §1–11 — check those too
centralText.split('\n').forEach((l, i) => {
  for (const m of l.matchAll(/หมวด 12 ข้อ ((?:\d+(?:–\d+)?)(?:\s*·\s*\d+(?:–\d+)?)*)/g)) {
    for (const part of m[1].split('·')) {
      const [a, b] = part.trim().split('–').map(Number);
      for (let n = a; n <= (b || a); n++) { ptrs++; if (n < 1 || n > decl.sectionItems) fail(`pointer: central line ${i + 1} names หมวด 12 ข้อ ${n}`); }
    }
  }
});
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!(dir === repo && ['src', 'public', 'data', 'db'].includes(e.name))) walk(p); continue; }
    if (!e.name.endsWith('.md')) continue;
    rd(p).split('\n').forEach((l, i) => {
      for (const m of l.matchAll(/หมวด 12 ข้อ ((?:\d+(?:–\d+)?)(?:\s*·\s*\d+(?:–\d+)?)*)/g)) {
        for (const part of m[1].split('·')) {
          const [a, b] = part.trim().split('–').map(Number);
          for (let n = a; n <= (b || a); n++) {
            ptrs++;
            if (n < 1 || n > decl.sectionItems) fail(`pointer: ${path.relative(repo, p)}:${i + 1} names หมวด 12 ข้อ ${n}`);
          }
        }
      }
    });
  }
})(repo);

console.log(`map: ${mapArg} · removed lines: ${removed} (${Object.entries(kinds).map(([k, n]) => `${k} ${n}`).join(' · ') || 'none'}) · lost: ${lost} · stale map entries: ${stale} · §12 items: ${items.length} · pointers into §12: ${ptrs}`);
if (fails.length) { console.log(`\nFAIL (${fails.length})`); fails.forEach((m) => console.log(' ' + m)); process.exit(1); }
console.log('\nPASS');
