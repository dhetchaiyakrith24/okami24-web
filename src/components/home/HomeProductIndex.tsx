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
 *  when the product has no real brand ("Unbranded" is a data id, not a word a customer should read; a brandless
 *  ProductMaster product has brandId null). */
function withBrand(name: string, brandId: string | null): IndexEntry["brand"] {
  if (brandId === null) return "";
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
        {/* Round "หน้าแรก hero" (owner 20/10 ~03:40): the long four-column list became one closed box per
            category — the page stays short, and a visitor opens only the type they want. The links stay
            in the HTML inside <details> (closed boxes are still crawled), so every product page keeps its
            link from `/` (the reason this block exists — header above). The box's heading keeps the
            category label the category pages use; its count is the number of links inside. */}
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {groups.map(({ category, entries }) => (
            <details key={category.id} className="okh-index group/box rounded-2xl border border-surface-border bg-surface-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
                  <CategoryLabel label={category.labelTh} />
                </h3>
                <span className="flex shrink-0 items-center gap-2 text-foreground-muted">
                  <span className="label-mono text-xs" lang="en">
                    {entries.length}
                  </span>
                  <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform group-open/box:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </span>
              </summary>
              <div className="border-t border-surface-border-soft px-5 pb-4 pt-3">
                {/* one link per line (a model name must never break across two sub-columns); whole row
                    tappable; brand prefix muted, model name full foreground (designer #1, AA contrast) */}
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
                <Link href={`/products/${category.slug}`} className="label-mono mt-3 inline-block text-xs text-ember hover:underline">
                  <HomeText k="indexOpenCategory" />
                </Link>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
