/**
 * Phase 3.2 first i18n slice — deliberately NOT the whole site. Covers: header/nav, footer nav,
 * the homepage hero, the search page + tool, and CatalogBrowser's generic controls. Brand names,
 * model names, category/brand taxonomy labels, and per-product editorial copy are NOT part of
 * this dictionary — they stay in their existing English source data untouched (see the Phase 3.2
 * report §TRANSLATED SURFACES for why: translating taxonomy/product content without an
 * owner-verified glossary risks inventing terminology, which this project's culture already
 * treats as a hard line — see docs/BUSINESS_SOURCE_OF_TRUTH.md).
 */
export interface Dictionary {
  nav: {
    products: string;
    allProducts: string;
    eliquid: string;
    compare: string;
    finder: string;
    guides: string;
    technology: string;
    faq: string;
    about: string;
    search: string;
    favorites: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    tagline: string;
    shop: string;
    learn: string;
    tools: string;
    ageNotice: string;
  };
  hero: {
    badgeSuffix: string;
    headingLine1: string;
    headingLine2: string;
    headingAccent: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    statProducts: string;
    statBrands: string;
    statFamilies: string;
    viewProduct: string;
  };
  search: {
    eyebrow: string;
    title: string;
    placeholder: string;
    prompt: string;
    noResultsTitle: string;
    noResultsHint: string;
    resultCountOne: string;
    resultCountOther: string;
  };
  catalog: {
    eyebrow: string;
    emptyStateNote: string;
    searchLabel: string;
    searchPlaceholder: string;
    sortLabel: string;
    sortFeatured: string;
    sortAlphabetical: string;
    sortFamily: string;
    clearFilters: string;
    noMatchTitle: string;
    noMatchHint: string;
    productCountOne: string;
    productCountOther: string;
    filterBrand: string;
    filterCategory: string;
    filterScreen: string;
    filterPortability: string;
    filterExperienceLevel: string;
    filterBeginnerOnly: string;
    screenNone: string;
    screenLed: string;
    screenColor: string;
    screenTouch: string;
    portabilityUltraCompact: string;
    portabilityCompact: string;
    portabilityStandard: string;
  };
  /** Product detail page section chrome — eyebrows/titles/stat labels/buttons. Per-product
   *  feature/spec/FAQ/compatibility VALUES stay untranslated (see the module doc comment). */
  product: {
    colorLabel: string;
    flavorLabel: string;
    allVariantsLabel: string;
    outOfStockChip: string;
    reviewVideoEyebrow: string;
    watchOnYoutube: string;
    statBattery: string;
    statOutput: string;
    statRatedPuffs: string;
    statCapacity: string;
    addToComparison: string;
    viewSpecifications: string;
    galleryEyebrow: string;
    galleryTitle: string;
    anatomyEyebrow: string;
    anatomyTitle: string;
    featuresEyebrow: string;
    featuresTitle: string;
    specsEyebrow: string;
    specsTitle: string;
    compatibilityTitle: string;
    worksWithTitle: string;
    fitsDevicesTitle: string;
    verifiedCompatibilityNote: string;
    whoIsThisForTitle: string;
    faqEyebrow: string;
    faqTitle: string;
    relatedEyebrow: string;
    relatedTitle: string;
    sourceNoteLabel: string;
    officialSite: string;
    gallerySourceLinkLabel: string;
  };
  /** ProductMaster pilot bridge (Phase 3.0/3.1) chrome — was hardcoded Thai regardless of locale
   *  before this fix; see the report for why that was a real bug, not a design choice. */
  pilot: {
    unpublishedBadge: string;
    priceReferenceLabel: string;
    priceUnavailable: string;
    priceSourcePrefix: string;
    priceDisclaimer: string;
    variantFallback: string;
    sectionEyebrow: string;
    sectionTitle: string;
    /** Translates `optionAxisCode` ("color"/"flavor"/"resistance"/"size"/"strength") from the
     *  ProductMaster projection — see storefront-preview-read-model.ts. */
    axisColor: string;
    axisFlavor: string;
    axisResistance: string;
    axisSize: string;
    axisStrength: string;
    /** Heading for the manufacturer-facts block on a pilot product's detail page — see
     *  VERIFIED_SPECIFICATIONS in the projection adapter. Only rendered when a product actually
     *  has specifications. */
    specificationsTitle: string;
    /** Real price label for a genuinely PUBLISHED product (sellingPrice !== null) — replaces
     *  priceReferenceLabel/priceDisclaimer, which only apply to the DEV-preview/unapproved
     *  reference-price state. See publication-approvals.ts. */
    priceLabel: string;
  };
  /** Product Detail add-to-cart control — only rendered for a genuinely published, priced
   *  product; see PilotProductDetail.tsx. */
  productActions: {
    addToCartCta: string;
    outOfStockLabel: string;
    outOfStockCta: string;
  };
  compare: {
    metaTitle: string;
    metaDescription: string;
    pageTitle: string;
    pageDescription: string;
    rowBrand: string;
    rowFamily: string;
    rowCategory: string;
    rowPrice: string;
    rowOptions: string;
    rowBattery: string;
    rowOutput: string;
    rowRatedPuffs: string;
    rowCapacity: string;
    rowScreen: string;
    rowDrawStyle: string;
    rowPortability: string;
    rowBeginnerFriendly: string;
    rowCharging: string;
    rowDimensions: string;
    rowWeight: string;
    yes: string;
    no: string;
    addAtLeastTwoTitle: string;
    addAtLeastTwoHint: string;
    classificationTitle: string;
    verifiedSpecsTitle: string;
    verifiedSpecsEmptyNote: string;
    bestFitFor: string;
    disclaimer: string;
    removeAriaPrefix: string;
    addPlaceholder: string;
    mixedCoverageNote: string;
    uncertainSpecsNote: string;
  };
  finder: {
    metaTitle: string;
    metaDescription: string;
    pageTitle: string;
    pageDescription: string;
    questionProgressPrefix: string;
    questionProgressMiddle: string;
    back: string;
    topMatches: string;
    startOver: string;
    bestMatch: string;
    alternatives: string;
    alternativesHint: string;
    scopeNote: string;
    alsoInCatalogTitle: string;
  };
  languageSwitcher: {
    label: string;
  };
}
