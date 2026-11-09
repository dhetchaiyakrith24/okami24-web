import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { getCategory } from "@/data/categories";
import { RAIL_LAST } from "@/data/home-sections";
import type { HeroType } from "@/data/home-hero";
import { HomeTypeText } from "@/components/home/HomeCopy";
import { HomeCardRail } from "@/components/home/HomeCardRail";

/** The English tag above each section title — same words as the hero tabs' tags (THAI_STYLE §5 group ก). */
const TYPE_TAG: Record<HeroType, string> = {
  "pod-systems": "Pod System",
  "switch-pods": "Switch Pod",
  disposables: "Disposable",
  "heated-tobacco-devices": "Heated Tobacco",
};

/**
 * One product type on the homepage (src/data/home-sections.ts): the first RAIL_CARDS products of its
 * categories (the picks first) as the shop's own cards — the legacy card and the ProductMaster card,
 * exactly as the category pages show them. Desktop = the sideways rail (ProductRail's classes); phones
 * and tablets = a grid that stops after the first rows; then a "see all N" button to the category page (HomeCardRail).
 */
export function HomeTypeSection({ type, categories, first }: { type: HeroType; categories: string[]; first: string[] }) {
  const items = categories.flatMap((categoryId) => [
    ...allProducts.filter((p) => p.categoryId === categoryId).map((p) => ({ slug: p.slug, legacy: p, published: null })),
    ...getPublishedProducts()
      .filter((p) => p.categoryId === categoryId)
      .map((p) => ({ slug: p.slug, legacy: null, published: p })),
  ]);
  const pods = new Set(items.filter((i) => (i.legacy ?? i.published)?.systemType === "pod-cartridge").map((i) => i.slug));
  const rank = (slug: string) => {
    if (RAIL_LAST.has(slug)) return first.length + 2;
    if (pods.has(slug)) return first.length + 1;
    const i = first.indexOf(slug);
    return i === -1 ? first.length : i;
  };
  // Sold out (as built) after everything that sells (owner 10/11 ~02:00, with the card "สินค้าหมด" badge: a customer should
  // not spend the first cards of a row on things they cannot buy); within each group the picks first, in their order,
  // then the catalog's order (stable sort). Build-time stock on purpose: the prerendered row never reshuffles after load —
  // a product that sold out since the build shows its badge in place and moves at the next deploy.
  const soldOut = (i: (typeof items)[number]) => {
    if (i.published) return i.published.availabilityStatus === "out-of-stock";
    const p = i.legacy;
    if (!p) return false;
    const options = [...(p.colorVariants ?? []), ...(p.flavorVariants ?? [])];
    return options.length > 0 ? options.every((v) => v.availability === "out-of-stock") : p.availability === "out-of-stock";
  };
  items.sort((a, b) => Number(soldOut(a)) - Number(soldOut(b)) || rank(a.slug) - rank(b.slug));
  const category = getCategory(categories[0]);
  if (!items.length || !category) return null;
  const href = `/products/${category.slug}`;
  return (
    <HomeCardRail
      tag={TYPE_TAG[type]}
      title={<HomeTypeText type={type} field="label" />}
      desc={<HomeTypeText type={type} field="desc" />}
      href={href}
      items={items}
    />
  );
}
