import Link from "next/link";
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { categoriesWithProducts } from "@/lib/category-visibility";
import { Container } from "@/components/ui/Container";
import { CategoryLabel } from "@/components/catalog/CategoryLabel";
import { HomeText } from "@/components/home/HomeCopy";
import { brandName } from "@/lib/utils";

/**
 * Round 8 B1 (owner ruling 2026-09-23, HANDOFF §16 4b round-7 close ruling 6): a text index of
 * EVERY product page, grouped by category, on the home page.
 *
 * Why it exists: round 7's link graph (`_incoming/seo-c/inbound.json`) showed that product pages
 * linked from the home page get indexed by Google and the others mostly do not — and 32 of the
 * 53 product pages had no home link at all (all 18 ProductMaster products, since every rail
 * above reads the legacy selectors only, plus 14 legacy SALTHUB/JOIWAY/unbranded models). The
 * rails stay the curated part; this block is the complete list, so no product page is ever more
 * than one click from `/` again. It lists all 53 rather than "the 32 the rails miss" because a
 * visitor cannot tell which rail already showed what, and an index that skips models reads as
 * if the shop does not carry them.
 *
 * Plain links on purpose — no photos, no prices: 53 cards would double the home page's weight
 * (already 398 KB of HTML), and the price belongs on the card and the product page. Headings are
 * the category labels the category pages themselves use (`CategoryLabel`), so no new words.
 * Category order and visibility = `categoriesWithProducts()` (an empty category never shows).
 */
interface IndexEntry {
  slug: string;
  name: string;
  brand: string;
}

/** The brand prefix is dropped when the name already carries it anywhere (ProductMaster display
 *  names do — "SALTHUB M BAR 10K", or with a Thai type word first: "เครื่อง Esko Bar Switch 20k") or
 *  when the product has no real brand ("Unbranded" is a data id, not a word a customer should read). */
function withBrand(name: string, brandId: string): IndexEntry["brand"] {
  const brand = brandName(brandId);
  if (brandId.toLowerCase() === "unbranded" || name.toLowerCase().includes(brand.toLowerCase())) return "";
  return brand;
}

function entriesFor(categoryId: string): IndexEntry[] {
  const legacy = allProducts
    .filter((p) => p.categoryId === categoryId)
    .map((p) => ({ slug: p.slug, name: p.name, brand: withBrand(p.name, p.brandId) }));
  const published = getPublishedProducts()
    .filter((p) => p.categoryId === categoryId)
    .map((p) => ({ slug: p.slug, name: p.displayName, brand: withBrand(p.displayName, p.brandId) }));
  return [...legacy, ...published].sort((a, b) => `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`));
}

export function HomeProductIndex({ eyebrow }: { eyebrow: string }) {
  const groups = categoriesWithProducts()
    .map((category) => ({ category, entries: entriesFor(category.id) }))
    .filter((g) => g.entries.length > 0);

  return (
    <section className="border-b border-surface-border-soft bg-surface-1 py-14 lg:py-20" aria-labelledby="home-product-index">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="label-mono text-xs text-ember" lang="en">{eyebrow}</span>
            <h2 id="home-product-index" className="font-display text-[length:var(--text-h2)] font-semibold leading-[0.95] tracking-tight text-foreground">
              <HomeText k="indexTitle" />
            </h2>
            <p className="max-w-xl text-base text-foreground-muted">
              <HomeText k="indexDescription" />
            </p>
          </div>
          <Link href="/products" className="label-mono shrink-0 text-xs text-foreground-muted hover:text-ember">
            <HomeText k="indexViewAll" />
          </Link>
        </div>
        {/* 4 columns at lg (designer #1): 10 · 13 · 10 · 12 entries side by side, then the two
            short categories (6 · 2) as a natural tail — 3 columns left a large empty corner. */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map(({ category, entries }) => (
            <div key={category.id} className="flex flex-col gap-3">
              <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
                <Link href={`/products/${category.slug}`} className="hover:text-ember">
                  <CategoryLabel label={category.labelTh} />
                </Link>
              </h3>
              {/* One link per line at every width: the first 390px scan showed two sub-columns
                  splitting model names mid-term ("Voopoo | PnP-X"), and a model name is the one
                  thing this list must never break. */}
              {/* Whole row tappable (`block py-1`, no list gap) — same 27px pitch as before, but the
                  hit area is the row, not the 19px text line (designer #1). Colours: brand prefix
                  muted (8.2:1 on surface-1), model name full foreground — the dim prefix measured
                  4.0:1 at 14px, under AA. */}
              <ul className="flex flex-col">
                {entries.map((entry) => (
                  <li key={entry.slug} className="text-sm leading-snug">
                    <Link href={`/products/${entry.slug}`} className="block py-1 text-foreground transition-colors hover:text-ember">
                      {entry.brand && <span className="text-foreground-muted">{entry.brand} </span>}
                      {entry.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
