"use server";

import { redirect } from "next/navigation";
import { destroyMemberSession } from "@/lib/members/session";

/** "Sign out" on /account — revokes this browser's member session only (other devices stay signed in). */
export async function signOutAction(): Promise<void> {
  await destroyMemberSession();
  redirect("/");
}
