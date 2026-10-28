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
  const rank = (slug: string) => {
    if (RAIL_LAST.has(slug)) return first.length + 1;
    const i = first.indexOf(slug);
    return i === -1 ? first.length : i;
  };
  // the picks first, in their order; everything else keeps the catalog's order (stable sort)
  items.sort((a, b) => rank(a.slug) - rank(b.slug));
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
