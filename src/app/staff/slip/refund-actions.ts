"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { staffAdd, staffMatch, undoRefund } from "@/lib/staff/refunds";

/** The three refund buttons of /staff/slip (owner 10/11 "ทาง 1"). Rules = src/lib/staff/refund-rules.ts. */

function back(result: string): never {
  revalidatePath("/staff/slip");
  revalidatePath("/staff/sales");
  revalidatePath("/staff/owner");
  redirect(`/staff/slip?refund=${encodeURIComponent(result)}#refunds`);
}

const outcome = (d: { status: string; reason?: string }) => (d.status === "unmatched" || d.status === "error" ? `${d.status}:${d.reason}` : d.status);

async function guard(): Promise<void> {
  if (!staffAreaEnabled() || !(await isStaff())) redirect("/staff");
}

/** Tie an unmatched refund post to a slip by the end of its reference. */
export async function matchRefundAction(formData: FormData): Promise<void> {
  await guard();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) back("error:none");
  back(outcome(staffMatch(id, String(formData.get("ref") ?? "").slice(0, 40))));
}

/** A refund not posted in the group (or an old one): amount in baht + the end of the slip's reference. */
export async function addRefundAction(formData: FormData): Promise<void> {
  await guard();
  const baht = Number(String(formData.get("amount") ?? "").replace(/[,\s]/g, ""));
  const satang = Number.isFinite(baht) ? Math.round(baht * 100) : NaN;
  back(outcome(staffAdd(satang, String(formData.get("ref") ?? "").slice(0, 40))));
}

export async function undoRefundAction(formData: FormData): Promise<void> {
  await guard();
  const id = Number(formData.get("id"));
  back(Number.isInteger(id) && undoRefund(id) ? "undone" : "error:none");
}
