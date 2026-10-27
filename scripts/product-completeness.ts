// Product-page completeness audit (round seo-push-2710, owner 27/10: every product page carries real text, a photo per
// colour/flavour, specs and the all-options grid). Reads the catalog in the working tree — no server needed.
//   npx tsx scripts/product-completeness.ts            one line per storefront product, gaps flagged, totals at the end
//   npx tsx scripts/product-completeness.ts --gaps     only the products with a gap
// Flags (legacy): NO-ARTICLE (no Thai article in "more details") · EMPTY-HEAD (storyDetails page whose heading has only the
// options grid under it: no lede, cover, poster or article) · OPT-NO-PHOTO n (options without a photo) · FEW-SPECS (< 2
// verified spec rows). Published (ProductMaster) pages have no article slot; flags = OPT-NO-PHOTO · FEW-SPECS · NO-IMAGE.
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { productArticle } from "@/data/product-articles";
import { PRODUCT_EDITORIAL } from "@/data/product-editorial";
import { verifiedRows } from "@/lib/verified-specs";

const gapsOnly = process.argv.includes("--gaps");
const lines: string[] = [];
let total = 0;
let withGap = 0;
const count: Record<string, number> = {};
const flag = (fs: string[], f: string) => {
  fs.push(f);
  const k = f.split(" ")[0];
  count[k] = (count[k] ?? 0) + 1;
};

for (const p of allProducts) {
  total++;
  const fs: string[] = [];
  const th = productArticle(p.slug, "th");
  // a PRODUCT_EDITORIAL page (M Bar 9K redesign 23/10) shows its own article in place of "more details"
  const editorial = p.slug in PRODUCT_EDITORIAL;
  const posters = p.features.filter((f) => f.image).length;
  const isColour = (p.colorVariants?.length ?? 0) > 0;
  const opts = isColour
    ? (p.colorVariants ?? []).map((o) => !!o.image)
    : (p.flavorVariants ?? []).map((o) => !!(o.boxImage ?? o.image));
  const noPhoto = opts.filter((x) => !x).length;
  const specs = verifiedRows(p.specifications).length;
  if (!th && !editorial) flag(fs, "NO-ARTICLE");
  if (p.storyDetails && !editorial && !th?.lede && !p.storyCover && posters === 0 && !th) flag(fs, "EMPTY-HEAD");
  if (noPhoto > 0) flag(fs, `OPT-NO-PHOTO ${noPhoto}/${opts.length}`);
  if (specs < 2) flag(fs, "FEW-SPECS");
  if (fs.length) withGap++;
  if (!gapsOnly || fs.length)
    lines.push(`legacy    · ${p.slug} · ${p.categoryId} · story:${p.storyDetails ? "y" : "n"} posters:${posters} opts:${opts.length} specs:${specs} faqs:${p.faqs.length} article:${th ? th.sections.length : 0} · ${fs.join(" · ") || "ok"}`);
}
for (const p of getPublishedProducts()) {
  total++;
  const fs: string[] = [];
  const noPhoto = p.variants.filter((v) => !v.image).length;
  const specs = verifiedRows(p.specifications).length;
  if (!p.image) flag(fs, "NO-IMAGE");
  if (p.variants.length > 1 && noPhoto > 0) flag(fs, `OPT-NO-PHOTO ${noPhoto}/${p.variants.length}`);
  if (specs < 2) flag(fs, "FEW-SPECS");
  if (fs.length) withGap++;
  if (!gapsOnly || fs.length)
    lines.push(`published · ${p.slug} · ${p.categoryId} · opts:${p.variants.length} specs:${specs} video:${p.reviewVideo ? "y" : "n"} · ${fs.join(" · ") || "ok"}`);
}
console.log(lines.join("\n"));
console.log(`\n${total} products · ${withGap} with a gap · ${Object.entries(count).map(([k, v]) => `${k} ${v}`).join(" · ")}`);
