#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Central-rules copy gate (round "central-rules", 2026-09-26). Run by .github/workflows/central-rules-copy.yml on every
// push and PR (a required check on main), and by hand.
//
// .claude/rules/central-rules.md is a byte copy of CLAUDE.md in the rules repo, sent here by that repo's sync workflow
// together with .claude/rules-source.json (source commit + sha256). A copy edited by hand must never reach main:
//   1. .claude/rules/ holds nothing but central-rules.md (every .md there is loaded into every chat)
//   2. copy present ⇔ rules-source.json present; its source_repo is the one rules repo below (not any repo)
//   3. sha256 of the copy's bytes == rules-source.json sha256
//   4. (remote) the bytes equal CLAUDE.md of the rules repo at source_commit, and that commit is on the rules repo's
//      main — so the copy is a real, merged version, whoever made the commit (no branch-name or author trust)
//   5. the copy may not disappear: if the base branch has one, this tree must too
// No copy yet (first run, before the first sync) = PASS with a notice, as long as the base has none either.
// Remote steps need RULES_READ_TOKEN (read-only on the rules repo). Without it: in CI = FAIL; by hand = SKIPPED (not a
// pass — printed). Usage: node scripts/central-rules-copy-check.js [--base=<ref>]   · exit 0 = PASS.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const SOURCE_REPO = 'dhetchaiyakrith24/smogz-rules';
const SOURCE_PATH = 'CLAUDE.md';
const SOURCE_BRANCH = 'main';
const repo = path.resolve(__dirname, '..');
const rulesDir = path.join(repo, '.claude', 'rules');
const COPY = '.claude/rules/central-rules.md';
const META = '.claude/rules-source.json';
const inCI = process.env.GITHUB_ACTIONS === 'true';
const token = process.env.RULES_READ_TOKEN || '';
const baseArg = (process.argv.find((a) => a.startsWith('--base=')) || '').slice(7) || process.env.BASE_REF || '';

const fails = [];
const notes = [];
const fail = (m) => fails.push(m);
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

function listAll(dir, prefix = '') {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listAll(path.join(dir, e.name), `${prefix}${e.name}/`) : [`${prefix}${e.name}`]);
}

async function gh(url, accept) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: accept, 'X-GitHub-Api-Version': '2022-11-28' } });
  return res;
}

