/**
 * OKami24 — every shop clip the site shows carries what Google's VideoObject needs (round "clip", 2026-09-27).
 *
 * GSC flagged 7 product pages "invalid video item": their VideoObject had no `uploadDate`, a field Google requires,
 * because the clip's date was optional in the data (and one component never wrote it at all). The type now requires
 * `publishedAt` and every block goes through src/lib/video-jsonld.ts; this test proves the data side from the records
 * themselves, so a clip added next month without a real date, from another channel, or with a malformed id fails here
 * on the day it is written — including records hidden from the storefront today, which would break the day they show.
 * Picked up by scripts/verify-catalog.ts (every `*-contract-test.ts` under src/).
 */

import { allProducts, hiddenProducts } from "@/data/products";
import { guides, heldGuides } from "@/data/guides";
import { technologyEntries } from "@/data/technology";
import { VERIFIED_REVIEW_VIDEOS } from "@/data/shipnity-seed/active-catalog-to-product-master";
import { COLLECTION_VIDEOS } from "@/data/collection-videos";
import { videoObjectJsonLd } from "@/lib/video-jsonld";
import type { ReviewVideo } from "@/types/catalog";

export interface ReviewVideoContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

/** The shop's own three channels (round instruction: clips come from these only), by the name YouTube shows. */
const SHOP_CHANNELS = new Set(["OKAMI", "POD SYSTEM OKAMI II", "OKM YARZ"]);
const FIRST_CLIP = "2020-01-01";

function realDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

export function runReviewVideoContractTests(): ReviewVideoContractResult[] {
  const results: ReviewVideoContractResult[] = [];
  const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

  // Legacy products: the storefront ones and the hidden ones (a hidden clip breaks the day its product shows).
  const clips: { where: string; v: ReviewVideo }[] = [];
  for (const p of allProducts) if (p.reviewVideo) clips.push({ where: `/products/${p.slug}`, v: p.reviewVideo });
  for (const p of hiddenProducts) if (p.reviewVideo) clips.push({ where: `/products/${p.slug} (hidden)`, v: p.reviewVideo });
  for (const [id, v] of Object.entries(VERIFIED_REVIEW_VIDEOS)) clips.push({ where: `ProductMaster ${id}`, v });
  for (const g of [...guides, ...heldGuides]) {
    if (g.reviewVideo) clips.push({ where: `/guides/${g.slug}`, v: g.reviewVideo });
  }
  for (const t of technologyEntries) if (t.reviewVideo) clips.push({ where: `/technology/${t.slug}`, v: t.reviewVideo });
  for (const [path, v] of Object.entries(COLLECTION_VIDEOS)) clips.push({ where: path, v });

  check("at least one clip found (the test reads real records)", clips.length > 0, `${clips.length} clip(s)`);

  const today = new Date().toISOString().slice(0, 10);
  const badDate = clips.filter(({ v }) => !realDate(v.publishedAt) || v.publishedAt < FIRST_CLIP || v.publishedAt > today);
  check("every clip has a real upload date (YYYY-MM-DD, not in the future) — VideoObject uploadDate", badDate.length === 0, badDate.map((c) => `${c.where}: ${JSON.stringify(c.v.publishedAt)}`).join("; ") || "none");

  const badId = clips.filter(({ v }) => !/^[A-Za-z0-9_-]{11}$/.test(v.videoId));
  check("every clip id is an 11-character YouTube id", badId.length === 0, badId.map((c) => `${c.where}: ${c.v.videoId}`).join("; ") || "none");

  const badChannel = clips.filter(({ v }) => !SHOP_CHANNELS.has(v.channelName));
  check("every clip comes from one of the shop's three channels", badChannel.length === 0, badChannel.map((c) => `${c.where}: ${c.v.channelName}`).join("; ") || "none");

  const badTitle = clips.filter(({ v }) => v.title.trim().length === 0);
  check("every clip has a title (VideoObject name)", badTitle.length === 0, badTitle.map((c) => c.where).join("; ") || "none");

  // The one builder emits every field Google requires, for every clip.
  const missing = clips.filter(({ v }) => {
    const b = videoObjectJsonLd(v, "x");
    return !b.name || !b.uploadDate || !Array.isArray(b.thumbnailUrl) || b.thumbnailUrl.length === 0 || !b.embedUrl;
  });
  check("the shared builder fills name · thumbnailUrl · uploadDate · embedUrl for every clip", missing.length === 0, missing.map((c) => c.where).join("; ") || "none");

  // A page shows a clip once: the same id twice on one page would be two identical VideoObjects.
  const perPage = new Map<string, string[]>();
  for (const { where, v } of clips) {
    const page = where.replace(/ \(hidden\)$/, "");
    perPage.set(page, [...(perPage.get(page) ?? []), v.videoId]);
  }
  const dupes = [...perPage.entries()].filter(([, ids]) => new Set(ids).size !== ids.length).map(([p]) => p);
  check("no page lists the same clip twice", dupes.length === 0, dupes.join("; ") || "none");

  return results;
}

if (require.main === module) {
  const results = runReviewVideoContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
