"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentStaff, staffAreaEnabled } from "@/lib/staff/auth";
import type { StaffActor } from "@/lib/staff/account-rules";
import { recordStaffAction } from "@/lib/staff/audit";
import { staffAdd, staffMatch, undoRefund } from "@/lib/staff/refunds";

/** The three refund buttons of /staff/slip (owner 10/11 "ทาง 1"). Rules = src/lib/staff/refund-rules.ts. */

function back(result: string): never {
  revalidatePath("/staff/slip");
  revalidatePath("/staff/sales");
  revalidatePath("/staff/owner");
  redirect(`/staff/slip?refund=${encodeURIComponent(result)}#refunds`);
}

const outcome = (d: { status: string; reason?: string }) => (d.status === "unmatched" || d.status === "error" ? `${d.status}:${d.reason}` : d.status);

async function guard(): Promise<StaffActor> {
  const actor = staffAreaEnabled() ? await currentStaff() : null;
  if (!actor) redirect("/staff");
  return actor;
}

/** A refund that now counts (matched) is recorded under the person; a refused try changed nothing and is not. */
const counted = (d: { status: string }) => d.status === "matched";

/** Tie an unmatched refund post to a slip by the end of its reference. */
export async function matchRefundAction(formData: FormData): Promise<void> {
  const actor = await guard();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) back("error:none");
  const ref = String(formData.get("ref") ?? "").slice(0, 40);
  const result = staffMatch(id, ref);
  if (counted(result)) recordStaffAction(actor, "line-refund-match", { detail: `สลิปลงท้าย ${ref.slice(-6)}` });
  back(outcome(result));
}

/** A refund not posted in the group (or an old one): amount in baht + the end of the slip's reference. */
export async function addRefundAction(formData: FormData): Promise<void> {
  const actor = await guard();
  const baht = Number(String(formData.get("amount") ?? "").replace(/[,\s]/g, ""));
  const satang = Number.isFinite(baht) ? Math.round(baht * 100) : NaN;
  const ref = String(formData.get("ref") ?? "").slice(0, 40);
  const result = staffAdd(satang, ref);
  if (counted(result)) recordStaffAction(actor, "line-refund-add", { detail: `฿${(satang / 100).toLocaleString("en-US")} · สลิปลงท้าย ${ref.slice(-6)}` });
  back(outcome(result));
}

export async function undoRefundAction(formData: FormData): Promise<void> {
  const actor = await guard();
  const id = Number(formData.get("id"));
  const undone = Number.isInteger(id) && undoRefund(id);
  if (undone) recordStaffAction(actor, "line-refund-undo");
  back(undone ? "undone" : "error:none");
}
