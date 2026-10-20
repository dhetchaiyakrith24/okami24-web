import Link from "next/link";
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { getCategory } from "@/data/categories";
import { PHONE_CARDS, RAIL_CARDS, TABLET_CARDS } from "@/data/home-sections";
import type { HeroType } from "@/data/home-hero";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PilotProductCard } from "@/components/catalog-bridge/PilotProductCard";
import { HomeText, HomeTypeText } from "@/components/home/HomeCopy";
import { cn } from "@/lib/utils";

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
 * and tablets = a grid that stops after the first rows; then a "see all N" button to the category page.
 */
export function HomeTypeSection({ type, categories, first }: { type: HeroType; categories: string[]; first: string[] }) {
  const items = categories.flatMap((categoryId) => [
    ...allProducts.filter((p) => p.categoryId === categoryId).map((p) => ({ slug: p.slug, legacy: p, published: null })),
    ...getPublishedProducts()
      .filter((p) => p.categoryId === categoryId)
      .map((p) => ({ slug: p.slug, legacy: null, published: p })),
  ]);
  const rank = (slug: string) => {
    const i = first.indexOf(slug);
    return i === -1 ? first.length : i;
  };
  // the picks first, in their order; everything else keeps the catalog's order (stable sort)
  items.sort((a, b) => rank(a.slug) - rank(b.slug));
  const category = getCategory(categories[0]);
  if (!items.length || !category) return null;
  const href = `/products/${category.slug}`;

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="label-mono text-xs text-ember" lang="en">
              {TYPE_TAG[type]}
            </span>
            <h2 className="font-display text-[length:var(--text-h2)] font-semibold leading-[0.95] tracking-tight text-foreground">
              <HomeTypeText type={type} field="label" />
            </h2>
            <p className="max-w-xl text-base text-foreground-muted">
              <HomeTypeText type={type} field="desc" />
            </p>
          </div>
          <Link href={href} className="label-mono shrink-0 text-xs text-foreground-muted hover:text-ember max-lg:hidden">
            <HomeText k="viewAll" />
          </Link>
        </div>
      </Container>
      <Container>
        <div className="rail-scroll -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 max-lg:mx-0 max-lg:grid max-lg:grid-cols-4 max-lg:gap-3 max-lg:overflow-visible max-lg:px-0 max-lg:pb-0 max-sm:grid-cols-2 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          {items.slice(0, RAIL_CARDS).map((item, i) => (
            <div
              key={item.slug}
              className={cn(
                "w-[240px] shrink-0 snap-start max-lg:w-auto sm:w-[280px]",
                i >= PHONE_CARDS && "max-sm:hidden",
                i >= TABLET_CARDS && "max-lg:hidden",
              )}
            >
              {item.legacy ? <ProductCard product={item.legacy} /> : <PilotProductCard product={item.published!} />}
            </div>
          ))}
        </div>
        {items.length > PHONE_CARDS ? (
          // phones/tablets always (the grid stops early) · desktop only when the rail is cut short
          <Link
            href={href}
            className={cn(
              "mt-5 flex h-12 items-center justify-center rounded-full border border-surface-border text-sm font-semibold text-foreground transition-colors hover:border-ember hover:text-ember",
              items.length <= RAIL_CARDS && "lg:hidden",
              "lg:mx-auto lg:w-fit lg:px-8",
            )}
          >
            <HomeText k="typeViewAll" n={items.length} />
          </Link>
        ) : null}
      </Container>
    </section>
  );
}
