import { NextResponse, type NextRequest } from "next/server";
import { searchPlaces } from "@/lib/commerce/thai-postcodes";

/**
 * GET /api/address/search?q=<text> — places matching what the customer typed in the address search on the checkout address
 * step (owner 03/11: a search box that fills the sub-district / district / province / postcode boxes when one is picked).
 * Answer: `{ places: [{ postalCode, subdistrict, district, province }] }`, at most 8, empty under 2 characters. Public
 * reference data like /api/address/postcode/<code>; the address action re-checks on the server (src/lib/commerce/addresses.ts).
 */

export const runtime = "nodejs";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 80);
  return NextResponse.json({ places: searchPlaces(q) }, { headers: { "Cache-Control": "public, max-age=86400" } });
}
