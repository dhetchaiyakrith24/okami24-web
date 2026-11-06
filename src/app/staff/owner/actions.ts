"use server";

import { redirect } from "next/navigation";
import { ownerLogout } from "@/lib/owner/auth";

export async function ownerLogoutAction(): Promise<void> {
  await ownerLogout();
  redirect("/staff/owner");
}
