"use client";

import { useState } from "react";
import type { Product } from "@/types/catalog";
import { ProductMedia } from "@/components/visual/ProductMedia";
import { ColorVariantRail } from "@/components/product/ColorVariantRail";
import { FlavorVariantGrid } from "@/components/product/FlavorVariantGrid";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FavoriteButton } from "@/components/catalog/FavoriteButton";
import { brandName, familyName, formatBattery, formatPuffs, formatWattage } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PRODUCT_COPY_TH } from "@/i18n/product-copy-th";
import type { ImageDisplayInfo } from "@/lib/media-quality";
import { CONTACT } from "@/data/contact";
import { addToCartAction } from "@/app/cart/actions";

/** First option a customer may actually buy — skips options marked out-of-stock so the page never
 *  opens on a colour/flavour the cart would reject (falls back to the first option when every one
 *  is sold out, so the name label and photo still work). */
function firstSellable<T extends { id: string; availability?: string }>(options: T[] | undefined): string | null {
  if (!options || options.length === 0) return null;
  return (options.find((o) => o.availability !== "out-of-stock") ?? options[0]).id;
}

/** `imageDisplayInfo` — the storefront quality-correction pass's fill-vs-intrinsic sizing switch,
 *  computed server-side (reads the real file under `public/`, never a value that could go stale)
 *  and passed down as plain data since this is a client component. `undefined` (e.g. the source
 *  file couldn't be read) falls back to the original always-fill behavior. See
 *  `src/lib/media-quality.ts` for the full rationale. */
