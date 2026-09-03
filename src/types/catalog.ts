/**
 * Core catalog data model. Every product/spec/asset carries a `sourceStatus`
 * so the UI can distinguish independently verified facts from anything
 * that could not be confirmed against an official source — never fabricated.
 */

export type SourceStatus = "verified" | "unverified";

export type SystemType =
  | "open-pod" // refillable open-system pod device (e.g. Caliburn family)
  | "pod-kit" // higher-output pod mod (e.g. ARGUS, DRAG, VINCI)
  | "disposable" // prefilled disposable
  | "pod-cartridge" // replacement pod / cartridge
  | "coil"
  | "accessory";

export type DrawStyle = "MTL" | "RDL" | "DTL" | "MTL/RDL";

export type ScreenType = "none" | "led-indicator" | "color-display" | "touchscreen";

export type Portability = "ultra-compact" | "compact" | "standard";

export interface Brand {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  founded?: string;
  homeMarket?: string;
  referenceUrl: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  systemTypes: SystemType[];
}

export interface ProductFamily {
  id: string;
  slug: string;
  brandId: string;
  categoryId: string;
  name: string;
  tagline: string;
  description: string;
}

export interface Specification {
  key: string;
  label: string;
  value: string;
  sourceStatus: SourceStatus;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
}

export interface Compatibility {
  type: "pod" | "coil" | "cartridge" | "charging";
  label: string;
  note?: string;
}

export interface ProductAsset {
  kind: "official-photo" | "illustration";
  /** "card" = isolated/transparent shot used everywhere the product appears
   *  (catalog card, hero, picker, home rails) in place of DeviceGlyph.
   *  "detail" = supplementary shot shown only in the product page gallery. */
  role: "card" | "detail";
  src: string;
  alt: string;
  angle?: string;
  transparentBackground?: boolean;
  sourceName?: string;
  sourceUrl?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Real manufacturer-confirmed color/finish variant for a Legacy catalog product (owner quality
 * review, 2026-09-02). Deliberately separate from ProductMaster's `ProductVariant` (which models
 * Shipnity-sourced option axes like resistance/flavor with commerce implications — price, stock,
 * SKU) — a Legacy color variant carries none of that; it exists purely to let a customer see and
 * inspect the other real colors a model ships in. `image` is present ONLY when a real, verified
 * photo of that exact color exists — never fabricated to "complete" a list. A color with no
 * `image` still displays (name + swatch), it just doesn't swap the hero photo when selected.
 */
export interface ColorVariant {
  /** Stable, URL/DOM-safe id, e.g. "mystic-forest". */
  id: string;
  /** The manufacturer's own name for this color/finish, e.g. "Mystic Forest". */
  name: string;
  /** Approximate real-world swatch color for the selector dot — an honest visual approximation
   *  from the real product photo/name, never a claim of exact factory color-matching. */
  swatchHex: string;
  /** Present only when a real, sourced photo of this exact color exists. */
  image?: { src: string; alt: string };
  sourceUrl?: string;
}

/**
 * Whether a real, verified variant is currently orderable — kept STRICTLY separate from whether
 * it exists in the manufacturer's real catalog (owner rule, 2026-09-03: "manufacturer catalog
 * truth and operational stock truth are separate"). A flavor a manufacturer genuinely makes stays
 * visible in `FlavorVariant`/`ColorVariant` even when this reads "out-of-stock" or "unknown" — it
 * must never be silently removed from the list just because it isn't currently stocked. Mirrors
 * `AvailabilityStatus` in `product-master.ts` (kept as a separate type, not imported, because the
 * Legacy catalog and ProductMaster are deliberately independent data models — see that file's own
 * header for why they aren't merged).
 */
export type VariantAvailability = "in-stock" | "out-of-stock" | "unknown";

/**
 * Real manufacturer-confirmed flavor variant for a Legacy catalog disposable/pod-cartridge
 * product (owner mandate, 2026-09-03 — "the current color-only variant model is no longer
 * sufficient for the disposable business"). Deliberately a SEPARATE shape from `ColorVariant`,
 * not a reuse of it: a flavor is a taste/consumable-content axis, not a finish/shell axis, and the
 * two must never be shown as if they were the same kind of choice. Like `ColorVariant`, `image` is
 * present ONLY when a real, verified photo/flavor-card artwork of that exact flavor exists — never
 * fabricated to "complete" a list. `availability` is what makes catalog truth and stock truth
 * expressible at the same time: a verified real flavor with `availability: "out-of-stock"` still
 * renders (name + swatch/art), it just can't be added to cart and is visually marked unavailable —
 * see `FlavorVariantGrid`'s own doc comment for the UI contract.
 */
