import Link from "next/link";
import type { Product } from "@/types/catalog";
import { ProductMedia } from "@/components/visual/ProductMedia";
import { FavoriteButton } from "@/components/catalog/FavoriteButton";
import { OptionCountBadge } from "@/components/catalog/OptionCountBadge";
import { EditorialTagBadge } from "@/components/catalog/EditorialTagBadge";
import { CardHeadlineSpec } from "@/components/catalog/CardHeadlineSpec";
import { ProductTagline } from "@/components/catalog/ProductTagline";
import { brandName } from "@/lib/utils";
import { headlineSpecsForProduct } from "@/lib/card-headline-spec";
import { getLegacyApprovedPrice } from "@/data/shipnity-seed/legacy-price-approvals";
import { PRODUCT_COPY_TH } from "@/i18n/product-copy-th";

/**
 * Phone layout (mobile round A, M3 — MOBILE_SPEC 3.1/3.5, owner decisions E-ก and F-ก, 2026-09-08;
 * every `max-lg:` / `hidden max-lg:block` class): cards sit two to a row, so below `lg` the card
 * slims down to photo (4:5, tighter padding) → brand → name clamped to two lines at a fixed
 * height → price. The tagline and the stats row are hidden by CSS (not removed — desktop keeps
 * them). The price is the owner-approved legacy selling price already used on the product page
 * (F-ก: a number from existing data, never typed here); a product with no approved price keeps an
 * empty line of the same height so every card in a row ends at the same edge (3.5).
 * At `lg` and above every class that was here before is still here; round "search-price" batch 2
 * (owner 2026-09-22, "ราคาแสดงจริงทุกตัว" was never phone-only) made the price line show on every
 * width — desktop reads brand → name → tagline → price → spec row (designer's pick B over a
 * price-in-the-spec-row variant A, which truncated the spec on four-digit prices).
 */
export function ProductCard({ product }: { product: Product }) {
  // Round 30.4ข batch 2 (owner 2026-09-16): the stats row used to print `attributes` as bare
  // values ("1600MAH · 5–35W", or "—" when there were none) regardless of whether the spec row
  // behind them was verified. It is now the headline spec line — one or two facts picked per
  // category from VERIFIED spec rows only, worded in the visitor's language by <CardHeadlineSpec>
  // (the same reason <PuffCount> existed). No verified row → the row stays, empty, at its height.
  const headline = headlineSpecsForProduct(product);
  const sellingPrice = getLegacyApprovedPrice(product.slug);
  // The tagline switches language on the client (round 30.3, THAI_STYLE §6 item 1) — same reason
  // as the puff count above. The Thai line is the same human-checked entry the product page shows.
  const taglineTh = PRODUCT_COPY_TH[product.slug]?.tagline;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-1 transition-all duration-300 hover:-translate-y-1 hover:border-foreground-dim"
    >
      <div className="relative aspect-[4/5] w-full bg-surface-2/40 p-6 max-lg:p-3">
        {/* max-lg:z-10 — with the tighter phone padding the absolutely-positioned photo (next/image
            fill) painted over the option-count badge (designer, 2026-09-08); the heart already had z-10. */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 max-lg:left-2 max-lg:top-2 max-lg:z-10">
          {/* On a 169px phone card the editorial tag, the option count and the heart could not share
              the top edge (designer, 2026-09-08: "FLAGSHIP" / "RETAILER-CONFIRMED" clipped mid-word).
              The tag hides below lg — CSS only; the option count stays. Round 30.4 ก8: the wording
              is EditorialTagBadge's — only "Flagship" shows, in the visitor's language. */}
          <EditorialTagBadge tag={product.editorialTag} className="max-lg:hidden" />
          <OptionCountBadge product={product} />
        </div>
        <FavoriteButton slug={product.slug} className="absolute right-3 top-3 max-lg:right-2 max-lg:top-2" />
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <ProductMedia product={product} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5 max-lg:gap-1 max-lg:p-3">
        {/* Round 30.4ค batch 8: brand marks and Latin stats keep the mono look in Thai (label-lang.ts). */}
        <span className="label-mono text-[0.65rem] text-foreground-dim max-lg:text-[0.6rem]" lang="en">
          {brandName(product.brandId)}
        </span>
        <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-foreground max-lg:line-clamp-2 max-lg:min-h-[2.5em] max-lg:text-sm max-lg:leading-[1.25]">
          {product.name}
        </h3>
        {/* lg:min-h-10 = two lines of text-sm. A Thai tagline is often one line where the English took
            two, and in a horizontal rail (home page) each card is only as tall as its own content — so
            without a floor the card would shrink 20px and its stats row would move (round 30.3 desktop
            proof, 13,446 px outside the mask). Grid pages already stretch cards to the row height. */}
        <p className="line-clamp-2 text-sm text-foreground-muted max-lg:hidden lg:min-h-10">
          <ProductTagline en={product.tagline} th={taglineTh} />
        </p>
        {/* Phone: the headline spec as one short line between the name and the price (the M3 phone
            card never had a stats row — this is the one addition). The price stays last (owner ข,
            2026-09-16, designer): name → spec → price reads like any shop listing, and a card with
            no approved price then leaves its gap at the bottom edge instead of mid-card. Both lines
            keep their height when empty so every card in a row still ends at the same edge.
            Desktop (round search-price batch 2): the same price line, 18 px, between the two-line
            tagline floor and the spec row, so prices align across a row. */}
        <p className="hidden min-h-[0.875rem] truncate text-[0.65rem] leading-[0.875rem] text-foreground-dim max-lg:block" data-card-spec-phone="legacy">
          <CardHeadlineSpec specs={headline} compact />
        </p>
        <p className="min-h-[1.25rem] font-display text-[15px] font-bold leading-tight text-foreground lg:text-lg" data-card-price>
          {sellingPrice !== null ? `฿${sellingPrice.toLocaleString("th-TH")}` : ""}
        </p>
        <div className="mt-auto flex min-h-4 items-center gap-3 pt-3 text-xs text-foreground-dim max-lg:hidden" data-card-spec="legacy">
          <CardHeadlineSpec specs={headline} />
        </div>
      </div>
    </Link>
  );
}
