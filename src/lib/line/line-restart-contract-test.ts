/**
 * OKami24 — slip bot across website restarts contract (03/11; on 02/11 slips posted during deploys got no answer).
 *
 *   1. one webhookEventId is handled once: a redelivered copy (or a network duplicate) is skipped;
 *   2. an event without an id is still handled; the memory is bounded and forgets the oldest id first;
 *   3. running slip checks are counted while they run and released when they finish or throw; once SIGTERM's deadline
 *      passes, a check still running gives way to a "send the same slip again" reply (Render kills at 30 s);
 *   4. the webhook handler dedupes BEFORE any work, still answers a redelivered slip by reply, and never pushes;
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
  // 1. dedupe by webhookEventId
  const guard = createEventGuard();
  const id = "01HB1ZVG6Q7Z4Q8W9X0Y1Z2A3B";
  check("first sighting of an event is handled", guard.firstSighting(id) === true);
  check("the redelivered copy (same id) is skipped", guard.firstSighting(id) === false);
  check("a different event is handled", guard.firstSighting("01HB1ZVG6Q7Z4Q8W9X0Y1Z2A3C") === true);

  // 2. no id + bounded memory
  check("an event without an id is handled", guard.firstSighting(undefined) === true && guard.firstSighting(undefined) === true);
  const small = createEventGuard(3);
  ["a", "b", "c", "d"].forEach((x) => small.firstSighting(x));
  check("the oldest id is forgotten past the limit", small.firstSighting("a") === true);
  check("recent ids are still remembered", small.firstSighting("d") === false);

  // 3. in-flight count
  const counter = createEventGuard();
  let release: () => void = () => {};
  const slow = counter.track(new Promise<void>((res) => (release = res)));
  check("a running slip check is counted", counter.inFlight() === 1, String(counter.inFlight()));
  release();
  await slow;
  check("a finished slip check is released", counter.inFlight() === 0, String(counter.inFlight()));
  await counter.track(Promise.reject(new Error("boom"))).catch(() => {});
  check("a slip check that throws is released too", counter.inFlight() === 0, String(counter.inFlight()));

  // 3b. restart deadline: a slow check gives way to "send it again"; a quick one keeps its verdict
  const quickGuard = createEventGuard(10, 30);
  check("before any shutdown the verdict wins", (await quickGuard.raceShutdown(Promise.resolve("verdict"))) === "verdict");
  const pending = quickGuard.raceShutdown(new Promise<string>(() => {}));
  quickGuard.beginShutdown();
  check("a check still running at the deadline resolves null", (await pending) === null);
  check("after the deadline a new check is answered at once", (await quickGuard.raceShutdown(new Promise<string>(() => {}))) === null);
  const restart = formatRestartSlipReply("2026-11-02T15:05:00.000Z");
  check("restart reply asks to send the same slip again", restart.includes("ส่งรูปสลิปเดิมอีกครั้ง"), restart);
  check("restart reply explains a 'seen before' at this Bangkok time", restart.includes("เคยตรวจแล้ว") && restart.includes("02/11 22:05"), restart);

  // 4. the handler wiring (server-only module — read as text, not imported)
  const webhook = readFileSync(path.join(process.cwd(), "src", "lib", "line", "webhook.ts"), "utf8");
  const loop = webhook.slice(webhook.indexOf("export async function handleEvents"));
  check(
    "handleEvents dedupes before doing anything with the event",
    loop.indexOf("guard.firstSighting(event.webhookEventId)") > -1 && loop.indexOf("guard.firstSighting") < loop.indexOf("recordJoin"),
  );
  check("slip checks are tracked for shutdown", webhook.includes("guard.track(handleSlipImage(event))"));
  check("the slip verdict (or the restart line) goes out by reply", webhook.includes("replyText(replyToken, verdict ?? formatRestartSlipReply(startedAt))"));
  check("the slip check is raced against the restart deadline", webhook.includes("guard.raceShutdown(slipVerdictText(messageId))"));
  check("SIGTERM starts the restart deadline", /process\.once\("SIGTERM"[\s\S]{0,80}guard\.beginShutdown\(\)/.test(webhook));
  check("the bot never pushes (push = quota = owner's call)", !/push(Text|TextWithImage)/.test(webhook));
  check("a refused reply on a redelivered event is logged", webhook.includes("redelivered event, no push sent"));

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
