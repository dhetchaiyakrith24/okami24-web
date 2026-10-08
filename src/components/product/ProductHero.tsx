"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/catalog";
import { ProductMedia } from "@/components/visual/ProductMedia";
import { NoOptionPhoto } from "@/components/product/NoOptionPhoto";
import { ColorVariantRail } from "@/components/product/ColorVariantRail";
import { FlavorVariantGrid } from "@/components/product/FlavorVariantGrid";
import { MobileVariantGallery, MOBILE_SLIDE_SIZES } from "@/components/product/MobileVariantGallery";
import { legacyVariantOptions } from "@/components/product/variant-options";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { EditorialTagBadge } from "@/components/catalog/EditorialTagBadge";
import { Button } from "@/components/ui/Button";
import { FavoriteButton } from "@/components/catalog/FavoriteButton";
import { SoldOutPhotoBadge } from "@/components/product/SoldOutPhotoBadge";
import { brandName, familyName, formatBattery, formatPuffs, formatWattage } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PRODUCT_COPY_TH } from "@/i18n/product-copy-th";
import { thaiTypographyNode } from "@/lib/thai-typography";
import type { ImageDisplayInfo } from "@/lib/media-quality";
import { ProductBuyAction } from "@/components/commerce/ProductBuyAction";
import { MobileBuyBar } from "@/components/commerce/MobileBuyBar";
import { verifiedAttributes, verifiedRows } from "@/lib/verified-specs";
import { BRAND_LOGOS } from "@/lib/brand-logos";
import { getBrand } from "@/data/brands";

/** First option a customer may actually buy — skips options marked out-of-stock so the page never
 *  opens on a colour/flavour the cart would reject (falls back to the first option when every one
 *  is sold out, so the name label and photo still work). */
function firstSellable<T extends { id: string; availability?: string }>(options: T[] | undefined): string | null {
  if (!options || options.length === 0) return null;
  return (options.find((o) => o.availability !== "out-of-stock") ?? options[0]).id;
}

/** Image-fix round 2026-09-28 (owner: an option without its own photo must never show another option's photo):
 *  open on an option that HAS its own photo, so the first picture always matches the name beside it. With every
 *  option photographed this is exactly `firstSellable`. With 2+ options and none photographed nothing is
 *  pre-selected — the page opens on the product photo, which then claims no particular option. */
function initialOption<T extends { id: string; availability?: string; image?: unknown }>(options: T[] | undefined): string | null {
  if (!options || options.length === 0) return null;
  const sellable = options.filter((o) => o.availability !== "out-of-stock");
  const withPhoto = (sellable.length > 0 ? sellable : options).find((o) => o.image);
  if (withPhoto) return withPhoto.id;
  return options.length >= 2 ? null : firstSellable(options);
}

/** `imageDisplayInfo` — the storefront quality-correction pass's fill-vs-intrinsic sizing switch,
 *  computed server-side (reads the real file under `public/`, never a value that could go stale)
 *  and passed down as plain data since this is a client component. `undefined` (e.g. the source
 *  file couldn't be read) falls back to the original always-fill behavior. See
 *  `src/lib/media-quality.ts` for the full rationale.
 *
 *  Phone layout (mobile round A, MOBILE_SPEC M2 + owner decisions A-ข/D-ข, 2026-09-08 — every
 *  `max-lg:` / `lg:hidden` class in this file): below `lg` the two desktop columns dissolve
 *  (`max-lg:contents`) so every block becomes a direct child of the one-column grid and can be
 *  re-ordered without touching the desktop tree: name → swipe gallery with position dots →
 *  colour/flavour chips → price → (tagline, description) → compare/spec buttons → stats. The
 *  in-page buy button hides on phones because the sticky `MobileBuyBar` carries the same
 *  `ProductBuyAction`. Selection state is unchanged and still lives here (P1: M5 reads it next).
 *  At `lg` and above every class that was here before is still here, untouched. */
