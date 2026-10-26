/**
 * OKami24 — staff jobs contract (owner 26/10, queue B3): every BSOT §9 status belongs to exactly one job box, the to-do
 * jobs are the ones a staff button moves on, and the colours follow the owner's rule (HANDOFF §18: yellow = waiting,
 * red = no, green = done).
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { ORDER_STATUSES } from "../commerce/order-status";
import { availableActions } from "./order-actions";
import { isStaffJob, jobOf, STAFF_JOB_ORDER, STAFF_JOBS, statusTone, TODO_JOBS } from "./jobs";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

for (const status of ORDER_STATUSES) {
  const owners = STAFF_JOB_ORDER.filter((j) => STAFF_JOBS[j].statuses.includes(status));
  check(`${status}: exactly one job`, owners.length === 1, owners.join(","));
}
check("every job is listed once", new Set(STAFF_JOB_ORDER).size === Object.keys(STAFF_JOBS).length);

for (const job of TODO_JOBS) {
  for (const status of STAFF_JOBS[job].statuses) {
    const steps = availableActions(status).filter((a) => a !== "cancel");
    check(`to-do job ${job} (${status}) has a staff button`, steps.length > 0, steps.join(","));
  }
}
check("cancelled = red", statusTone("cancelled") === "no");
check("shipped + completed = green", statusTone("shipped") === "done" && statusTone("completed") === "done");
check(
  "waiting statuses = yellow",
  (["pending_payment", "payment_submitted", "awaiting_verification", "approved", "processing"] as const).every((s) => statusTone(s) === "wait")
);
check("job of approved = รอส่งคลัง", jobOf("approved") === "warehouse");
check("filter names", isStaffJob("slip") && !isStaffJob("todo") && !isStaffJob(undefined) && !isStaffJob("x"));

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
