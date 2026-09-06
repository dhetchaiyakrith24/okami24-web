/**
 * OKami24 — boot-time check on the two native libraries this server cannot live without.
 *
 * Why this exists (2026-09-06): the first live deployment answered "Ready in 400ms", then died with
 * `Segmentation fault (core dumped)` — exit 139 — the moment a customer tapped "add to cart", which
 * is the first time anything opens the database. A segfault is the kernel killing the process: no
 * JavaScript exception, no stack, nothing in the log but the corpse. `try/catch` cannot see it and
 * `process.on("uncaughtException")` never fires, so the only way to locate it is to do each
 * dangerous step with a breadcrumb written first.
 *
 * The work runs in a CHILD process (`scripts/native-probe.js`), and that is the whole design. Doing
 * it inline would mean that if the addon really is what crashes, this server now dies at boot
 * instead of at the cart — turning a broken checkout into a site that will not stay up at all, with
 * the health check failing and the instance restarting in a loop. In a child, the crash is contained:
 * the exit code names it, the log names the step, and customers can still browse the shop while
 * someone reads it.
 *
 * Output goes through `fs.writeSync(1, ...)` rather than `console.log` because stdout is a pipe under
 * a process manager, and pipe writes are asynchronous — a crash immediately afterwards takes the
 * buffered text with it.
 *
 * This is scaffolding for a live incident, not permanent architecture. Once the cause is known and
 * fixed, the probe can go; `OKAMI24_STARTUP_PROBE=0` turns it off without a deploy in the meantime.
 */
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { describeMemory } from "@/lib/runtime-limits";

function say(line: string): void {
  try {
    fs.writeSync(1, `${line}\n`);
  } catch {
    // stdout closed — and a logger must never be the thing that throws
  }
}

/** Runs once per server process, from src/instrumentation.ts, before the first request.
 *  Never throws: a diagnostic that can take the server down is worse than no diagnostic. */
export function runStartupCheck(): void {
  try {
    say(`[startup] node ${process.version} ${process.platform}-${process.arch} · ${describeMemory()}`);

    if (process.env.OKAMI24_STARTUP_PROBE === "0") {
      say(`[startup] native probe: skipped (OKAMI24_STARTUP_PROBE=0)`);
      return;
    }

    const script = path.join(process.cwd(), "scripts", "native-probe.js");
    if (!fs.existsSync(script)) {
      say(`[startup] native probe: skipped — ${script} is not on this machine`);
      return;
    }

    // Synchronous on purpose: the point is to have the answer in the log BEFORE the first request
    // can reach the cart. It costs one boot delay — measured at roughly a second here, and Render's
    // half-CPU instance is slower, hence the generous timeout rather than a tight one.
    say(`[startup] native probe: running in a child process so a crash cannot take this server down`);
    const started = Date.now();
    const child = spawnSync(process.execPath, [script], {
      encoding: "utf8",
      timeout: 30_000,
      env: process.env,
    });
    const took = Date.now() - started;

    for (const line of `${child.stdout ?? ""}${child.stderr ?? ""}`.split("\n")) {
      if (line.trim()) say(`[probe] ${line}`);
    }

    // `spawnSync` reports a timeout as an error with the kill signal set, which reads as "could not
    // start" unless it is separated out — it did start, it hung, and those need different answers.
    const timedOut = Boolean(child.error && "signal" in child && child.signal);
    if (timedOut) {
      say(`[startup] !! native probe HUNG — no answer in 30s, killed by ${child.signal}. The step named above is where it stopped (a blocked filesystem lock is the usual cause).`);
    } else if (child.error) {
      say(`[startup] native probe: could not start — ${child.error.message}`);
    } else if (child.signal) {
      // The interesting branch: the probe was killed rather than returning. The last `[probe]` line
      // above is the step that did it.
      say(`[startup] !! native probe was KILLED by ${child.signal} after ${took}ms — the line above it is the step that crashes. This is the bug that takes the server down on "add to cart".`);
    } else if (child.status === 0) {
      say(`[startup] native probe: passed in ${took}ms — the addon, the disk, WAL and the migrations all work here`);
    } else {
      say(`[startup] !! native probe exited ${child.status} after ${took}ms${child.status === 139 ? " (139 = SIGSEGV — the step named above is the crash)" : ""}`);
    }
  } catch (err) {
    say(`[startup] self-check aborted — ${err instanceof Error ? err.message : String(err)}`);
  }
}
