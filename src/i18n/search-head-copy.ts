/**
 * Search-facing head copy the owner approved on 2026-09-21 (SEO round ก, batch 2 table:
 * `_incoming/seo-a/table-final-for-owner.md`, "เคาะ" in chat). Everything here is HEAD-ONLY —
 * `<title>` / meta description / og:description — and is read by `generateMetadata` and the root
 * layout, never rendered on the page. The visible copy (taglines, deks, H1s) is untouched.
 *
 * Rules the strings follow (docs/THAI_STYLE.md §2–§4 + the owner's rulings in that table):
 * - Brand/model names in English exactly as the catalog spells them (layer 1).
 * - NO price is ever typed here. Every "฿…" is filled at build time from the catalog through
 *   `priceOf(slug)` so a re-priced product (20 of the 45 legacy prices are owner estimates that the
 *   stock API will overwrite) can never leave a stale number in a <title>. A product with no
 *   approved price simply loses that fragment (owner 2026-09-21: drop the price, never guess).
 * - Titles that end in "OKami24 (OKM)" are used as `title.absolute` so the root layout's
 *   "%s — OKami24" template does not append the shop name twice.
 * - `{N}` in the /products copy is the shown-product count, passed in by the page at build.
 * - Lengths were counted at approval: title ≤ 60, description 120–160 (a few pod-with-no-spec rows
 *   are shorter by the owner's explicit ruling — "ปล่อยสั้นไว้ ห้ามเติมน้ำ").
 */

export const OKM_TITLE_SUFFIX = " — OKami24 (OKM)";

/** "฿1,190" — the same thousands comma THAI_STYLE §4 asks for in prose. */
export function formatPriceTh(price: number): string {
  return `฿${price.toLocaleString("en-US")}`;
}

/** Row A1 / A2 — the homepage (root layout default title + description + og:description).
 *  Round 7 "SEO ค" B2 (owner ruling 2026-09-23): both "พอตไฟฟ้า" and "บุหรี่ไฟฟ้า" are allowed in
 *  head copy — before this round "บุหรี่ไฟฟ้า" appeared in no head on the site (0/99) while
 *  Search Console showed "okami บุหรี่ไฟฟ้า" at 0/5. Wording = thai-copy's row A (title keeps the
 *  BSOT §1 slogan whole; "พอตไฟฟ้า" stays in the visible H1, which is untouched — owner set, B5). */
export const HOME_HEAD_TH = {
  title: "OKami24 (OKM) ร้านพอต บุหรี่ไฟฟ้า ของแท้ ราคาตรง บริการจริง",
  description:
    "OKami24 (OKM) ร้านพอตไฟฟ้าและบุหรี่ไฟฟ้า ของแท้ ราคาตรง มีพอตซิสเต็ม พอตใช้แล้วทิ้ง หัวพอต และคอยล์ บอกราคาทุกตัว สั่งทาง LINE @okm24 แอดมินตอบเอง ไม่ใช่บอท",
} as const;

/** Rows A3 / A4. */
export const ABOUT_HEAD_TH = {
  title: `OKami24 (OKM) คือใคร — ร้านพอตของแท้ ราคาตรง บริการจริง`,
  description:
    "OKami24 (OKM) คือใคร — ร้านพอตของแท้ ราคาตรง บริการจริง ราคาที่เห็นคือราคาที่ขายจริง ทักไลน์มา แอดมินตอบเอง ไม่ใช่บอท นโยบายเคลมและช่องทางติดต่ออยู่ในหน้านี้",
} as const;

/** Rows A5 / A6. */
export const CONTACT_HEAD_TH = {
  title: "ติดต่อ OKami24 (OKM) — LINE @okm24 แอดมินตอบเองทุกวัน",
  description:
    "ติดต่อ OKami24 (OKM) — LINE @okm24 ทักได้ทุกวัน 24 ชั่วโมง แอดมินตอบเอง ไม่ใช่บอท · อีเมล okamisalt@gmail.com สำหรับเรื่องเอกสารและข้อมูลส่วนบุคคล",
} as const;

/** Rows A7 (option ก) / A8 — `count` = products shown on /products, counted by the page. */
export function productsHeadTh(count: number) {
  // Round 9 B4 (thai-copy row 3, seo-auditor #1 "land now"): the all-products page leads with the
  // collective owner key "อุปกรณ์บุหรี่ไฟฟ้า" (0 titles before). Owner's answer 2026-09-23: "พอต" and
  // "คอยล์" go back in — seo-auditor #2 option A (59 characters at 53 products, 60 at 100+): keeps the
  // live title's "พอต"/"คอยล์" and "(OKM)", leaves "หัวพอต" to Pods & Cartridges; the price promise stays in
  // the description. Past the ceiling the pre-round-9 title returns.
  const title = `อุปกรณ์บุหรี่ไฟฟ้า พอต คอยล์ ของแท้ ${count} รุ่น${OKM_TITLE_SUFFIX}`;
  return {
    title: [...title].length <= TITLE_MAX ? title : `พอต หัวพอต คอยล์ ของแท้ ${count} รุ่น ราคาทุกตัว${OKM_TITLE_SUFFIX}`,
    // Round 7 "SEO ค" B2: "อุปกรณ์บุหรี่ไฟฟ้า" (owner key, 0/99 heads before) opens the line; "อุปกรณ์" =
    // the device, THAI_STYLE §3 word 11. thai-copy dropped the owner's "อุปกรณ์ pod" (keyword laid on
    // top, not a seller's phrase) — "พอต" already covers it.
    description: `อุปกรณ์บุหรี่ไฟฟ้าและพอตของแท้ ${count} รุ่นในหน้าเดียว พอตซิสเต็ม พอตใช้แล้วทิ้ง หัวพอต คอยล์ และ IQOS บอกราคาทุกตัว ค้นด้วยชื่อรุ่นได้ สั่งทาง LINE @okm24`,
  };
}

/** A formatted price for a catalog slug, or null when the product has no approved price. */
export type PriceOf = (slug: string) => string | null;

/** Rows A9–A16 — the four brand pages whose title/description name real models and prices.
 *  Every other brand keeps `brandTitleTh()` + its `descriptionTh`. Prices come through `priceOf`
 *  (see the header comment); a null price drops just that " ฿…" fragment. */
