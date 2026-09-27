/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// session-sync.js — the SessionStart hook: make this checkout match GitHub before any work starts (round C, topic 1,
// owner 2026-09-27: "a chat opened on the computer gets the latest before it loads the rules · cannot = a loud warning").
//   node scripts/session-sync.js        run by .claude/settings.json at every chat open (computer and cloud)
//   node scripts/session-sync.js --dry  same checks, changes nothing (no fast-forward, no prepare-clone)
// What it does, in order:
//   1 fetch      `git fetch origin` (no prompt; offline = warning)
//   2 update     on a clean branch that is only BEHIND its upstream → `git merge --ff-only` (never a merge commit, never
//                a reset, never touches uncommitted work). Dirty · ahead · diverged · detached = warning, nothing moved.
//   3 re-read    the update changed a file Claude Code loads at chat open (CLAUDE.md · AGENTS.md · TEAM_RULES · memory ·
//                .claude/rules/) → the context lists them: the copy loaded may be the old one, re-read before working.
//   4 drafts     computer only: each round file in the OneDrive draft folder that also exists in git (docs/rounds/ on
//                this checkout, or rounds/ on origin/inbox) must be the same text — a difference = warning.
//   5 probe      writes a fresh nonce to _incoming/session-probe.md, which CLAUDE.md imports — tells whether this hook
//                runs before or after Claude Code reads the rules (not documented; see the block below)
//   6 cloud      CLAUDE_CODE_REMOTE=true → then runs `prepare-clone.js --session-start` (after the fetch, never beside it:
//                two git fetches at once fight over the ref lock).
// Output = the hook JSON: `systemMessage` = one Thai line the owner sees · `additionalContext` = the English lines for
// Friday. Always exits 0 (a SessionStart hook cannot stop a chat; the warning is the stop sign — central §1).
"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DRY = process.argv.includes("--dry");
const CLOUD = process.env.CLAUDE_CODE_REMOTE === "true";
// Files Claude Code reads into context at chat open (repo CLAUDE.md imports + .claude/rules/ auto-load).
const LOADED = [/^CLAUDE\.md$/, /^AGENTS\.md$/, /^\.claude\/TEAM_RULES\.md$/, /^\.claude\/memory\//, /^\.claude\/rules\//];
const DRAFTS =
  process.env.ROUND_DRAFTS_DIR ||
  path.join(os.homedir(), "OneDrive", "Desktop", "Run prompt", "New prompt WEB");

const ENV = { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never", LC_ALL: "C" };
function git(...args) {
  const r = spawnSync("git", args, { cwd: ROOT, encoding: "utf8", env: ENV, timeout: 45000, maxBuffer: 64 * 1024 * 1024 });
  return { ok: r.status === 0, out: (r.stdout || "").trim(), err: `${r.stderr || ""}${r.error ? r.error.message : ""}`.trim() };
}
const short = (ref) => git("rev-parse", "--short", ref).out;
const count = (range) => Number(git("rev-list", "--count", range).out || 0);

const warn = []; // Thai, for the owner (systemMessage) — each also explained in `ctx`
const ctx = []; // English, for Friday (additionalContext)

// 1 fetch
const f = git("fetch", "origin", "--prune", "--quiet");
if (!f.ok) {
  warn.push("เช็ค GitHub ไม่ได้ (เน็ตหรือสิทธิ์) — ของในคอมอาจเก่า");
  ctx.push(`FETCH FAILED — cannot tell whether this checkout is behind GitHub: ${f.err.split("\n").slice(-2).join(" | ")}`);
}

// 2 update
const branch = git("rev-parse", "--abbrev-ref", "HEAD").out;
const dirty = git("status", "--porcelain", "--untracked-files=no").out !== "";
const upstream = git("rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}");
let changed = [];
let upd = null; // { from, to, n } after a fast-forward
if (branch === "HEAD") {
  warn.push("คอมไม่ได้อยู่บน branch ไหน (detached) — ยังไม่ได้อัปเดต");
  ctx.push(`DETACHED HEAD at ${short("HEAD")} — nothing updated; origin/main = ${short("origin/main")}.`);
} else if (!upstream.ok) {
  ctx.push(`Branch ${branch} has no upstream — not updated. origin/main = ${short("origin/main")}, ${count("HEAD..origin/main")} commit(s) not in this branch.`);
} else {
  const up = upstream.out;
  const behind = count(`HEAD..${up}`);
  const ahead = count(`${up}..HEAD`);
  if (behind === 0 && ahead === 0) {
    ctx.push(`${f.ok ? "UP TO DATE" : "UP TO DATE WITH THE LAST FETCH ONLY"}: ${branch} = ${up} = ${short("HEAD")}.`);
  } else if (ahead > 0) {
    warn.push(`คอมมีงาน ${ahead} commit ที่ยังไม่ขึ้น GitHub${behind ? ` และ GitHub มีของใหม่ ${behind} commit` : ""} — ยังไม่ได้อัปเดต`);
    ctx.push(`${behind ? "DIVERGED" : "AHEAD"}: ${branch} is ${ahead} ahead / ${behind} behind ${up} — nothing moved; push or sort it out before work.`);
  } else if (dirty) {
    warn.push(`GitHub มีของใหม่ ${behind} commit แต่คอมมีไฟล์ที่ยังไม่ commit — ยังไม่ได้อัปเดต`);
    ctx.push(`BEHIND ${behind} with uncommitted changes: ${branch} ${short("HEAD")} vs ${up} ${short(up)} — not updated (would touch unsaved work).`);
  } else if (DRY) {
    ctx.push(`DRY: would fast-forward ${branch} ${short("HEAD")} → ${short(up)} (${behind} commit(s)).`);
  } else {
    const from = short("HEAD");
    changed = git("diff", "--name-only", "HEAD", up).out.split("\n").filter(Boolean);
    const m = git("merge", "--ff-only", "--quiet", up);
    if (m.ok) {
      upd = { from, to: short("HEAD"), n: behind };
      ctx.push(`UPDATED: ${branch} fast-forwarded ${from} → ${short("HEAD")} (${behind} commit(s), ${changed.length} file(s)).`);
    } else {
      changed = [];
      warn.push(`GitHub มีของใหม่ ${behind} commit แต่อัปเดตไม่สำเร็จ — ของในคอมยังเก่า`);
      ctx.push(`FAST-FORWARD FAILED ${from} → ${short(up)}: ${m.err.split("\n").slice(-2).join(" | ")}`);
    }
  }
  if (branch !== "main" && git("rev-parse", "--verify", "--quiet", "origin/main").ok) {
    const n = count("HEAD..origin/main");
    if (n) ctx.push(`Note: origin/main (${short("origin/main")}) has ${n} commit(s) not in ${branch} — round-open step 2 decides.`);
  }
}

// 3 re-read
const reread = changed.filter((p) => LOADED.some((re) => re.test(p)));
if (reread.length) {
  ctx.push(
    `RE-READ NOW, before any other work — these files changed on disk after the update, and the copy in your context ` +
      `may be the old one: ${reread.join(" · ")}`,
  );
}

// 4 drafts (computer)
if (!CLOUD && fs.existsSync(DRAFTS)) {
  const norm = (s) => s.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const sha = (s) => require("crypto").createHash("sha256").update(norm(s).trim()).digest("hex");
  // A difference already known and recorded (file + the draft's hash) = one info line, not a warning every chat;
  // the draft changes again = its hash no longer matches = warning again.
  let known = [];
  try {
    known = JSON.parse(fs.readFileSync(path.join(ROOT, "docs", "rounds", "draft-differences.json"), "utf8")).known || [];
  } catch {
    /* no list = no known differences */
  }
  const differ = [];
  const knownHit = [];
  let same = 0;
  let draftOnly = 0;
  for (const name of fs.readdirSync(DRAFTS)) {
    if (!/\.(txt|md|tsv)$/i.test(name)) continue;
    const safe = name.replace(/ /g, "-");
    const mine = norm(fs.readFileSync(path.join(DRAFTS, name), "utf8"));
    const copies = [`HEAD:docs/rounds/${safe}`, `origin/inbox:rounds/${safe}`]
      .map((spec) => ({ spec, r: git("show", spec) }))
      .filter((c) => c.r.ok);
    if (!copies.length) {
      draftOnly++;
      continue;
    }
    const bad = copies.filter((c) => norm(c.r.out).trim() !== mine.trim());
    const where = bad.map((c) => c.spec.split(":")[0].replace("HEAD", "docs/rounds")).join(" + ");
    const k = known.find((e) => e.file === name && e.sha256 === sha(mine));
    if (!bad.length) same++;
    else if (k) knownHit.push(`${name} ≠ ${where} (known: ${k.why})`);
    else differ.push(`${name} ≠ ${where}`);
  }
  if (differ.length) {
    warn.push(`ไฟล์คำสั่งใน OneDrive ${differ.length} ไฟล์ ไม่ตรงกับฉบับใน Git`);
    ctx.push(`ROUND FILES DIFFER (OneDrive draft vs git — git is the master, docs/rounds/README.md): ${differ.join(" · ")}`);
  }
  if (knownHit.length) ctx.push(`Known draft differences (docs/rounds/draft-differences.json): ${knownHit.join(" · ")}`);
  ctx.push(
    `Round drafts: ${same} same as git · ${differ.length} differ · ${knownHit.length} known difference · ${draftOnly} draft-only (not in git yet — normal).`,
  );
}

// 5 probe — does this hook run BEFORE Claude Code reads CLAUDE.md and its imports? (not documented; round C test)
// The repo CLAUDE.md imports _incoming/session-probe.md (_incoming/ is gitignored). This run writes a fresh nonce
// there; the chat compares the probe line it was given at load with the nonce below: same = the hook ran first and the
// chat already saw the updated rule files (RE-READ lines are then only a safety net) · older or none = rules load first.
if (!DRY) {
  const nonce = require("crypto").randomBytes(4).toString("hex");
  try {
    fs.mkdirSync(path.join(ROOT, "_incoming"), { recursive: true });
    fs.writeFileSync(
      path.join(ROOT, "_incoming", "session-probe.md"),
      `session-probe: ${nonce} (written by scripts/session-sync.js at ${new Date().toISOString()})\n`,
    );
    ctx.push(
      `PROBE: this run wrote session-probe ${nonce}. The session-probe line loaded with CLAUDE.md shows ${nonce} = ` +
        `the hook ran before the rules were read; another value or none = the rules were read first.`,
    );
  } catch (e) {
    ctx.push(`PROBE: could not write _incoming/session-probe.md (${e.message})`);
  }
}

// 6 cloud
if (CLOUD && !DRY) {
  const p = spawnSync(process.execPath, [path.join(__dirname, "prepare-clone.js"), "--session-start"], {
    cwd: ROOT,
    encoding: "utf8",
    timeout: 280000,
    maxBuffer: 64 * 1024 * 1024,
  });
  ctx.push(`${p.stdout || ""}${p.stderr || ""}`.trim() || "prepare-clone: no output");
}

const ok = warn.length === 0;
const systemMessage = ok
  ? upd
    ? `อัปเดตจาก GitHub แล้ว ✓ (${branch} ${upd.from} → ${upd.to} · ${upd.n} commit)${reread.length ? " — กฎมีเปลี่ยน Friday อ่านใหม่ก่อนเริ่ม" : ""}`
    : `คอมตรงกับ GitHub ✓ (${branch} ${short("HEAD")})`
  : `⚠ คอมยังไม่ตรงกับ GitHub: ${warn.join(" · ")} — Friday จะบอกก่อนเริ่มงาน`;
if (!ok) ctx.unshift("STOP SIGN — tell the owner in Thai, first line of your first reply, before any work: " + warn.join(" · "));
process.stdout.write(
  JSON.stringify({
    systemMessage,
    hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: `session-sync (${new Date().toISOString()}):\n${ctx.join("\n")}` },
  }) + "\n",
);
process.exit(0);
