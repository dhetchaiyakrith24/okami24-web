// Every storefront card whose headline spec line is empty (legacy + published), with its option count
// and the verified spec rows it has — the list of cards that show no spec line.
//   npx tsx scripts/empty-cards.ts > out.txt
// Reads the catalog in the working tree (no server needed); diff two outputs for before/after.
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { headlineSpecsForProduct, headlineSpecsForPublished } from "@/lib/card-headline-spec";
import { verifiedRows } from "@/lib/verified-specs";

const rows: string[] = [];
for (const p of allProducts) {
  if (headlineSpecsForProduct(p).length === 0)
    rows.push(`legacy    · ${p.slug} · ${p.categoryId} · verified rows: ${verifiedRows(p.specifications).map((r) => r.key).join(",") || "none"}`);
}
for (const p of getPublishedProducts()) {
  if (headlineSpecsForPublished(p).length === 0)
    rows.push(
      `published · ${p.slug} · ${p.categoryId} · variants: ${p.variants.length} · axis: ${JSON.stringify((p as { variantAxis?: unknown }).variantAxis ?? null)} · verified rows: ${verifiedRows(p.specifications).map((r) => r.key).join(",") || "none"}`,
    );
}
console.log(rows.join("\n"));
console.log(`\n${rows.length} empty card line(s)`);
