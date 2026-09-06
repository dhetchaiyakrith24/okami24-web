/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
/**
 * OKami24 — compiles better-sqlite3 from source on a Linux host and makes that build the ONLY
 * binary the app can load. OPT-IN: runs only with `OKAMI24_SQLITE_FROM_SOURCE=1`, otherwise it
 * prints one line and exits 0. Sits between `npm ci` and the gate in render.yaml's buildCommand.
 *
 *   OKAMI24_SQLITE_FROM_SOURCE=1 node scripts/build-native-sqlite.js
 *
 * History (2026-09-06): this was written as THE fix for the live segfault, on the theory that the
 * shipped `prebuilds/linux-x64.node` was built for a different machine. It is not the fix. The
 * crash is Node 22.11.0 refusing a module that declares Node-API version 10 (Node-API 10 exists
 * from 22.14.0) and dying on the refusal path instead of raising an error — see
 * scripts/check-native-sqlite.js and docs/INCIDENT_2026-09-06_sqlite-segfault.md. A binary compiled
 * here declares the same version 10 and dies the same way (better-sqlite3 issue #1514 confirms it).
 * The fix is a newer Node; the owner chooses which in render.yaml.
 *
 * Kept, opt-in, because it is correct and tested as far as a Windows machine can test it, and
 * because "compile on the host" is the standard answer the next time a shipped binary really does
 * not fit the host (a glibc mismatch, an unusual CPU). Two things about the package make the obvious
 * commands do nothing, and this script exists to do them right:
 *
 *   1. `npm rebuild better-sqlite3 --build-from-source` compiles NOTHING. The package's binding.gyp
 *      checks for a shipped prebuild and, finding one, turns every target into `type: none` — stamp
 *      files in build/Release and no `.node`, exactly what the owner found on the server. Only the
 *      gyp variable `force_build=1` overrides that; it can be passed on the command line or as
 *      `npm_config_force_build=1` (node-gyp normalises the name to `force-build` and restores the
 *      underscore when it writes config.gypi — both reach gyp as `force_build`). The package's own
 *      `build-release` script is the supported way, so that is what runs. `node-gyp` resolves
 *      through the copy npm bundles and puts on PATH for every lifecycle script.
 *
 *   2. Compiling is not enough. lib/binding.js loads a prebuild FIRST and falls back to
 *      build/Release only when none exists for the platform, so every `prebuilds/linux*.node` is
 *      removed after the build. Windows and macOS ones stay; they are never consulted here.
 *
 * The gate (scripts/check-native-sqlite.js) runs next in the buildCommand and, when this script was
 * enabled, insists that the compiled binary exists and that nothing shadows it.
 */
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const say = (line) => {
  try {
    fs.writeSync(1, `${line}\n`);
  } catch {
    /* stdout gone */
  }
};

if (process.env.OKAMI24_SQLITE_FROM_SOURCE !== "1") {
  say(`[native-build] not requested (set OKAMI24_SQLITE_FROM_SOURCE=1 to compile better-sqlite3 on this host) — using the shipped binary`);
  process.exit(0);
}
if (process.platform !== "linux") {
  say(`[native-build] ${process.platform}: nothing to do — only Linux hosts are built from source`);
  process.exit(0);
}

const pkgDir = path.dirname(require.resolve("better-sqlite3/package.json"));

say(`[native-build] compiling better-sqlite3 from source in ${pkgDir}`);
say(`[native-build] → npm run build-release  (= node-gyp clean && node-gyp rebuild --release --force_build=1)`);
const build = spawnSync("npm", ["run", "build-release"], { cwd: pkgDir, stdio: "inherit" });
if (build.status !== 0) {
  say(`[native-build] !! compile failed (exit ${build.status ?? build.signal}). Look for "gyp ERR" above — on a bare host that usually means python3, make or g++ is missing.`);
  process.exit(1);
}

const prebuildsDir = path.join(pkgDir, "prebuilds");
const shipped = fs.existsSync(prebuildsDir) ? fs.readdirSync(prebuildsDir).filter((f) => /^linux.*\.node$/.test(f)) : [];
for (const f of shipped) {
  fs.rmSync(path.join(prebuildsDir, f), { force: true });
  say(`[native-build] removed prebuilds/${f} — the shipped binary better-sqlite3 would have loaded instead of the fresh build`);
}
if (shipped.length === 0) say(`[native-build] no Linux prebuilds present (already removed)`);
say(`[native-build] done — scripts/check-native-sqlite.js will now insist on the compiled binary`);
