/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// push-guard.js — git pre-push gate (.githooks/pre-push): no force push, no push straight to main
// (housekeeping round 01/10, owner answer "3-B" · rule text .claude/TEAM_RULES.md 13.7). Catches every push from this
// clone, whoever runs it — the Claude Code hook scripts/guard-tool.js only sees the agent's own commands.
//
// git feeds one line per ref on stdin: <local ref> <local sha> <remote ref> <remote sha>
//   remote ref refs/heads/main (push or delete)               → refused
//   remote sha exists and is not an ancestor of local sha      → refused (that is a force push)
//   branch delete elsewhere · new branch · fast-forward · tags → allowed
// Exit 0 = PASS · exit 1 = refused (reason printed). Setup after clone: node scripts/prepare-clone.js
const { execFileSync } = require("child_process");

const ZERO = /^0+$/;
let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  const bad = [];
  for (const line of raw.split(/\r?\n/).filter(Boolean)) {
    const [, localSha, remoteRef, remoteSha] = line.trim().split(/\s+/);
    if (remoteRef === "refs/heads/main") {
      bad.push(`${remoteRef}: no push straight to main — the way into main is a merged PR`);
      continue;
    }
    if (!remoteRef.startsWith("refs/heads/") || ZERO.test(localSha) || ZERO.test(remoteSha)) continue;
    try {
      execFileSync("git", ["merge-base", "--is-ancestor", remoteSha, localSha], { stdio: "ignore" });
    } catch (e) {
      // status 1 = not an ancestor = history rewritten; anything else (object missing locally) = cannot tell → refuse too
      bad.push(`${remoteRef}: ${e.status === 1 ? "not a fast-forward" : "remote commit unknown here (git fetch first)"} — force push is banned forever`);
    }
  }
  if (bad.length) {
    console.error(`push-guard: refused (TEAM_RULES 13.7)\n  ${bad.join("\n  ")}`);
    process.exit(1);
  }
  console.log("push-guard: OK");
});
