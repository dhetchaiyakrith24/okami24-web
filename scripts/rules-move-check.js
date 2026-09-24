#!/usr/bin/env node
// Rules-move check (round "rules move", 2026-09-25) — criterion (ก) of the round file, re-runnable.
//
// Proves that moving section 13 of ~/.claude/CLAUDE.md into .claude/TEAM_RULES.md lost nothing:
//   1. coverage   — every non-empty line of the pre-move backup lands in the (expected) central file or in
//                   TEAM_RULES: lost = 0, duplicated = 0; §1–11 changes only where scripts/rules-move-declared.json says
//   2. mirror     — .claude/GLOBAL_RULES_MIRROR.md (below its marker) equals the post-edit central text
//   3. central    — mode "pre": ~/.claude/CLAUDE.md still equals the backup (untouched before stop point 2)
//                   mode "post": ~/.claude/CLAUDE.md equals the expected post-edit text exactly
//                   (not readable, e.g. a cloud session = reported as skipped, not as pass)
//   4. pointers   — no "~/.claude/CLAUDE.md 13.x" left outside docs/archive/ and docs/RULES_INDEX.md (whose old rows
//                   are covered by its mapping note), no live pointer to ~/.claude/skills/handoff
//   5. 13.x exist — every "13.N" cited in rule/agent/skill/docs files is a heading in TEAM_RULES
//   6. skills     — every skill named as a skill has a folder under .claude/skills/
//
// Usage: node scripts/rules-move-check.js [--mode=pre|post|auto]   (auto = post when the central file has no
// "## 13\." heading). Exit 0 = all checks pass. Line endings are ignored everywhere (autocrlf=true).
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const repo = path.resolve(__dirname, '..');
const rd = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const decl = JSON.parse(rd(path.join(repo, 'scripts', 'rules-move-declared.json')));
const modeArg = (process.argv.find((a) => a.startsWith('--mode=')) || '--mode=auto').slice(7);

const fails = [];
const fail = (check, msg) => fails.push(`[${check}] ${msg}`);
const counts = {};
const bump = (k, n = 1) => { counts[k] = (counts[k] || 0) + n; };