export function ProductHero({
  product,
  sellingPrice = null,
  imageDisplayInfo,
  imageDisplayMap,
  orderingEnabled = true,
}: {
  product: Product;
  /** From the server page (src/lib/commerce/ordering-mode.ts — owner 2026-09-07). False = the
   *  cart form is replaced by OrderViaLineButton; everything else on the page is unchanged.
   *  Defaults to true so every other caller renders exactly as before. */
  orderingEnabled?: boolean;
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
  // Round 30.4 wiring A (owner ruling 2026-09-12): a Thai visitor reads the human-checked Thai
  // tagline/description from product-copy-th.ts INSTEAD of the English pair. Until this round the
  // English stayed above the Thai ("never replacing", Phase 3.2.2), which left two English lines in
  // the hero of every legacy product page after the site went Thai-first. A slug without a Thai
  // entry keeps the English lines, so nothing goes blank; en/zh visitors see exactly what they did.
  const copyTh = locale === "th" ? PRODUCT_COPY_TH[product.slug] : undefined;
  // Round 30.4ค closing: render-time Thai typography (thai-typography.ts) — data strings stay plain.
  const heroTagline = copyTh?.tagline ? thaiTypographyNode(copyTh.tagline) : product.tagline;
  const heroDescription = copyTh?.shortDescription ? thaiTypographyNode(copyTh.shortDescription) : product.shortDescription;
  // `openOnCardPhoto` (see its doc in types/catalog.ts): open on the card with nothing picked.
  const openOnCard = product.openOnCardPhoto === true;
  // `lineupFirst` (see its doc in types/catalog.ts): open on the lineup of every option, "all" selected, nothing picked.
  const lineupFirst = product.lineupFirst === true && !!product.lineupImage;
  const startUnpicked = openOnCard || lineupFirst;
  const [selectedColorId, setSelectedColorId] = useState<string | null>(startUnpicked ? null : initialOption(product.colorVariants));
  const [selectedFlavorId, setSelectedFlavorId] = useState<string | null>(startUnpicked ? null : initialOption(product.flavorVariants));
  // "All Colors" (owner mandate, 2026-09-03) is a third hero-image state, not a third variant list
  // — it only exists when a real lineup shot does. Starts unselected (an individual color/default
  // photo is still the strongest first impression); the customer opts INTO the lineup view.
  const [showAllColors, setShowAllColors] = useState(lineupFirst);
  // Which "all" image is shown: `lineupImage2` is a second group (owner 01/10 — Caliburn G3 Pro's 16 colours as two
  // groups of 8). With two, the pills read "ทั้งหมด 1" / "ทั้งหมด 2" (the label + its number, in every language).
  const lineups = [product.lineupImage, product.lineupImage2].filter((l): l is NonNullable<typeof l> => !!l);
  const [allIndex, setAllIndex] = useState(0);
  const shownLineup = lineups[allIndex] ?? product.lineupImage;
  const allLabelAt = (i: number) => (lineups.length > 1 ? `${dict.product.allVariantsLabel} ${i + 1}` : dict.product.allVariantsLabel);
  const selectedColor = product.colorVariants?.find((c) => c.id === selectedColorId);
  const selectedFlavor = product.flavorVariants?.find((f) => f.id === selectedFlavorId);
  // "all": the lineup photo. On a lineupFirst product it is also the unpicked start state, so it clears the pick
  // (the photo then claims no option, and the buy action asks for one); elsewhere it keeps the pick, as before —
  // unless the pick is sold out (reachable since stock batch 2c, sold-out chips are clickable): then it returns to the
  // page's opening option, so the lineup of every colour never reads "sold out" while others still sell (checker #404).
  function selectAll(i = 0) {
    setAllIndex(i);
    if (lineupFirst) {
      setSelectedColorId(null);
      setSelectedFlavorId(null);
    } else {
      if (selectedColor?.availability === "out-of-stock") setSelectedColorId(initialOption(product.colorVariants));
      if (selectedFlavor?.availability === "out-of-stock") setSelectedFlavorId(initialOption(product.flavorVariants));
    }
    setShowAllColors(true);
  }
  // The option list this product picks from (legacy products carry colours OR flavours, never both). An option
  // with no photo of its own gets the NoOptionPhoto panel instead of the product card — the card is often one
  // specific option (image-fix round 2026-09-28). A single-option product keeps the card: the card IS that option.
  const optionRecords = (product.colorVariants?.length ? product.colorVariants : product.flavorVariants) ?? [];
  const noPhotoNote = (product.colorVariants?.length ?? 0) > 0 ? dict.product.noPhotoColor : dict.product.noPhotoFlavor;
  const lacksOwnPhoto = (o: { image?: unknown } | undefined) => optionRecords.length >= 2 && !!o && !o.image;
  const selectedRecord = selectedColor ?? selectedFlavor;
  const showNoPhoto = !showAllColors && lacksOwnPhoto(selectedRecord);
  const heroOverrideImage = showAllColors ? shownLineup ?? null : selectedColor?.image ?? selectedFlavor?.image ?? null;
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
  // "Nothing picked yet" (only on products whose options have no photos — see initialOption) is not "out of stock":
  // it no longer blocks the buy action; ProductBuyAction gets choiceMissingLabel instead (designer 2026-09-28).
  const choiceMissing = hasOptions && cartVariantId === null;
  const choiceMissingLabel = choiceMissing ? ((product.colorVariants?.length ?? 0) > 0 ? dict.product.chooseColorFirst : dict.product.chooseFlavorFirst) : null;
  // Every option sold out (stock round 08/10: no SKU in the warehouse) = the product is sold out, even with nothing picked
  // yet — otherwise a page that opens on no option would still offer "order on LINE". A product without options carries
  // the same answer on the product itself (no SKU, batch 2b — e.g. Zero Nano).
  const everyOptionSoldOut = hasOptions
    ? [...(product.colorVariants ?? []), ...(product.flavorVariants ?? [])].every((v) => v.availability === "out-of-stock")
    : product.availability === "out-of-stock";
  const canAddToCart = sellingPrice !== null && !selectedOutOfStock && !everyOptionSoldOut;
  // Data round (owner 2026-09-24): a stat shows only when a verified spec row states the same number.
  const facts = verifiedAttributes(product);
  const hasVerifiedSpecs = verifiedRows(product.specifications).length > 0;
  const stats = [
    { label: dict.product.statBattery, value: formatBattery(facts.batteryMah) },
    { label: dict.product.statOutput, value: formatWattage(facts.wattageMin, facts.wattageMax) },
    facts.puffCount ? { label: dict.product.statRatedPuffs, value: formatPuffs(facts.puffCount, dict.catalog.puffUnit) } : null,
    facts.capacityMl ? { label: dict.product.statCapacity, value: `${facts.capacityMl}mL` } : null,
  ].filter((s): s is { label: string; value: string } => Boolean(s) && s!.value !== "—");

  // Phone gallery (M2.2/M2.3): one slide per option, each showing that option's own photo or —
  // when it has none yet — the NoOptionPhoto panel (image-fix round 2026-09-28; before that, the product's
  // default photo with only the name changing, which showed one option's photo under another's name). Swiping IS
  // selecting: it sets the same state the chips set, including onto a sold-out option (owner
  // decision A-ข: the customer may look at it; the page then shows the sold-out state and the
  // chip stays disabled). "All Colors" is not a slide — while it is on, the lineup photo shows.
  const options = legacyVariantOptions(product);
  const hasColorAxis = (product.colorVariants?.length ?? 0) > 0;
  const selectedOptionId = hasColorAxis ? selectedColorId : selectedFlavorId;
  const selectOption = (slideId: string) => {
    // the leading "all" slide (lineupFirst products) = the lineup, nothing picked
    if (slideId === "all") return selectAll();
    // the leading "default" slide (product photo — products where no option has a photo, or openOnCardPhoto) = no option
    const id = slideId === "default" ? null : slideId;
    if (hasColorAxis) setSelectedColorId(id);
    else setSelectedFlavorId(id);
    setShowAllColors(false);
  };
  // G5 template round batch 3 (owner 02/10: every image that looks clickable goes somewhere fitting): a link to
  // `#option-<id>` — the colour/flavour tiles in "more details" — picks that option here and scrolls the hero into
  // view (instantly for visitors who asked for reduced motion). Also works when the page is opened with that hash.
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const ids = new Set(optionRecords.map((o) => o.id));
    const pick = () => {
      const m = /^#option-(.+)$/.exec(window.location.hash);
      if (!m || !ids.has(decodeURIComponent(m[1]))) return;
      selectOption(decodeURIComponent(m[1]));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      heroRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
    // the option list never changes after mount, and selectOption only calls state setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // A lineupFirst product leads with the lineup instead: every option is in it, the card shows only one.
  const leadWithCard = !lineupFirst && (openOnCard || (optionRecords.length >= 2 && optionRecords.every((o) => !o.image)));
  const lineupSlide = lineupFirst && product.lineupImage
    ? [{ id: "all", node: <div className="h-full w-full p-2"><ProductMedia product={product} sizes={MOBILE_SLIDE_SIZES} qualityAware={imageDisplayMap?.[product.lineupImage.src] ?? null} overrideImage={product.lineupImage} loading={showAllColors ? "eager" : "lazy"} fetchPriority={showAllColors ? "high" : "auto"} /></div> }]
    : [];
  const optionSlides = options.map((o) => {
    const record = optionRecords.find((r) => r.id === o.id);
    return lacksOwnPhoto(record)
      ? { id: o.id, node: <div className="h-full w-full p-2"><NoOptionPhoto name={o.name} swatchHex={record?.swatchHex} note={noPhotoNote} /></div> }
      : null;
  });
  const slides =
    options.length > 0
      ? [
          ...lineupSlide,
          ...(leadWithCard ? [{ id: "default", node: <div className="h-full w-full p-2"><ProductMedia product={product} sizes={MOBILE_SLIDE_SIZES} qualityAware={imageDisplayInfo} loading="eager" fetchPriority="high" /></div> }] : []),
          ...options.map((o, i) => optionSlides[i] ?? {
          id: o.id,
          node: (
            <div className="h-full w-full p-2">
              <ProductMedia
                product={product}
                sizes={MOBILE_SLIDE_SIZES}
                qualityAware={o.image ? imageDisplayMap?.[o.image.src] ?? null : imageDisplayInfo}
                overrideImage={o.image}
                // The slide the customer is actually looking at is this page's largest paint, so
                // it must not wait for the lazy-loading threshold. It used to say `priority`,
                // which Next 16 deprecated into a no-op — a DOM probe on 2026-09-08 found the
                // rendered <img> still carrying `loading="auto"`/`fetchpriority="auto"`, i.e. the
                // hint had been doing nothing since the upgrade. These two attributes are the
                // replacement Next 16's own docs point at.
                loading={o.id === selectedOptionId ? "eager" : "lazy"}
                fetchPriority={o.id === selectedOptionId ? "high" : "auto"}
              />
            </div>
          ),
          }),
        ]
      : [
          {
            id: "default",
            node: (
              <div className="h-full w-full p-2">
                <ProductMedia product={product} sizes={MOBILE_SLIDE_SIZES} qualityAware={imageDisplayInfo} loading="eager" fetchPriority="high" />
              </div>
            ),
          },
        ];
  // Stock batch 2c (owner 08/10): a sold-out option stays viewable and its photo carries the sold-out badge — on phones
  // per slide (it travels with the swipe), on desktop over the still image. The product card / lineup slide gets it
  // only when nothing at all can be ordered.
  const soldOutBadge = <SoldOutPhotoBadge label={dict.product.outOfStockChip} />;
  const badgedSlides = slides.map((s) => {
    const option = options.find((o) => o.id === s.id);
    return (option ? option.outOfStock : everyOptionSoldOut) ? { ...s, node: <>{s.node}{soldOutBadge}</> } : s;
  });
  // Same rule as the buy action (canAddToCart): "All colors" after picking a sold-out colour keeps that colour as the
  // cart choice, so the lineup photo carries the badge too (checker #404).
  const photoSoldOut = everyOptionSoldOut || selectedOutOfStock;
  // On a lineupFirst product "all" is where the page starts, not an option — the buy bar then asks for a pick.
  const selectedOptionLabel = showAllColors ? (product.lineupImage && !lineupFirst ? allLabelAt(allIndex) : null) : selectedColor?.name ?? selectedFlavor?.name ?? null;
  const priceText = sellingPrice !== null ? `฿${sellingPrice.toLocaleString("th-TH")}` : null;

  return (
    <>
    <section ref={heroRef} className="relative scroll-mt-16 overflow-hidden border-b border-surface-border-soft bg-surface-1">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background: "radial-gradient(ellipse 55% 45% at 85% 15%, var(--color-ember-soft) 0%, transparent 60%)",
        }}
        aria-hidden
      />
      <Container className="relative grid grid-cols-1 items-center gap-10 py-14 max-lg:gap-4 max-lg:py-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-20">
        <div className="order-2 flex flex-col gap-5 max-lg:contents lg:order-1">
          <div className="flex flex-wrap items-center gap-2 max-lg:order-1">
            {/* owner 03/10: the brand's own logo (linked to its brand page) in place of the text chip, when the file exists */}
            {BRAND_LOGOS[product.brandId] ? (
              <Link href={`/brands/${getBrand(product.brandId)?.slug ?? product.brandId}`} className="mr-1 inline-flex h-6 items-center opacity-90 transition-opacity hover:opacity-100">
                <Image
                  src={BRAND_LOGOS[product.brandId].src}
                  alt={brandName(product.brandId)}
                  loading="eager"
                  width={BRAND_LOGOS[product.brandId].width}
                  height={BRAND_LOGOS[product.brandId].height}
                  // one visual letter size for every brand: 20 px (24 px from lg) × the logo's own `scale` (brand-logos.ts)
                  style={{ "--logo-scale": BRAND_LOGOS[product.brandId].scale ?? 1 } as CSSProperties}
                  className="h-[calc(1.25rem*var(--logo-scale))] w-auto lg:h-[calc(1.5rem*var(--logo-scale))]"
                />
              </Link>
            ) : (
              <Badge tone="steel">{brandName(product.brandId)}</Badge>
            )}
            <Badge tone="neutral">{familyName(product.familyId)}</Badge>
            <EditorialTagBadge tag={product.editorialTag} />
          </div>
          <h1 className="font-display text-[length:var(--text-h1)] font-bold leading-[0.95] tracking-tight text-foreground max-lg:order-2 max-lg:text-[1.75rem] max-lg:leading-[1.1]">
            {product.name}
          </h1>
          <div className="flex flex-col gap-1.5 max-lg:order-7">
            <p className="max-w-lg text-lg leading-relaxed text-foreground-muted">{heroTagline}</p>
          </div>
          <div className="flex flex-col gap-1 max-lg:order-8">
            <p className="max-w-lg text-sm leading-relaxed text-foreground-dim">{heroDescription}</p>
          </div>

          {sellingPrice !== null && (
            <div className="max-lg:order-5">
              <span className="label-mono text-xs text-foreground-dim">{dict.pilot.priceLabel}</span>
              <p className="font-display text-3xl font-bold text-foreground max-lg:text-2xl">฿{sellingPrice.toLocaleString("th-TH")}</p>
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
              onSelectAll={product.lineupImage ? () => selectAll() : undefined}
              allChips={lineups.length > 1 ? lineups.map((_, i) => ({ label: allLabelAt(i), selected: showAllColors && allIndex === i, onSelect: () => selectAll(i) })) : undefined}
              outOfStockLabel={dict.product.outOfStockChip}
              className="max-lg:order-4"
            />
          )}

          {product.flavorVariants && product.flavorVariants.length > 0 && (
            <FlavorVariantGrid
              variants={product.flavorVariants}
              selectedId={selectedFlavorId}
              onSelect={(id) => {
                setSelectedFlavorId(id);
                setShowAllColors(false);
              }}
              label={dict.product.flavorLabel}
              allLabel={product.lineupImage ? dict.product.allVariantsLabel : undefined}
              isAllSelected={showAllColors}
              onSelectAll={product.lineupImage ? () => selectAll() : undefined}
              outOfStockLabel={dict.product.outOfStockChip}
              className="max-lg:order-4"
            />
          )}

          {sellingPrice !== null && (
            <div className="flex flex-col gap-3 pt-1 max-lg:hidden">
              {/* One shared buy action for every product page and the mobile bar — see
                  ProductBuyAction.tsx (mobile round, 2026-09-08). The legacy form/note classes
                  are passed in so this renders exactly as it did when the branch lived here. */}
              <ProductBuyAction
                available={canAddToCart}
                choiceMissingLabel={choiceMissingLabel}
                orderingEnabled={orderingEnabled}
                slug={product.slug}
                variantId={cartVariantId}
                productName={product.displayName}
                variantLabel={selectedColor?.name ?? selectedFlavor?.name ?? null}
                formClassName="flex flex-wrap gap-3"
                noteClassName="basis-full text-xs text-foreground-muted hover:text-foreground"
              />
            </div>
          )}

          <div className={`flex flex-wrap gap-3 max-lg:order-9 ${sellingPrice !== null ? "pt-1" : "pt-2"}`}>
            <Button href={`/compare?slugs=${product.slug}`} variant={sellingPrice !== null ? "secondary" : "primary"}>
              {dict.product.addToComparison}
            </Button>
            {hasVerifiedSpecs && (
              <Button href="#specifications" variant="secondary">
                {dict.product.viewSpecifications}
              </Button>
            )}
          </div>

          {stats.length > 0 && (
            <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-surface-border-soft pt-6 max-lg:order-10 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <dt className="label-mono text-[0.6rem] text-foreground-dim">{s.label}</dt>
                  <dd className="font-display text-lg font-semibold text-foreground">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* The image box: same element and same children order as before for desktop; on phones
            (max-lg) it re-orders under the name and its still hero image gives way to the swipe
            gallery, which is absolutely positioned over the same square. One FavoriteButton in its
            original DOM slot serves both — a second copy for the phone view was found (2026-09-08)
            to perturb the desktop render of the heart's backdrop blur by ±2/255. */}
        <div className="relative order-1 mx-auto aspect-square w-full max-w-lg max-lg:order-3 max-lg:max-w-none lg:order-2 lg:max-w-none">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 58% 54% at 50% 40%, var(--color-steel-soft) 0%, transparent 72%)" }}
            aria-hidden
          />
          <FavoriteButton slug={product.slug} className="absolute right-2 top-2 z-10" />
          {photoSoldOut && <SoldOutPhotoBadge label={dict.product.outOfStockChip} className="max-lg:hidden" />}
          <div className="relative h-full w-full p-8 max-lg:hidden lg:p-12">
            {showNoPhoto && selectedRecord ? (
              <NoOptionPhoto name={selectedRecord.name} swatchHex={selectedRecord.swatchHex} note={noPhotoNote} />
            ) : (
              <ProductMedia
                product={product}
                sizes="(min-width: 1024px) 42vw, 85vw"
                qualityAware={currentImageDisplayInfo}
                overrideImage={heroOverrideImage}
              />
            )}
          </div>
          {/* The floor shadow under a single device; a lineup carries its own stage floor, and this one sat as a second
              floor under its names (designer 2026-09-30); a colour photo marked `ownFloor` carries its own studio shadow. */}
          {!(showAllColors && product.lineupImage) && !(heroOverrideImage && "ownFloor" in heroOverrideImage && heroOverrideImage.ownFloor) && (
            <div
              className="pointer-events-none absolute inset-x-16 bottom-6 h-10 rounded-full opacity-70 max-lg:hidden"
              style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 75%)", filter: "blur(10px)" }}
              aria-hidden
            />
          )}
          {/* Phone gallery — hidden at lg+, where the still image above is the hero. */}
          <div className="absolute inset-0 lg:hidden">
            {showAllColors && product.lineupImage && !lineupFirst ? (
              <div className="relative h-full w-full p-2">
                <ProductMedia product={product} sizes={MOBILE_SLIDE_SIZES} qualityAware={imageDisplayMap?.[(shownLineup ?? product.lineupImage).src] ?? null} overrideImage={shownLineup ?? product.lineupImage} />
                {photoSoldOut && soldOutBadge}
              </div>
            ) : (
              <MobileVariantGallery
                slides={badgedSlides}
                selectedId={lineupFirst && showAllColors ? "all" : selectedOptionId ?? "default"}
                onSelect={selectOption}
                className="h-full"
                ariaLabel={hasColorAxis ? dict.product.colorLabel : dict.product.flavorLabel}
              />
            )}
          </div>
        </div>
      </Container>
    </section>
    {sellingPrice !== null && (
      <MobileBuyBar priceText={priceText} optionLabel={selectedOptionLabel}>
        <ProductBuyAction
          available={canAddToCart}
                choiceMissingLabel={choiceMissingLabel}
          orderingEnabled={orderingEnabled}
          slug={product.slug}
          variantId={cartVariantId}
          productName={product.displayName}
          variantLabel={selectedColor?.name ?? selectedFlavor?.name ?? null}
          compact
        />
      </MobileBuyBar>
    )}
    </>
  );
}
