import { NextResponse, type NextRequest } from "next/server";
import { placesForPostcode } from "@/lib/commerce/thai-postcodes";

/**
 * GET /api/address/postcode/<code> — the sub-districts / districts / provinces a Thai postcode serves, for the checkout
 * address step (owner queue 02/11 item 4). Answer: `{ places: [{ subdistrict, district, province }] }` — empty when the
 * code is malformed or not in the data (the form then offers typing the place by hand). Public reference data, no
 * cookies, no customer data; the address action re-checks on the server (src/lib/commerce/addresses.ts).
 */

export const runtime = "nodejs";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ code: string }> }): Promise<NextResponse> {
  const { code } = await ctx.params;
  return NextResponse.json({ places: placesForPostcode(code) }, { headers: { "Cache-Control": "public, max-age=86400" } });
}
