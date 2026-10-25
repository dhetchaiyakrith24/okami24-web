import { NextResponse } from "next/server";
import { getMember } from "@/lib/members/session";

/**
 * Is this browser signed in as a member? — read by the header pill ("เข้าสู่ระบบ" ↔ "บัญชีสมาชิก", owner 26/10). The pages are
 * prerendered and cannot read the member cookie, so the header asks here after load (same pattern as /api/cart/count).
 * Answers a yes/no only — never the name or any id. Per visitor, so never cached.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const member = await getMember();
  return NextResponse.json(
    { signedIn: member !== null },
    { headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
