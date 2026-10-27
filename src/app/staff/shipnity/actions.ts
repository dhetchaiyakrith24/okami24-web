"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { createKey, revokeKey } from "@/lib/woo/keys";

/** /staff/shipnity (Shipnity link step 1, owner 27/10): make a key pair for the warehouse, or switch one off. */

export type NewKeyState = { consumerKey: string; consumerSecret: string } | null;

export async function createWooKeyAction(_prev: NewKeyState, formData: FormData): Promise<NewKeyState> {
  if (!staffAreaEnabled() || !(await isStaff())) redirect("/staff");
  const key = createKey(String(formData.get("description") ?? ""));
  revalidatePath("/staff/shipnity");
  // The only time the pair leaves the server: shown once on the page, never stored in the clear, never logged.
  return { consumerKey: key.consumerKey, consumerSecret: key.consumerSecret };
}

export async function revokeWooKeyAction(formData: FormData): Promise<void> {
  if (!staffAreaEnabled() || !(await isStaff())) redirect("/staff");
  const id = Number(formData.get("id"));
  if (Number.isInteger(id) && id > 0) revokeKey(id);
  revalidatePath("/staff/shipnity");
  redirect("/staff/shipnity");
}
