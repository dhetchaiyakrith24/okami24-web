import { NextResponse, type NextRequest } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { handle } from "@/lib/woo/api";
import { wooCatalog } from "@/lib/woo/catalog";
import { safeQuery } from "@/lib/woo/credentials";
import { authenticate } from "@/lib/woo/keys";
import { logCall, saveStockReport, stockReports } from "@/lib/woo/store";

/**
 * /wp-json/* — where a WooCommerce shop answers its REST API, so the warehouse's Shipnity can connect to this site with
 * the "Url · cs · ck" it uses for every Woo shop (Shipnity link step 1, owner 27/10). The rules are in src/lib/woo/api.ts;
 * keys are made and revoked on /staff/shipnity. Every call is logged (credentials stripped) for staff to read there.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 256 * 1024;

async function serve(request: NextRequest, ctx: { params: Promise<{ path?: string[] }> }): Promise<NextResponse> {
  const { path } = await ctx.params;
  const segments = (path ?? []).filter(Boolean);
  const url = new URL(request.url);
  const keyId = authenticate(request.headers.get("authorization"), url.searchParams);

  let raw = "";
  let body: unknown = null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    raw = (await request.text()).slice(0, MAX_BODY);
    if (raw) {
      try {
        body = JSON.parse(raw);
      } catch {
        // Woo clients may send a form body; only JSON carries stock fields here.
        body = Object.fromEntries(new URLSearchParams(raw));
      }
    }
  }

  const res = handle({
    method: request.method,
    segments,
    query: url.searchParams,
    body,
    signed: keyId !== null,
    siteUrl: SITE_URL,
    catalog: wooCatalog(),
    reports: keyId !== null ? stockReports() : new Map(),
  });
  for (const w of res.writes) saveStockReport(w.sku, w.quantity, w.stockStatus);

  logCall({
    method: request.method,
    path: `/wp-json/${segments.join("/")}`,
    query: safeQuery(url.searchParams),
    status: res.status,
    keyId,
    ip: request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? null,
    userAgent: request.headers.get("user-agent"),
    body: keyId !== null && raw ? raw : null,
  });

  return NextResponse.json(res.json, {
    status: res.status,
    headers: { ...res.headers, "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}

export const GET = serve;
export const POST = serve;
export const PUT = serve;
export const PATCH = serve;
export const DELETE = serve;