export interface FlavorVariant {
  /** Stable, URL/DOM-safe id, e.g. "grape-aloe". */
  id: string;
  /** The manufacturer's own name for this flavor, e.g. "Grape Aloe". */
  name: string;
  /** An honest visual approximation of the flavor's character (e.g. green for a grape/aloe taste)
   *  for the picker chip when no real flavor-specific artwork exists — never a claim about the
   *  physical device's color, which for a disposable is usually flavor-independent. */
  swatchHex: string;
  /** Present only when real, verified flavor-specific artwork/photography exists for this exact
   *  flavor (official flavor-card art, a labeled retail photo, etc.) — same "never fabricate" rule
   *  as `ColorVariant.image`. Most flavors on most disposables will not have one, by design: the
   *  physical device usually looks identical across flavors, so this is optional richness, not a
   *  completeness requirement. */
  image?: { src: string; alt: string };
  /** Catalog truth vs. operational stock truth — see `VariantAvailability`'s own doc comment. */
  availability: VariantAvailability;
  sourceUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  brandId: string;
  familyId: string;
  categoryId: string;
  systemType: SystemType;
  name: string;
  displayName: string;
  tagline: string;
  shortDescription: string;
  isFlagship: boolean;
  editorialTag?: string; // e.g. "Editor's Pick" — explicitly demo curation, never sales data

  // Normalized attributes — power the filters, compare table, and finder.
  attributes: {
    batteryMah?: number;
    wattageMin?: number;
    wattageMax?: number;
    puffCount?: number; // disposables
    capacityMl?: number;
    screenType: ScreenType;
    screenSize?: string;
    drawStyle: DrawStyle;
    portability: Portability;
    beginnerFriendly: boolean;
    chargingType: string;
    weightG?: number;
    dimensions?: string;
  };

  assets: ProductAsset[];
  /** Real manufacturer color/finish options — absent (or omitted) for a product with no
   *  meaningful color choice, or one not yet researched. See `ColorVariant`'s own doc comment. */
  colorVariants?: ColorVariant[];
  /** Real manufacturer flavor options — absent for a product with no flavor axis (most devices),
   *  present for disposables/pod-cartridges with a real, verified flavor lineup. A product should
   *  carry AT MOST ONE of `colorVariants`/`flavorVariants` as its primary picker in practice (a
   *  device varies by shell finish OR by e-liquid flavor, not customer-facing as both at once in
   *  this catalog today) — the type does not forbid both being present, since that judgment
   *  belongs to real product data, not the schema. See `FlavorVariant`'s own doc comment. */
  flavorVariants?: FlavorVariant[];
  /**
   * A real "all colors/flavors at once" lineup shot — either the manufacturer's own official
   * lineup render (preferred, `sourceName` should say so), or an OKami24-built composite grid of
   * several individually-verified real variant images (`sourceName: "OKami24 composite"`) when no
   * official one exists. Absent when neither exists — the "All Colors" toggle simply doesn't
   * render rather than fabricating a lineup. Never a claim that this specific image represents any
   * ONE selected variant; see `ColorVariantRail`'s "All Colors" chip for how selection state
   * interacts with this.
   */
  lineupImage?: { src: string; alt: string; sourceName: string };
  /**
   * A real OKami24-channel review video for this exact product (owner mandate, 2026-09-03 —
   * "map existing review videos to the correct product identities"). Absent unless a specific
   * video was found AND confirmed to genuinely review this exact model — never a loosely-related
   * video attached just to have "content." `channelName` is shown to the customer so they know
   * which of OKami24's channels it's from; `publishedAt` (ISO date, optional) powers `VideoObject`
   * JSON-LD `uploadDate` when present. See `ProductReviewVideo` component for the lightweight,
   * click-to-load embed contract (no iframe loads until the customer clicks).
   */
  reviewVideo?: { videoId: string; title: string; channelName: string; publishedAt?: string };
  specifications: Specification[];
  features: Feature[];
  compatibility: Compatibility[];
  whoIsThisFor: string[];
  faqs: FAQItem[];
  relatedProductSlugs: string[];
  sourceUrls: string[];
}

export type FlavorFamilySlug =
  | "fruit"
  | "menthol-cooling"
  | "dessert"
  | "beverage"
  | "tobacco-style";

export interface FlavorFamily {
  id: string;
  slug: FlavorFamilySlug;
  name: string;
  description: string;
  characterNotes: string[];
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  dek: string;
  category: "buying-guide" | "how-it-works" | "maintenance" | "getting-started";
  readingTimeMin: number;
  body: GuideSection[];
  relatedProductSlugs?: string[];
}

export interface GuideSection {
  heading: string;
  paragraphs: string[];
}

export interface TechnologyEntry {
  id: string;
  slug: string;
  name: string;
  brandId?: string;
  summary: string;
  body: GuideSection[];
  relatedProductSlugs: string[];
}

/**
 * An optional, single "where this naturally leads" link on a FAQ answer (owner review,
 * 2026-09-03 — "FAQ must become actionable"). `labelKey` selects a pre-translated label (reusing
 * `nav.*` for existing destinations, `faq.*` for FAQ-specific ones) rather than storing raw text,
 * so an action never needs a separate translation pass of its own. Deliberately at most one per
 * FAQ item in practice — a wall of buttons under a short answer would read as link-stuffing, not
 * helpfulness.
 */
export interface FAQAction {
  href: string;
  labelKey: "finder" | "compare" | "favorites" | "eliquid" | "viewGuideCta" | "contactLineCta" | "browseProductsCta";
}

export interface SiteFAQ {
  id: string;
  question: string;
  answer: string;
  category: "ordering" | "devices" | "e-liquid" | "safety" | "account";
  action?: FAQAction;
}
