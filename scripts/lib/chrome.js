/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// Which Chrome the screenshot and scan scripts start, and how (round "mobile", 2026-09-26).
//   CHROME     CHROME_PATH if set · Windows: the standard Chrome install (the path every script used before) ·
//              elsewhere: the first Chrome/Chromium found — Playwright's browsers (PLAYWRIGHT_BROWSERS_PATH, the
//              claude.ai/code cloud ships them at /opt/pw-browsers) newest first, then google-chrome/chromium on PATH.
//              Found by searching, never by a fixed folder or version number (both change when the cloud image updates).
//   FLAGS      extra command-line flags to put before the script's own: none on Windows (Windows argv unchanged) ·
//              Linux: --no-sandbox (the cloud runs as root, where Chrome refuses its sandbox and never opens DevTools —
//              docs/cloud-results/T4.md step 14) + --disable-dev-shm-usage (small /dev/shm in containers).
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
const TMP = process.env.TEMP || os.tmpdir();
const MACHINE = WIN ? "windows-chrome" : process.env.CLAUDE_CODE_REMOTE === "true" ? "cloud-linux-chromium" : `${process.platform}-chrome`;

module.exports = { CHROME, FLAGS, TMP, MACHINE, findChrome };
