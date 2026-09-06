/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
/**
 * OKami24 — exercises the two native libraries in a SEPARATE process, so that if one of them takes
 * the process down, it takes this one down and not the web server.
 *
 *   node scripts/native-probe.js            # uses OKAMI24_DATA_DIR, else <cwd>/.data
 *
 * Written for the live incident of 2026-09-06: the first deployment answered "Ready in 400ms" and
 * then died with `Segmentation fault (core dumped)` — exit 139 — on the first "add to cart", which
 * is the first time anything opens the database. A segfault leaves no exception, no stack, and
 * nothing in the log but the corpse, so the only way to find it is to do each dangerous step with a
 * breadcrumb written first, and to do it somewhere a death is survivable.
 *
 * The server runs this at boot via src/lib/db/startup-check.ts and reports the exit code. A 139 here
 * names the exact step in the last line printed, and the site stays up while we read it.
 *
 * Every write is `fs.writeSync(1, ...)`: stdout is a pipe under a process manager and pipe writes
 * are asynchronous, so a crash microseconds later would swallow a `console.log`.
 */
const fs = require("node:fs");
const path = require("node:path");

const say = (line) => {
  try {
    fs.writeSync(1, `${line}\n`);
  } catch {
    /* stdout gone; a logger must never be the thing that throws */
  }
};

const dataDir = process.env.OKAMI24_DATA_DIR?.trim()
  ? path.resolve(process.env.OKAMI24_DATA_DIR.trim())
  : path.join(process.cwd(), ".data");

function reportEnvironment() {
  let glibc;
  try {
    glibc = process.report?.getReport()?.header?.glibcVersionRuntime;
  } catch {
    glibc = undefined;
  }
  say(`node ${process.version} ${process.platform}-${process.arch} · glibcVersionRuntime=${glibc ?? "(absent)"}`);

  // Mirrors better-sqlite3's own rule in lib/binding.js: musl is assumed whenever the diagnostic
  // report carries no runtime glibc version. Getting this wrong means dlopen'ing a musl-linked
  // shared object into a glibc process, which is exactly the kind of thing that segfaults rather
  // than failing cleanly — so the chosen file is named here before anything loads it.
  const isMusl = process.platform === "linux" && !glibc;
  say(`better-sqlite3 will load prebuilds/${isMusl ? "linuxmusl" : process.platform}-${process.arch}.node`);
  if (isMusl) say(`!! that is the MUSL build — wrong on a glibc host (Debian/Ubuntu, which Render uses)`);

  const constrained = typeof process.constrainedMemory === "function" ? process.constrainedMemory() : 0;
  const mb = (b) => `${Math.round(b / 1024 / 1024)}MB`;
  say(`memory: container limit ${constrained ? mb(constrained) : "none"} · rss ${mb(process.memoryUsage().rss)}`);
}

function probeSqlite() {
  const probe = path.join(dataDir, ".native-probe.db");
  const leftovers = [probe, `${probe}-wal`, `${probe}-shm`];

  say(`data dir: ${dataDir}`);
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, ".native-probe.txt"), "ok");
  fs.unlinkSync(path.join(dataDir, ".native-probe.txt"));
  say(`data dir is writable`);

  for (const f of leftovers) if (fs.existsSync(f)) fs.unlinkSync(f);

  say(`sqlite: loading the native addon`);
  const Database = require("better-sqlite3");

  say(`sqlite: opening ${probe} on the real disk`);
  const db = new Database(probe);

  say(`sqlite: journal_mode = WAL`);
  const mode = db.pragma("journal_mode = WAL", { simple: true });
  say(`sqlite: journal mode is ${mode}`);

  // The real first "add to cart" also creates the schema, which is where the live crash actually
  // happened — an empty file open would not have reached it. Each migration is named before it runs,
  // so a death in one of them says which.
  const migrationsDir = path.join(process.cwd(), "src", "lib", "db", "migrations");
  if (fs.existsSync(migrationsDir)) {
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
    say(`sqlite: replaying ${files.length} migration(s) into the throwaway file`);
    for (const file of files) {
      say(`sqlite: migration ${file}`);
      db.exec(fs.readFileSync(path.join(migrationsDir, file), "utf8"));
    }
  } else {
    say(`sqlite: !! no migrations dir at ${migrationsDir} — the server would fail here too`);
  }

  say(`sqlite: write + read back`);
  db.exec("CREATE TABLE __probe (v TEXT)");
  db.prepare("INSERT INTO __probe (v) VALUES (?)").run("ok");
  const row = db.prepare("SELECT v FROM __probe").get();

  db.close();
  for (const f of leftovers) if (fs.existsSync(f)) fs.unlinkSync(f);
  say(`sqlite: OK (read back ${row?.v}) — addon, disk, WAL and every migration all work`);
}

async function probeSharp() {
  say(`sharp: loading`);
  const sharp = require("sharp");
  say(`sharp: libvips ${sharp.versions.vips} · concurrency ${sharp.concurrency()}`);
  // A real decode+encode round trip, which is what next/image does on a product page.
  await sharp({ create: { width: 64, height: 64, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .webp()
    .toBuffer();
  say(`sharp: OK`);
}

(async () => {
  reportEnvironment();
  probeSqlite();
  await probeSharp();
  say(`all probes passed`);
})().catch((err) => {
  say(`!! FAILED — ${err && err.message ? err.message : String(err)}`);
  process.exit(1);
});