export const BRAND_HEAD_TH: Record<string, (priceOf: PriceOf) => { title: string; description: string }> = {
  // Round SEO D batch 4 (07/10, keyword map SEO_LANDSCAPE §0): every brand title is brand-level — the model terms
  // ("15k", "joiway f4", "caliburn g5", "drag 6") belong to the product pages; GSC 21/09–05/10 showed brand pages
  // taking them. Wording = thai-copy 07/10, read by seo-auditor 07/10.
  // Round SEO ฉ batch 3 (12/10): relx / iqos / wotofo metas step back to brand level like joiway/infy in #354 — the model
  // names and prices belong to the product pages (SEO_LANDSCAPE §0.6). Wording = thai-copy 12/10, read by seo-auditor 12/10.
  relx: () => ({
    title: `RELX ของแท้ พอตใช้แล้วทิ้งและพอตเปลี่ยนหัว${OKM_TITLE_SUFFIX}`,
    description: "RELX ของแท้ที่ OKami24 (OKM) มีให้เลือกทั้งพอตใช้แล้วทิ้งที่แกะกล่องใช้ได้เลย และพอตเปลี่ยนหัวที่ใช้ตัวเครื่องเดิม บอกราคาทุกรุ่น สั่งทาง LINE @okm24",
  }),
  // "15k" belongs to /products/m-switch-kit (the shop's "M Bar 15K"; the m-bar-15k page redirects there since 08/10) —
  // no 15K, no price in this head.
  salthub: () => ({
    title: `SALTHUB M Bar (Marbo) ของแท้ บอกราคาทุกรุ่น${OKM_TITLE_SUFFIX}`,
    description: "SALTHUB เจ้าของ M Bar ที่หลายร้านเรียกว่า Marbo มีทั้งพอตใช้แล้วทิ้ง M Bar 9K และ 10K กับเครื่องระบบสวิตช์ M Switch และ Zero สั่งทาง LINE @okm24",
  }),
  voopoo: () => ({
    title: `VOOPOO ของแท้ พอตซิสเต็ม หัวพอต และคอยล์${OKM_TITLE_SUFFIX}`,
    description: "VOOPOO ของแท้ที่ OKami24 (OKM) มีพอตซิสเต็มตระกูล ARGUS DRAG VINCI และ VMATE พร้อมหัวพอตและคอยล์แท้สำหรับเปลี่ยน บอกราคาทุกรุ่น สั่งทาง LINE @okm24",
  }),
  uwell: () => ({
    title: `UWELL Caliburn พอตซิสเต็ม ของแท้ ราคาทุกรุ่น${OKM_TITLE_SUFFIX}`,
    description: "UWELL ผู้ผลิตพอตซิสเต็มตระกูล Caliburn ที่ร้านมีทั้งตัวเครื่องหลายรุ่น พร้อมหัวพอตและคอยล์แท้สำหรับเปลี่ยน บอกราคาทุกรุ่น สั่งทาง LINE @okm24",
  }),
  // Round 7 "SEO ค" B2 — the seven brands that still read "X ของแท้ทุกรุ่นที่ร้านมี". Pattern agreed
  // with seo-auditor #1 and thai-copy: the brand page's title = brand word + category word (the
  // brand term), the product page's title = model + price (the model term) — a single-product
  // brand must not carry the same title as its product, or Google keeps one of the two. Every
  // non-price sentence below is the brand's own `descriptionTh` already on the page; prices
  // come through `priceOf` like the four entries above. relx/salthub stay as approved in SEO ก
  // (their Search Console lines are being measured until 2026-10-05).
  // "ไอคอส" = the Thai name with typing evidence (owner 07/10, sheet 35), same as "อินฟี่" in the infy meta below.
  iqos: () => ({
    title: `IQOS ของแท้ เครื่องอุ่นยาสูบ ILUMA${OKM_TITLE_SUFFIX}`,
    description: "IQOS หรือที่คนไทยเรียกกันว่าไอคอส เป็นเครื่องอุ่นยาสูบที่ใช้ได้กับก้าน TEREA เท่านั้น ที่ร้านมีเครื่องตระกูล ILUMA ของแท้ให้เลือก สั่งทาง LINE @okm24",
  }),
  // SEO all keys 20/10: "esko bar" sat at position 3.6 with 0 clicks (GSC 18/10) under a title that spoke only to the switch
  // device — the brand now has the ESKO BAR 20000 disposable, the Switch 20K device and its pods, so the head names both
  // formats, no model and no price (the product pages own "esko bar switch 20k" / "esko bar 20k"). Wording = thai-copy 20/10.
  "esko-bar": () => ({
    title: `ESKO BAR พอตใช้แล้วทิ้ง พอตเปลี่ยนหัว ของแท้${OKM_TITLE_SUFFIX}`,
    description: "ESKO BAR หรือที่หลายคนเรียกว่าเอสโคบาร์ มีทั้งพอตใช้แล้วทิ้ง และพอตเปลี่ยนหัวที่ใช้ตัวเครื่องเดิม เปลี่ยนแค่หัวพอต บอกราคาทุกรุ่น สั่งทาง LINE @okm24",
  }),
  // Image-fix round 2026-09-30: Pod-180 is nexBar CLEAR 18K (no brand); the WOTOFO page lists WOTOFO nexBAR 18K, sold
  // out — so no price and no stock claim here (owner "ตามแนะนำ").
  // SEO ฉ batch 3: the 18K spec line is the product page's (wotofo-nexbar-18k); the first clause is the brand lede in
  // brands.ts. "สอบถาม", not "สั่ง": the model is sold out.
  wotofo: () => ({
    // SEO brand push heads (30/10, thai-copy + seo-auditor 30/10): brand level, both lines (nexBAR disposables + the nexPOD
    // switch-style kit); no model number (the product pages own them). nexBAR 18K is sold out and nexPOD 15K has no price → "สอบถาม".
    title: `WOTOFO ของแท้ พอตใช้แล้วทิ้งและพอตเปลี่ยนหัว${OKM_TITLE_SUFFIX}`,
    description: "WOTOFO มีทั้งพอตใช้แล้วทิ้ง nexBAR และพอตเปลี่ยนหัว nexPOD ที่ตัวเครื่องรู้เองว่าใส่หัวพอตแบบไหน แล้วตั้งวัตต์เริ่มต้นให้ ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24",
  }),
  nevoks: (priceOf) => {
    const p = priceOf("coil-54");
    return {
      title: `NEVOKS หัวพอตเปล่า ของแท้${p ? ` ${p}` : ""}${OKM_TITLE_SUFFIX}`,
      description: `NEVOKS ผู้ผลิตพอตซิสเต็มตระกูล FEELIN ที่ร้านมีหัวพอตเปล่าสำหรับ Feelin Mini ของแท้${p ? ` ราคา ${p}` : ""} สั่งทาง LINE @okm24`,
    };
  },
  rincoe: (priceOf) => {
    const p = priceOf("coil-89");
    return {
      title: `RINCOE หัวพอต ของแท้${p ? ` ${p}` : ""}${OKM_TITLE_SUFFIX}`,
      description: `RINCOE ผู้ผลิตพอตตระกูล Jellybox ที่ร้านมีหัวพอตแท้สำหรับ Jellybox V คอยล์ในตัว${p ? ` ราคา ${p}` : ""} สั่งทาง LINE @okm24`,
    };
  },
  dotmod: (priceOf) => {
    const p = priceOf("coil-70");
    return {
      title: `DOTMOD คอยล์ ของแท้${p ? ` ${p}` : ""}${OKM_TITLE_SUFFIX}`,
      description: `DOTMOD ผู้ผลิต dotAIO และคอยล์ dotCoils ที่ร้านมีคอยล์แท้สำหรับ dotAIO V2${p ? ` ราคา ${p}` : ""} สั่งทาง LINE @okm24`,
    };
  },
  // Round SEO D: "joiway f4" queries landed on this page (GSC 0/10) — the model names and prices left the title (batch 4)
  // and the description (close, seo-auditor 08/10): /products/joiway-f4 owns "joiway f4". Wording = thai-copy 08/10.
  // SEO all keys 20/10: "joiway" pos 6.2, 3 clicks / 179 impressions — title + meta carry the Thai name people type (จอยเวย์,
  // SEO_LANDSCAPE row 75); "คู่กลิ่น" stays out of the title — it is F4's selling point and the brand page already takes
  // "joiway f4" queries (row 76, seo-auditor 20/10). thai-copy 20/10.
  joiway: () => ({
    title: `JOIWAY จอยเวย์ พอตใช้แล้วทิ้ง ของแท้${OKM_TITLE_SUFFIX}`,
    description: "JOIWAY หรือที่หลายคนเรียกว่าจอยเวย์ มีพอตใช้แล้วทิ้งทั้งรุ่นกลิ่นเดียว และรุ่นคู่กลิ่นในเครื่องเดียว พร้อมคลิปรีวิวใช้จริงบน YouTube สั่งทาง LINE @okm24",
  }),
  // Round SEO D close (seo-auditor 08/10): with no override this page's description was its lede, which names "INFY 20K"
  // — /products/infy-20k owns "infy 20k". (Superseded 30/10: title + meta below = SEO brand push heads.) The old
  // description reuses the lede's first half (the one Thai-name sentence, owner 07/10) without the model. thai-copy 08/10.
  infy: () => ({
    // SEO brand push heads (30/10, thai-copy): the page also sells the INFY POD device and INFY PLUS pods — the head names the
    // three kinds, still no "20K" (row 8 of SEO_BASELINE, owned by /products/infy-20k). Title in the RELX pattern.
    title: `INFY ของแท้ พอตใช้แล้วทิ้งและพอตเปลี่ยนหัว${OKM_TITLE_SUFFIX}`,
    description: "INFY หรือที่หลายคนเรียกว่าอินฟี่ มีทั้งพอตใช้แล้วทิ้ง ตัวเครื่องแบบเปลี่ยนหัว และหัวพอตคอยล์ในตัว น้ำยาหมดก็เปลี่ยนแค่หัวพอต บอกราคาทุกรุ่น",
  }),
};

