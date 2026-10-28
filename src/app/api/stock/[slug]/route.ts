import { NextResponse, type NextRequest } from "next/server";
import { getProduct } from "@/data/products";
import { getPublishedProductBySlug } from "@/data/shipnity-seed/storefront-preview-read-model";
import { liveLookup } from "@/lib/stock/live";

/**
 * GET /api/stock/<slug> — the live warehouse stock of one product's options (Shipnity link step 4, owner 28/10). Product
 * pages stay prerendered; after load they ask here and update their option tiles and buy button, so a stock change in
 * Shipnity shows without a new build. Answer: `{ o: { <optionId>: "in" | "out" }, p: "in" | "out" | null }` — only options
 * with a live answer are listed; the rest keep what the page was built with. No cookies, no customer data; the cart and
 * checkout re-check on the server (catalog-resolver.ts), so nothing here is trusted for money.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }): Promise<NextResponse> {
  const { slug } = await ctx.params;
  const live = liveLookup();
  const legacy = getProduct(slug);
  const published = legacy ? undefined : getPublishedProductBySlug(slug);
  if (!legacy && !published) return NextResponse.json({ o: {}, p: null }, { status: 404 });

  const options = legacy
    ? [...(legacy.colorVariants ?? []), ...(legacy.flavorVariants ?? [])].map((v) => ({ id: v.id, name: v.name }))
    : published!.variants.map((v) => ({ id: v.id, name: v.label }));
  const o: Record<string, "in" | "out"> = {};
  for (const opt of options) {
    const s = live(slug, opt.id, opt.name);
    if (s) o[opt.id] = s;
  }
  const p = options.length === 0 ? live(slug) : null;
  return NextResponse.json(
    { o, p },
    // A short shared cache: a busy page does not hit the server per visitor, and a stock change shows within a minute.
    { headers: { "Cache-Control": "public, max-age=30, s-maxage=30" } }
  );
}
