/**
 * OKami24 — search aliases (round "search-price", 2026-09-22; full set from the owner/Cowork the
 * same day, replacing the main agent's first guess).
 *
 * What a visitor TYPES into the search box, mapped to the English term the catalog stores. One
 * direction only: typed word → product. These strings are NEVER rendered anywhere on the site —
 * THAI_STYLE §2 layer 1 (brand and model names stay English on the site, never transliterated)
 * and the ban on "บุหรี่ไฟฟ้า" are rules for what the site WRITES to a customer; this file only
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
  // TFIT (ทีฟิต/ทีฟิท) and INFY (อินฟี่/อินฟี) from the owner's list are NOT here yet: both
  // products are hidden from the storefront (no card photo), so the aliases would find nothing
  // and the dead-alias check would fail — add them the day the products go live.
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
  // The site's own home H1 says "พอตไฟฟ้า"; "บุหรี่ไฟฟ้า" is what many customers still type
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
};

/** Slug → extra terms that belong to one product only. Empty today: the brand/family-level
 *  aliases above cover every case the round found. Add a row here when one product is known by
 *  a name no field carries (and say where the name comes from). */
export const PRODUCT_SEARCH_ALIASES: Record<string, string[]> = {};