/**
 * Round SEO ฉ batch 3 (12/10): brand pages whose H1 should carry the name people search, not only `brand.name`
 * (menus, breadcrumbs and JSON-LD keep `brand.name`). "Marbo" (Trends ~ the biggest product-name key) was missing from
 * the salthub H1; the words are the start of its approved title. Latin only → the same in every locale.
 */
export const BRAND_H1: Record<string, string> = {
  salthub: "SALTHUB M Bar (Marbo)",
};

/** Row B2 — appended to every product description; the price is the catalog's, never typed. */
/** `genuine: false` = a page that makes no genuine claim (src/lib/genuine-claim.ts) — the suffix drops "ของแท้". */
export function productPriceSuffixTh(price: number, genuine = true): string {
  return `${genuine ? "ของแท้ " : ""}ราคา ${formatPriceTh(price)} สั่งทาง LINE @okm24`;
}

/**
 * Round "backlink" batch 2 (owner, 2026-09-22): the share card of a product page carries the
 * price, because the product link is what an admin sends a customer on LINE. The price already
 * sat at the END of the 160-character description, where a preview cuts it off; here it joins
 * the title line, exactly the way the owner-approved brand titles carry theirs
 * (`BRAND_HEAD_TH` above: "… ของแท้ ฿349"). Same catalog number, no new words.
 *
 * Round 7 "SEO ค" B2 (owner: "title ทำได้เลย", 2026-09-23): the `<title>` now carries the same
 * price line on 46 of the 53 product pages — see `productTitleWithPriceTh` below for the seven
 * pages held back until the 2026-10-05 re-measure and for the length guard.
 */
export function shareTitleWithPriceTh(title: string, price: number | null): string {
  return price === null ? title : `${title} ${formatPriceTh(price)}`;
}

/** The root layout appends this to every title that does not end in "(OKM)". */
const ROOT_TITLE_SUFFIX = " — OKami24";
/** The owner's title ceiling (this file's header), measured including the root suffix. */
const TITLE_MAX = 60;

/**
 * `<title>` of a product page = the approved base title, plus the catalog price where one exists —
 * unless the price would push the title past the ceiling (a
 * four-digit price can arrive from the stock API any day; the guard drops the fragment instead of
 * letting a title silently grow past 60 — thai-copy's note 8). og:title keeps using
 * `shareTitleWithPriceTh` unchanged, so the share-card gate's "title + price" rule still holds.
 */
export function productTitleWithPriceTh(slug: string, baseTitle: string, price: number | null): string {
  if (price === null) return baseTitle;
  const withPrice = shareTitleWithPriceTh(baseTitle, price);
  return [...withPrice].length + ROOT_TITLE_SUFFIX.length <= TITLE_MAX ? withPrice : baseTitle;
}

/**
 * Round 7 "SEO ค" B2 — category `<title>`: the locked ชั้น-2 label stays first and whole (it is also
 * the H1 and the menu word), then " ของแท้ บอกราคาทุกรุ่น" where the whole title fits the ceiling,
 * else the short " ของแท้" (the two long labels, Coils & Accessories / Heated Tobacco Devices).
 * Descriptions are the visible category ledes and are not touched here.
 * Round 9 B4 (owner's key list 2026-09-23 "เอาหมด ทำหมดทุกคีย์"): a category whose owner key is missing
 * from its label gets a head-only title in CATEGORY_TITLE_HEAD_TH — the label itself (H1, menu, `labelTh`)
 * is unchanged. "disposable pod" was on 0 of 99 pages; thai-copy row 1, seo-auditor #1 "land now".
 */
const CATEGORY_TITLE_HEAD_TH: Record<string, string> = {
  disposables: "Disposable Pod / พอตใช้แล้วทิ้ง ของแท้ ราคาทุกรุ่น",
  // Round SEO ฉ batch 3 (12/10): "คอยล์พอต" was in no head on the site; the page lists coils only. 49 chars — at 50+
  // categoryTitleTh() silently falls back to the label title, so keep it ≤ 49 (seo-auditor 12/10).
  "coils-accessories": "Coils & Accessories / คอยล์พอต ของแท้ ราคาทุกรุ่น",
};

export function categoryTitleTh(labelTh: string, categoryId?: string): string {
  const head = categoryId ? CATEGORY_TITLE_HEAD_TH[categoryId] : undefined;
  if (head && [...head].length + ROOT_TITLE_SUFFIX.length <= TITLE_MAX) return head;
  const full = `${labelTh} ของแท้ บอกราคาทุกรุ่น`;
  return [...full].length + ROOT_TITLE_SUFFIX.length <= TITLE_MAX ? full : `${labelTh} ของแท้`;
}

/**
 * Round 7 "SEO ค" B2 — product `<title>` overrides (before the price fragment), keyed by slug.
 * Wording = thai-copy's rows (2026-09-23). Coils and pods put the locked Thai type word first
 * (คอยล์ / หัวพอต / หัวพอตเปล่า — THAI_STYLE "กติกาเรียกหัวพอต"); every "สำหรับ …" names one device
 * already listed in that product's approved meta description. "(Marbo)" = the name the SALTHUB
 * line is marketed under. Model names keep the catalog's spelling; the
 * iqosheet / pod-159 pages keep their generated titles so `<title>`, Product.name and H1 agree.
 */
