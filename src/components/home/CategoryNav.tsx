import Link from "next/link";
import { categoriesWithProducts } from "@/lib/category-visibility";
import { Container } from "@/components/ui/Container";

// Round "share-deadend" batch 2 (2026-09-22): the grid offers only the categories that have a
// product today (src/lib/category-visibility.ts). A SHOP tile that led to an empty page was the
// dead end the review round found; the tile comes back on its own when stock arrives.
export function CategoryNav() {
  const categories = categoriesWithProducts();
  return (
    <section className="border-b border-surface-border-soft bg-surface-1">
      <Container className="py-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="group flex flex-col gap-2 rounded-xl border border-surface-border-soft bg-surface-0 p-4 transition-colors hover:border-foreground-dim"
            >
              <span className="label-mono text-[0.6rem] text-foreground-dim" lang="en">Shop</span>
              <span className="font-display text-base font-semibold leading-tight text-foreground group-hover:text-ember">
                {category.shortName}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
