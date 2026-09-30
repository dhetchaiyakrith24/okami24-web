/**
 * OKami24 — search aliases (round "search-price", 2026-09-22; full set from the owner/Cowork the
 * same day, replacing the main agent's first guess).
 *
 * What a visitor TYPES into the search box, mapped to the English term the catalog stores. One
 * direction only: typed word → product. These strings are NEVER rendered anywhere on the site —
 * THAI_STYLE §2 layer 1 (brand and model names stay English on the site, never transliterated —
 * "Marbo" included, round-8 lock 2026-09-23) is a rule for what the site WRITES to a customer
 * ("บุหรี่ไฟฟ้า" was once banned there too; allowed since round 7, locked in round 8); this file only
 * listens to what the customer writes to us. The owner's ruling (2026-09-22): a Thai customer
 * spells a brand many ways and still says "บุหรี่ไฟฟ้า" — refusing those words means an empty
 * results page, so several spellings per brand are welcome and Code may add or drop entries as
 * it sees fit, without asking.
 *
 * Read by src/lib/catalog-search.ts. Guarded by catalog-search-contract-test.ts: every alias must
 * find exactly what its English term finds (a dead alias fails), and every brand that has a
 * product on the storefront must have at least one Thai alias (a new brand without one fails).
 *
 * Keys are the normalised token (lower-case, no spaces) exactly as `normalizeQuery` produces it;
 * values are the English terms the token stands for (any one matching is enough; a term may
 * contain a space — it is matched as a phrase, and also in its compact form).
 */