export const PRODUCT_TITLE_HEAD_TH: Record<string, string> = {
  "m-bar-9k": "SALTHUB M BAR 9K (Marbo / มาโบ 9K) ของแท้",
  "m-bar-10k": "SALTHUB M BAR 10K (Marbo) ของแท้",
  // List-new (27/10, HANDOFF §18): the lookalike — its title must not carry the default " ของแท้" (search-titles.ts).
  "marbo-10k-clone": "Marbo 10K (เทียบแท้) พอตใช้แล้วทิ้ง",
  // Owner 08/10: the M Bar 15K page folded into the Kit — the Kit's title carries the shop's name for it (thai-copy 08/10);
  // the Pod opens with the locked type word, like the coil/pod rows below.
  "m-switch-kit": "SALTHUB M SWITCH KIT (M BAR 15K) ของแท้",
  "m-switch-pod": "หัวพอต M SWITCH POD (M BAR 15K) ของแท้",
  "coil-1": "คอยล์ VOOPOO Vinci สำหรับ VINCI Pod ของแท้",
  "coil-38": "คอยล์ VOOPOO TPP สำหรับ DRAG 3 ของแท้",
  "coil-53": "คอยล์ UWELL Caliburn G2 ของแท้",
  "coil-92": "คอยล์ VOOPOO PnP X ของแท้",
  "coil-54": "หัวพอตเปล่า NEVOKS Feelin Mini ของแท้",
  "coil-55": "หัวพอตเปล่า UWELL Caliburn G2 ของแท้",
  "coil-56": "หัวพอตเปล่า VOOPOO PnP-X ของแท้",
  "coil-68": "หัวพอตเปล่า VOOPOO ITO-X ของแท้",
  "coil-70": "คอยล์ DOTMOD dotAIO V2 ของแท้",
  "coil-72": "หัวพอต VOOPOO Vmate Infinity Edition ของแท้",
  "coil-74": "หัวพอตเปล่า UWELL Caliburn X ของแท้",
  "coil-83": "หัวพอตเปล่า VOOPOO Argus P1 ของแท้",
  "coil-87": "หัวพอตเปล่า VOOPOO TPP Pod ของแท้",
  "coil-89": "หัวพอต RINCOE Jellybox V ของแท้",
  "coil-94": "หัวพอต UWELL Caliburn G4 · G3 Series ของแท้",
};

const META_DESCRIPTION_MAX = 160;

/** Words a trimmed description must not end on — a connective, a bare number, or a phrase opener
 *  left hanging when the words after it were cut ("…มี 10", "…ส่วน", "…ของ VOOPOO" is fine, "…ของ"
 *  is not). Thai prose marks phrase boundaries with spaces only, so this is the second half of
 *  the boundary test: cut at a space, then back off past any dangling opener. */
const DANGLING_TAIL = new Set(["มี", "และ", "ของ", "ที่", "กับ", "พร้อม", "ส่วน", "ตอนนี้", "ให้", "ใช้", "จาก", "ต่อ", "หรือ", "แต่", "เป็น", "ใน", "โดย", "ระหว่างรุ่น", "ระหว่าง", "ตั้งแต่", "ไปจนถึง", "แบบ", "รุ่น", "สาย", "ซีรีส์", "สูงสุด", "รองรับสูงสุด", "ประมาณ", "กว่า", "—", ":", "OKami24"]);
const NUMERIC_TAIL = /^[\d,.]+$/u;

/**
 * `base` + the B2 price line, kept within 160 characters. When the two do not fit, the ORIGINAL
 * description is shortened at its last phrase boundary before the limit — a space, then backing
 * off past any dangling connective / bare number / unclosed bracket — never inside a word, and
 * never the price line. A product without a price keeps its description exactly as it was.
 */
export function withPriceSuffixTh(base: string, price: number | null, genuine = true): string {
  if (price === null) return base;
  const suffix = productPriceSuffixTh(price, genuine);
  const room = META_DESCRIPTION_MAX - suffix.length - 1;
  let head = base.trim();
  if (head.length > room) {
    // A strong boundary (dash clause, colon, middle dot) in the last 40% of the room beats a plain
    // space: "…และใช้ปุ่มยิง — จุดกึ่งกลางระหว่างรุ่น Mini ที่…" cuts before the dash, not inside
    // the clause after it.
    const strong = Math.max(...STRONG_BOUNDARIES.map((b) => head.lastIndexOf(b, room)));
    const cut = strong >= room * 0.6 ? strong : head.lastIndexOf(" ", room);
    const words = (cut > 0 ? head.slice(0, cut) : head.slice(0, room)).split(" ");
    while (words.length > 1) {
      const last = words[words.length - 1].replace(/[\s·]+$/u, "");
      const opensBracket = (words.join(" ").split("(").length - 1) > (words.join(" ").split(")").length - 1);
      if (last === "" || DANGLING_TAIL.has(last) || NUMERIC_TAIL.test(last) || opensBracket) { words.pop(); continue; }
      // A clause opener within the last three tokens ("ส่วนเว็บทางการของ Joiway") means the tail
      // is the head of a clause whose rest was cut — drop from the opener onward.
      const tail = words.slice(-3);
      const opener = tail.findIndex((w) => CONNECTIVE_PREFIX.test(w));
      const keep = words.length - tail.length + opener;
      if (opener >= 0 && keep >= 1) { words.length = keep; continue; }
      break;
    }
    head = words.join(" ").replace(/[\s·:—]+$/u, "");
  }
  return `${head} ${suffix}`;
}

const STRONG_BOUNDARIES = [" — ", ": ", " · "];
/** A tail token that OPENS a connected clause ("และในกล่องมีหัวพอตให้", "ส่วนเว็บทางการของ") is
 *  incomplete once the words after it are gone — back off past it too. */
const CONNECTIVE_PREFIX = /^(และ|แล้ว|ส่วน|กับ|ซึ่ง|โดย|เพื่อ)/u;

/** Rows A17 + C1–C16 — product meta descriptions that replace the tagline / shortDescription in
 *  <head> only. Keyed by product slug. Rows C3–C6 are deliberately short (no spec to draw on). */
