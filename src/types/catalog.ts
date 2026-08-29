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
  src: string;
  alt: string;
  angle?: string;
  sourceName?: string;
  sourceUrl?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
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

export interface SiteFAQ {
  id: string;
  question: string;
  answer: string;
  category: "ordering" | "devices" | "e-liquid" | "safety" | "account";
}
