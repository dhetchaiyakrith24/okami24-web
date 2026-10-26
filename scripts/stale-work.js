/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// stale-work.js — what is stuck or due, so work does not drift (owner 26/10: "เวลาที่งานไหลไปเรื่อยๆแล้วไม่มีใครตามงานค้าง งานเก่า").
//   node scripts/stale-work.js          full list (English, one finding per line) — the `follow-up` agent and the morning task read it
//   node scripts/stale-work.js --brief  only the count line + the findings, for session-sync at chat open
//   node scripts/stale-work.js --json   machine-readable
// Read only: never edits, fetches nothing but `gh` reads. Offline / no gh = says so and still checks the files.
// What counts (TEAM_RULES 13.2 follow-up · thresholds = owner 26/10):
//   1 dated   a due day in HANDOFF §16 item 5 "open / dated" (a dd/mm at the start of a bullet or after " · ") that is past
//             (up to 14 days back) or is today/tomorrow — dates elsewhere say when something was said, not when it is due
//   2 waiting a numbered item under "รอพี่ตัดสิน" / "งานที่พี่ต้องทำเอง" of docs/รอพี่ตรวจ.md last changed more than 7 days ago
//   3 PRs     an open PR in this repo or in dhetchaiyakrith24/smogz-rules not updated for more than 1 day
//   4 branch  a branch on GitHub not in origin/main whose last commit is more than 7 days old — except gsc-data, inbox and
//             any branch HANDOFF names (parked rounds list theirs in §16)
// Always exits 0.
"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const BRIEF = process.argv.includes("--brief");
const JSON_OUT = process.argv.includes("--json");
const DAY = 86400000;
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const ENV = { ...process.env, GIT_TERMINAL_PROMPT: "0", GH_PROMPT_DISABLED: "1" };
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", env: ENV, timeout: 20000, maxBuffer: 16 * 1024 * 1024 });
  return { ok: r.status === 0, out: (r.stdout || "").trim() };
};
const days = (ms) => Math.floor(ms / DAY);
const found = [];
const notes = [];

// 1 dated items in HANDOFF §16
let handoff = "";
try {
  handoff = fs.readFileSync(path.join(ROOT, "docs", "HANDOFF.md"), "utf8").replace(/\r\n/g, "\n");
} catch {
  notes.push("docs/HANDOFF.md not readable — dated items and branch names not checked");
}
const s16 = handoff.slice(handoff.indexOf("## 16."), handoff.indexOf("## 17."));
const b5 = s16.slice(s16.indexOf("\n5 open / dated"));
const dated = b5.split("\n").slice(1).filter((l) => /^\s+- /.test(l));
for (const line of dated) {
  if (/\b(DONE|CLOSED)\b/.test(line)) continue;
  for (const m of line.matchAll(/(?:^\s+- |· )(\d{2})\/(\d{2})(?![\d/])/g)) {
    if (Number(m[2]) < 1 || Number(m[2]) > 12) continue;
    // dd/mm has no year: across New Year a December day read in January is last year, a January day read in December next year.
    const mon = Number(m[2]) - 1;
    const yr = today.getFullYear() + (today.getMonth() === 0 && mon === 11 ? -1 : today.getMonth() === 11 && mon === 0 ? 1 : 0);
    const d = new Date(yr, mon, Number(m[1]));
    const diff = days(d - today);
    if (diff <= 1 && diff >= -14) {
      const what = line.slice(m.index, m.index + 110).replace(/^[\s·-]+/, "");
      found.push({ kind: "dated", due: `${m[1]}/${m[2]}`, when: diff < 0 ? `${-diff} day(s) past` : diff === 0 ? "today" : "tomorrow", what });
    }
  }
}

// 2 owner-waiting items older than 7 days (git blame of the line)
const WAIT = "docs/รอพี่ตรวจ.md";
const blame = run("git", ["blame", "--line-porcelain", "--", WAIT]);
if (blame.ok) {
  let t = 0;
  let live = false;
  for (const l of blame.out.split("\n")) {
    if (l.startsWith("committer-time ")) t = Number(l.slice(15)) * 1000;
    else if (l.startsWith("\t")) {
      if (l.startsWith("\t## ")) live = /รอพี่ตัดสิน|งานที่พี่ต้องทำเอง/.test(l);
      const m = l.slice(1).match(/^(\d+)\. (.{0,90})/);
      if (live && m && now - t > 7 * DAY) found.push({ kind: "waiting", item: m[1], age: `${days(now - t)} days`, what: m[2] });
    }
  }
} else notes.push(`could not read the history of ${WAIT}`);

// 3 open PRs not moving
for (const repo of ["dhetchaiyakrith24/okami24-web", "dhetchaiyakrith24/smogz-rules"]) {
  const r = run("gh", ["pr", "list", "-R", repo, "--state", "open", "--json", "number,title,updatedAt,isDraft"]);
  if (!r.ok) {
    notes.push(`gh could not list PRs of ${repo} (offline or not signed in)`);
    continue;
  }
  let prs = [];
  try {
    prs = JSON.parse(r.out || "[]");
  } catch {
    notes.push(`gh gave unreadable output for ${repo}`);
  }
  for (const p of prs) {
    const age = now - new Date(p.updatedAt);
    if (age > DAY) found.push({ kind: "pr", repo, pr: p.number, age: `${days(age)} days`, draft: p.isDraft, what: p.title.slice(0, 90) });
  }
}

// 4 unmerged branches on GitHub
const refs = run("git", ["for-each-ref", "--format=%(refname:short)|%(committerdate:unix)|%(subject)", "refs/remotes/origin/"]);
for (const l of refs.ok ? refs.out.split("\n") : []) {
  const [ref, t, subject] = l.split("|");
  if (!ref || /^origin\/(HEAD|main|gsc-data|inbox)$/.test(ref) || ref === "origin") continue;
  const name = ref.slice("origin/".length).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (new RegExp(`(^|[^\\w/-])${name}([^\\w/-]|$)`).test(handoff)) continue; // named as a whole word = parked on purpose
  if (run("git", ["merge-base", "--is-ancestor", ref, "origin/main"]).ok) continue;
  const age = now - Number(t) * 1000;
  if (age > 7 * DAY) found.push({ kind: "branch", ref, age: `${days(age)} days`, what: (subject || "").slice(0, 90) });
}

if (JSON_OUT) {
  process.stdout.write(JSON.stringify({ at: now.toISOString(), found, notes }, null, 2) + "\n");
  process.exit(0);
}
const fmt = (f) =>
  f.kind === "dated"
    ? `DUE ${f.due} (${f.when}): ${f.what}`
    : f.kind === "waiting"
      ? `OWNER WAITING ${f.age}: รอพี่ตรวจ ${f.item}. ${f.what}`
      : f.kind === "pr"
        ? `PR ${f.repo.split("/")[1]}#${f.pr} idle ${f.age}${f.draft ? " (draft)" : ""}: ${f.what}`
        : `BRANCH ${f.ref} unmerged, idle ${f.age}: ${f.what}`;
const lines = [`stale-work: ${found.length} item(s) stuck or due`, ...found.map(fmt), ...notes.map((n) => `note: ${n}`)];
process.stdout.write((BRIEF ? lines.slice(0, 9) : lines).join("\n") + "\n");
process.exit(0);
