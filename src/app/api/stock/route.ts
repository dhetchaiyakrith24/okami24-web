import { NextResponse } from "next/server";
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { liveLookup } from "@/lib/stock/live";
import { liveCardChanges, type CardStockChanges } from "@/lib/stock/card-stock";

/**
 * GET /api/stock — live warehouse stock for the product CARDS (owner 31/10: cards read live stock like the product page;
 * one product's options = /api/stock/<slug>). Listing, category, brand and home pages stay prerendered with the build's
 * stock; after load the page asks here ONCE (every card on it shares the answer) and the cards and the "สินค้าพร้อมส่ง"
 * filter take it. Answer: `{ c: { <slug>: { o: soldOut, s: inStock } } }` — only the products whose live state differs from
 * the build, so it stays small. No cookies, no counts, no customer data; the cart and checkout re-check on the server.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The live read itself is cached for 10 s (live.ts); the answer is too, so a busy listing does not walk the catalog per visitor.
const TTL_MS = 10_000;
let memo: { at: number; c: CardStockChanges } | null = null;

export async function GET(): Promise<NextResponse> {
  if (!memo || Date.now() - memo.at >= TTL_MS) {
    memo = { at: Date.now(), c: liveCardChanges(allProducts, getPublishedProducts(), liveLookup()) };
  }
  return NextResponse.json({ c: memo.c }, { headers: { "Cache-Control": "public, max-age=30, s-maxage=30" } });
}
