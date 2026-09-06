/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
/**
 * OKami24 — the gate: proves the better-sqlite3 binary THIS machine will load actually works,
 * and fails the build if it does not. Runs between `npm ci` and `next build` (render.yaml).
 *
 *   node scripts/check-native-sqlite.js      # exit 0 = safe to ship · anything else = do not
 *
 * Why (2026-09-06): the live site segfaulted (exit 139) on the first "add to cart". The owner ran
 * the pieces by hand in Render's shell and found that merely loading the shipped binary,
 * `prebuilds/linux-x64.node`, kills the process — no database, no disk, no memory involved.
 *
 * The cause, established from the sources of both sides (better-sqlite3 issue #1514 and Node's own
 * src/node_api.cc, 2026-09-06): better-sqlite3 13 declares that it needs **Node-API version 10**
 * (binding.gyp: `NAPI_VERSION=10`). Node 22.11.0 supports Node-API up to **version 9** — 10 only
 * arrived in 22.14.0. Node means to refuse such a module with a readable error, but on the versions
 * that cannot serve it the refusal path dereferences a null environment and the process dies with
 * SIGSEGV instead of a message. Compiling the addon from source does not help: the compiled file
 * declares the same version 10 and dies the same way (#1514 confirms). The fix is a Node that speaks
 * Node-API 10 — 22.14 or later, or 24 LTS, which is the version the shipped Linux binary was built
 * with. Which one is the owner's call, in render.yaml.
 *
 * So the FIRST check here is the one that would have named this in one line: is this Node's
 * Node-API version at least what the package asks for? It is answered before anything native is
 * loaded, because loading is what crashes. Only then is the addon loaded and a database opened.
 *
 * A segfault while loading still exits this process with a signal — non-zero — and fails the build.
 * Nothing here tries to catch it; a build that fails loudly is the point.
 */
const fs = require("node:fs");
const path = require("node:path");

const say = (line) => {
  try {
    fs.writeSync(1, `${line}\n`);
  } catch {
    /* stdout gone */
  }
};
const fail = (msg) => {
  say(`[native-check] !! ${msg}`);
  process.exit(1);
};

const pkgDir = path.dirname(require.resolve("better-sqlite3/package.json"));
const pkgVersion = require(path.join(pkgDir, "package.json")).version;
const compiled = path.join(pkgDir, "build", "Release", "better_sqlite3.node");
// Absolute path on purpose: the package's `exports` map hides lib/binding.js from a bare require,
// and this is the resolver the app itself uses, so asking it beats re-deriving its rule.
const resolver = require(path.join(pkgDir, "lib", "binding.js"));

say(`[native-check] node ${process.version} ${process.platform}-${process.arch} · Node-API ${process.versions.napi} · better-sqlite3 ${pkgVersion}`);

// ---- 1. The check that names the 2026-09-06 crash without triggering it ---------------------
const gyp = fs.readFileSync(path.join(pkgDir, "binding.gyp"), "utf8");
const declared = Number((gyp.match(/NAPI_VERSION=(\d+)/) || [])[1]);
const supported = Number(process.versions.napi);
if (declared && supported && supported < declared) {
  say(`[native-check] !! Node รุ่นนี้ (${process.version}) เก่าเกินไปสำหรับตัวจัดการฐานข้อมูล — ต้องเปลี่ยนค่า NODE_VERSION เป็น 24.14.1 (หรือ 22.x ที่ ≥ 22.14.0) ทั้งใน render.yaml และในหน้า Environment ของ Render แล้วกด Manual Deploy ใหม่ · build นี้หยุดไว้ก่อน เว็บจะไม่ถูกแทนที่`);
  fail(
    `better-sqlite3 ${pkgVersion} needs Node-API version ${declared}, but Node ${process.version} only speaks version ${supported}. ` +
      `Loading the addon on this Node crashes the process (SIGSEGV) instead of raising an error — see docs/INCIDENT_2026-09-06_sqlite-segfault.md. ` +
      `Fix: set NODE_VERSION to a Node that has Node-API ${declared} (22.14.0 or later, or 24 LTS) — in render.yaml AND in the service's Environment tab, whichever the service reads. Compiling from source will not help; the compiled file declares the same version.`
  );
}
say(`[native-check] Node-API ${supported} ≥ ${declared || "?"} required — this Node can load the addon`);

// ---- 2. Only when the source build was requested: it must have produced a binary that wins ----
const fromSource = process.env.OKAMI24_SQLITE_FROM_SOURCE === "1";
const prebuild = resolver.getPrebuildPath();
if (fromSource) {
  if (!fs.existsSync(compiled)) {
    fail(`OKAMI24_SQLITE_FROM_SOURCE=1 but there is no compiled binary at ${compiled} — the source build did not run or did not finish. Look for "gyp ERR" above.`);
  }
  if (prebuild) {
    fail(`a shipped prebuild is still at ${prebuild}, and better-sqlite3 loads prebuilds BEFORE its own build — the compiled binary would never be used. scripts/build-native-sqlite.js removes it; something put it back.`);
  }
  say(`[native-check] source build present and no prebuild in the way → the app will load ${compiled}`);
} else {
  say(`[native-check] will load ${prebuild ?? compiled}`);
}

// ---- 3. Load it and use it — the crash, if there is one, happens on the next line -------------
say(`[native-check] loading the addon and opening an in-memory database`);
const Database = require("better-sqlite3");
const db = new Database(":memory:");
const sqliteVersion = db.prepare("SELECT sqlite_version() AS v").get().v;
db.exec("CREATE TABLE t (n INTEGER)");
db.prepare("INSERT INTO t (n) VALUES (?)").run(42);
const back = db.prepare("SELECT n FROM t").get().n;
db.close();
if (back !== 42) fail(`wrote 42, read back ${back}`);

// Evidence, not a check: the diagnostic report lists every shared object mapped into the process,
// so this names the file that really loaded rather than the one we expected to.
try {
  const mapped = process.report.getReport().sharedObjects.filter((p) => /better_sqlite3|prebuilds[\\/]/.test(p));
  if (mapped.length) say(`[native-check] mapped in this process: ${mapped.join(", ")}`);
} catch {
  /* report unavailable — optional */
}

say(`[native-check] OK — SQLite ${sqliteVersion} opens, writes and reads on this Node`);
