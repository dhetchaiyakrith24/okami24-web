/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// guard-tool.js — Claude Code PreToolUse hook (.claude/settings.json): the owner's three locks turned from text into
// a real stop (housekeeping round 01/10, owner answer "3-ABC"). Rule text: .claude/TEAM_RULES.md 13.7.
//
//   A  never kill node by image name (it also kills the owner's own dev server) — stop the test server with
//      `node scripts/test-server.js stop`                                                        → deny
//   B  never force push, never push straight to main (the way into main is a merge)              → deny
//   C  render.yaml · .env* · src/lib/commerce/ordering-mode.ts (the cart switch) · src/lib/thai-typography.ts (the Thai
//      line-break word list — THAI_STYLE §5, owner 15/10) change only when a line of
//      the open round file that starts with 【แตะได้】 names the path (the plan = the permission, no tickets); otherwise the
//      normal permission prompt asks the owner                                                   → allow / ask
// Lock round 15/10 (rule-audit 14/10 L2 L3 L5 L7 + LESSONS พ22) — each a rule that was kept only by memory:
//   D  no bare `next build` / `npm run build` in the main folder — `node scripts/test-server.js build` (right env,
//      refuses while 3412 is up); a build that runs IN a worktree under _incoming/ (the shell's cwd, or a `cd` before
//      it) passes (HANDOFF §17 "Test server")                                                     → deny
//   E  no blind `git add -A` / `--all` / `.` / `*` and no `git commit -a` — add files by name (TEAM_RULES 13.7)  → deny
//   F  self-merge-check and the merge never in one command — run it alone, read its last line, then merge
//      (TEAM_RULES 13.7)                                                                         → deny
//   G  Windows Git Bash: `node scripts/…` with a page path like /about and no MSYS_NO_PATHCONV=1 — Git Bash turns it
//      into C:/Program Files/Git/about (HANDOFF §17 "Windows shell")                             → deny
//   H  while scripts/pre-checker-gate.js has noted "the checker is reading" (scripts/lib/checker-lock.js): no edit in that
//      working tree outside _incoming/, no git command that moves or rewrites it, no test-server build/start/stop,
//      no build — until `node scripts/pre-checker-gate.js --done` (LESSONS พ22)                  → deny
//
// Input: the hook JSON on stdin ({ tool_name, tool_input, cwd }). Output: a PreToolUse decision on stdout, or nothing
// (= carry on as usual). Fails open on its own errors — a broken guard must not stop all work; the git pre-push
// hook (scripts/push-guard.js) still stops B. Every lock has a planted example in `node scripts/pre-checker-gate.js --self-test`.
// Try it: echo '{"tool_name":"Bash","tool_input":{"command":"git push --force"}}' | node scripts/guard-tool.js
const path = require("path");
const { LOCKED, allowedByRound } = require("./lib/round-file");
const checkerLock = require("./lib/checker-lock");

