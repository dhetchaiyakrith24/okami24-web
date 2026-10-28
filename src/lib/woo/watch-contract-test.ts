/**
 * OKami24 — the Shipnity stock light (owner 28/10, watch-rules.ts).
 *
 *   1. down: no live key · never a number · an order sent more than DOWN_AFTER_ORDER_MIN ago with no number since;
 *      an order inside that window, or one older than LOOKBACK_HOURS, or a number after the order = not down;
 *   2. quiet after QUIET_HOURS with no such order; ok otherwise;
 *   3. LINE only on the change into red and out of red; the alert text has no customer data and points at /staff/dev.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { alertFor, DOWN_AFTER_ORDER_MIN, formatFeedAlert, formatFeedRecovered, judgeFeed, LOOKBACK_HOURS, QUIET_HOURS, type FeedFacts } from "./watch-rules";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

const now = Date.parse("2026-10-28T16:00:00.000Z");
const ago = (min: number) => new Date(now - min * 60_000).toISOString();
const facts = (over: Partial<FeedFacts>): FeedFacts => ({ now, activeKeys: 1, lastPushAt: ago(5), reportedCodes: 738, sends: [], ...over });

// 1. down
check("no live key → down", judgeFeed(facts({ activeKeys: 0 })).state === "down");
check("never a number → down", judgeFeed(facts({ lastPushAt: null, reportedCodes: 0 })).state === "down");
const stuck = judgeFeed(facts({ lastPushAt: ago(DOWN_AFTER_ORDER_MIN + 60), sends: [{ orderNumber: "OK-1", sentAt: ago(DOWN_AFTER_ORDER_MIN + 10) }] }));
check("order sent past the window, no number since → down", stuck.state === "down" && !!stuck.reason?.includes("OK-1"), JSON.stringify(stuck));
check("order still inside the window → not down", judgeFeed(facts({ lastPushAt: ago(600), sends: [{ orderNumber: "OK-2", sentAt: ago(DOWN_AFTER_ORDER_MIN - 10) }] })).state !== "down");
check("a number arrived after the order → ok", judgeFeed(facts({ lastPushAt: ago(30), sends: [{ orderNumber: "OK-3", sentAt: ago(DOWN_AFTER_ORDER_MIN + 60) }] })).state === "ok");
check("order older than the lookback → not down", judgeFeed(facts({ lastPushAt: ago(LOOKBACK_HOURS * 60 + 120), sends: [{ orderNumber: "OK-4", sentAt: ago(LOOKBACK_HOURS * 60 + 60) }] })).state !== "down");

// 2. quiet / ok
const quiet = judgeFeed(facts({ lastPushAt: ago(QUIET_HOURS * 60 + 5) }));
check("no number for QUIET_HOURS, no order → quiet", quiet.state === "quiet" && !!quiet.reason, JSON.stringify(quiet));
check("a recent number → ok, no reason", JSON.stringify(judgeFeed(facts({}))) === JSON.stringify({ lastPushAt: ago(5), reportedCodes: 738, state: "ok", reason: null }));

// 3. alerts
check("ok → down alerts", alertFor("ok", "down") === "down");
check("first run straight into down alerts", alertFor(null, "down") === "down");
check("down → down stays silent", alertFor("down", "down") === null);
check("down → ok says recovered", alertFor("down", "ok") === "recovered" && alertFor("down", "quiet") === "recovered");
check("ok ↔ quiet stays silent", alertFor("ok", "quiet") === null && alertFor("quiet", "ok") === null && alertFor(null, "ok") === null);
const text = formatFeedAlert(stuck, "https://okami24.store");
check("alert text points at /staff/dev and names the order, no phone", text.includes("/staff/dev") && text.includes("OK-1") && !/0[689]\d{8}/.test(text), text);
check("recovered text names the last push", formatFeedRecovered(judgeFeed(facts({}))).includes("ล่าสุด"));

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