// ---------- inputs
const backup = rd(path.join(repo, decl.backup)).split('\n');
const teamRules = rd(path.join(repo, '.claude', 'TEAM_RULES.md')).split('\n');
const mirrorRaw = rd(path.join(repo, '.claude', 'GLOBAL_RULES_MIRROR.md'));
const marker = '<!-- MIRROR-BEGIN -->\n';
const at = (re) => backup.findIndex((l) => re.test(l));
const s13 = at(/^## 13\\\. /);
const endOf11 = at(/^ห้ามรายงานยาวกว่านี้ถ้าไม่จำเป็น$/);
if (s13 < 0 || endOf11 < 0 || endOf11 > s13) { console.error('backup markers not found'); process.exit(2); }

// expected post-edit central = backup lines 1..endOf11 with the declared edits
for (const d of decl.centralEdits) {
  if (backup[d.line - 1] !== d.before) fail('declared', `line ${d.line}: "before" is not the backup line`);
}
const expectedCentral = backup.slice(0, endOf11 + 1).map((l, i) => {
  const d = decl.centralEdits.find((e) => e.line === i + 1);
  return d ? d.after : l;
});
const expectedCentralText = expectedCentral.join('\n') + '\n';

// ---------- 3. central file (read first: decides the mode)
const centralPath = path.join(os.homedir(), '.claude', 'CLAUDE.md');
let central = null;
try { central = rd(centralPath); } catch { /* cloud / other machine */ }
let mode = modeArg;
if (mode === 'auto') mode = central && !/^## 13\\\. /m.test(central) ? 'post' : 'pre';
if (central === null) {
  console.log('central: ~/.claude/CLAUDE.md not readable here — SKIPPED (not a pass)');
} else if (mode === 'pre') {
  if (central !== backup.join('\n')) fail('central', 'mode pre: ~/.claude/CLAUDE.md differs from the backup (touched before stop point 2?)');
} else if (central !== expectedCentralText) {
  const a = central.split('\n');
  const i = a.findIndex((l, k) => l !== expectedCentral[k]);
  fail('central', `mode post: ~/.claude/CLAUDE.md differs from the expected post-edit text (first diff at line ${i + 1})`);
}
// the text the coverage check runs against: the real file after stop point 2, the simulated one before
const centralLines = mode === 'post' && central !== null ? central.replace(/\n$/, '').split('\n') : expectedCentral;

// ---------- 1. coverage
const isStructural = (l) => /^(\\?---|```.*|>?\s*)$/.test(l.trim());
const inSet = (arr) => { const m = new Map(); arr.forEach((l) => m.set(l, (m.get(l) || 0) + 1)); return m; };
const cSet = inSet(centralLines);
const tSet = inSet(teamRules);
const region11 = new Set(backup.slice(0, s13).filter((l) => l.trim()));
const region13 = new Set(backup.slice(s13).filter((l) => l.trim()));
const befores = new Set(decl.centralEdits.map((d) => d.before));
let nonEmpty = 0;
backup.forEach((l, i) => {
  if (!l.trim()) return;
  nonEmpty++;
  const inC = cSet.has(l);
  const inT = tSet.has(l);
  if (befores.has(l)) {
    if (!inT) { bump('lost'); fail('coverage', `declared line ${i + 1} not found verbatim in TEAM_RULES`); }
    if (inC) { bump('dup'); fail('coverage', `declared line ${i + 1} still in the central text`); }
    return;
  }
  if (!inC && !inT) { bump('lost'); fail('coverage', `backup line ${i + 1} lost: ${l.slice(0, 80)}`); return; }
  if (isStructural(l) || (region11.has(l) && region13.has(l))) return; // separators / lines that were in both halves
  if (inC && inT) { bump('dup'); fail('coverage', `backup line ${i + 1} in both files: ${l.slice(0, 80)}`); }
  if (i >= s13 && inC && !region11.has(l)) { bump('dup'); fail('coverage', `section-13 line ${i + 1} still in the central text`); }
});
decl.centralEdits.forEach((d) => { if (!cSet.has(d.after)) fail('coverage', `declared replacement for line ${d.line} not in the central text`); });
// section 13 must sit in TEAM_RULES as one unbroken block, in order
const sec13 = backup.slice(s13);
while (sec13.length && sec13[sec13.length - 1] === '') sec13.pop();
const start = teamRules.indexOf(sec13[0]);
if (start < 0 || sec13.some((l, k) => teamRules[start + k] !== l)) fail('coverage', 'section 13 is not verbatim and contiguous in TEAM_RULES');
// the central text may differ from backup §1–11 only at the declared lines
if (centralLines.length !== expectedCentral.length || centralLines.some((l, k) => l !== expectedCentral[k])) {
  bump('undeclared'); fail('coverage', 'central text has changes that are not in rules-move-declared.json');
}

// ---------- 2. mirror
const mi = mirrorRaw.indexOf(marker);
const mirrorBody = mi < 0 ? null : mirrorRaw.slice(mi + marker.length);
if (mirrorBody === null) fail('mirror', 'marker line missing');
else if (mirrorBody !== (mode === 'post' && central !== null ? central : expectedCentralText)) fail('mirror', 'GLOBAL_RULES_MIRROR.md differs from the central §1–11 text');

// ---------- files to scan for 4/5/6
const skipDirs = new Set(['node_modules', '.git', '.next', '_incoming', 'archive', 'Claude outputs']);
const exts = new Set(['.md', '.js', '.ts', '.tsx', '.json']);
const scan = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!(dir === repo && ['src', 'public', 'data', 'db'].includes(e.name))) walk(p); }
    else if (exts.has(path.extname(e.name))) scan.push(p);
  }
})(repo);
const rel = (p) => path.relative(repo, p).split(path.sep).join('/');
const allow = (decl.allowLines || []);
const allowed = (file, line) => allow.some((a) => a.file === file && line.includes(a.contains));
const self = new Set(['scripts/rules-move-check.js', 'scripts/rules-move-declared.json']);

// ---------- 4. pointers
const ptr = /~\/\.claude\/CLAUDE\.md`?\s*(?:§|หมวด |section |ข้อ |\*\*)?13\b/;
const skillPtr = /~\/\.claude\/skills\/handoff/;
const ri = rd(path.join(repo, 'docs', 'RULES_INDEX.md'));
if (!ri.includes('หมายเหตุเทียบทาง (รอบย้ายกฎ 2026-09-25')) fail('pointers', 'RULES_INDEX mapping note missing');
for (const p of scan) {
  const f = rel(p);
  if (self.has(f) || f === 'docs/RULES_INDEX.md') continue;
  rd(p).split('\n').forEach((l, i) => {
    if (allowed(f, l)) return;
    if (ptr.test(l)) { bump('pointer'); fail('pointers', `${f}:${i + 1} still points section 13 at ~/.claude/CLAUDE.md`); }
    if (skillPtr.test(l) && !/ย้ายจาก `?~\/\.claude\/skills\/handoff|ย้าย `?~\/\.claude\/skills\/handoff`? ออก|move `?~\/\.claude\/skills\/handoff`? out|→ `?\.claude\/skills\/okami24-handoff/.test(l)) { bump('pointer'); fail('pointers', `${f}:${i + 1} points at ~/.claude/skills/handoff`); }
  });
}

// ---------- 5. every cited 13.N exists
const heads = new Set(teamRules.map((l) => (l.match(/^### (13\.\d+)\b/) || [])[1]).filter(Boolean));
const cite = /(?:^|[\s(`§*·/,])(13\.(\d{1,2}))(?![\d.]*\s?(?:mm|ml|mL|W|V|Ω|mAh|%|x|บาท))(?!\.\d)/g;
for (const p of scan) {
  const f = rel(p);
  if (!f.endsWith('.md') || !(f.startsWith('.claude/') || f.startsWith('docs/') || f === 'CLAUDE.md')) continue;
  rd(p).split('\n').forEach((l, i) => {
    for (const m of l.matchAll(cite)) {
      bump('cited13');
      if (!heads.has(m[1]) && !allowed(f, l)) { bump('bad13'); fail('13.x', `${f}:${i + 1} cites ${m[1]}, not a heading in TEAM_RULES`); }
    }
  });
}

// ---------- 6. every skill named as a skill has a folder
const skillDirs = new Set(fs.readdirSync(path.join(repo, '.claude', 'skills')));
const skillRe = /(?:skill|สกิล)\s+`([a-z0-9-]+)`|`([a-z0-9-]+)`\s+skill|(?<![\w/~-])\.claude\/skills\/([a-z0-9-]+)\//g;
for (const p of scan) {
  const f = rel(p);
  // RULES_INDEX old rows: the skill rename is covered by its mapping note (checked in 4)
  if (!f.endsWith('.md') || self.has(f) || f === 'docs/RULES_INDEX.md') continue;
  rd(p).split('\n').forEach((l, i) => {
    for (const m of l.matchAll(skillRe)) {
      const name = m[1] || m[2] || m[3];
      if (!name || name === '*') continue;
      bump('skillRefs');
      if (!skillDirs.has(name) && !allowed(f, l)) { bump('badSkill'); fail('skills', `${f}:${i + 1} names skill "${name}" — no .claude/skills/${name}/`); }
    }
  });
}

// ---------- report
console.log(`mode: ${mode} · backup non-empty lines: ${nonEmpty} · §13 lines: ${sec13.length} · declared edits: ${decl.centralEdits.length}`);
console.log(`lost: ${counts.lost || 0} · duplicated: ${counts.dup || 0} · undeclared changes: ${counts.undeclared || 0} · pointers left: ${counts.pointer || 0}`);
console.log(`13.x cited: ${counts.cited13 || 0} (missing: ${counts.bad13 || 0}) · skill refs: ${counts.skillRefs || 0} (missing: ${counts.badSkill || 0}) · 13.x headings: ${[...heads].join(' ')}`);
if (fails.length) { console.log(`\nFAIL (${fails.length})`); fails.forEach((m) => console.log(' ' + m)); process.exit(1); }
console.log('\nPASS');
