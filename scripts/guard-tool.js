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
//
// Input: the hook JSON on stdin ({ tool_name, tool_input }). Output: a PreToolUse decision on stdout, or nothing
// (= carry on as usual). Fails open on its own errors — a broken guard must not stop all work; the git pre-push
// hook (scripts/push-guard.js) still stops B.
// Try it: echo '{"tool_name":"Bash","tool_input":{"command":"git push --force"}}' | node scripts/guard-tool.js
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LOCKED = [/(^|[\\/])render\.yaml$/i, /(^|[\\/])\.env[^\\/]*$/i, /(^|[\\/])ordering-mode\.ts$/i, /(^|[\\/])thai-typography\.ts$/i];
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
function blankText(cmd) {
  return cmd
    .replace(/(["'])[^"'\n]*[\\/]git(?:\.exe)?\1/gi, "git") // '& "C:/Program Files/Git/cmd/git.exe" push' = git push
    .replace(/(["'])\s*imagename\s+eq\s+([^"'\n]+)\1/gi, "IMAGENAME eq $2") // taskkill /FI "IMAGENAME eq node.exe"
    .replace(/(<<-?\s*["']?(\w+)["']?)([^\n]*)\n[\s\S]*?\n\s*\2(?=\s|$)/g, "$1$3") // heredoc body only — the opener line (and its redirect) stays
    .replace(/@'[\s\S]*?'@|@"[\s\S]*?"@/g, "''") // PowerShell here-strings
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

// the instruction file of the round that is open now = the first docs/rounds/… path on the "OPEN" line of HANDOFF §16
function openRoundText() {
  try {
    const h = fs.readFileSync(path.join(ROOT, "docs", "HANDOFF.md"), "utf8");
    const s16 = h.slice(h.indexOf("## 16."), h.indexOf("## 17.") > 0 ? h.indexOf("## 17.") : undefined);
    const lines = s16.split(/\r?\n/);
    const open = lines.findIndex((l) => /^\s*3[a-z]?\s+OPEN\b/.test(l)); // "3 OPEN …" or a lettered item "3u OPEN ROUND …"
    if (open < 0) return "";
    const m = lines.slice(open, open + 3).join(" ").match(/docs\/rounds\/[^`\s]+/);
    return m ? fs.readFileSync(path.join(ROOT, m[0]), "utf8") : "";
  } catch {
    return "";
  }
}
// the plan allows it = a line of the open round's file that STARTS with 【แตะได้】, is not the template placeholder
// (<…>) and carries no ไม่/ห้าม (not/never), and names the file — `.env*` on that line covers every .env file
function allowedByRound(name) {
  const lower = name.toLowerCase();
  return openRoundText()
    .split(/\r?\n/)
    .some((l) => {
      const s = l.trim();
      if (!s.startsWith("【แตะได้】") || /[<>]|ไม่|ห้าม/.test(s)) return false;
      const body = s.slice("【แตะได้】".length).toLowerCase();
      if (lower.startsWith(".env") && /\.env\*/.test(body)) return true;
      return body.split(/[\s,·、]+/).some((tok) => tok.replace(/[`"'()]/g, "").split(/[\\/]/).pop() === lower);
    });
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

function checkShell(cmd) {
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
}

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
    if (tool === "Bash" || tool === "PowerShell") checkShell(String(ti.command || ""));
    if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(tool)) {
      const p = String(ti.file_path || ti.notebook_path || "").replace(/\\/g, "/");
      if (LOCKED.some((re) => re.test(p))) lockedDecision(p);
    }
  } catch {
    /* fail open — see head */
  }
  process.exit(0);
});
