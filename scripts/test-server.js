/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// Local production test server on port 3412 — the one agents use for proof (docs/HANDOFF.md §17 "test server").
//   node scripts/test-server.js status   who listens on 3412 (PID) — exit 0 if up, 3 if down
//   node scripts/test-server.js start    serve a COPY of the current .next build on 3412 (refuses if 3412 is taken or
//                                        no build) — a later build of the repo cannot break it; restart to serve the new build
//   node scripts/test-server.js stop     kill ONLY the process tree listening on 3412 (never by image name, never 3000)
//   node scripts/test-server.js build    `next build` — refuses while 3412 is up (a build under a running server breaks it)
//                                        · builds with OKAMI24_ORDERING=on like the live site (cart icon in the header);
//                                        set OKAMI24_ORDERING=off yourself for a cart-off build (27/10: a cart-off proof hid
//                                        the header overflow the owner then saw live)
//   node scripts/test-server.js guard    exit 1 if 3412 is up — for other scripts that build (verify-catalog --full)
// Port 3000 is the owner's own dev server: this script never starts, stops or builds for it, and has no port option.
// start uses: SITE_URL=https://okami24.store · a throwaway data dir (OKAMI24_DATA_DIR, default <tmp>/okami24-3412-data)
// · OKAMI24_BACKUP_DISABLED=1 · OKAMI24_STARTUP_PROBE=0 · log → _incoming/test-server-3412.log (override with --log <file>).
const { execFileSync, spawn, spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const PORT = 3412;
const ROOT = path.join(__dirname, "..");
const SITE_URL = "https://okami24.store";

function listeners(port) {
  let out = "";
  if (process.platform === "win32") {
    out = execFileSync("netstat", ["-ano", "-p", "TCP"], { encoding: "utf8" });
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      const cols = line.trim().split(/\s+/);
      // Proto  Local  Foreign  State  PID
      if (cols.length >= 5 && cols[3] === "LISTENING" && cols[1].endsWith(":" + port)) pids.add(cols[4]);
    }
    return [...pids];
  }
  // lsof first; the cloud container (claude.ai/code) hides next-server's listener from lsof, so fuser is the fallback
  // (docs/cloud-results/T4.md step 13 · round "mobile").
  for (const [cmd, args] of [
    ["lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN", "-t"]],
    ["fuser", ["-n", "tcp", String(port)]],
  ]) {
    const r = spawnSync(cmd, args, { encoding: "utf8" });
    const pids = [...new Set((r.stdout || "").split(/\s+/).filter((s) => /^\d+$/.test(s)))];
    if (pids.length) return pids;
  }
  return [];
}

// Last line of defence when no tool names the owner of the port: does anything answer on it at all?
// Windows keeps its netstat answer only (unchanged there).
function portAnswers(port) {
  if (process.platform === "win32") return false;
  const r = spawnSync(process.execPath, ["-e", `require("net").connect(${port},"127.0.0.1").on("connect",()=>process.exit(0)).on("error",()=>process.exit(1))`], { timeout: 5000 });
  return r.status === 0;
}

function killTree(pid) {
  if (process.platform === "win32") return spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
  // `start` spawns detached, so the npm → sh → next-server chain shares one process group: kill the whole group,
  // never our own.
  const pgid = Number(spawnSync("ps", ["-o", "pgid=", "-p", String(pid)], { encoding: "utf8" }).stdout.trim());
  let ownPgid = 0;
  try {
    ownPgid = Number(spawnSync("ps", ["-o", "pgid=", "-p", String(process.pid)], { encoding: "utf8" }).stdout.trim());
  } catch {
    /* keep 0 */
  }
  if (pgid > 1 && pgid !== ownPgid) spawnSync("kill", ["-9", `-${pgid}`], { stdio: "ignore" });
  spawnSync("kill", ["-9", String(pid)], { stdio: "ignore" });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// The server runs from its own copy of the build, so a build started any other way (npm run build, npx next build)
// rewrites the repo's .next but cannot touch what 3412 is serving. Copied: .next (minus cache/) + the config files.
// Linked (junctions, never deleted by this script): node_modules · public · src · scripts (read at runtime via cwd).
const SNAP = path.join(ROOT, "_incoming", ".test-server-3412");
const LINKED = ["node_modules", "public", "src", "scripts"];
const COPIED = ["package.json", "next.config.ts", "tsconfig.json"];

function prepareSnapshot() {
  fs.mkdirSync(SNAP, { recursive: true });
  for (const name of LINKED) {
    const link = path.join(SNAP, name);
    if (!fs.existsSync(link)) fs.symlinkSync(path.join(ROOT, name), link, "junction");
    if (!fs.lstatSync(link).isSymbolicLink()) throw new Error(`${link} should be a link to the repo, found a real folder`);
  }
  for (const name of COPIED) fs.copyFileSync(path.join(ROOT, name), path.join(SNAP, name));
  const snapNext = path.join(SNAP, ".next");
  if (fs.existsSync(snapNext)) {
    if (fs.lstatSync(snapNext).isSymbolicLink()) throw new Error(`${snapNext} is a link — refusing to delete through it`);
    removeCopy(snapNext);
  }
  copyBuild(path.join(ROOT, ".next"), snapNext, true);
  return fs.readFileSync(path.join(snapNext, "BUILD_ID"), "utf8").trim();
}

// Delete the old copy. Links (junctions into the repo's node_modules) are unlinked, never descended into.
function removeCopy(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isSymbolicLink()) fs.unlinkSync(p);
    else if (e.isDirectory()) removeCopy(p);
    else fs.unlinkSync(p);
  }
  fs.rmdirSync(dir);
}

