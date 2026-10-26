import type { HeroType } from "@/data/home-hero";
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
    inStock: string;
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
    trackOrder: string;
    /** Member sign-in (queue Q4, owner 26/10) — the header person icon + drawer link to /account. */
    account: string;
    /** Owner 26/10: the word on the header pill while signed out ("เข้าสู่ระบบ"); signed in it reads `account`. */
    login: string;
    /** The signed-in pill on phones, where `account` does not fit beside the logo at 360 px. */
    accountShort: string;
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
    /** ageNotice while online ordering is OFF (owner 26/10: the cart-on notice says order on the site). */
    ageNoticeWhileOrderingOff: string;
    /** Round "site unreachable" (owner 11/10): the link to the DNS help page under the LINE/YouTube icons, every page. */
    siteUnreachable: string;
  };
  hero: {
    badgeSuffix: string;
    headingLine1: string;
    headingLine2: string;
    headingAccent: string;
    description: string;
    /** hero.description while online ordering is OFF (owner 26/10). */
    descriptionWhileOrderingOff: string;
    ctaPrimary: string;
    ctaSecondary: string;
    statProducts: string;
    statBrands: string;
    statFamilies: string;
    viewProduct: string;
  };
  /** Round "หน้าแรก hero" (owner 20/10, thai-copy option A): the new homepage hero (HeroShowcase).
   *  `kicker` is the small first line INSIDE the H1, so the words locked for the home H1 stay in it
   *  (THAI_STYLE §3 round 8 — "Pod System" + "บุหรี่ไฟฟ้า"). `lede2` never breaks inside itself (it is
   *  the lede's second line at 390). `types` is keyed by category slug (src/data/home-hero.ts). */
  heroShowcase: {
    kicker: string;
    headingLine1: string;
    headingAccent: string;
    lede1: string;
    lede2: string;
    ctaFinder: string;
    ctaAll: string;
    viewCategory: string;
    tabsLabel: string;
    /** the light switch in the hero (owner 20/10): the action each press does */
    fxOff: string;
    fxOn: string;
    types: Record<HeroType, { label: string; desc: string }>;
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
    /** Round 8 B1 (owner 2026-09-23): the text index of every product page, grouped by category,
     *  that closes the "no link from the home page" gap for 32 of 53 product pages. */
    indexTitle: string;
    indexDescription: string;
    indexViewAll: string;
    /** Round "หน้าแรก hero" (owner 20/10): the type sections' phone button — "{n}" = models in the type. */
    typeViewAll: string;
    /** …and the link inside each collapsible box of the full index, to that category's page. */
    indexOpenCategory: string;
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
    inStockOnly: string;
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
    /** Image-fix round 2026-09-28: the picture slot of a flavour / colour that has no photo of its own (NoOptionPhoto). */
    noPhotoFlavor: string;
    noPhotoColor: string;
    /** Cart mode only: the buy button while nothing is picked on a product that opens with no option pre-selected. */
    chooseFlavorFirst: string;
    chooseColorFirst: string;
    outOfStockChip: string;
    /** Phone option tiles (Q5, 24/10): the green pill, the sold-out pill, and "{in} of {n}" over the tiles. */
    optionIn: string;
    optionOut: string;
    optionStockCount: string;
    /** Past 12 options: open the photo strip into the full grid / close it again (owner 24/10). */
    optionShowAll: string;
    optionShowLess: string;
    /** Header line while nothing is picked yet. */
    optionPickPrompt: string;
    reviewVideoEyebrow: string;
    watchOnYoutube: string;
    /** Round "clip" (owner 2026-09-27): the line under a clip card whose Thai YouTube title is hidden on en/zh. The
     *  Thai page shows the clip's own title instead, so the th value is never on screen. */
    reviewVideoHiddenTitle: string;
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
    /** ProductMoreDetails (products with `storyDetails`) — section title, then the all-options grid heading ({count}). */
    moreDetailsTitle: string;
    moreDetailsAllFlavours: string;
    moreDetailsAllColours: string;
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
    /** Round 10B (owner ruling 2026-09-24, en/zh wording given by the owner): the one line an English or Chinese visitor
     *  sees on a Thai-only guide's URL (Guide.thaiOnly), above a link back to /guides. The Thai page never shows it. */
    thaiOnlyNotice: string;
    /** Round SEO ฉ batch 4 (designer option C, owner OK 12/10): byline under a guide's H1 (GuideByline) —
     *  "<bylineAuthor with {team} = the /about link> · <bylinePublished> <date> · <bylineUpdated> <date>" (zh has no "by"). */
    bylineAuthor: string;
    bylineTeam: string;
    bylinePublished: string;
    bylineUpdated: string;
    /** Closing line of a guide body (ArticleBody `sourceNote`): `{channels}` = the shop channels of the clips on that
     *  page joined by `channelJoiner`; `sourceNoteNoClip` when the page has no clip. */
    sourceNote: string;
    sourceNoteNoClip: string;
    channelJoiner: string;
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
    /** Round 8 B4 (owner 2026-09-23): the "salt nic กับ freebase" section on /e-liquid — five
     *  sentences, the "not sold on the storefront yet" line, and the LINE line. */
    nicTitle: string;
    nicP1: string;
    nicP2: string;
    nicP3: string;
    nicP4: string;
    nicP5: string;
    nicNotSold: string;
    nicCta: string;
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
    decreaseLabel: string;
    increaseLabel: string;
    quantityLabel: string;
    subtotalLabel: string;
    shippingLabel: string;
    freeShippingLabel: string;
    totalLabel: string;
    checkoutCta: string;
    fixIssuesNote: string;
    /** Q8 (26/10): the heading of the cart's suggestion row — claims nothing (owner 20/10: no "best seller" wording). */
    suggestionsTitle: string;
    /** Quick add on a suggestion card (owner 26/10). `{name}` = the product name. */
    suggestionAddLabel: string;
    /** Status line after a quick add — `{name}` = product (+ option). */
    suggestionAdded: string;
    /** Shown in the picker when the add was refused (the option sold out meanwhile). */
    suggestionAddFailed: string;
    suggestionViewProduct: string;
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
    errorTooManyTries: string;
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
    changeSavedAddressCta: string;
    shipToSavedTitle: string;
    addressErrorMissing: string;
    addressErrorPhone: string;
    addressErrorPostal: string;
    placeErrorBusy: string;
    placeErrorAddress: string;
    /** Cart UX batch C (owner 24/10): the optional, closed-by-default note to the shop on the review step. */
    noteToggle: string;
    notePlaceholder: string;
    noteHint: string;
  };
  /** `/orders/[orderNumber]` — order confirmation/status. */
  /** /orders "ติดตามคำสั่งซื้อ" (owner 24/10: find your orders by phone number only). */
  orderLookup: {
    eyebrow: string;
    title: string;
    description: string;
    phoneLabel: string;
    otherPhoneLabel: string;
    submitCta: string;
    /** "{phone}" = the masked number. */
    listTitle: string;
    emptyNote: string;
    errorInvalidPhone: string;
    errorNotFound: string;
    errorTooManyTries: string;
  };
  /** /account/login + /account (queue Q4, owner 26/10: LINE + Google, no member perks on the page, drafts v2). */
  account: {
    eyebrow: string;
    /** "\n" = where the heading breaks (th: the shop name on its own line). */
    loginTitle: string;
    loginLine1: string;
    loginLine2: string;
    continueLine: string;
    continueGoogle: string;
    loginError: string;
    loginUnavailable: string;
    /** What is kept, said before the visitor signs in (BSOT §11 / PDPA); followed by the privacy link. */
    privacyNote: string;
    privacyLink: string;
    guestOrdering: string;
    guestLookup: string;
    /** "{name}" = the LINE / Google display name. */
    greeting: string;
    greetingNoName: string;
    /** "{provider}" = LINE / Google. */
    signedInWith: string;
    latestOrder: string;
    /** "{count}" items · "{total}" baht. */
    orderMeta: string;
    stepPaid: string;
    stepConfirmed: string;
    stepShipped: string;
    stepReceived: string;
    viewOrder: string;
    noOrdersTitle: string;
    noOrdersBody: string;
    allOrdersTitle: string;
    linkOrders: string;
    linkOrdersSub: string;
    /** Orders placed before signing in (owner 26/10: old customers have only the phone) → the phone lookup on /orders. */
    linkPhoneOrders: string;
    linkPhoneOrdersSub: string;
    linkYoutube: string;
    linkYoutubeSub: string;
    linkGuides: string;
    linkGuidesSub: string;
    linkProducts: string;
    linkProductsSub: string;
    linkContact: string;
    signOut: string;
  };
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
    /** Instead of paymentQrNote when the QR carries the order total (owner 23/10, BSOT §9). */
    paymentQrAmountNote: string;
    paymentQrAlt: string;
    paymentAfterTransferNote: string;
    paymentNoRefundWarning: string;
    paymentCopyCta: string;
    paymentCopiedLabel: string;
    paymentSubmittedNote: string;
    /** The order page's thank-you heading from "payment submitted" onwards (owner 24/10, two fixed lines; the brand name
     *  "OKami24" is added after `thankYouTail` by the page in the display font). */
    thankYouLead: string;
    thankYouTail: string;
    slipUploadTitle: string;
    slipUploadPick: string;
    slipUploadChange: string;
    slipUploadHint: string;
    slipPreviewAlt: string;
    slipUploadCta: string;
    slipUploadPending: string;
    slipErrorUnreadable: string;
    slipErrorPending: string;
    slipErrorTooLarge: string;
    slipErrorUsed: string;
    slipErrorBusy: string;
    slipErrorGeneric: string;
    /** Shown once an order is shipped (cart round 22/10). */
    trackingLabel: string;
    /** The "track your parcel" box once shipped (owner 23/10): carrier name, copy, the carrier's own tracking page and
     *  3 steps. `{carrier}` in a step = the carrier's name. */
    trackTitle: string;
    carrierLabel: string;
    trackCopyCta: string;
    trackCta: string;
    trackStep1: string;
    trackStep2: string;
    trackStep3: string;
    /** Out of stock after payment (cart UX batch E, owner 24/10; BSOT §9 owner exception 22/10). {name} = the item that
     *  is out · {amount} = the refund in baht · {phone} = the PromptPay number, masked to its last 4 digits. */
    stockTitle: string;
    stockLead: string;
    stockSwapTitle: string;
    stockSwapPickLabel: string;
    stockSwapPlaceholder: string;
    stockSwapCta: string;
    stockSwapNone: string;
    stockRefundTitle: string;
    stockRefundAmount: string;
    stockRefundPartialNote: string;
    stockRefundOwnCta: string;
    stockRefundOtherLabel: string;
    stockRefundOtherCta: string;
    stockRefundBankLabel: string;
    stockRefundBankNumber: string;
    stockRefundBankName: string;
    stockRefundBankBranch: string;
    stockRefundBankCta: string;
    stockRefundBankBack: string;
    stockPending: string;
    stockChosenSwap: string;
    stockChosenRefund: string;
    stockChosenRefundBank: string;
    stockSwapped: string;
    stockRefunded: string;
    stockRefundedBank: string;
    stockRefundedPartial: string;
    stockErrorSwap: string;
    stockErrorPromptPay: string;
    stockErrorBank: string;
    stockBranchPart: string;
    stockErrorClosed: string;
    stockContactNote: string;
    /** The order's story (owner 24/10: "จัดส่งแล้วไปขั้นตอนไหน ยกเลิกเพราะอะไร และไปขั้นตอนไหนต่อ"): the 4 steps under the status, and
     *  one "next step" sentence per state. "@okm24" inside a sentence becomes the LINE link. */
    stepPay: string;
    stepCheck: string;
    stepPack: string;
    stepShip: string;
    nextLabel: string;
    nextPendingPayment: string;
    nextChecking: string;
    nextApproved: string;
    nextProcessing: string;
    nextShipped: string;
    nextShippedNoCarrier: string;
    nextCompleted: string;
    nextCancelled: string;
    nextCancelledPaid: string;
    nextCancelledUnpaid: string;
    paymentDeadlineNote: string;
    nextCancelledRefunded: string;
    nextStockWaiting: string;
    nextStockChosen: string;
    /** The status pill while an out-of-stock choice is open (instead of e.g. "อนุมัติแล้ว"). */
    statusStockWaiting: string;
    statusStockChosen: string;
    /** "ข้อความจากร้าน" — the admin's messages to the customer (owner 24/10). */
    messagesTitle: string;
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
