import { NextResponse, type NextRequest } from "next/server";
import { getCatalogItem } from "@/lib/catalog-index";
import { relatedFor, type RelatedItem } from "@/lib/related-order";
import type { RelatedAnswer } from "@/lib/related-row";
import { liveLookup } from "@/lib/stock/live";

/**
 * GET /api/related/<slug> — the product page's "สินค้าใกล้เคียง" row from live stock: the same row a cart holding this one product
 * gets (rowFor, src/lib/related-order.ts), so the page follows Shipnity without a rebuild. Product pages stay prerendered with
 * the build's row, so the answer carries card data only for what that row lacks. Answer: `{ s: [slugs in order], c: [cards] }`.
 * No cookies, no counts, no customer data; the cart and checkout re-check on the server, so nothing here is trusted for money.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The live read itself is cached for 10 s (live.ts); so is the answer, so a busy page does not walk the catalog per visitor.
const TTL_MS = 10_000;
const memo = new Map<string, { at: number; answer: RelatedAnswer<RelatedItem> }>();

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }): Promise<NextResponse> {
  const { slug } = await ctx.params;
  // Only catalog slugs reach the memo, so its size is the catalog's.
  if (!getCatalogItem(slug)) return NextResponse.json({ s: [], c: [] }, { status: 404 });
  let hit = memo.get(slug);
  if (!hit || Date.now() - hit.at >= TTL_MS) {
    const built = new Set(relatedFor(slug).map((i) => i.slug));
    const now = relatedFor(slug, liveLookup());
    hit = { at: Date.now(), answer: { s: now.map((i) => i.slug), c: now.filter((i) => !built.has(i.slug)) } };
    memo.set(slug, hit);
  }
  return NextResponse.json(hit.answer, { headers: { "Cache-Control": "public, max-age=30, s-maxage=30" } });
}
