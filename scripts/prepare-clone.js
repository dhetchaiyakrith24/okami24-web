/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// Make a clone ready for the full verify set — one command, safe to run again (round "mobile", 2026-09-26).
//   node scripts/prepare-clone.js                  run every step, print one line each, exit 1 if a step failed
//   node scripts/prepare-clone.js --session-start  same, but only in a claude.ai/code cloud session (started by
//                                                  scripts/session-sync.js, the SessionStart hook, after its fetch)
//                                                  (CLAUDE_CODE_REMOTE=true); anywhere else it exits 0 at once
// Steps (each skipped when already done):
//   1 git hooks      core.hooksPath = .githooks (a fresh clone does not set it — commit/push gates would not run)
//   2 git history    unshallow + tags (a shallow clone gives content-dates the clone boundary as every file's date)
//   3 packages       npm ci when node_modules is missing or older than package-lock.json
//   4 Next types     `next typegen` (tsc needs LayoutProps & co. before the first build — docs/cloud-results/T4.md 10)
//   5 browser        the Chrome/Chromium the screenshot and scan scripts will use (scripts/lib/chrome.js)
//   6 Thai font      Linux only: Noto Sans Thai (what Android visitors see) as the system Thai font. The site ships
//                    no Thai font (next/font loads Latin only), so the machine's Thai font draws every Thai glyph of
//                    a screenshot or a line-break scan — the cloud image's own Loma matches no visitor's phone.
//                    Fetched from Google Fonts (CSS API → TTF, weights 400–800 = the weights the site uses) into
//                    ~/.local/share/fonts, preferred for Thai through ~/.config/fontconfig. Gate: scripts/font-check.js
// Why each step exists: docs/cloud-results/T4.md steps 7 10 12 · table: docs/CLOUD.md §1.
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const WIN = process.platform === "win32";

if (process.argv.includes("--session-start") && process.env.CLAUDE_CODE_REMOTE !== "true") process.exit(0);

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", shell: WIN, maxBuffer: 64 * 1024 * 1024 });
  return { ok: r.status === 0, out: `${r.stdout || ""}${r.stderr || ""}`.trim() };
}
const git = (...args) => run("git", args);

const results = [];
function step(name, fn) {
  const t = Date.now();
  let ok = true;
  let note = "";
  try {
    note = fn() || "";
  } catch (e) {
    ok = false;
    note = String(e.message || e).split("\n").slice(0, 3).join(" | ");
  }
  results.push(ok);
  console.log(`prepare-clone: ${ok ? "OK  " : "FAIL"} ${name} — ${note} (${((Date.now() - t) / 1000).toFixed(1)} s)`);
}

step("git hooks", () => {
  if (git("config", "core.hooksPath").out === ".githooks") return "already .githooks";
  if (!git("config", "core.hooksPath", ".githooks").ok) throw new Error("git config core.hooksPath failed");
  return "set to .githooks";
});

step("git history", () => {
  if (git("rev-parse", "--is-shallow-repository").out === "true") {
    const r = git("fetch", "--unshallow", "--tags", "--quiet", "origin");
    if (!r.ok) throw new Error(`git fetch --unshallow: ${r.out}`);
    return `unshallowed · ${git("rev-list", "--count", "HEAD").out} commits · ${git("tag").out.split("\n").filter(Boolean).length} tags`;
  }
  return `full already · ${git("rev-list", "--count", "HEAD").out} commits`;
});

step("packages", () => {
  const stamp = path.join(ROOT, "node_modules", ".package-lock.json");
  const lock = path.join(ROOT, "package-lock.json");
  if (fs.existsSync(stamp) && fs.statSync(stamp).mtimeMs >= fs.statSync(lock).mtimeMs) return "node_modules up to date";
  const r = run("npm", ["ci", "--no-audit", "--no-fund"]);
  if (!r.ok) throw new Error(`npm ci: ${r.out.split("\n").slice(-3).join(" | ")}`);
  return "npm ci done";
});

step("Next types", () => {
  const r = run("npx", ["next", "typegen"]);
  if (!r.ok) throw new Error(`next typegen: ${r.out.split("\n").slice(-3).join(" | ")}`);
  return "next typegen done";
});

step("browser", () => {
  const { findChrome } = require("./lib/chrome");
  const c = findChrome();
  if (!c) throw new Error("no Chrome/Chromium found — set CHROME_PATH (screenshots and scans will not run)");
  return `${c.path}${c.linux ? " (Linux: runs with --no-sandbox)" : ""}`;
});

step("Thai font", () => {
  if (process.platform !== "linux") return "not Linux — the machine's own Thai font is kept";
  const has = () => run("fc-list", [":family=Noto Sans Thai", "family"]).out.includes("Noto Sans Thai");
  const home = require("os").homedir();
  const fontDir = path.join(home, ".local", "share", "fonts", "okami24-noto-sans-thai");
  const confDir = path.join(home, ".config", "fontconfig", "conf.d");
  let note = "already installed";
  if (!has()) {
    const css = run("curl", ["-fsSL", "-A", "Wget/1.0", "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700;800"]);
    const urls = [...css.out.matchAll(/font-weight: (\d+);[\s\S]*?url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/g)].map((m) => [m[1], m[2]]);
    if (!css.ok || urls.length < 5) throw new Error(`Google Fonts CSS gave ${urls.length} font files (network blocked?) — screenshots keep the machine's own Thai font`);
    fs.mkdirSync(fontDir, { recursive: true });
    urls.forEach(([weight, u]) => {
      const r = run("curl", ["-fsSL", "-o", path.join(fontDir, `NotoSansThai-${weight}.ttf`), u]);
      if (!r.ok) throw new Error(`download ${u}: ${r.out}`);
    });
    note = `installed ${urls.length} weights`;
  }
  fs.mkdirSync(confDir, { recursive: true });
  fs.writeFileSync(
    path.join(confDir, "60-okami24-thai.conf"),
    `<?xml version="1.0"?>\n<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n<!-- written by scripts/prepare-clone.js (okami24-web): Noto Sans Thai first for Thai -->\n<fontconfig>\n  <match target="pattern">\n    <test name="lang" compare="contains"><string>th</string></test>\n    <edit name="family" mode="prepend" binding="strong"><string>Noto Sans Thai</string></edit>\n  </match>\n  <alias><family>sans-serif</family><prefer><family>Noto Sans Thai</family></prefer></alias>\n</fontconfig>\n`,
  );
  run("fc-cache", ["-f"]);
  if (!has()) throw new Error("Noto Sans Thai not visible to fontconfig after install");
  return `${note} · fc-match th → ${run("fc-match", [":lang=th", "family"]).out}`;
});

const failed = results.filter((ok) => !ok).length;
console.log(failed ? `prepare-clone: NOT READY — ${failed} step(s) failed` : "prepare-clone: READY");
process.exit(failed ? 1 : 0);
