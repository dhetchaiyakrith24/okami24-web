/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// Which Chrome the screenshot and scan scripts start, and how (round "mobile", 2026-09-26).
//   CHROME     CHROME_PATH if set · Windows: the standard Chrome install (the path every script used before) ·
//              elsewhere: the first Chrome/Chromium found — Playwright's browsers (PLAYWRIGHT_BROWSERS_PATH, the
//              claude.ai/code cloud ships them at /opt/pw-browsers) newest first, then google-chrome/chromium on PATH.
//              Found by searching, never by a fixed folder or version number (both change when the cloud image updates).
//   FLAGS      extra command-line flags to put before the script's own: none on Windows (Windows argv unchanged) ·
//              Linux: --no-sandbox (the cloud runs as root, where Chrome refuses its sandbox and never opens DevTools —
//              docs/cloud-results/T4.md step 14) + --disable-dev-shm-usage (small /dev/shm in containers) · cloud:
//              + --ignore-certificate-errors-spki-list=<the cloud network's CA> once prepare-clone learned it.
//   TMP        where throwaway Chrome profiles go: TEMP if set (Windows always sets it), else the OS temp dir (the cloud
//              has no TEMP — profiles went to "undefined/…" before).
//   MACHINE    one word naming the rendering machine, written into every scan/shot record so "before" and "after"
//              are only compared when they come from the same kind of machine (skill tier-b-proof).
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const WIN = process.platform === "win32";
const WIN_DEFAULT = "C:/Program Files/Google/Chrome/Application/chrome.exe";

function playwrightChromes() {
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, path.join(os.homedir(), ".cache", "ms-playwright")].filter(Boolean);
  const found = [];
  for (const root of roots) {
    let dirs = [];
    try {
      dirs = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d));
    } catch {
      continue;
    }
    dirs.sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]));
    for (const d of dirs) {
      for (const sub of ["chrome-linux64/chrome", "chrome-linux/chrome"]) {
        const p = path.join(root, d, sub);
        if (fs.existsSync(p)) found.push(p);
      }
    }
  }
  return found;
}

function onPath() {
  for (const name of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    const r = spawnSync("which", [name], { encoding: "utf8" });
    if (r.status === 0 && r.stdout.trim()) return [r.stdout.trim()];
  }
  return [];
}

function findChrome() {
  if (process.env.CHROME_PATH) return { path: process.env.CHROME_PATH, linux: process.platform === "linux" };
  if (WIN) return { path: WIN_DEFAULT, linux: false };
  const p = [...playwrightChromes(), ...onPath()][0];
  return p ? { path: p, linux: process.platform === "linux" } : null;
}

const found = findChrome();
const CHROME = found ? found.path : WIN_DEFAULT;
const FLAGS = found && found.linux ? ["--no-sandbox", "--disable-dev-shm-usage"] : [];
// Cloud only: trust the one CA the machine already trusts for the live site (scripts/lib/cloud-ca.js · round C) —
// without it every https page through the cloud's egress proxy is "Your connection is not private".
if (process.env.CLAUDE_CODE_REMOTE === "true") {
  const ca = require("./cloud-ca").cached();
  if (ca && ca.spki) FLAGS.push(`--ignore-certificate-errors-spki-list=${ca.spki}`);
}
const TMP = process.env.TEMP || os.tmpdir();
const MACHINE = WIN ? "windows-chrome" : process.env.CLAUDE_CODE_REMOTE === "true" ? "cloud-linux-chromium" : `${process.platform}-chrome`;

// ONE Chrome job at a time on this machine (HANDOFF §17 — two jobs at once slow each other into false flags; every
// chat and agent shares the machine). Reading CHROME = this process is a Chrome job: it takes the machine-wide note
// <tmp>/okami24-chrome-job.json, or waits for the job that holds it (OKAMI24_CHROME_LOCK_WAIT seconds, default 900),
// then gives up with exit 2. Child processes of the holder pass (OKAMI24_CHROME_JOB carries the holder's pid) · a note
// whose pid is gone is taken over · scripts that only need findChrome() (prepare-clone) never take it.
const LOCK_DIR = process.env.OKAMI24_CHROME_LOCK_DIR || os.tmpdir();
const LOCK = path.join(LOCK_DIR, "okami24-chrome-job.json");
const alive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === "EPERM";
  }
};
function holder() {
  try {
    const h = JSON.parse(fs.readFileSync(LOCK, "utf8"));
    return h.pid && h.pid !== process.pid && String(h.pid) !== process.env.OKAMI24_CHROME_JOB && alive(h.pid) ? h : null;
  } catch {
    return null;
  }
}
let locked = false;
function takeChromeLock() {
  if (locked) return;
  locked = true;
  const waitMs = Number(process.env.OKAMI24_CHROME_LOCK_WAIT ?? 900) * 1000;
  const until = Date.now() + waitMs;
  let h = holder();
  if (h) process.stderr.write(`chrome: waiting — another Chrome job holds the machine (${h.script}, pid ${h.pid}, since ${h.started})\n`);
  while (h && Date.now() < until) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2000);
    h = holder();
  }
  if (h) {
    process.stderr.write(`chrome: gave up — ${h.script} (pid ${h.pid}) still runs. One Chrome job at a time (HANDOFF §17): wait for it, then run again.\n`);
    process.exit(2);
  }
  if (process.env.OKAMI24_CHROME_JOB) return; // a child of the holder — the parent's note covers it
  fs.writeFileSync(LOCK, JSON.stringify({ pid: process.pid, script: path.basename(process.argv[1] || "node"), started: new Date().toISOString() }));
  process.env.OKAMI24_CHROME_JOB = String(process.pid);
  process.on("exit", () => {
    try {
      if (JSON.parse(fs.readFileSync(LOCK, "utf8")).pid === process.pid) fs.unlinkSync(LOCK);
    } catch {
      /* gone already */
    }
  });
}

module.exports = { FLAGS, TMP, MACHINE, findChrome, LOCK };
Object.defineProperty(module.exports, "CHROME", { enumerable: true, get: () => (takeChromeLock(), CHROME) });
