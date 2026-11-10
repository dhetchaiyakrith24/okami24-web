/**
 * Contract tests for the member tiers (tiers.ts — owner 10/11, draft v8) — pure, plain `tsx`, no database.
 */
import fs from "node:fs";
import path from "node:path";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/commerce/order-status";
import { COUNTED_STATUSES, MEMBER_ART, ROOM_ORDER, TIER_THRESHOLDS, countedOrders, ordersToFirstCard, tierAllows, tierFor } from "./tiers";

export function runTiersContractTests(): { name: string; passed: boolean; detail: string }[] {
  const results: { name: string; passed: boolean; detail: string }[] = [];
  const check = (name: string, condition: boolean, detail = "") => results.push({ name, passed: condition, detail });

  // The owner's numbers (draft v8: 1 = no card yet · 2+ crescent · 5+ half · 10+ full).
  const at = (n: number) => tierFor(n);
  check("0 and 1 order = no card", at(0) === null && at(1) === null);
  check("2-4 = crescent", at(2) === "crescent" && at(4) === "crescent");
  check("5-9 = half moon", at(5) === "half" && at(9) === "half");
  check("10 and more = full moon", at(10) === "full" && at(57) === "full");
  check("thresholds are 2 / 5 / 10 in rising order", TIER_THRESHOLDS.map((t) => t.from).join(",") === "2,5,10");

  // Which orders count: accepted by the shop only.
  const accepted: OrderStatus[] = ["approved", "processing", "shipped", "completed"];
  const notYet: OrderStatus[] = ["pending_payment", "payment_submitted", "awaiting_verification", "cancelled"];
  check("every order status is decided (counted or not)", ORDER_STATUSES.every((s) => accepted.includes(s) || notYet.includes(s)));
  check("approved → completed count", accepted.every((s) => COUNTED_STATUSES.has(s)));
  check("pending, slip-submitted, to-verify and cancelled do not count", notYet.every((s) => !COUNTED_STATUSES.has(s)));
  check(
    "a mixed history counts only the accepted ones",
    countedOrders(["completed", "cancelled", "shipped", "pending_payment", "awaiting_verification", "approved"]) === 3,
  );
  check("to-first-card: 0 → 2 · 1 → 1 · 2+ → 0", ordersToFirstCard(0) === 2 && ordersToFirstCard(1) === 1 && ordersToFirstCard(7) === 0);

  // The picture gate.
  check("no tier opens nothing", !tierAllows(null, "crescent") && !tierAllows(null, "full"));
  check("half moon opens half, not full", tierAllows("half", "half") && !tierAllows("half", "full"));
  check("full moon opens everything", tierAllows("full", "half") && tierAllows("full", "full"));
  const room = Object.entries(MEMBER_ART).filter(([, a]) => a.use === "room");
  check("every room picture needs the full moon", room.length > 0 && room.every(([, a]) => a.needs === "full"));
  check("the room order lists every room picture once", ROOM_ORDER.length === room.length && room.every(([n]) => ROOM_ORDER.includes(n)));
  check("no art name can climb out of the folder", Object.keys(MEMBER_ART).every((n) => /^[a-z0-9-]+\.webp$/.test(n)));

  // The files exist where the route reads them, and none sits in public/ (a public copy would skip the check).
  const dir = path.join(process.cwd(), "private", "member-art");
  const missing = Object.keys(MEMBER_ART).filter((n) => !fs.existsSync(path.join(dir, n)));
  check("every gated picture is in private/member-art/", missing.length === 0, missing.join(", "));
  const pub = path.join(process.cwd(), "public");
  const leaked: string[] = [];
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (Object.keys(MEMBER_ART).includes(e.name) || /member-art/.test(p)) leaked.push(path.relative(pub, p));
    }
  };
  walk(pub);
  check("no gated picture is in public/", leaked.length === 0, leaked.join(", "));
  return results;
}

if (require.main === module) {
  const results = runTiersContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail && !r.passed ? `\n      ${r.detail}` : ""}`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
