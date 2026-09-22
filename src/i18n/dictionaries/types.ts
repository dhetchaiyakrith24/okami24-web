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
    /** /warranty — published 2026-09-06 once the owner approved the claim conditions (BSOT §12). */
    warranty: string;
    /** Round "leftovers" (2026-09-22): the two site-wide contact affordances used to carry their
     *  Thai straight in the JSX — the floating LINE button's label and aria-label
     *  (LineContact.tsx) and the footer's two social icons (Footer.tsx) — so an English or Chinese
     *  visitor read Thai on every page. Both strings are ones the site already shows elsewhere
     *  (`faq.contactLineCta` / `checkout.contactLineCta`, and `product.watchOnYoutube`), repeated
     *  here rather than reached across sections; no new wording was invented. */
    contactLine: string;
    youtubeChannel: string;
  };
  /** Round 30.4ข batch 5 (owner, 2026-09-17): the four-claim strip above the footer (TrustBar.tsx).
   *  Exactly four items, in the owner's order — genuine · straight prices · real admin · specs
   *  checked against the official site. Nothing here may promise shipping, warranty or payment. */
  trust: {
    ariaLabel: string;
    items: Array<{ title: string; body: string }>;
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
  /** Round 30.3ข (owner, 2026-09-11): the homepage sections below the hero — every H2, the lede
   *  under it, the two editorial paragraphs, and the section CTAs/labels — used to be English
   *  props hardcoded in src/app/page.tsx and the home/* components, so the Thai homepage read
   *  Thai only down to the hero. The brand/model names inside stay English (THAI_STYLE layer 1);
   *  the uppercase eyebrows are NOT here — they stay English by owner ruling (THAI_STYLE §5 ก). */
  home: {
    flagshipTitle: string;
    flagshipDescription: string;
    controlTitle: string;
    controlP1: string;
    controlP2: string;
    controlCta: string;
    caliburnTitle: string;
    caliburnDescription: string;
    mBarTitle: string;
    mBarP1: string;
    mBarP2: string;
    mBarCta: string;
    voopooTitle: string;
    voopooDescription: string;
    flavorTitle: string;
    flavorDescription: string;
    compareTitle: string;
    compareDescription: string;
    compareCta: string;
    guidesTitle: string;
    guidesAll: string;
    /** "{n} min read" on the three guide teaser cards — `{n}` is replaced with the minutes. */
    guideReadingTime: string;
    /** The "View all →" link beside every product rail heading. */
    viewAll: string;
  };
  search: {
    /** No `eyebrow` here since round 30.4ข batch 4 (owner, 2026-09-17): the /search header reuses
     *  `footer.tools` like /compare and /finder — the old "ค้นหา" eyebrow repeated the H1 "ค้นหาสินค้า". */
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
    /** Shown on /products only after /cart or /checkout redirected there while online ordering is
     *  off (OKAMI24_ORDERING, owner 2026-09-07). Tone: "LINE is the faster way right now", never
     *  "closed". See LineOrderingNotice.tsx. */
    lineOrderingNotice: string;
    lineOrderingCta: string;
    /** The word after a puff count — "10,000 พัฟ" / "10,000 puffs" / "10,000 口". Lives in the
     *  dictionary since round 30.2 (docs/THAI_STYLE.md §3: Thai copy says พัฟ, never "puffs"),
     *  and formatPuffs() takes it as an argument so the Thai word can never leak into the
     *  English or Chinese page. */
    puffUnit: string;
    /** Round 30.4ข batch 2 — the card's headline spec line (CardHeadlineSpec.tsx). Templates with
     *  one placeholder each: {mah} = "1600mAh" · {w} = "35" · {ohm} = "0.7" · {ml} = "3mL". The
     *  puff form reuses puffUnit through formatPuffs(). */
    cardBattery: string;
    cardMaxWatt: string;
    cardResistance: string;
    cardCapacity: string;
    emptyStateTitle: string;
    emptyStateNote: string;
    emptyStateAlternatives: string;
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
    /** Card badge telling a shopper a product comes in many options before they open it.
     *  `{n}` is replaced with the count. Owner decision 2026-09-06: the shop needed a way to say
     *  "many flavours" on the catalogue card, because the all-flavours lineup shrinks to ~17px per
     *  flavour at card size and cannot say it. */
    optionCountFlavors: string;
    optionCountColors: string;
    /** Mobile round B (owner 2026-09-08, MOBILE_SPEC M4): on phones the whole filter panel folds
     *  into one button that opens a bottom sheet. `filtersButton` is that button's word and the
     *  sheet's title — the button (not the title) also shows " (n)" while n filters are on;
     *  `filtersApply` is the sheet's confirm button, `{count}` = "<n> <productCountOne/Other>".
     *  The Thai words are the owner's own from the brief; en/zh are pending the owner's review. */
    filtersButton: string;
    filtersApply: string;
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
    /** ProductAnatomy.tsx — labels/details were hardcoded English until round 30.4ค batch 6. Display
     *  templates take `{size}` (the data's screenSize with its inch mark; Thai strips it and says นิ้ว). */
    anatomy: {
      mouthpiece: string;
      mouthpiecePodDetail: string;
      mouthpieceDisposableDetail: string;
      pod: string;
      podDetail: string;
      display: string;
      displayColour: string;
      displayTouch: string;
      airflow: string;
      airflowDetail: string;
      chargingPort: string;
      labelBand: string;
      labelBandDetail: string;
      statusLed: string;
      statusLedDetail: string;
    };
    featuresEyebrow: string;
    featuresTitle: string;
    specsEyebrow: string;
    specsTitle: string;
    /** SpecSheet lede when `{n}` of `{m}` specification rows are unverified (round 30.4 — was
     *  hardcoded English in SpecSheet.tsx and showed on every Thai product page). */
    specsUnverifiedNote: string;
    /** SpecSheet lede when every row is verified. */
    specsAllVerifiedNote: string;
    /** The small badge on a spec chip whose value could not be confirmed (SpecChip.tsx). */
    unverifiedBadge: string;
    /** Hover text of that badge. */
    unverifiedTooltip: string;
    /** The hero/card badge for `editorialTag === "Flagship"` (round 30.4 ก8, EditorialTagBadge.tsx).
     *  The other editorialTag values are internal curation notes and are not shown. */
    flagshipBadge: string;
    compatibilityTitle: string;
    worksWithTitle: string;
    fitsDevicesTitle: string;
    verifiedCompatibilityNote: string;
    whoIsThisForTitle: string;
    faqEyebrow: string;
    faqTitle: string;
    /** Round "backlink" (owner 2026-09-22): the one line above the article links on a product
     *  page — the same words the article bodies use for an onward link. */
    readMoreEyebrow: string;
    relatedEyebrow: string;
    relatedTitle: string;
    sourceNoteLabel: string;
    officialSite: string;
    gallerySourceLinkLabel: string;
    /** Lede under the gallery heading (ProductGallery.tsx) — `{brand}` is the photos' sourceName. Round 30.4ค batch 5: was hardcoded English. */
    galleryNote: string;
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
  /** `/favorites` — title reuses `nav.favorites`. The empty-state strings were hardcoded English
   *  in FavoritesList.tsx until round 30.4 (wiring ข3). */
  favorites: {
    eyebrow: string;
    pageDescription: string;
    emptyTitle: string;
    emptyBody: string;
    emptyCta: string;
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
    /** Small line under the cart button — LINE is the backup order channel (owner 2026-09-06, BSOT §8). */
    orderOnLineNote: string;
    outOfStockLabel: string;
    outOfStockCta: string;
    /** While online ordering is OFF (OKAMI24_ORDERING, owner 2026-09-07) these four replace the
     *  cart button: the button label (shows the LINE ID on purpose — if the link fails the
     *  customer can still type it), the line under it before a tap, the line after the tap has
     *  copied the product details, and the word that starts the copied text
     *  ("สนใจ <product> <option> — @okm24"). See OrderViaLineButton.tsx. */
    orderOnLineCta: string;
    orderOnLineHint: string;
    orderOnLineCopied: string;
    orderOnLineClipboardPrefix: string;
  };
  /** `/checkout`, `/checkout/address`, `/checkout/review`. */
  checkout: {
    phoneEyebrow: string;
    phoneTitle: string;
    phoneLabel: string;
    phonePlaceholder: string;
    sendCodeCta: string;
    /** Shown instead of the code step while OTP verification is switched off (owner 2026-09-06,
     *  see src/lib/commerce/otp-mode.ts). */
    continueCta: string;
    phoneTitleNoOtp: string;
    noOtpNote: string;
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
    /** Bank-details block (owner 2026-09-06). The account values themselves are NOT in the
     *  dictionary — they come from the server-only src/data/payment.ts via page props. */
    paymentTransferTitle: string;
    paymentBankLabel: string;
    paymentAccountNameLabel: string;
    paymentAccountNumberLabel: string;
    paymentQrNote: string;
    paymentQrAlt: string;
    paymentVerifyNameWarning: string;
    paymentAfterTransferNote: string;
    paymentNoRefundWarning: string;
    paymentCopyCta: string;
    paymentCopiedLabel: string;
    referenceNoteLabel: string;
    submitPaymentCta: string;
    paymentSubmittedNote: string;
    notFoundMessage: string;
  };
  languageSwitcher: {
    label: string;
  };
  /** Round 30.3ข: the 404 page (src/app/not-found.tsx) used to be English-only. Three ways out,
   *  none of them the cart (ordering is on LINE — LAUNCH_AUDIT item 43). */
  notFound: {
    title: string;
    body: string;
    ctaProducts: string;
    ctaLine: string;
    ctaHome: string;
  };
}
