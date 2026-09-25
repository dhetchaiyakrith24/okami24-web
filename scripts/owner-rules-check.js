#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Owner-rules check (round "owner rules", 2026-09-25) — re-runnable proof that the central file's new §12
// "ทำงานกับเจ้าของ" and the slimmed .claude/TEAM_RULES.md lost nothing:
//   1. every non-empty line of the old central file / old TEAM_RULES that is gone now is listed in
//      scripts/owner-rules-map.json, and its "to" anchor is found verbatim where the map says (lost = 0)
//   2. no map entry points at a line that did not disappear (stale = 0)
//   3. central §12 has exactly the declared number of items, numbered 1..N
//   4. every "หมวด 12 ข้อ N" pointer in TEAM_RULES / agents / skills / docs names an existing item
//   5. .claude/GLOBAL_RULES_MIRROR.md (below its marker) == ~/.claude/CLAUDE.md (skipped when unreadable)
// Usage: node scripts/owner-rules-check.js   · exit 0 = PASS. Line endings ignored.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const repo = path.resolve(__dirname, '..');
const norm = (s) => s.replace(/\r\n/g, '\n');
const rd = (p) => norm(fs.readFileSync(p, 'utf8'));
const decl = JSON.parse(rd(path.join(repo, 'scripts', 'owner-rules-map.json')));
const fails = [];
const fail = (m) => fails.push(m);

// inputs
const oldCentral = rd(path.join(repo, decl.oldCentral)).split('\n');
const oldTeam = norm(execSync(`git show ${decl.oldTeamRef}:.claude/TEAM_RULES.md`, { cwd: repo, encoding: 'utf8' })).split('\n');
const team = rd(path.join(repo, '.claude', 'TEAM_RULES.md'));
const mirrorRaw = rd(path.join(repo, '.claude', 'GLOBAL_RULES_MIRROR.md'));
const marker = '<!-- MIRROR-BEGIN -->\n';
const mi = mirrorRaw.indexOf(marker);
if (mi < 0) fail('mirror: marker line missing');
const mirror = mi < 0 ? '' : mirrorRaw.slice(mi + marker.length);
let central = null;
try { central = rd(path.join(os.homedir(), '.claude', 'CLAUDE.md')); } catch { /* cloud */ }
const centralText = central === null ? mirror : central; // the mirror stands in when the real file is not readable

// 5. mirror
if (central === null) console.log('central: ~/.claude/CLAUDE.md not readable here — mirror used as the central text; mirror sync SKIPPED');
else if (mirror !== central) fail('mirror: GLOBAL_RULES_MIRROR.md differs from ~/.claude/CLAUDE.md');

// 1–2. removed lines vs map
const texts = { central: centralText, team };
const newLines = { central: new Set(centralText.split('\n')), team: new Set(team.split('\n')) };
const oldLines = { central: oldCentral, team: oldTeam };
let removed = 0; let lost = 0; let stale = 0;
for (const k of ['central', 'team']) {
  oldLines[k].forEach((l, i) => {
    if (!l.trim() || newLines[k].has(l)) return;
    removed++;
    const m = decl.map.find((e) => e.file === k && i + 1 >= e.lines[0] && i + 1 <= e.lines[1]);
    if (!m) { lost++; fail(`lost: ${k} line ${i + 1} gone and not mapped: ${l.slice(0, 70)}`); return; }
    if (!texts[m.in].includes(m.to)) { lost++; fail(`lost: ${k} line ${i + 1} mapped to "${m.to.slice(0, 50)}" — not found in ${m.in}`); }
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

console.log(`removed lines: ${removed} · lost: ${lost} · stale map entries: ${stale} · §12 items: ${items.length} · pointers into §12: ${ptrs}`);
if (fails.length) { console.log(`\nFAIL (${fails.length})`); fails.forEach((m) => console.log(' ' + m)); process.exit(1); }
console.log('\nPASS');