export const TERM_SEARCH_ALIASES: Record<string, string[]> = {
  // ── brands ──────────────────────────────────────────────────────────────────────────────
  "ยูเวล": ["uwell"],
  "ยูเวลล์": ["uwell"],
  "ยูเวว": ["uwell"],
  "วูปู": ["voopoo"],
  "วู้ปู": ["voopoo"],
  "วูปู้": ["voopoo"],
  "วุปู": ["voopoo"],
  "ซอลท์ฮับ": ["salthub"],
  "ซอลฮับ": ["salthub"],
  "ซอลต์ฮับ": ["salthub"],
  // "Marbo" is how the SALTHUB line is marketed (salthub.com's footer carries the Marbo logo —
  // note in src/data/products/salthub.ts; the m-bar-15k head copy says "M Bar 15K (Marbo)").
  marbo: ["salthub"],
  "มาร์โบ": ["salthub"],
  "มาร์โบ้": ["salthub"],
  "มาโบ": ["salthub"],
  "รีแลกซ์": ["relx"],
  "รีแล็กซ์": ["relx"],
  "รีแลค": ["relx"],
  "เรลเอ็กซ์": ["relx"],
  "ไอคอส": ["iqos"],
  "ไอโคส": ["iqos"],
  "ไอค๊อส": ["iqos"],
  "จอยเวย์": ["joiway"],
  "จอยเว": ["joiway"],
  // TFIT and INFY, from the owner's list (round "leftovers", 2026-09-22). Each brand's only
  // product is still `hiddenFromStorefront` for want of a card photo, so these find nothing TODAY
  // — they are dormant, not dead, and `DORMANT_ALIAS_TERMS` below is what tells the contract test
  // the difference. The day a photo lands the product joins the storefront and these start
  // working with no edit here; the test then demands the dormant row be removed.
  "ทีฟิต": ["tfit"],
  "ทีฟิท": ["tfit"],
  "ทีฟิส": ["tfit"],
  "อินฟี่": ["infy"],
  "อินฟี": ["infy"],
  "อินฟิ": ["infy"],
  // Brands the owner's list did not name but the storefront carries (the contract test demands
  // one Thai spelling per brand with a product) — Code's spellings, add more as customers show them:
  "รินโค": ["rincoe"],
  "ดอทมอด": ["dotmod"],
  "ด็อทมอด": ["dotmod"],
  "เอสโก้บาร์": ["esko bar"],
  "เอสโกบาร์": ["esko bar"],
  "เนวอกซ์": ["nevoks"],
  "เนว็อกซ์": ["nevoks"],
  "โวโตโฟ": ["wotofo"],
  "วอโตโฟ": ["wotofo"],
  // ── families / model lines ───────────────────────────────────────────────────────────────
  "คาลิเบิร์น": ["caliburn"],
  "คาลิเบิน": ["caliburn"],
  "คาริเบิร์น": ["caliburn"],
  "คาลิ": ["caliburn"],
  "ดราก": ["drag"],
  "ดร๊าก": ["drag"],
  "แดรก": ["drag"],
  "ดรัก": ["drag"],
  "อาร์กัส": ["argus"],
  "อากัส": ["argus"],
  "อาร์กัด": ["argus"],
  "วินชี": ["vinci"],
  "วินชี่": ["vinci"],
  "วินซี่": ["vinci"],
  "วีเมท": ["vmate"],
  "วีเมต": ["vmate"],
  "เอ็มบาร์": ["m bar"],
  "เอมบาร์": ["m bar"],
  "เอ็มบา": ["m bar"],
  "เอ็มสวิตช์": ["m switch"],
  "เอ็มสวิช": ["m switch"],
  "เอ็มสวิทช์": ["m switch"],
  "ซีโร่": ["zero"],
  "ซีโร": ["zero"],
  "มูโร่": ["muro"],
  "มูโร": ["muro"],
  // The record spells it "MOOOD Monster" (three O's, the brand's own spelling) — customers type two.
  mood: ["moood"],
  "มูดมอนสเตอร์": ["moood monster"],
  "มู้ดมอนสเตอร์": ["moood monster"],
  // ── generic words ───────────────────────────────────────────────────────────────────────
  // The site's own home H1 names neither word (Thai H1: "Pod System ของแท้ ข้อมูลจริง"); "บุหรี่ไฟฟ้า" is what many customers still type
  // (Search Console records "บุหรี่ไฟฟ้า drag", docs/SEO_BASELINE.md) — owner 2026-09-22: accept
  // it as a typed word; it stays banned in the site's own copy. Both mean a device: the three
  // device categories (พอตซิสเต็ม · พอตคิท · พอตใช้แล้วทิ้ง), not the pods and coils.
  "พอตไฟฟ้า": ["พอตซิสเต็ม", "พอตคิท", "พอตใช้แล้วทิ้ง"],
  "บุหรี่ไฟฟ้า": ["พอตซิสเต็ม", "พอตคิท", "พอตใช้แล้วทิ้ง"],
  "เครื่องพอต": ["พอตซิสเต็ม", "พอตคิท", "พอตใช้แล้วทิ้ง"],
  "พอตทิ้ง": ["พอตใช้แล้วทิ้ง"],
  "พอตเปลี่ยนหัว": ["พอตซิสเต็ม", "พอตคิท"],
  "หัวเปล่า": ["หัวพอต"],
  "แทงค์": ["หัวพอต"],
  // ── round 7 "SEO ค" B4 (2026-09-23): spellings people actually typed into Google and reached
  // the site with (Search Console export, _incoming/seo-c/gsc-2026-09-23.tsv) plus the owner's own
  // "คอล์ย" / "พอด". Owner ruling that round: a misspelling lives here, hidden — never in a title,
  // a description, visible copy or JSON-LD (THAI_STYLE layer 1 keeps brand/model names correct).
  uotofo: ["wotofo"],
  calibirn: ["caliburn"],
  "คาริเบิน": ["caliburn"],
  eskobar: ["esko bar"],
  ekkobar: ["esko bar"],
  ecobar: ["esko bar"],
  catrit: ["cartridge"],
  "เนวัก": ["nevoks"],
  "คอล์ย": ["coil"],
  "พอด": ["pod"],
  // Not added (round 7 B4): saltnic / ซอลนิค / ซอลนิก / ฟรีเบส — no e-liquid on the storefront, and the
  // dormant mechanism below is brand-based (a hidden product's brandId), so these would be dead
  // aliases and fail the contract. Add them the day an e-liquid product is published.
};

/** Slug → extra terms that belong to one product only. Empty today: the brand/family-level
 *  aliases above cover every case the round found. Add a row here when one product is known by
 *  a name no field carries (and say where the name comes from). */
export const PRODUCT_SEARCH_ALIASES: Record<string, string[]> = {};

/**
 * English terms above that legitimately find nothing right now (round "leftovers", 2026-09-22).
 *
 * The contract test's rule is "an alias whose English term finds nothing is a dead alias" — a
 * good rule, because a typo'd target is invisible otherwise. But it also blocked the honest case:
 * a brand the shop really carries whose only product is `hiddenFromStorefront` for want of a card
 * photo (docs/IMAGE_SPEC.md §4). Listing the term here says "this one is waiting for a photo, not
 * misspelled", and the test then holds it to a stricter bargain than a normal alias:
 *
 *   - it must find nothing today, AND
 *   - a hidden product of that brand must actually exist (so a typo can never hide in here), AND
 *   - the moment the product goes live and the term starts finding something, the test FAILS
 *     until the row is deleted — the list cannot quietly outlive its reason.
 *
 * Nothing is needed here on the day the photo lands except deleting the row: the aliases above
 * are already wired and start working by themselves.
 *
 * "infy": the INFY 20K page is ready but held until 06/10 (src/data/products/infy.ts) — drop the term the day it opens.
 */
export const DORMANT_ALIAS_TERMS: string[] = ["tfit", "infy"];
