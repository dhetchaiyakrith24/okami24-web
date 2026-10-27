/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// Agent / skill header gate (27/10): every .claude/agents/*.md and .claude/skills/*/SKILL.md must open with a YAML header
// that parses and holds name + description. 26/10 22:47 an unquoted "`Checker: SKIP`" in the checker's description broke
// its YAML; the app silently stopped loading the `checker` agent and the hourly stock routine stalled three times on 27/10.
//   node scripts/agent-header-check.js            every agent and skill file in the tree — exit 1 if any fails
//   node scripts/agent-header-check.js --staged   only the staged ones (run by .githooks/pre-commit)
// js-yaml comes from this checkout's node_modules, or the main checkout's when a worktree has none.
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const git = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const isHeaderFile = (f) => /^\.claude\/agents\/[^/]+\.md$/.test(f) || /^\.claude\/skills\/[^/]+\/SKILL\.md$/.test(f);

let files;
if (process.argv.includes("--staged")) {
  files = git(["diff", "--cached", "--name-only", "--diff-filter=ACMR"]).split("\n").filter(isHeaderFile);
  if (!files.length) process.exit(0);
} else {
  files = git(["ls-files", ".claude/agents", ".claude/skills"]).split("\n").filter(isHeaderFile);
}

const scriptRepo = path.join(__dirname, "..");
const mainOf = (dir) => path.resolve(execFileSync("git", ["-C", dir, "rev-parse", "--path-format=absolute", "--git-common-dir"], { encoding: "utf8" }).trim(), "..");
let yaml;
try {
  yaml = require(require.resolve("js-yaml", { paths: [process.cwd(), mainOf(process.cwd()), scriptRepo, mainOf(scriptRepo)] }));
} catch {
  console.error("agent-header-check: js-yaml not found (npm ci in the main checkout) — cannot check the headers");
  process.exit(1);
}

const problems = [];
for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) { problems.push(`${f}: no YAML header (--- … ---) at the top`); continue; }
  let head;
  try { head = yaml.load(m[1]); } catch (e) { problems.push(`${f}: YAML error — ${e.reason} (quote a value that holds ": ")`); continue; }
  for (const key of ["name", "description"]) if (!head || typeof head[key] !== "string" || !head[key].trim()) problems.push(`${f}: header has no ${key}`);
}
if (problems.length) {
  console.error(`agent-header-check: the app will not load these:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`agent-header-check: OK (${files.length} header(s))`);
