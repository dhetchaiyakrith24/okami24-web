/**
 * OKami24 — the card-only records a product grid sends to the browser (speed round, owner 13/11 "เว็บรู้สึกโหลดภาพช้า และ
 * กดเปลี่ยนหัวข้อหน่วงเป็นช่วงๆ").
 *
 * CatalogBrowser and FavoritesList are client components, so every product they receive is serialized into the page's
 * RSC payload — and every prefetch of that page. Measured 13/11 on /products: 785 KB decoded, 88 % of it the full
 * product records (flavour lists, spec tables, features, FAQ) that no card shows. These types say exactly what a card
 * and the grid's filters/sort read, and the builders keep only that, so the payload carries cards, not product pages.
 *
 * The types are the guard: ProductCard, PilotProductCard and the helpers they call accept these narrow shapes, so a
 * card that starts reading another field fails `tsc` until the field is added here (a full `Product` still fits, so
 * every other caller is unchanged).
 */
import type { ColorVariant, FlavorVariant, Product, ProductAsset } from "@/types/catalog";
import type { StorefrontProductView, StorefrontSpecificationView, StorefrontVariantView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { HEADLINE_SPEC_KEYS, type HeadlineRow } from "@/lib/card-headline-spec";

/** A legacy product as a card sees it (ProductCard → ProductMedia/DeviceGlyph, OptionCountBadge, the headline spec) plus
 *  what CatalogBrowser filters and sorts by (brand, family, flagship, editorial tag, screen/portability/beginner). */
export type CardProduct = Pick<
  Product,
  "slug" | "brandId" | "familyId" | "categoryId" | "systemType" | "name" | "tagline" | "isFlagship" | "editorialTag" | "availability" | "attributes"
> & {
  assets: readonly Pick<ProductAsset, "role" | "src" | "alt">[];
  specifications: readonly HeadlineRow[];
  colorVariants?: readonly Pick<ColorVariant, "availability">[];
  flavorVariants?: readonly Pick<FlavorVariant, "availability">[];
};

/** A published (ProductMaster) product as PilotProductCard and CatalogBrowser see it. */
export type CardPublished = Pick<
  StorefrontProductView,
  | "slug"
  | "displayName"
  | "tagline"
  | "brandId"
  | "brandName"
  | "categoryId"
  | "systemType"
  | "glyphKind"
  | "image"
  | "isFlagship"
  | "publicationStatus"
  | "sellingPrice"
  | "availabilityStatus"
  | "optionAxisLabel"
  | "optionAxisCode"
> & {
  variants: readonly Pick<StorefrontVariantView, "label">[];
  specifications: readonly Pick<StorefrontSpecificationView, "key" | "value" | "sourceStatus">[];
};

/** Only the spec rows the card's headline line can use: verified, and one of the keys card-headline-spec.ts reads. */
const headlineRows = (rows: readonly HeadlineRow[]): HeadlineRow[] =>
  rows.filter((r) => r.sourceStatus === "verified" && HEADLINE_SPEC_KEYS.has(r.key)).map(({ key, value, sourceStatus }) => ({ key, value, sourceStatus }));

const availabilityOnly = <T extends { availability?: unknown }>(list: readonly T[] | undefined) =>
  list?.map((v) => (v.availability === undefined ? {} : { availability: v.availability })) as Pick<T, "availability">[] | undefined;

export function cardProduct(p: Product): CardProduct {
  return {
    slug: p.slug,
    brandId: p.brandId,
    familyId: p.familyId,
    categoryId: p.categoryId,
    systemType: p.systemType,
    name: p.name,
    tagline: p.tagline,
    isFlagship: p.isFlagship,
    editorialTag: p.editorialTag,
    availability: p.availability,
    attributes: p.attributes,
    assets: p.assets.filter((a) => a.role === "card").map(({ role, src, alt }) => ({ role, src, alt })),
    specifications: headlineRows(p.specifications),
    colorVariants: availabilityOnly(p.colorVariants),
    flavorVariants: availabilityOnly(p.flavorVariants),
  };
}

export function cardPublished(p: StorefrontProductView): CardPublished {
  return {
    slug: p.slug,
    displayName: p.displayName,
    tagline: p.tagline,
    brandId: p.brandId,
    brandName: p.brandName,
    categoryId: p.categoryId,
    systemType: p.systemType,
    glyphKind: p.glyphKind,
    image: p.image,
    isFlagship: p.isFlagship,
    publicationStatus: p.publicationStatus,
    sellingPrice: p.sellingPrice,
    availabilityStatus: p.availabilityStatus,
    optionAxisLabel: p.optionAxisLabel,
    optionAxisCode: p.optionAxisCode,
    variants: p.variants.map(({ label }) => ({ label })),
    specifications: headlineRows(p.specifications),
  };
}
