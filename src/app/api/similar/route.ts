import { NextResponse } from "next/server";
import { getCatalogItem } from "@/lib/catalog-index";
import { similarInStock } from "@/lib/similar-in-stock";

/**
 * GET /api/similar?slug=<slug> — the models to offer on a product page that the warehouse emptied after the build (owner
 * 07/11). A page built as sold out carries its list in the HTML; a page built in stock would have to carry six full product
 * records for nothing, so it asks here only when the live stock says every option has gone. No cookies, no customer data.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  if (!getCatalogItem(slug)) return NextResponse.json({ items: [] }, { status: 404 });
  return NextResponse.json({ items: similarInStock(slug) }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } });
}
