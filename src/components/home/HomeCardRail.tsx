import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { PHONE_CARDS, RAIL_CARDS, TABLET_CARDS } from "@/data/home-sections";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PilotProductCard } from "@/components/catalog-bridge/PilotProductCard";
import { HomeText } from "@/components/home/HomeCopy";
import { DecodeOnView } from "@/components/home/Decode";
import { cn } from "@/lib/utils";

export interface HomeCardItem {
  slug: string;
  legacy: Product | null;
  published: StorefrontProductView | null;
}

/**
 * The homepage's product section (moved out of HomeTypeSection 29/10 so the "สินค้าเข้าใหม่" row is the same section, not a
 * look-alike): an English tag, the title and one line, then the first RAIL_CARDS items as the shop's own cards — the legacy
 * card and the ProductMaster card, exactly as the category pages show them. Desktop = the sideways rail (ProductRail's
 * classes); phones and tablets = a grid that stops after the first rows; then, when `href` is given, a "see all N" button.
 */
export function HomeCardRail({
  tag,
  title,
  desc,
  href,
  items,
}: {
  tag: string;
  title: ReactNode;
  desc: ReactNode;
  href?: string;
  items: HomeCardItem[];
}) {
  // a lone card on the last grid row sits centred (checker #648: IQOS has 5 — the 5th stood alone by a gap)
  const shown = Math.min(items.length, RAIL_CARDS);
  const lonePhone = Math.min(shown, PHONE_CARDS) % 2 === 1 ? Math.min(shown, PHONE_CARDS) - 1 : -1;
  const loneTablet = Math.min(shown, TABLET_CARDS) % 4 === 1 ? Math.min(shown, TABLET_CARDS) - 1 : -1;
  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="label-mono text-xs text-ember" lang="en">
              <DecodeOnView text={tag} />
            </span>
            <h2 className="font-display text-[length:var(--text-h2)] font-semibold leading-[0.95] tracking-tight text-foreground">
              {title}
            </h2>
            <p className="max-w-xl text-base text-foreground-muted">{desc}</p>
          </div>
          {href ? (
            <Link href={href} className="label-mono shrink-0 text-xs text-foreground-muted hover:text-ember max-lg:hidden">
              <HomeText k="viewAll" />
            </Link>
          ) : null}
        </div>
      </Container>
      <Container>
        <div className="okh-rail rail-scroll -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 max-lg:mx-0 max-lg:grid max-lg:grid-cols-4 max-lg:gap-3 max-lg:overflow-visible max-lg:px-0 max-lg:pb-0 max-sm:grid-cols-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:-mx-12 lg:scroll-px-12 lg:px-12">
          {items.slice(0, RAIL_CARDS).map((item, i) => (
            <div
              key={item.slug}
              className={cn(
                "w-[240px] shrink-0 snap-start max-lg:w-auto lg:w-[280px]",
                i >= PHONE_CARDS && "max-sm:hidden",
                i >= TABLET_CARDS && "max-lg:hidden",
                i === lonePhone && "max-sm:col-span-2 max-sm:mx-auto max-sm:w-[calc(50%-0.375rem)]",
                i === loneTablet && "sm:max-lg:col-span-4 sm:max-lg:mx-auto sm:max-lg:w-[calc(25%-0.5625rem)]",
              )}
            >
              {item.legacy ? <ProductCard product={item.legacy} /> : <PilotProductCard product={item.published!} />}
            </div>
          ))}
        </div>
        {href && items.length > PHONE_CARDS ? (
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