export const PRODUCT_DESCRIPTION_HEAD_TH: Record<string, string> = {
  // Owner 08/10: the M Bar 15K page folded into the Kit — the searched names first, then what the set is (thai-copy 08/10;
  // 15,000 = the Kit's verified puffs-per-pod row).
  "m-switch-kit": "M Bar 15K (Marbo 15K) ที่ร้านขาย คือ M Switch Kit ตัวเครื่องใช้ซ้ำได้ คู่กับหัวพอตสีดำบรรจุสำเร็จ หัวละสูงสุด 15,000 พัฟ",
  // Round SEO D (07/10) — head-only lines that open with the model name (the page's own shortDescription stays as
  // it is). Every number is a verified spec row of that product (thai-copy + seo-auditor 07/10).
  "m-bar-10k": "M Bar 10K (Marbo 10K) จาก SALTHUB พอตใช้แล้วทิ้งชาร์จซ้ำได้ รองรับสูงสุด 10,000 พัฟ ใช้คอยล์ cotton mesh มี 3 โหมดวัตต์",
  "caliburn-g5": "UWELL Caliburn G5 พอตซิสเต็มที่มีจอสี 0.85 นิ้ว แตะสามครั้งเพื่อสลับโหมดวัตต์ แบต 1600mAh ปรับได้ 5–35 วัตต์",
  // Round p63 (16/10): searched as "relx infinity" — RELX's store sells only the Infinity 2 Plus now.
  "relx-infinity-2-plus": "RELX Infinity รุ่นปัจจุบันคือ Infinity 2 Plus เครื่องระบบสวิตช์ที่มี 3 โหมด 6.5–10 วัตต์ แบต 440mAh และใช้ได้กับหัวพอต RELX Pod · Pod Pro · Pod Pro 2",
  // Round p63 (16/10): the plain G3 page — searchers of "caliburn g3" land on the G3 Pro today (SEO_LANDSCAPE §9.5).
  "caliburn-g3": "Caliburn G3 รุ่นมาตรฐาน ไม่ใช่ G3 Pro เป็นพอตซิสเต็มจาก UWELL แบต 900mAh ปรับได้สูงสุด 25 วัตต์ มีจอ OLED บอกวัตต์และจำนวนพัฟ หน้านี้รวมทุกสีที่ UWELL ผลิต",
  // Round p63 (18/10): numbers = verified spec rows of nexpod-15k (wotofo.com).
  "nexpod-15k": "WOTOFO nexPOD 15K Pro Kit เครื่องระบบสวิตช์ แบต 1200mAh ใช้หัวพอตบรรจุสำเร็จ 18mL คอยล์ 0.8 โอห์ม หัวละ 15,000 พัฟ ตัวเครื่องรู้เองว่าใส่หัวพอตแบบไหน มี 6 สี",
  // Round p63 (16/10): the DRAG X (2020) — searched as "voopoo drag x" (SEO_LANDSCAPE §9.5).
  "drag-x": "VOOPOO DRAG X (ไม่ใช่ DRAG X3) เป็นพอตคิทที่ใช้ถ่าน 18650 ก้อนเดียว ปรับได้ 5–80 วัตต์ ใช้คอยล์ PnP ได้ และมีหัวพอต 4.5mL ยึดด้วยแม่เหล็ก",
  "caliburn-g3-pro": "Caliburn G3 Pro มีจอเต็มหน้าเครื่องบอกวัตต์และจำนวนพัฟ แบต 1000mAh ปรับลมได้ละเอียด ให้หัวพอต 0.4 กับ 0.9 โอห์มมาในกล่อง",
  "caliburn-g3-pro-koko": "Caliburn G3 Pro KOKO ทรงกล่อง จอสี 1.8 นิ้วที่เปลี่ยนธีมหน้าจอได้ แบต 1250mAh และใช้หัวพอต G3 ได้ทุกหัว",
  "caliburn-g4-classic": "Caliburn G4 Classic แบต 1400mAh ใช้สีไฟบอกแบตที่เหลือแทนจอ สูบได้เลยโดยไม่ต้องกดปุ่ม และปรับช่องลมได้ละเอียดแบบไม่มีขั้น",
  "argus-g4": "VOOPOO ARGUS G4 แบต 1650mAh ปรับได้ 5–35 วัตต์ จอ HD 0.85 นิ้วบอกแบต วัตต์และโอห์ม ปุ่มเลื่อนปรับลมตั้งแต่ MTL ถึง RDL",
  "argus-g4-mini": "VOOPOO ARGUS G4 mini ตัวเครื่องเล็กลงแต่แบต 1650mAh เท่ารุ่นใหญ่ ปรับได้ 5–30 วัตต์ ไม่มีจอ และสูบได้เลยโดยไม่ต้องกดปุ่ม",
  "tfit-m-power-20k": "TFIT M Power 20K พอตใช้แล้วทิ้ง รองรับสูงสุด 20,000 พัฟ ใช้คอยล์ mesh สองตัว แบต 600mAh ชาร์จผ่าน USB-C ปรับช่องลมได้",
  "joiway-f4": "JOIWAY F4 พอตใช้แล้วทิ้งแบบ Double Flavor คู่กลิ่นในเครื่องเดียว หมุนปากดูดเพื่อสลับ รองรับสูงสุด 20,000 พัฟ มีจอ LED",
  "coil-1": "คอยล์ VOOPOO Vinci มี 0.15 · 0.6 · 1.2 โอห์ม ทั้งแบบ MTL และ DTL ใช้ได้กับ VINCI Pod · VINCI X Pod · DRAG Baby Trio",
  "coil-38": "คอยล์ VOOPOO TPP มี TPP-DM2 0.2 โอห์ม 40–60 วัตต์ · TPP-DM4 0.3 โอห์ม 32–40 วัตต์ ใช้ได้กับ TPP Pod · DRAG 3 · DRAG X Plus",
  "coil-54": "หัวพอตเปล่า Feelin Mini จากแบรนด์ NEVOKS สำหรับเครื่อง Feelin Mini ไม่มีคอยล์มาในกล่อง ต้องซื้อคอยล์แยก",
  "coil-55": "หัวพอตเปล่า Caliburn G2 จากแบรนด์ UWELL สำหรับเครื่อง Caliburn G2 ไม่มีคอยล์มาในกล่อง ต้องซื้อคอยล์แยก",
  "coil-56": "หัวพอตเปล่า PnP-X จากแบรนด์ VOOPOO ความจุ 5mL สี Silver ไม่มีคอยล์มาในกล่อง ต้องซื้อคอยล์แยก",
  "coil-68": "หัวพอตเปล่า ITO-X จากแบรนด์ VOOPOO สี Black ไม่มีคอยล์มาในกล่อง ต้องซื้อคอยล์แยก",
  "coil-70": "คอยล์ Dotmod Aio V2 0.7 โอห์ม 14–20 วัตต์ 5 หัวต่อกล่อง ใช้ได้กับ dotAIO V2 · V2 Lite · dotStick Revo · dotPod Max",
  "coil-72": "หัวพอต Vmate Infinity Edition จากแบรนด์ VOOPOO คอยล์ในตัว มี 0.7 และ 1.2 โอห์ม ส่วนแบบเติมด้านบนมี 0.4 และ 0.7 โอห์ม",
  "coil-74": "หัวพอตเปล่า Caliburn X จากแบรนด์ UWELL ความจุ 3mL เติมน้ำยาได้ เปลี่ยนคอยล์แยกได้ ไม่มีคอยล์มาในกล่อง",
  "coil-83": "หัวพอตเปล่า VOOPOO Argus P1 ความจุ 2mL มี 2 หัวต่อกล่อง ต้องซื้อคอยล์ ITO แยก ใช้ได้กับ Argus Pod · P1 · Z · G · A",
  "coil-87": "หัวพอตเปล่า VOOPOO TPP Pod ความจุ 5.5mL ใช้กับคอยล์ TPP ใช้ได้กับ DRAG 3 Kit และ DRAG X Plus Kit",
  "coil-89": "หัวพอต RINCOE Jellybox V คอยล์ในตัว มี 0.8 และ 1.0 โอห์ม ความจุ 3mL เติมด้านข้าง ใช้ได้กับ Jellybox V1 · V2 · V3",
  "coil-94": "หัวพอต Caliburn G4&G3 Series จากแบรนด์ UWELL คอยล์ mesh ในตัว มี 0.4 · 0.6 · 0.9 · 1.2 โอห์ม",
  // Round list19 (17/10): every number = a verified spec row of iqosheet-14 (LAMBDA's own page).
  "iqosheet-14": "LAMBDA i8 เครื่องอุ่นยาสูบระบบเหนี่ยวนำ แบต 3200mAh ใช้ได้ 35–40 ก้านต่อการชาร์จ ปรับอุณหภูมิ 200–300°C ดูได้ทั้ง 6 สีที่ LAMBDA ทำออกมา",
  "iqosheet-16": "เครื่องอุ่นยาสูบ IQOS ILUMA i PRIME ชาร์จผ่าน USB-C เต็มแล้วใช้ได้สูงสุด 20 ก้าน ใช้กับก้าน TEREA เท่านั้น",
  // Round list19 (17/10): every number = a verified spec row of iqosheet-17.
  "iqosheet-17": "IQOS ILUMA i ONE เครื่องอุ่นยาสูบตัวเดียวจบ ชาร์จเต็มใช้ได้ 20 ก้านติดกัน มี Autostart และ FlexPuff ใช้กับก้าน TEREA เท่านั้น ดูได้ทั้ง 6 สีที่ IQOS ทำออกมา",
  "iqosheet-18": "IQOS ILUMA i เครื่องอุ่นยาสูบ ใช้ได้กับก้าน TEREA เท่านั้น ดูได้ทั้ง 7 สีที่ IQOS ทำออกมา",
  // Round list19 (18/10): every number = a verified spec row of pod-150 (kardinal.com).
  "eliquid-1": "Marbo Saltnic น้ำยา salt nic ขวด 30ml มีให้เลือก 10 กลิ่น",
  "eliquid-109": "Marbo Freebase น้ำยา freebase ขวดยาว มีให้เลือก 4 กลิ่น",
  "eliquid-64": "Double Mint Salt Nic น้ำยา salt nic มีให้เลือก 6 กลิ่น",
  "eliquid-72": "Pepo Salt Nic น้ำยา salt nic มีให้เลือก 5 กลิ่น",
  "eliquid-73": "Dundu Salt Nic น้ำยา salt nic กลิ่นองุ่น",
  "pod-149": "SKE Crystal B20000 พอตใช้แล้วทิ้ง ชื่อรุ่นระบุ 20,000 พัฟ มีให้เลือก 8 กลิ่น",
  "pod-169": "INFY PLUS หัวพอตความจุ 2.5mL คอยล์ในตัว ใช้หมดแล้วเปลี่ยนหัวใหม่ มีให้เลือก 28 กลิ่น",
  "pod-154": "Pop Up 10K หัวพอต หัวละสูงสุด 10,000 พัฟ ใช้กับฐานแบตเตอรี่ของ Pop Up มีให้เลือก 18 กลิ่น",
  "pod-142": "Reswa Sportcan 12K พอตใช้แล้วทิ้งทรงกระป๋อง ชื่อรุ่นระบุ 12,000 พัฟ มีให้เลือก 5 กลิ่น",
  "nexswitch-16k-kit": "Nexswitch 16K ชุดเครื่องพร้อมหัวพอต 1 หัว หัวละสูงสุด 16,000 พัฟ มีให้เลือก 10 กลิ่น",
  "nexswitch-16k-pod": "Nexswitch 16K หัวพอต หัวละสูงสุด 16,000 พัฟ ใช้กับตัวเครื่อง Nexswitch มีให้เลือก 10 กลิ่น",
  "relx-lumi-18k": "RELX LUMI 18K พอตใช้แล้วทิ้ง ชื่อรุ่นระบุ 18,000 พัฟ มีให้เลือก 16 กลิ่น",
  // Round p63 (19/10): numbers = the maker's spec block (eskobarvape.com/product/eskobar).
  "vmate-pro-2": "VOOPOO Vmate Pro 2 ตัวเครื่อง มีให้เลือก 4 สี",
  "punta-ice": "น้ำยา Punta Ice มีให้เลือก 7 กลิ่น",
  "next-pro-2-beyond": "Next Pro 2 Beyond ตัวเครื่องพอต มีให้เลือก 6 สี",
  "muro-salt-nic": "Muro Salt Nic น้ำยา salt nic มีให้เลือก 6 กลิ่น",
  "muro-freebase": "Muro Freebase น้ำยา freebase มีให้เลือก 6 กลิ่น",
  "vazer-one-pod": "หัวพอต Vazer One มีให้เลือก 21 กลิ่น",
  "foli-bar-15k": "Foli Cool Bar 15K พอตใช้แล้วทิ้ง 15,000 พัฟ มีให้เลือก 12 กลิ่น",
  "super-cool-saltnic": "น้ำยา Super Cool นิโคตินแบบ salt nic มีให้เลือก 10 กลิ่น",
  "infy-pod": "INFY POD ตัวเครื่อง แบตเตอรี่ 400mAh ชาร์จผ่าน USB-C มีให้เลือก 19 สี",
  "relx-essential-2": "RELX Essential 2 ตัวเครื่อง มีให้เลือก 5 สี",
  // SEO brand push 30/10: searchers type "relx pod pro 2" (the name printed on the pack); the fit is RELX's own sentence on the Infinity 2 Plus page.
  // 118 characters: + the price line it stays under the 160 ceiling (#1053's 126-character line lost "42 กลิ่น" to the trim).
  "relx-infinity-pro-2-pod": "หัวพอต RELX Infinity Pro 2 แพ็กพิมพ์ชื่อ RELX Pod Pro 2 ใส่กับ Infinity 2 Plus ได้ตามที่ RELX ระบุ มีให้เลือก 42 กลิ่น",
  "coil-21": "หัวพอต VOOPOO Argus Pod มีให้เลือก 4 แบบ",
  "mq-bar-22k": "MQ Bar 22K พอตใช้แล้วทิ้ง ชื่อรุ่นระบุ 22K มีให้เลือก 11 กลิ่น",
  // List-new (27/10, HANDOFF §18): thai-copy 27/10 — no "ของแท้"; says it is not SALTHUB.
  "marbo-10k-clone": "Marbo 10K เทียบแท้ พอตใช้แล้วทิ้ง ไม่ใช่สินค้าของ SALTHUB มีให้เลือก 12 กลิ่น",
  "sup-zero-22k": "SUP ZERO 22K พอตใช้แล้วทิ้ง ชื่อรุ่นระบุ 22,000 พัฟ มีให้เลือก 15 กลิ่น",
  "graple-freebase": "Graple น้ำยา freebase กลิ่นองุ่น",
  "esko-bar-switch-pod": "ESKO BAR SWITCH 20K หัวพอต หัวละสูงสุด 20,000 พัฟ ความจุ 18mL ใช้กับเครื่อง ESKO BAR SWITCH มีให้เลือก 20 กลิ่น",
  "esko-bar-20k": "ESKO BAR 20000 พอตใช้แล้วทิ้ง สูงสุด 20,000 พัฟ แบต 600mAh ชาร์จได้ น้ำยา 18ml คอยล์ mesh คู่ 1.0Ω มีให้เลือก 22 กลิ่น",
  "ks-quikpro-kit": "KS Quikpro 15K ชุดเครื่องพร้อมหัวพอต 1 หัว แบต 600mAh ชาร์จ USB-C ราว 30 นาที หัวละสูงสุด 15,000 พัฟ ตัวเครื่องมี 4 สี",
  "pod-150": "KS Quikpro 15K หัวพอตน้ำยา 15ml หัวละสูงสุด 15,000 พัฟ ใช้จนหมดแล้วเปลี่ยนหัวใหม่ ดูได้ทุกกลิ่นที่ KS ทำออกมา",
  "pod-180": "พอตใช้แล้วทิ้ง nexBar CLEAR 18K ตัวใส สูงสุด 18,000 พัฟ น้ำยา 18mL แบต 650mAh ชาร์จผ่าน USB-C มี 2 โหมด Normal กับ Turbo",
};