(async () => {
  // 1. only the copy lives in .claude/rules/
  const extra = listAll(rulesDir).filter((f) => f !== 'central-rules.md');
  extra.forEach((f) => fail(`.claude/rules/${f}: only central-rules.md may live in .claude/rules/ (every file there is loaded into every chat) — project rules go in .claude/TEAM_RULES.md`));

  const copyPath = path.join(repo, COPY);
  const metaPath = path.join(repo, META);
  const hasCopy = fs.existsSync(copyPath);
  const hasMeta = fs.existsSync(metaPath);

  // 5. the copy may not disappear
  let baseHasCopy = false;
  if (baseArg) {
    try {
      execFileSync('git', ['cat-file', '-e', `${baseArg}:${COPY}`], { cwd: repo, stdio: 'ignore' });
      baseHasCopy = true;
    } catch { /* base has no copy (or base not fetched) */ }
  } else notes.push('no --base given: "copy may not disappear" not checked');

  if (!hasCopy && !hasMeta) {
    if (baseHasCopy) fail(`${COPY} is gone but ${baseArg} has it — the central rules would stop loading`);
    else notes.push('no copy yet (before the first sync) — nothing else to check');
    return;
  }
  // 2. both files together, right source
  if (hasCopy !== hasMeta) { fail(`${COPY} and ${META} must come together (only one is here)`); return; }
  let meta;
  try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')); } catch (e) { fail(`${META}: not valid JSON (${e.message})`); return; }
  if (meta.source_repo !== SOURCE_REPO || meta.source_path !== SOURCE_PATH) fail(`${META}: source must be ${SOURCE_REPO}/${SOURCE_PATH}, found ${meta.source_repo}/${meta.source_path}`);
  if (!/^[0-9a-f]{40}$/.test(meta.source_commit || '')) fail(`${META}: source_commit is not a full commit hash`);

  // 3. local bytes vs recorded sha256
  const copy = fs.readFileSync(copyPath);
  const localSum = sha(copy);
  if (localSum !== meta.sha256) fail(`${COPY}: sha256 ${localSum.slice(0, 12)}… ≠ ${META} ${String(meta.sha256).slice(0, 12)}… — the copy was changed after the sync (or line endings were converted)`);
  else notes.push(`copy sha256 ${localSum.slice(0, 12)}… = rules-source.json · source ${meta.source_repo}@${String(meta.source_commit).slice(0, 7)}`);
  if (fails.length) return;

  // 4. remote: bytes equal the source at that commit, and that commit is on the source main
  if (!token) {
    if (inCI) fail('secret RULES_READ_TOKEN is missing — the copy cannot be compared with the rules repo');
    else notes.push('RULES_READ_TOKEN not set — remote comparison SKIPPED (not a pass)');
    return;
  }
  const api = `https://api.github.com/repos/${SOURCE_REPO}`;
  const raw = await gh(`${api}/contents/${SOURCE_PATH}?ref=${meta.source_commit}`, 'application/vnd.github.raw');
  if (raw.status === 401 || raw.status === 403) { fail(`RULES_READ_TOKEN rejected (HTTP ${raw.status}) — expired or no access to ${SOURCE_REPO}`); return; }
  if (!raw.ok) { fail(`could not read ${SOURCE_PATH} at ${meta.source_commit} from ${SOURCE_REPO} (HTTP ${raw.status})`); return; }
  const src = Buffer.from(await raw.arrayBuffer());
  if (!src.equals(copy)) fail(`${COPY} differs from ${SOURCE_REPO}/${SOURCE_PATH}@${meta.source_commit.slice(0, 7)} (sha256 ${sha(src).slice(0, 12)}… vs ${localSum.slice(0, 12)}…)`);
  else notes.push(`bytes = ${SOURCE_REPO}/${SOURCE_PATH}@${meta.source_commit.slice(0, 7)} (${copy.length} bytes)`);
  const cmp = await gh(`${api}/compare/${meta.source_commit}...${SOURCE_BRANCH}`, 'application/vnd.github+json');
  if (!cmp.ok) { fail(`could not compare ${meta.source_commit.slice(0, 7)} with ${SOURCE_BRANCH} (HTTP ${cmp.status})`); return; }
  const c = await cmp.json();
  if (c.status !== 'identical' && c.status !== 'ahead') fail(`source commit ${meta.source_commit.slice(0, 7)} is not on ${SOURCE_REPO} ${SOURCE_BRANCH} (compare status: ${c.status}) — only merged versions may be copied`);
  else if (c.status === 'ahead') notes.push(`${SOURCE_REPO} ${SOURCE_BRANCH} is ${c.ahead_by} commit(s) past this copy's source — a newer sync PR may be waiting`);
  const exp = raw.headers.get('github-authentication-token-expiration');
  if (exp) {
    const days = Math.floor((Date.parse(exp.replace(' UTC', 'Z').replace(' ', 'T')) - Date.now()) / 86400000);
    notes.push(`RULES_READ_TOKEN expires ${exp} (${days} days)`);
    if (days < 21 && process.env.GITHUB_EVENT_NAME === 'schedule') fail(`RULES_READ_TOKEN expires in ${days} days — renew it (rules repo README, "กุญแจ")`);
  }
})().then(() => {
  notes.forEach((n) => console.log(`note: ${n}`));
  if (fails.length) {
    console.log(`\nFAIL (${fails.length})`);
    fails.forEach((m) => { console.log(` ${m}`); if (inCI) console.log(`::error::${m}`); });
    process.exit(1);
  }
  console.log(notes.some((n) => n.includes('SKIPPED')) ? '\nPASS (local checks only — remote comparison SKIPPED)' : '\nPASS');
}).catch((e) => { console.error(`error: ${e.message}`); process.exit(2); });
