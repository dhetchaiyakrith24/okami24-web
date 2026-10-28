"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { createKey, revokeKey } from "@/lib/woo/keys";
import { setApproval } from "@/lib/woo/webhooks";

/** /staff/shipnity (Shipnity link step 1, owner 27/10): make a key pair for the warehouse, or switch one off. */

export type NewKeyState = { consumerKey: string; consumerSecret: string } | null;

export async function createWooKeyAction(_prev: NewKeyState, formData: FormData): Promise<NewKeyState> {
  if (!staffAreaEnabled() || !(await isStaff())) redirect("/staff");
  const key = createKey(String(formData.get("description") ?? ""));
  revalidatePath("/staff/shipnity");
  // The only time the pair leaves the server: shown once on the page, never stored in the clear, never logged.
  return { consumerKey: key.consumerKey, consumerSecret: key.consumerSecret };
}

/** Allow (or stop) sending orders to one of the webhooks Shipnity registered — the owner's OK before any customer
 *  name, address or phone leaves the site (owner 28/10). */
export async function approveWebhookAction(formData: FormData): Promise<void> {
  if (!staffAreaEnabled() || !(await isStaff())) redirect("/staff");
  const id = Number(formData.get("id"));
  if (Number.isInteger(id) && id > 0) setApproval(id, formData.get("approve") === "1");
  revalidatePath("/staff/shipnity");
  redirect("/staff/shipnity#hooks");
}

export async function revokeWooKeyAction(formData: FormData): Promise<void> {
  if (!staffAreaEnabled() || !(await isStaff())) redirect("/staff");
  const id = Number(formData.get("id"));
  if (Number.isInteger(id) && id > 0) revokeKey(id);
  revalidatePath("/staff/shipnity");
  redirect("/staff/shipnity");
}
