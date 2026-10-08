import "server-only";
import type { NextRequest } from "next/server";

/**
 * Same-site lock shared by the staff API routes (/staff/api/*). The staff cookie is SameSite=Lax (never sent on
 * a cross-site POST); this is the second lock. A request without an Origin header passes — browsers always send
 * one on a POST from a page, and the session check still applies.
 */
export function sameSiteRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    // Behind Cloudflare + Render the public host may arrive as X-Forwarded-Host; either one matching is fine.
    const originHost = new URL(origin).host;
    const hosts = [request.headers.get("host"), request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()];
    return hosts.includes(originHost);
  } catch {
    return false;
  }
}
