import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Image-fix round 2026-09-30 (owner: "Cloudflare ส่ง JPEG — อยากให้แก้"): make the image optimizer answer WebP
 * to every request, so the edge can only ever cache WebP.
 *
 * Why: `/_next/image` picks its output format from the request's `Accept` header, and for a WebP source that a
 * client does not accept it falls back to JPEG (node_modules/next/dist/server/image-optimizer.js). JPEG has no
 * alpha channel, so our transparent product photos come out on a solid BLACK square. Cloudflare caches
 * `/_next/image` by URL without `Accept` (the 2026-09-09 cache rule, LAUNCH_AUDIT item 46), so whichever client
 * missed the cache first — a crawler, an old tool — decides what every visitor gets for that URL. Seen on the live
 * site 2026-09-30: M Bar 10K Pink Berry w=1080 came back `image/jpeg` (1000x1000, no alpha, corner 0,0,0) to a
 * request that accepts WebP — kept as `_incoming/mbar10k-full/pb.jpg`; later probes (46) all got WebP, so which
 * edge copy a visitor meets varies.
 *
 * Every browser in use today decodes WebP, so the optimizer is told the client accepts it. The page HTML, the
 * image URLs and the sizes are unchanged — only the format a non-WebP request would have produced changes.
 * Existing JPEG entries at the edge stay until they expire or are purged.
 */
export function proxy(request: NextRequest) {
  const accept = request.headers.get("accept") ?? "";
  if (accept.includes("image/webp")) return NextResponse.next();
  const headers = new Headers(request.headers);
  headers.set("accept", accept ? `image/webp,${accept}` : "image/webp,*/*");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: "/_next/image",
};
