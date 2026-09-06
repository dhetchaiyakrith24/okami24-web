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
    cart: string;
    openMenu: string;
    closeMenu: string;
    /** Customer-service pages added 2026-09-06 (LAUNCH_AUDIT 3/4): /how-to-order, /shipping,
     *  /contact, /privacy — linked from the footer "help" column. */
    howToOrder: string;
    shipping: string;
    contact: string;
    privacy: string;
  };
  footer: {
    tagline: string;
    shop: string;
    learn: string;
    tools: string;
    /** Column title for the customer-service links (วิธีสั่งซื้อ / การจัดส่ง / ติดต่อเรา / ความเป็นส่วนตัว). */
    help: string;
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
    /** Match-reason bullets under each top-3 result (owner review, 2026-09-03 — found still
     *  hardcoded English in `scoreProduct` while every other Finder string was already localized,
     *  the same "translated the surrounding UI but missed a dynamically-generated content type"
     *  gap as Guides/Technology's listing cards). Keyed the same way FAQAction's CTA labels are,
     *  since `scoreProduct` (a plain function, not a component) cannot read the locale dict itself
     *  — it returns a `FinderReasonKey`, and only the rendering component resolves it to text. */
    reasons: {
      formatMatch: string;
      portabilityUltraCompact: string;
      portabilityCompact: string;
      screenNone: string;
      screenBasic: string;
      screenFull: string;
      battery: string;
      outputLow: string;
      outputHigh: string;
      outputFlexible: string;
      beginnerFriendly: string;
      advanced: string;
    };
  };
  /** Storefront quality-correction pass (2026-09-02) fix — these 4 pages previously hardcoded
   *  their PageHeader eyebrow/title/description as plain English strings directly in a Server
   *  Component, so they never localized regardless of the visitor's chosen locale, unlike every
   *  other page's chrome (Compare/Finder/Search already had this fixed via a dedicated
   *  `"use client"` header component — these 4 simply never got that same treatment). Guides'
   *  eyebrow reuses `footer.learn` directly (its real English text already IS "Learn"); FAQ,
   *  Technology, and E-Liquid each have their own distinct eyebrow word, so keep their own key.
   *  Per-guide/technology/flavor-family EDITORIAL CONTENT (titles, deks, bodies, summaries) stays
   *  untranslated deliberately, same rule as `product`'s own header comment — only the
   *  surrounding UI chrome is in scope. */
  faq: {
    eyebrow: string;
    pageTitle: string;
    pageDescriptionOne: string;
    pageDescriptionOther: string;
    categoryOrdering: string;
    categoryDevices: string;
    categoryELiquid: string;
    categorySafety: string;
    categoryAccount: string;
    /** Generic labels for the optional action link(s) a FAQ answer can carry (owner review,
     *  2026-09-03 — "FAQ must become actionable"). Destination-specific labels (Finder, Compare,
     *  Favorites, E-Liquid) reuse the existing `nav.*` strings instead of duplicating them here. */
    viewGuideCta: string;
    contactLineCta: string;
    browseProductsCta: string;
  };
  technology: {
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
  };
  guides: {
    pageTitle: string;
    pageDescription: string;
    categoryGettingStarted: string;
    categoryBuyingGuide: string;
    categoryHowItWorks: string;
    categoryMaintenance: string;
    readingTimeMinutes: string;
    /** Singular "Guide" eyebrow on a guide's own detail page (`/guides/[slug]`) — distinct from
     *  `pageTitle` ("Guides", plural, the listing page). */
    detailEyebrow: string;
  };
  eliquid: {
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
    disclaimer: string;
    /** Eyebrow on a single flavor-family detail page (`/e-liquid/[family]`) — the family's own
     *  name/description stay untranslated editorial content, same rule as `guides`. */
    familyEyebrow: string;
    characterNotesTitle: string;
    familyDisclaimer: string;
  };
  /** The main `/products` (all-products) page — category subpages already localized correctly
   *  via CategoryPageHeader/`catalog.eyebrow`; this page's own header simply never got the same
   *  `"use client"` treatment. Reuses `catalog.eyebrow`/`nav.allProducts` for eyebrow/title. */
  products: {
    pageDescriptionOne: string;
    pageDescriptionOther: string;
  };
  /** `/favorites` — title reuses `nav.favorites`. */
  favorites: {
    eyebrow: string;
    pageDescription: string;
  };
  /** Commerce foundation (2026-09-02) — `/cart`. Product names/variant labels themselves stay
   *  untranslated catalog content, same rule as everywhere else in this dictionary. */
  cart: {
    eyebrow: string;
    pageTitle: string;
    emptyMessage: string;
    continueShoppingCta: string;
    unavailableMessage: string;
    removeCta: string;
    quantityLabel: string;
    updateCta: string;
    subtotalLabel: string;
    shippingLabel: string;
    freeShippingLabel: string;
    totalLabel: string;
    checkoutCta: string;
    fixIssuesNote: string;
  };
  /** Product Detail add-to-cart control — only rendered for a genuinely published, priced
   *  product; see PilotProductDetail.tsx. */
  productActions: {
    addToCartCta: string;
    outOfStockLabel: string;
    outOfStockCta: string;
  };
  /** `/checkout`, `/checkout/address`, `/checkout/review`. */
  checkout: {
    phoneEyebrow: string;
    phoneTitle: string;
    phoneLabel: string;
    phonePlaceholder: string;
    sendCodeCta: string;
    codeLabel: string;
    codePlaceholder: string;
    verifyCta: string;
    resendCta: string;
    errorInvalidPhone: string;
    errorRateLimited: string;
    errorNoPendingCode: string;
    errorExpired: string;
    errorTooManyAttempts: string;
    errorIncorrectCode: string;
    addressEyebrow: string;
    addressTitle: string;
    savedAddressesTitle: string;
    useThisAddressCta: string;
    addNewAddressTitle: string;
    recipientNameLabel: string;
    phoneFieldLabel: string;
    line1Label: string;
    subdistrictLabel: string;
    districtLabel: string;
    provinceLabel: string;
    postalCodeLabel: string;
    saveAddressCta: string;
    reviewEyebrow: string;
    reviewTitle: string;
    itemsTitle: string;
    shipToTitle: string;
    paymentTitle: string;
    paymentPendingNote: string;
    contactLineCta: string;
    placeOrderCta: string;
    changeAddressCta: string;
  };
  /** `/orders/[orderNumber]` — order confirmation/status. */
  orderStatus: {
    eyebrow: string;
    pageTitle: string;
    orderNumberLabel: string;
    statusLabel: string;
    itemsTitle: string;
    shipToTitle: string;
    totalsTitle: string;
    paymentInstructionsTitle: string;
    bankDetailsTbdNote: string;
    referenceNoteLabel: string;
    submitPaymentCta: string;
    paymentSubmittedNote: string;
    notFoundMessage: string;
  };
  languageSwitcher: {
    label: string;
  };
}
