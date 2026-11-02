/**
 * OKami24 — slip bot across website restarts contract (03/11; on 02/11 slips posted during deploys got no answer).
 *
 *   1. running slip checks are counted while they run and released when they finish or throw;
 *   2. once SIGTERM's deadline passes, a check still running gives way to a "send the same slip again" reply (Render
 *      kills the old server 30 s after SIGTERM); a quick check keeps its real verdict;
 *   3. the restart reply asks for the same slip again and explains a later "seen before" at that Bangkok time;
 *   4. the webhook handler races the check against the deadline, answers by reply only, and never pushes;
 *   5. the route answers 200 at once and hands events to `after()` (which `next start` drains on SIGTERM).
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { createEventGuard } from "./event-guard";
import { formatRestartSlipReply } from "./messages";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

async function main(): Promise<void> {
  // 1. in-flight count
  const counter = createEventGuard();
  let release: () => void = () => {};
  const slow = counter.track(new Promise<void>((res) => (release = res)));
  check("a running slip check is counted", counter.inFlight() === 1, String(counter.inFlight()));
  release();
  await slow;
  check("a finished slip check is released", counter.inFlight() === 0, String(counter.inFlight()));
  await counter.track(Promise.reject(new Error("boom"))).catch(() => {});
  check("a slip check that throws is released too", counter.inFlight() === 0, String(counter.inFlight()));

  // 2. restart deadline
  const guard = createEventGuard(30);
  check("before any shutdown the verdict wins", (await guard.raceShutdown(Promise.resolve("verdict"))) === "verdict");
  const pending = guard.raceShutdown(new Promise<string>(() => {}));
  guard.beginShutdown();
  check("after SIGTERM a quick check still keeps its verdict", (await guard.raceShutdown(Promise.resolve("quick"))) === "quick");
  check("a check still running at the deadline resolves null", (await pending) === null);
  check("after the deadline a new check is answered at once", (await guard.raceShutdown(new Promise<string>(() => {}))) === null);

  // 3. restart reply
  const restart = formatRestartSlipReply("2026-11-02T15:05:00.000Z");
  check("restart reply asks to send the same slip again", restart.includes("ส่งรูปสลิปเดิมอีกครั้ง"), restart);
  check("restart reply explains a 'seen before' at this Bangkok time", restart.includes("เคยตรวจแล้ว") && restart.includes("02/11 22:05"), restart);

  // 4. the handler wiring (server-only module — read as text, not imported)
  const webhook = readFileSync(path.join(process.cwd(), "src", "lib", "line", "webhook.ts"), "utf8");
  check("slip checks are tracked for shutdown", webhook.includes("guard.track(handleSlipImage(event))"));
  check("the slip check is raced against the restart deadline", webhook.includes("guard.raceShutdown(slipVerdictText(messageId))"));
  check("the verdict (or the restart line) goes out by reply", webhook.includes("replyText(replyToken, verdict ?? formatRestartSlipReply(startedAt))"));
  check("SIGTERM starts the restart deadline", /process\.once\("SIGTERM"[\s\S]{0,80}guard\.beginShutdown\(\)/.test(webhook));
  check("the bot never pushes (owner 03/11: no push fallback)", !/push(Text|TextWithImage)/.test(webhook));

  // 5. the route
  const route = readFileSync(path.join(process.cwd(), "src", "app", "api", "line", "webhook", "route.ts"), "utf8");
  check("the route hands events to after()", route.includes("after(() => handleEvents(events))"));
}

main().then(() => {
  for (const res of results) {
    console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
  }
  const failed = results.filter((x) => !x.passed);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
});