export function ProductHero({
  product,
  sellingPrice = null,
  imageDisplayInfo,
  imageDisplayMap,
}: {
  product: Product;
  /** Owner-approved price from legacy-price-approvals.ts (2026-09-05). `null` = browse-only: no
   *  price, no cart action — exactly how every legacy product rendered before that date. */
  sellingPrice?: number | null;
  imageDisplayInfo?: ImageDisplayInfo | null;
  /** Per-image lookup (owner-reported bug fix, 2026-09-04) — `imageDisplayInfo` alone only ever
   *  described the CARD photo, so selecting a color/flavor whose own image is smaller than the
   *  card silently kept the card's fill decision instead of its own. When provided, the currently
   *  displayed image's own entry is looked up here instead; falls back to `imageDisplayInfo` for
   *  the card when a specific entry is missing (e.g. `getImageDisplayInfo` couldn't read the file).
   *  See `src/lib/media-quality.ts` and `ProductMedia`'s doc comment. */
  imageDisplayMap?: Record<string, ImageDisplayInfo>;
}) {
  const { locale, dict } = useLocale();
  // Thai locale adds a translated tagline/description under the English original — never
  // replacing it, and only for the 28 legacy products with a real (human-checked, not machine-
  // guessed) Thai entry. See product-copy-th.ts header for why this stays presentation-only.
  const copyTh = locale === "th" ? PRODUCT_COPY_TH[product.slug] : undefined;
  const [selectedColorId, setSelectedColorId] = useState<string | null>(firstSellable(product.colorVariants));
  const [selectedFlavorId, setSelectedFlavorId] = useState<string | null>(firstSellable(product.flavorVariants));
  // "All Colors" (owner mandate, 2026-09-03) is a third hero-image state, not a third variant list
  // — it only exists when a real lineup shot does. Starts unselected (an individual color/default
  // photo is still the strongest first impression); the customer opts INTO the lineup view.
  const [showAllColors, setShowAllColors] = useState(false);
  const selectedColor = product.colorVariants?.find((c) => c.id === selectedColorId);
  const selectedFlavor = product.flavorVariants?.find((f) => f.id === selectedFlavorId);
  const heroOverrideImage = showAllColors ? product.lineupImage ?? null : selectedColor?.image ?? selectedFlavor?.image ?? null;
  // The display-info entry for whichever image is ACTUALLY shown right now, not just the card's —
  // see this component's own prop doc comment for the bug this fixes.
  const currentImageDisplayInfo = heroOverrideImage
    ? imageDisplayMap?.[heroOverrideImage.src] ?? null
    : imageDisplayInfo;
  // Cart gate (client half — the server half is resolveProductRef()'s legacy branch, which
  // re-checks all of this on submit, so nothing here is trusted for money): the option that would
  // go into the cart is whichever axis this product has (no legacy product has both), and only an
  // option explicitly marked out-of-stock blocks the purchase — "unknown" sells, per the owner's
  // 2026-09-06 default for the legacy catalog.
  const hasOptions = (product.colorVariants?.length ?? 0) + (product.flavorVariants?.length ?? 0) > 0;
  const cartVariantId = selectedColor?.id ?? selectedFlavor?.id ?? null;
  const selectedOutOfStock = (selectedColor?.availability ?? selectedFlavor?.availability) === "out-of-stock";
  const canAddToCart = sellingPrice !== null && !selectedOutOfStock && (!hasOptions || cartVariantId !== null);
  const stats = [
    { label: dict.product.statBattery, value: formatBattery(product.attributes.batteryMah) },
    { label: dict.product.statOutput, value: formatWattage(product.attributes.wattageMin, product.attributes.wattageMax) },
    product.attributes.puffCount ? { label: dict.product.statRatedPuffs, value: formatPuffs(product.attributes.puffCount) } : null,
    product.attributes.capacityMl ? { label: dict.product.statCapacity, value: `${product.attributes.capacityMl}mL` } : null,
  ].filter((s): s is { label: string; value: string } => Boolean(s) && s!.value !== "—");

  return (
    <section className="relative overflow-hidden border-b border-surface-border-soft bg-surface-1">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background: "radial-gradient(ellipse 55% 45% at 85% 15%, var(--color-ember-soft) 0%, transparent 60%)",
        }}
        aria-hidden
      />
      <Container className="relative grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-20">
        <div className="order-2 flex flex-col gap-5 lg:order-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="steel">{brandName(product.brandId)}</Badge>
            <Badge tone="neutral">{familyName(product.familyId)}</Badge>
            {product.editorialTag && <Badge tone="ember">{product.editorialTag}</Badge>}
          </div>
          <h1 className="font-display text-[length:var(--text-h1)] font-bold leading-[0.95] tracking-tight text-foreground">
            {product.name}
          </h1>
          <div className="flex flex-col gap-1.5">
            <p className="max-w-lg text-lg leading-relaxed text-foreground-muted">{product.tagline}</p>
            {copyTh && <p className="max-w-lg text-lg leading-relaxed text-foreground-muted/75">{copyTh.tagline}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <p className="max-w-lg text-sm leading-relaxed text-foreground-dim">{product.shortDescription}</p>
            {copyTh && <p className="max-w-lg text-sm leading-relaxed text-foreground-dim/75">{copyTh.shortDescription}</p>}
          </div>

          {sellingPrice !== null && (
            <div>
              <span className="label-mono text-xs text-foreground-dim">{dict.pilot.priceLabel}</span>
              <p className="font-display text-3xl font-bold text-foreground">฿{sellingPrice.toLocaleString("th-TH")}</p>
            </div>
          )}

          {product.colorVariants && product.colorVariants.length > 0 && (
            <ColorVariantRail
              variants={product.colorVariants}
              selectedId={selectedColorId}
              onSelect={(id) => {
                setSelectedColorId(id);
                setShowAllColors(false);
              }}
              label={dict.product.colorLabel}
              allLabel={product.lineupImage ? dict.product.allVariantsLabel : undefined}
              isAllSelected={showAllColors}
              onSelectAll={product.lineupImage ? () => setShowAllColors(true) : undefined}
              outOfStockLabel={dict.product.outOfStockChip}
            />
          )}

          {product.flavorVariants && product.flavorVariants.length > 0 && (
            <FlavorVariantGrid
              variants={product.flavorVariants}
              selectedId={selectedFlavorId}
              onSelect={setSelectedFlavorId}
              label={dict.product.flavorLabel}
              outOfStockLabel={dict.product.outOfStockChip}
            />
          )}

          {sellingPrice !== null && (
            <div className="flex flex-col gap-3 pt-1">
              {canAddToCart ? (
                <form action={addToCartAction} className="flex flex-wrap gap-3">
                  <input type="hidden" name="slug" value={product.slug} />
                  {cartVariantId && <input type="hidden" name="variantId" value={cartVariantId} />}
                  <input type="hidden" name="quantity" value={1} />
                  <Button type="submit">{dict.productActions.addToCartCta}</Button>
                </form>
              ) : (
                <div className="flex flex-col items-start gap-2">
                  <span className="label-mono text-xs text-ember">{dict.productActions.outOfStockLabel}</span>
                  <a
                    href={CONTACT.lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-surface-border px-6 py-3 text-sm font-semibold tracking-tight text-foreground transition-colors duration-200 hover:border-foreground-dim hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-ember"
                  >
                    {dict.productActions.outOfStockCta}
                  </a>
                </div>
              )}
            </div>
          )}

          <div className={`flex flex-wrap gap-3 ${sellingPrice !== null ? "pt-1" : "pt-2"}`}>
            <Button href={`/compare?slugs=${product.slug}`} variant={sellingPrice !== null ? "secondary" : "primary"}>
              {dict.product.addToComparison}
            </Button>
            <Button href="#specifications" variant="secondary">
              {dict.product.viewSpecifications}
            </Button>
          </div>

          {stats.length > 0 && (
            <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-surface-border-soft pt-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <dt className="label-mono text-[0.6rem] text-foreground-dim">{s.label}</dt>
                  <dd className="font-display text-lg font-semibold text-foreground">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="relative order-1 mx-auto aspect-square w-full max-w-lg lg:order-2 lg:max-w-none">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 58% 54% at 50% 40%, var(--color-steel-soft) 0%, transparent 72%)" }}
            aria-hidden
          />
          <FavoriteButton slug={product.slug} className="absolute right-2 top-2 z-10" />
          <div className="relative h-full w-full p-8 lg:p-12">
            <ProductMedia
              product={product}
              sizes="(min-width: 1024px) 42vw, 85vw"
              qualityAware={currentImageDisplayInfo}
              overrideImage={heroOverrideImage}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-x-16 bottom-6 h-10 rounded-full opacity-70"
            style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 75%)", filter: "blur(10px)" }}
            aria-hidden
          />
        </div>
      </Container>
    </section>
  );
}