const ROOT = path.resolve(__dirname, "..");
// C in a shell command: the locked file must be the TARGET of a write (owner 01/10: a commit message that merely
// mentions render.yaml must not trip it). Text is judged after heredoc bodies, here-strings and quoted strings holding
// spaces (messages) are blanked; a quoted path without spaces stays.
const NAME = String.raw`["']?[^\s;|&<>"']*(?:render\.yaml|\.env(?:\.[\w.-]+)?|ordering-mode\.ts|thai-typography\.ts)(?![\w.-])`;
const ARGS = String.raw`[^;|&\n]*\s`;
const WRITE_TARGETS = [
  new RegExp(String.raw`>[>|]?\s*` + NAME, "i"), // > file · >> file · >| file
  new RegExp(String.raw`\b(sed|perl)\b(\s+-\S+)*\s+(-\w*i\w*|--in-place)\b` + ARGS + NAME, "i"), // sed -i / --in-place / perl -i … file
  new RegExp(String.raw`\b(tee|cp|mv|rm|ln|install|truncate|unix2dos|dos2unix|del|erase|copy|move|ren|rename)\b` + ARGS + NAME, "i"),
  new RegExp(String.raw`\bdd\b[^;|&\n]*\bof=` + NAME, "i"),
  new RegExp(String.raw`\bgit\b[^;|&\n]*\b(checkout|restore)\b` + ARGS + NAME, "i"), // overwrites the file from git
  new RegExp(String.raw`\b(Set-Content|Add-Content|Out-File|Copy-Item|Move-Item|Remove-Item|Clear-Content|New-Item|Rename-Item)\b` + ARGS + NAME, "i"),
  new RegExp(String.raw`(WriteAllText|WriteAllLines|AppendAllText|writeFileSync|appendFileSync)\s*\(\s*\x60?` + NAME, "i"),
];
// heredoc bodies (the opener line and its redirect stay) and PowerShell here-strings = message text
const stripBodies = (cmd) => cmd.replace(/(<<-?\s*["']?(\w+)["']?)([^\n]*)\n[\s\S]*?\n\s*\2(?=\s|$)/g, "$1$3").replace(/@'[\s\S]*?'@|@"[\s\S]*?"@/g, "''");
function blankText(cmd) {
  return stripBodies(cmd)
    .replace(/(["'])[^"'\n]*[\\/]git(?:\.exe)?\1/gi, "git") // '& "C:/Program Files/Git/cmd/git.exe" push' = git push
    .replace(/(["'])\s*imagename\s+eq\s+([^"'\n]+)\1/gi, "IMAGENAME eq $2") // taskkill /FI "IMAGENAME eq node.exe"
    .replace(/"(?:[^"\\]|\\.)*\s(?:[^"\\]|\\.)*"/g, '""') // double-quoted text with a space
    .replace(/'[^']*\s[^']*'/g, "''"); // single-quoted text with a space
}
// one simple command per item: split at newlines and shell separators, drop # comments
function segments(plain) {
  return plain
    .split(/\n|&&|\|\||;|\||(?<![>&])&(?!>)/)
    .map((s) => s.replace(/(^|\s)#.*$/, "").trim())
    .filter(Boolean);
}

function decide(decision, reason) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: decision, permissionDecisionReason: reason } }));
  process.exit(0);
}

function lockedDecision(what) {
  const name = what.replace(/\\/g, "/").split("/").pop().replace(/["'`]/g, "").match(/render\.yaml|ordering-mode\.ts|thai-typography\.ts|\.env[\w.-]*/i)[0];
  if (allowedByRound(name)) return;
  decide("ask", `${name} is locked (TEAM_RULES 13.7 · owner 01/10): no 【แตะได้】 line of the open round's instruction file names it — ask the owner (or Javis) to add one to the round file; never add it yourself.`);
}

const KILL_NODE = [
  /taskkill\b[^\n]*\/im\s+["']?node(\.exe)?\b/i,
  /taskkill\b[^\n]*imagename\s+eq\s+node(\.exe)?\b/i,
  /Stop-Process\b[^\n]*-(Name|ProcessName)\s+["']?node\b/i,
  /Stop-Process\b[^\n]*Get-Process\s+(-Name\s+)?["']?node\b/i,
  /Get-Process\s+(-Name\s+)?["']?node["']?[^\n]*\|\s*(Stop-Process|kill|spps)\b/i,
  /\b(pkill|killall)\b[^\n]*\bnode\b/i,
  /\bkill\b[^\n]*\$\(\s*pgrep\b[^\n]*\bnode\b/i,
  /\bwmic\b[^\n]*node\.exe[^\n]*\b(delete|terminate)\b/i,
];

function checkShell(cmd, cwd) {
  const plain = blankText(cmd); // quoted text / heredocs / here-strings (messages) never trip A, B or C
  const segs = segments(plain);
  // A
  const lines = plain.split("\n").map((l) => l.replace(/(^|\s)#.*$/, ""));
  if (lines.some((l) => KILL_NODE.some((re) => re.test(l)))) {
    decide("deny", "Killing node by name also kills the owner's dev server (port 3000). Stop the test server with `node scripts/test-server.js stop` (TEAM_RULES 13.7 · owner 01/10).");
  }
  // B — every `git … push` command (git or git.exe, any -c/-C options before push)
  for (const seg of segs) {
    const m = seg.match(/(?:^|[\s&'"\\/])git(?:\.exe)?["']?\s+(?:-[cC]\s+\S+\s+|--?[\w-]+(?:=\S+)?\s+)*push\b(.*)$/i);
    if (!m) continue;
    const args = m[1].trim().split(/\s+/).filter(Boolean).map((a) => a.replace(/^["']|["']$/g, ""));
    // --force* / --mirror, or a short-flag cluster that holds f (-f · -uf · -fu)
    if (args.some((a) => /^(--force(-with-lease(=.*)?|-if-includes)?|--mirror)$/.test(a) || /^-[a-zA-Z]*f[a-zA-Z]*$/.test(a))) {
      decide("deny", "Force push is banned forever (TEAM_RULES 13.7). Undo with a new commit or `git revert`, then a normal push.");
    }
    const refs = args.filter((a) => !a.startsWith("-"));
    if (refs.some((a) => a.startsWith("+"))) decide("deny", "A '+refspec' is a force push — banned forever (TEAM_RULES 13.7).");
    if (refs.slice(1).some((a) => /^(main|refs\/heads\/main)$/.test(a) || /:(refs\/heads\/)?main$/.test(a))) {
      decide("deny", "No push straight to main — the way into main is a merged PR (TEAM_RULES 13.7). Push the work branch instead.");
    }
  }
  // C — a shell command whose write TARGET is one of the locked files
  for (const seg of plain.split("\n")) {
    const hit = WRITE_TARGETS.map((re) => seg.match(re)).find(Boolean);
    if (hit) lockedDecision(hit[0].match(new RegExp(NAME, "i"))[0]);
  }
  const dirs = placeOf(segs, cwd);
  segs.forEach((seg, i) => {
    const g = gitCall(seg);
    // D — judged by where the build runs (the hook's cwd, or a `cd` before it), never by "_incoming/" anywhere in the line
    if (isBuild(seg) && inside(norm(dirs[i]), norm(ROOT))) {
      decide("deny", "No bare build in the main folder (HANDOFF §17 \"Test server\"): run `node scripts/test-server.js build` — right env, and it refuses while 3412 is up.");
    }
    // E
    if (g && g.sub === "add" && g.args.some((a) => /^(-A|--all|\.\/?|\*|:\/|-[a-zA-Z]*A[a-zA-Z]*)$/.test(a))) {
      decide("deny", "No blind add (TEAM_RULES 13.7): `git status --short`, then `git add <file> <file>` by name.");
    }
    if (g && g.sub === "commit" && g.args.some((a) => a === "--all" || /^-[a-zA-Z]*a[a-zA-Z]*$/.test(a))) {
      decide("deny", "No `git commit -a` (TEAM_RULES 13.7): `git status --short`, `git add <file>` by name, then commit.");
    }
  });
  // F
  if (/self-merge-check/.test(plain) && /\bgh\s+pr\s+merge\b|\bgh\s+api\b[^\n]*\/merge\b|(?:^|[\s&;|])git\s+merge(?![-\w])/.test(plain)) {
    decide("deny", "Run `node scripts/self-merge-check.js` ALONE, read its last line (BLOCKED = no merge), then merge in a separate command (TEAM_RULES 13.7).");
  }
}

// G — Windows Git Bash rewrites a leading "/" argument (and "/" alone) into its install folder. Quoted text is kept (a
// page list is quoted: --pages "/a /b"), but only a segment that STARTS with node/tsx running scripts/… is read — a
// commit message, heredoc or `gh pr --body` that quotes such a command never trips it. /c/… (a drive) and /tmp-style
// system folders are real paths and pass.
function checkPathConversion(cmd) {
  if (process.platform !== "win32" || /MSYS_NO_PATHCONV=1/.test(cmd)) return;
  for (const seg of stripBodies(cmd).split(/\n|&&|\|\|?|;/)) { // the script's own arguments only — not a `| sed '/x/p'` after it
    const m = seg.match(/^\s*(?:\w+=\S*\s+)*(?:timeout\s+\d+\s+)?(?:node|npx\s+tsx|tsx)\s+(?:\S*\/)?scripts\/[\w./-]+\.(?:c?js|mjs|ts)\b(.*)$/);
    if (m && /(?:^|[\s"'=,])\/(?:(?=[\s"',]|$)|(?![a-zA-Z]\/|\/|(?:tmp|dev|usr|etc|mnt|proc|bin|opt|home)\b)[\w-])/.test(m[1])) {
      decide("deny", "Git Bash will turn the page path into C:/Program Files/Git/… and the script scans the wrong pages. Put `MSYS_NO_PATHCONV=1 ` in front of the command (HANDOFF §17 \"Windows shell\").");
    }
  }
}

// H — the checker is reading a working tree (scripts/lib/checker-lock.js)
const norm = (p) => path.resolve(String(p)).replace(/\\/g, "/").replace(/\/$/, "").toLowerCase();
function checkerReading() {
  return checkerLock.readAll(ROOT).map((note) => ({ // every worktree's note lives in the main folder's .git
    ...note,
    tree: norm(note.tree),
    msg: `The checker is reading ${String(note.sha).slice(0, 8)} (${note.branch}) in ${note.tree} since ${note.started} — leave that working tree and the test server alone until its report, then run \`node scripts/pre-checker-gate.js --done\` there (LESSONS พ22). Prepare the next work under _incoming/ or in a worktree.`,
  }));
}
const inside = (p, tree) => (p + "/").startsWith(tree + "/") && !(p + "/").startsWith(tree + "/_incoming/");
// Covers the acts that move or rebuild a tree (git, builds, the test server) and the Edit/Write tools — not every shell
// write (rm · sed -i · a redirect): those stay Friday's discipline (TEAM_RULES 13.4 says so). Where a segment runs = the
// hook's cwd moved by any `cd` before it, or git's own -C.
function checkReadingShell(cmd, cwd) {
  const segs = segments(blankText(cmd));
  const dirs = placeOf(segs, cwd);
  for (const r of checkerReading()) {
    segs.forEach((seg, i) => {
      if (/test-server\.js["']?\s+(build|start|stop|restart)\b/.test(seg)) decide("deny", r.msg); // 3412 is the machine's, not one tree's
      const g = gitCall(seg);
      if (!inside(norm(g && g.dir ? resolveArg(dirs[i], g.dir) : dirs[i]), r.tree)) return;
      if (g && /^(checkout|switch|reset|merge|pull|rebase|commit|restore|clean|cherry-pick|revert|am|apply)$/.test(g.sub)) decide("deny", r.msg);
      if (g && g.sub === "stash" && !/^(list|show)$/.test(g.args[0] || "")) decide("deny", r.msg);
      if (isBuild(seg)) decide("deny", r.msg);
    });
  }
}
function checkReadingEdit(file, cwd) {
  if (!file) return;
  const p = norm(path.resolve(cwd || ROOT, file));
  for (const r of checkerReading()) if (inside(p, r.tree)) decide("deny", r.msg);
}

function gitCall(seg) {
  const m = seg.match(/(?:^|[\s&'"\\/])git(?:\.exe)?["']?\s+((?:-[cC]\s+\S+\s+|--?[\w-]+(?:=\S+)?\s+)*)([a-z][\w-]*)\b(.*)$/i);
  if (!m) return null;
  const c = m[1].match(/-C\s+(\S+)/);
  return { sub: m[2].toLowerCase(), dir: c ? c[1] : null, args: m[3].trim().split(/\s+/).filter(Boolean).map((a) => a.replace(/^["']|["']$/g, "")) };
}
function resolveArg(dir, arg) {
  return path.resolve(dir, String(arg).replace(/^["']|["']$/g, "").replace(/^\/([a-zA-Z])\//, "$1:/")); // Git Bash /c/… = C:/…
}
// the folder each segment runs in: the hook's cwd, moved by any `cd` / `pushd` / `Set-Location` segment before it
function placeOf(segs, cwd) {
  let dir = cwd || ROOT;
  return segs.map((seg) => {
    const m = seg.match(/^(?:cd|pushd|chdir|Set-Location|sl)\s+(?:-Path\s+)?(\S+)$/i);
    if (m) dir = resolveArg(dir, m[1]);
    return dir;
  });
}
const isBuild = (seg) => /(?:^|[\s/])(?:npx\s+)?next\s+build\b|\bnpm\s+run\s+build\b|\b(?:pnpm|yarn)\s+(?:run\s+)?build\b/.test(seg);

let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }
  try {
    const tool = input.tool_name || "";
    const ti = input.tool_input || {};
    const cwd = input.cwd || process.cwd();
    if (tool === "Bash" || tool === "PowerShell") {
      const cmd = String(ti.command || "");
      checkShell(cmd, cwd);
      if (tool === "Bash") checkPathConversion(cmd);
      checkReadingShell(cmd, cwd);
    }
    if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(tool)) {
      const p = String(ti.file_path || ti.notebook_path || "").replace(/\\/g, "/");
      checkReadingEdit(p, cwd); // deny first — it outranks C's "ask"
      if (LOCKED.some((re) => re.test(p))) lockedDecision(p);
    }
  } catch {
    /* fail open — see head */
  }
  process.exit(0);
});
