/**
 * The staff pages sorted by JOB, not by status (owner 26/10, queue B3: "หาออเดอร์ที่ต้องทำไม่เจอ"). Each job is one box on
 * the staff home with its count and one filter of /staff/orders — pure, no I/O, so jobs-contract-test.ts can hold every
 * BSOT §9 status to exactly one job.
 *
 * Colours (owner 26/10, HANDOFF §18): yellow = waiting on someone (`unverified` on the staff side), red = no / cancelled
 * (`danger`), green = done (`verified`).
 */
import type { OrderStatus } from "../commerce/order-status";

export type StaffJob = "slip" | "warehouse" | "tracking" | "done" | "cancelled" | "unpaid";

export type JobTone = "wait" | "done" | "no" | "quiet";

export interface StaffJobInfo {
  label: string;
  /** One short line under the label on the home box — what the staff member does next. */
  hint: string;
  statuses: readonly OrderStatus[];
  tone: JobTone;
}

/** In working order: the first three are the team's to-do, then the finished, the cancelled, and the not-yet-paid. */
export const STAFF_JOBS: Record<StaffJob, StaffJobInfo> = {
  slip: { label: "รอตรวจสลิป", hint: "ดูสลิป แล้วกดยืนยันยอดเงิน", statuses: ["payment_submitted", "awaiting_verification"], tone: "wait" },
  warehouse: { label: "รอส่งคลัง", hint: "คัดลอกรายการส่งคลัง", statuses: ["approved"], tone: "wait" },
  tracking: { label: "รอใส่เลขพัสดุ", hint: "ใส่ขนส่งและเลขพัสดุ", statuses: ["processing"], tone: "wait" },
  done: { label: "ส่งแล้ว", hint: "ส่งของแล้ว / ลูกค้าได้รับแล้ว", statuses: ["shipped", "completed"], tone: "done" },
  cancelled: { label: "ยกเลิก", hint: "ออเดอร์ที่ยกเลิก", statuses: ["cancelled"], tone: "no" },
  unpaid: { label: "ยังไม่จ่าย", hint: "ลูกค้ายังไม่แนบสลิป · ไม่จ่ายใน 24 ชม. ระบบยกเลิกเอง", statuses: ["pending_payment"], tone: "wait" },
};

export const STAFF_JOB_ORDER: readonly StaffJob[] = ["slip", "warehouse", "tracking", "done", "cancelled", "unpaid"];

/** The three jobs that are the team's to-do. */
export const TODO_JOBS: readonly StaffJob[] = ["slip", "warehouse", "tracking"];

export function isStaffJob(value: string | undefined): value is StaffJob {
  return value !== undefined && (STAFF_JOB_ORDER as readonly string[]).includes(value);
}

export function jobOf(status: OrderStatus): StaffJob {
  for (const job of STAFF_JOB_ORDER) if (STAFF_JOBS[job].statuses.includes(status)) return job;
  // Unreachable while every status has a job (jobs-contract-test.ts); a new status shows among the waiting ones.
  return "slip";
}

/** Tailwind classes for a status pill / box accent by tone — yellow waiting, green done, red no, plain otherwise. */
export const TONE_CLASS: Record<JobTone, { pill: string; text: string; border: string }> = {
  wait: { pill: "border-unverified/50 bg-unverified/10 text-unverified", text: "text-unverified", border: "border-unverified/50" },
  done: { pill: "border-verified/40 bg-verified/10 text-verified", text: "text-verified", border: "border-verified/40" },
  no: { pill: "border-danger/50 bg-danger/10 text-danger", text: "text-danger", border: "border-danger/50" },
  quiet: { pill: "border-surface-border text-foreground-muted", text: "text-foreground-muted", border: "border-surface-border-soft" },
};

/** The status in the TEAM's words (designer 26/10: the customer's "อนุมัติแล้ว" does not say it waits for the warehouse) —
 *  the same words as the job boxes. Display only: the stored status and the customer's labels (order-status.ts) stay. */
export const STAFF_STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "รอลูกค้าโอน",
  payment_submitted: "รอตรวจสลิป",
  awaiting_verification: "รอตรวจสลิป",
  approved: "รอส่งคลัง",
  processing: "รอใส่เลขพัสดุ",
  shipped: "ส่งแล้ว",
  completed: "เสร็จ",
  cancelled: "ยกเลิก",
};

/** The tone of one order's status: its job's tone. */
export function statusTone(status: OrderStatus): JobTone {
  return STAFF_JOBS[jobOf(status)].tone;
}
