/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// guard-tool.js — Claude Code PreToolUse hook (.claude/settings.json): the owner's three locks turned from text into
// a real stop (housekeeping round 01/10, owner answer "3-ABC"). Rule text: .claude/TEAM_RULES.md 13.7.
//
//   A  never kill node by image name (it also kills the owner's own dev server) — stop the test server with
//      `node scripts/test-server.js stop`                                                        → deny
//   B  never force push, never push straight to main (the way into main is a merge)              → deny
//   C  render.yaml · .env* · src/lib/commerce/ordering-mode.ts (the cart switch) change only when a 【แตะได้】 line
//      of the open round's instruction file names the path (the plan = the permission, no tickets); otherwise the
//      normal permission prompt asks the owner                                                   → allow / ask
//
// Input: the hook JSON on stdin ({ tool_name, tool_input }). Output: a PreToolUse decision on stdout, or nothing
// (= carry on as usual). Fails open on its own errors — a broken guard must not stop all work; the git pre-push
// hook (scripts/push-guard.js) still stops B.
// Try it: echo '{"tool_name":"Bash","tool_input":{"command":"git push --force"}}' | node scripts/guard-tool.js
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LOCKED = [/(^|[\\/])render\.yaml$/i, /(^|[\\/])\.env[^\\/]*$/i, /(^|[\\/])ordering-mode\.ts$/i];
const LOCKED_IN_TEXT = /render\.yaml|\.env\b|\.env\.[\w.-]+|ordering-mode\.ts/i;
const WRITES_IN_SHELL = /(^|[^<>])>{1,2}(?!&)|\bsed\s+-i|\bperl\s+-[a-z]*i|\b(tee|cp|mv|rm|truncate|unix2dos|dos2unix)\b|Set-Content|Add-Content|Out-File|Copy-Item|Move-Item|Remove-Item|WriteAllText|writeFileSync/i;

function decide(decision, reason) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: decision, permissionDecisionReason: reason } }));
  process.exit(0);
}

// the instruction file of the round that is open now = the first docs/rounds/… path on the "OPEN" line of HANDOFF §16
function openRoundText() {
  try {
    const h = fs.readFileSync(path.join(ROOT, "docs", "HANDOFF.md"), "utf8");
    const s16 = h.slice(h.indexOf("## 16."), h.indexOf("## 17.") > 0 ? h.indexOf("## 17.") : undefined);
    const open = s16.split(/\r?\n/).findIndex((l) => /^\s*3\s+OPEN\b/.test(l));
    if (open < 0) return "";
    const m = s16.split(/\r?\n/).slice(open, open + 3).join(" ").match(/docs\/rounds\/[^`\s]+/);
    return m ? fs.readFileSync(path.join(ROOT, m[0]), "utf8") : "";
  } catch {
    return "";
  }
}
function lockedDecision(what) {
  const round = openRoundText();
  const name = what.match(/render\.yaml|ordering-mode\.ts|\.env[\w.-]*/i)[0];
  // the plan allows it = a line of the open round's instruction file that says แตะได้ (may touch) and names the file
  if (round.split(/\r?\n/).some((l) => l.includes("แตะได้") && l.includes(name))) return;
  decide("ask", `${name} is locked (TEAM_RULES 13.7 · owner 01/10): no 【แตะได้】 line of the open round's instruction file names it — ask the owner, or add it to the round file first.`);
}

function checkShell(cmd) {
  const c = cmd.replace(/\s+/g, " ");
  // A
  if (/taskkill\b[^;&|]*\/im\s+"?node(\.exe)?\b/i.test(c) || /Stop-Process\b[^;&|]*-(Name|ProcessName)\s+"?node\b/i.test(c) || /\b(pkill|killall)\b[^;&|]*\bnode\b/i.test(c) || /Get-Process\s+-?(Name\s+)?"?node"?\s*\|\s*Stop-Process/i.test(c)) {
    decide("deny", "Killing node by name also kills the owner's dev server (port 3000). Stop the test server with `node scripts/test-server.js stop` (TEAM_RULES 13.7 · owner 01/10).");
  }
  // B — look at every `git push` segment of the command line
  for (const seg of c.split(/&&|\|\||;|\|/)) {
    const m = seg.match(/\bgit\s+(?:-C\s+\S+\s+)?push\b(.*)$/i);
    if (!m) continue;
    const args = m[1].trim().split(" ").filter(Boolean);
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
  // C — a shell command that writes one of the locked files
  if (LOCKED_IN_TEXT.test(c) && WRITES_IN_SHELL.test(c)) lockedDecision(c);
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