/** Rows C17 / C18 — keyed by guide id. Round SEO ข (owner เคาะ 2026-09-21): five more head-only
 *  descriptions for the guides grown that round; the dek each page shows is unchanged. No price
 *  ever appears in this map (round-ก rule). */
export const GUIDE_DESCRIPTION_HEAD_TH: Record<string, string> = {
  // Round 7 "SEO ค" B2: "pod system คือ" (@60) and "ยี่ห้อไหนดี" (@57) joined the line — thai-copy row D ก;
  // "ตัวไหนดี" already leads the title/H1. The definition paraphrases the pod-systems category lede
  // without the word "น้ำยา" (HANDOFF §16 4b keeps it out of head copy until the category has stock).
  // Round SEO E "pod" (09/10, seo-auditor): "pod system คือ" now belongs to what-is-a-pod-system — this row stops opening on
  // the definition and leads with "ยี่ห้อไหนดี" instead.
  "choosing-your-first-pod-system":
    // Round SEO ฉ batch 6a (12/10): the beginner angle of the reworked article (puffs · nicotine strength · flavour · cost over time).
    "Pod System ยี่ห้อไหนดีสำหรับมือใหม่ เริ่มจากเลือกแบบก่อน แล้วดูจำนวนพัฟ ความเข้มข้นนิโคติน กลิ่น และความคุ้มในระยะยาว พร้อมตัวอย่างจริง Caliburn G5 · M Bar 9K",
  // Round SEO E "pod": the dek says "น้ำยา", which stays out of head copy (HANDOFF §17 "Head copy") — head-only row, dek unchanged.
  "what-is-a-pod-system":
    "Pod System คืออะไร ในเครื่องมีอะไรบ้าง ทำงานยังไง ค่าโอห์มของหัวพอตบอกอะไร และหัวพอตควรเปลี่ยนเมื่อไหร่",
  "open-system-vs-disposable":
    "เทียบพอตใช้แล้วทิ้งกับพอตซิสเต็ม ต่างกันตรงไหน ต้องดูแลแค่ไหน พร้อมตัวอย่างจริง M Bar 10K · M Switch Kit · Caliburn G5 Lite และวิธีเช็คของแท้จากกล่อง",
  "reading-a-spec-sheet":
    "อ่านสเปกพอตทีละบรรทัดจากตัวอย่างจริง ARGUS G4 แบต mAh ช่วงวัตต์ ช่วงโอห์ม แปลว่าอะไร ป้ายยังไม่ยืนยันคืออะไร และทำไมช่วงโอห์มกว้างไม่ได้แปลว่ามีหัวพอตขาย",
  // Round SEO ฉ batch 5 topic 5 (12/10): the article now answers "หัวพอตใช้ได้กี่วัน" (the shop's 1–3 weeks, said as the
  // shop's experience); GPP stays in this line though it left the H1.
  "coil-and-pod-maintenance":
    "หัวพอตใช้ได้กี่วัน ร้านเราใช้หัวละราว 1–3 สัปดาห์ ขึ้นกับวิธีสูบและการดูแล รวมสัญญาณว่าถึงเวลาเปลี่ยน วิธีใช้ให้นานขึ้น และหัวพอต GPP ใช้กับ Caliburn รุ่นไหน",
  // Round SEO ฉ batch 6b (12/10): the reworked Thai article leads with "ตั้งกี่วัตต์ดี", the coil's ohm and the maker's range (seo-auditor: same start as the title); the per-pod
  // ranges of the G3 Pro replace the old "two pods in the box" angle.
  "choosing-wattage-and-airflow":
    "ตั้งกี่วัตต์ดี เริ่มจากโอห์มของคอยล์และช่วงวัตต์ที่ผู้ผลิตแนะนำ ไล่จากค่าต่ำขึ้นไป ปรับช่องลมแล้วรสเปลี่ยนยังไง พร้อมตัวอย่าง Caliburn G3 Pro",
  "understanding-mtl-vs-dtl":
    "MTL กับ DTL ต่างกันยังไง MTL ดูดเข้าปากก่อนแล้วค่อยลงปอด ช่องลมแคบ โอห์มสูง วัตต์ต่ำ ส่วน DTL ดูดลงปอดตรง ๆ ช่องลมโล่ง โอห์มต่ำ วัตต์สูง และ RDL อยู่ตรงกลาง",
  // Round SEO ฉ batch 6b topic 8 (12/10): the new Thai-only article — its dek says "น้ำยา", which stays out of head copy.
  "salt-nic-vs-freebase":
    "salt nic กับ freebase ต่างกันยังไง แบบไหนเข้ากับพอตตัวเล็ก แบบไหนเข้ากับเครื่องวัตต์สูง และตัวเลข 3% กับ 5% บอกอะไร",
  // Clip job 20/10: the new PG/VG guide — its dek says "น้ำยา", which stays out of head copy (thai-copy 19/10).
  "pg-vg-in-e-liquid":
    "PG กับ VG คือส่วนผสมหลักสองตัวที่อยู่ข้างขวด บทความนี้อธิบายว่าต่างกันยังไงตอนสูบ ตัวเลข 50/50 หรือ 70/30 อ่านยังไง และเลือกสัดส่วนแบบไหนให้เข้ากับคอยล์",
  // Round SEO ฉ batch 6c topic 10 (13/10): the searcher's question first, then the three rules people look for.
  "taking-a-pod-on-a-plane":
    "พอตขึ้นเครื่องบินได้ไหม ตามกติกาการบิน พอตต้องอยู่ในกระเป๋าถือ โหลดใต้เครื่องไม่ได้ และสูบหรือชาร์จบนเครื่องไม่ได้ พร้อมวิธีพกพาวเวอร์แบงก์และถ่านสำรอง",
  // Round "site unreachable" (owner 12/10, sheet 47.2): the short dek (card + page) has no search words, so the head gets
  // the terms people type — every method named with its official value (docs/cloud-results/dns-guide-sources.md).
  "cant-open-the-website":
    "เข้าเว็บไม่ได้ ลองเปลี่ยน DNS บนมือถือ Android ตั้ง DNS ส่วนตัวเป็น dns.google · iPhone ใส่ 8.8.8.8 ใน Wi-Fi หรือใช้แอป 1.1.1.1 ของ Cloudflare มีวิธีบนคอมด้วย",
  // Round SEO ฉ batch 5 topic 4 (12/10): thai-copy's line for the reworked Thai article (searches: ชาร์จพอตกี่นาที ·
  // ข้ามคืน · Fast Charge · ชาร์จไม่เข้า).
  "battery-care-and-charging":
    "ชาร์จพอตกี่นาทีถึงเต็ม ชาร์จข้ามคืนได้ไหม ใช้หัวชาร์จเร็ว Fast Charge ได้หรือเปล่า และชาร์จไม่เข้าต้องเช็คอะไร รวมวิธีชาร์จและดูแลแบตที่ร้านใช้เอง",
  // Round SEO ฉ batch 5 (12/10): thai-copy's drafted metas, with "น้ำยา" taken out (HANDOFF §18 "Head copy") — the dek on
  // the page keeps it. Owner words: "พอตไหม้" · "หัวพอตรั่ว" / "พอตรั่ว" (the shop's clip titles use both).
  "fixing-a-burnt-pod":
    "พอตไหม้เกิดจากอะไร ดูยังไง แก้ยังไง รวมอาการ สาเหตุที่ร้านเจอบ่อย และนิสัยเล็ก ๆ ที่ช่วยให้คอยล์ไม่ไหม้ไว ใช้ได้ทั้งพอตซิสเต็มและพอตใช้แล้วทิ้ง",
  "fixing-a-leaking-pod":
    "หัวพอตรั่วหรือพอตรั่ว เกิดจากอะไร แก้ยังไง ร้านรวมสาเหตุที่เจอบ่อย สิ่งที่ควรทำทันทีเมื่อเจอรอยรั่ว และวิธีเติม วิธีเก็บเครื่อง ที่ช่วยไม่ให้รั่วซ้ำ",
  // Round SEO ฉ batch 6a topic 6 (12/10): the reworked dek says "น้ำยา" → head-only line without it (HANDOFF §18 "Head copy").
  "how-long-a-disposable-lasts":
    "พอตใช้แล้วทิ้งใช้ได้กี่วัน ไม่มีตัวเลขตายตัว ร้านรวมวิธีอ่านตัวเลขพัฟบนกล่อง พัฟเยอะใช้ได้นานกว่าจริงไหม ทำไมช่วงท้ายกลิ่นจางลง และวิธีใช้ให้ได้นานขึ้น",
  // Round SEO ฉ batch 5 topic 3 (12/10): the Thai-only guide had no head line (the dek was used).
  "fixing-no-draw-and-blinking-light":
    "พอตดูดไม่ขึ้น ไฟกะพริบ แก้ยังไง ไล่เช็คทีละข้อ ตั้งแต่พลาสติกที่ก้นพอต แบต ขั้วสัมผัส จนถึงความหมายของไฟและข้อความบนจอ Caliburn G4 Mini · G4 · G5 และ M Switch",
  // Round "SEO all keys" batch 2 (16/10): thai-copy's head lines for the two new Thai-only guides — the deks say "น้ำยา",
  // which stays out of head copy (HANDOFF §18 "Head copy").
  "refilling-a-pod":
    "วิธีเติมพอตทีละขั้น หัวพอตแบบไหนเติมเองได้ แบบไหนเป็นหัวพอตบรรจุสำเร็จ เติมแค่ไหนถึงพอดี และหัวพอตใหม่ควรพักกี่นาทีก่อนสูบ ตามคำแนะนำของผู้ผลิต",
  "how-long-a-pod-device-lasts":
    "พอต 1 ตัวใช้ได้นานแค่ไหน ตัวเครื่อง หัวพอต และคอยล์ เสื่อมไม่พร้อมกัน ดูสัญญาณว่าส่วนไหนถึงเวลาเปลี่ยน และนิสัยที่ช่วยให้ตัวเครื่องอยู่กับเราได้นานขึ้น",
  // Round "SEO all keys" batch 4 (16/10): thai-copy's head line for the Drag family comparison.
  "comparing-voopoo-drag-models":
    "DRAG 6 กับ DRAG S3 ต่างกันยังไง และ DRAG X3 ต่างจาก DRAG 6 ตรงไหน เทียบแบต วัตต์ จอ หัวพอต และขนาดของ VOOPOO DRAG ทีละเรื่อง ให้เลือกได้ตรงกับการใช้งาน",
  // Round "SEO all keys" batches 4 + 6 (16/10, chat 3): thai-copy's head lines for the buying guides (SEO_LANDSCAPE §9.2 #3–#7).
  "choosing-a-switch-pod":
    "พอตเปลี่ยนหัว รุ่นไหนดี ยี่ห้อไหนดี เลือกตามความต้องการ ทั้งพัฟต่อหัว จอ โหมด กลิ่น และขนาด พร้อมตัวอย่าง M Switch · Zero · RELX Creator · Esko Bar Switch 20K",
  "choosing-a-disposable":
    "พอตใช้แล้วทิ้ง ยี่ห้อไหนดี ตัวไหนดี เลือกตามที่อยากได้ ทั้งพัฟ จอ โหมด สองกลิ่นในเครื่องเดียว และจำนวนกลิ่น พร้อมเทียบ Marbo 9K กับ 10K และ INFY กับ Esko Bar",
  "choosing-a-pod-flavor":
    "พอตกลิ่นไหนดี และมีกลิ่นอะไรบ้าง รวมกลิ่นจากหลายแบรนด์แยกเป็นสาย เย็น องุ่น ผลไม้ ชาและขนม ยาสูบ พร้อมวิธีเลือกกลิ่นไม่เย็นจากชื่อกลิ่น",
  "comparing-voopoo-argus-models":
    "VOOPOO ARGUS รุ่นไหนดี เทียบ ARGUS G4 · G4 mini · G3 mini · P3 ทีละคู่ ทั้งแบต วัตต์ จอ การเปลี่ยนค่าโอห์ม ช่องลม และหัวพอตที่ใช้ร่วมกันได้ ก่อนเลือกซื้อ",
  "checking-a-genuine-pod":
    "พอตของแท้ดูยังไง เช็คเองได้ที่เว็บทางการของแบรนด์ รวมหน้าเช็คของ UWELL RELX INFY SALTHUB Esko Bar และ VOOPOO พร้อมวิธีใช้ และสิ่งที่ควรทำเมื่อซื้อพอตออนไลน์",
  // Keyword line 23/10: thai-copy's head line for the new beginner guide (no "น้ำยา").
  "how-to-vape-without-coughing":
    "สูบพอตยังไงไม่ให้สำลัก เริ่มจากดูดช้า ๆ เบา ๆ เข้าปากก่อน พร้อมเรื่องนิโคตินและเครื่องที่ทำให้ไอ และวิธีเริ่มใช้พอตใช้แล้วทิ้ง พอตเปลี่ยนหัว และพอตซิสเต็ม",
  // SEO push 27/10 batch 2 (side chat seo-push-2710): head-only lines for six Thai-only guides that used their dek as meta —
  // three had no main keyword in it (Marbo · Caliburn · พอตเปลี่ยนหัว), three IQOS deks ran past 200 characters. thai-copy's lines.
  "choosing-a-marbo-flavor":
    "Marbo กลิ่นไหนดี และมีกลิ่นอะไรบ้าง รวมรายชื่อกลิ่น M Bar 9K · M Bar 10K และ M Switch Pod แยกเป็นสายเย็น องุ่น ผลไม้ และแนวอื่น ให้เลือกตามแนวที่ชอบได้ง่าย",
  "comparing-caliburn-models":
    "Caliburn รุ่นไหนดี เทียบ Caliburn 8 รุ่นทีละคู่ เช่น G5 กับ G4 และ G4 กับ G4 Pro ต่างกันยังไง ทั้งจอกับการควบคุม ขนาดแบต การปรับช่องลม และระบบหัวพอต",
  "disposable-vs-switch-pod":
    "พอตใช้แล้วทิ้งกับพอตเปลี่ยนหัว ต่างกันยังไง แบบแรกแกะแล้วใช้ได้เลย หมดแล้วทิ้งทั้งเครื่อง แบบหลังเก็บตัวเครื่องไว้ เปลี่ยนแค่หัวพอต ส่วน Marbo มีทั้งสองแบบ",
  "iqos-iluma-i-reset-and-charging":
    "IQOS ILUMA i รีเซ็ตยังไง วาง Holder ไว้ใน Pocket Charger แล้วกดปุ่มค้างไว้ 10 วินาที พร้อมวิธีเช็คเมื่อชาร์จไม่เข้า ความหมายของไฟและสัญลักษณ์บนจอ และวิธีใช้",
  "choosing-a-terea-flavor":
    "TEREA กลิ่นไหนดี เริ่มจากกลุ่มที่ชอบก่อน IQOS แบ่งไว้สี่กลุ่ม คือ ยาสูบคลาสสิก เมนทอล กานพลู และแคปซูล รวมความต่างของแต่ละกลิ่น และวิธีบีบแคปซูลของกลิ่น Pearl",
  "iqos-iluma-i-one-vs-iluma-i":
    "ILUMA i ONE กับ ILUMA i ต่างกันยังไง i ONE เป็นเครื่องชิ้นเดียว สูบต่อกันได้สูงสุด 20 ก้าน ส่วน ILUMA i และ i PRIME มีสองชิ้น พร้อมจอทัชและโหมดหยุดพัก",
};

/** Row C19 — keyed by technology entry id. */
export const TECHNOLOGY_DESCRIPTION_HEAD_TH: Record<string, string> = {
  "gesture-and-triple-tap-control":
    "Smart Triple-Tap Control ของ UWELL ใน Caliburn G5 ใช้เซ็นเซอร์แตะแทนปุ่มกด แตะสามครั้งสลับโหมดวัตต์ แต่ต้องมีจอบนเครื่องไว้ยืนยันโหมดที่เลือก",
};

/** Rows C20 / C21 — keyed by flavour-family id; the root template appends " — OKami24". */
export const FLAVOR_TITLE_HEAD_TH: Record<string, string> = {
  fruit: "น้ำยารสผลไม้ ให้รสแบบไหน",
  dessert: "น้ำยารสของหวาน ให้รสแบบไหน",
};

/** Row C22 — the 404 title; the root template appends " — OKami24". */
export const NOT_FOUND_TITLE_TH = "ไม่พบหน้านี้";
