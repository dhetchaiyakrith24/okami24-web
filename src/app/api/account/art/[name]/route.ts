import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getMember } from "@/lib/members/session";
import { getMemberStanding } from "@/lib/members/standing";
import { MEMBER_ART, tierAllows } from "@/lib/members/tiers";

/**
 * The member-card and full-moon-room pictures (owner 10/11, draft v8). The files live in private/member-art/ (never public/),
 * and this route checks on every request that the visitor is a signed-in member whose own counted orders reach the picture's
 * tier (tiers.ts MEMBER_ART). Anyone else gets a plain 404 — the same answer as a name that does not exist, so the route does
 * not tell who may see what. Never cached by a shared cache, never indexed, never framed into a link preview.
 */
export const dynamic = "force-dynamic";

const HEADERS = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow, noimageindex",
  "X-Content-Type-Options": "nosniff",
} as const;

const notFound = () => new NextResponse("Not found", { status: 404, headers: HEADERS });

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const art = Object.hasOwn(MEMBER_ART, name) ? MEMBER_ART[name] : undefined;
  if (!art) return notFound();
  const member = await getMember();
  if (!member) return notFound();
  if (!tierAllows(getMemberStanding(member.id).tier, art.needs)) return notFound();
  try {
    const body = await fs.readFile(path.join(process.cwd(), "private", "member-art", name));
    return new NextResponse(new Uint8Array(body), { headers: { ...HEADERS, "Content-Type": "image/webp" } });
  } catch {
    return notFound();
  }
}