// .next/cache (image cache, rebuilt on demand) and .next/dev (the owner's dev server state) are not copied.
// The build links native packages (.next/node_modules/<pkg>-<hash>) — re-created as junctions, since a plain
// symlink needs admin rights on Windows.
function copyBuild(from, to, top) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    if (top && (e.name === "cache" || e.name === "dev")) continue;
    const s = path.join(from, e.name);
    const d = path.join(to, e.name);
    if (e.isSymbolicLink()) {
      const real = fs.realpathSync(s);
      if (fs.statSync(real).isDirectory()) fs.symlinkSync(real, d, "junction");
      else fs.copyFileSync(real, d);
    } else if (e.isDirectory()) copyBuild(s, d, false);
    else fs.copyFileSync(s, d);
  }
}

async function waitUp(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      const r = await fetch(`http://localhost:${PORT}/`, { redirect: "manual" });
      if (r.status > 0) return r.status;
    } catch {
      /* not up yet */
    }
    await sleep(1000);
  }
  return 0;
}

function refuseIfUp(what) {
  const pids = listeners(PORT);
  if (pids.length || portAnswers(PORT)) {
    console.error(`test-server: port ${PORT} is up (PID ${pids.join(", ") || "unknown"}) — refusing to ${what}. Run: node scripts/test-server.js stop`);
    process.exit(1);
  }
}

async function main() {
  const cmd = process.argv[2];
  const logIdx = process.argv.indexOf("--log");
  const logFile = logIdx > 0 ? process.argv[logIdx + 1] : path.join(ROOT, "_incoming", "test-server-3412.log");

  if (cmd === "status") {
    const pids = listeners(PORT);
    const up = pids.length > 0 || portAnswers(PORT);
    console.log(up ? `test-server: UP on ${PORT} (PID ${pids.join(", ") || "unknown"})` : `test-server: DOWN (nothing listens on ${PORT})`);
    process.exit(up ? 0 : 3);
  }
  if (cmd === "guard") {
    refuseIfUp("build");
    console.log(`test-server: ${PORT} is down — building is safe`);
    return;
  }
  if (cmd === "stop") {
    const pids = listeners(PORT);
    if (!pids.length) {
      if (!portAnswers(PORT)) return console.log(`test-server: nothing listens on ${PORT}`);
      console.error(`test-server: ${PORT} answers but no tool (lsof/fuser) names its process — stop it by hand`);
      process.exit(1);
    }
    for (const pid of pids) killTree(pid);
    await sleep(1500);
    const left = listeners(PORT);
    if (left.length || portAnswers(PORT)) {
      console.error(`test-server: still listening after stop (PID ${left.join(", ") || "unknown"})`);
      process.exit(1);
    }
    return console.log(`test-server: stopped PID ${pids.join(", ")} on ${PORT}`);
  }
  if (cmd === "build") {
    refuseIfUp("build");
    const r = spawnSync("npx", ["next", "build"], {
      cwd: ROOT,
      stdio: "inherit",
      shell: process.platform === "win32",
      env: { ...process.env, SITE_URL, OKAMI24_ORDERING: process.env.OKAMI24_ORDERING ?? "on" },
    });
    process.exit(r.status ?? 1);
  }
  if (cmd === "start") {
    refuseIfUp("start a second server");
    if (!fs.existsSync(path.join(ROOT, ".next", "BUILD_ID"))) {
      console.error("test-server: no production build (.next/BUILD_ID missing) — run: node scripts/test-server.js build");
      process.exit(1);
    }
    const dataDir = process.env.OKAMI24_DATA_DIR || path.join(os.tmpdir(), "okami24-3412-data");
    fs.mkdirSync(dataDir, { recursive: true });
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    const buildId = prepareSnapshot();
    const fd = fs.openSync(logFile, "a");
    const child = spawn("npx", ["next", "start", "-p", String(PORT)], {
      cwd: SNAP,
      detached: true,
      windowsHide: true,
      shell: process.platform === "win32",
      stdio: ["ignore", fd, fd],
      env: { ...process.env, SITE_URL, OKAMI24_DATA_DIR: dataDir, OKAMI24_BACKUP_DISABLED: "1", OKAMI24_STARTUP_PROBE: "0" },
    });
    child.unref();
    const status = await waitUp(60000);
    if (!status) {
      console.error(`test-server: did not answer on ${PORT} within 60s — see ${logFile}`);
      process.exit(1);
    }
    return console.log(
      `test-server: UP on ${PORT} (PID ${listeners(PORT).join(", ")}) · build ${buildId} (copy in ${SNAP}) · GET / → ${status} · data ${dataDir} · log ${logFile}`,
    );
  }
  console.error("usage: node scripts/test-server.js <status|start|stop|build|guard> [--log <file>]");
  process.exit(2);
}

main();
