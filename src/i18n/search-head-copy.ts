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

/** Row A1 / A2 — the homepage (root layout default title + description + og:description). */
export const HOME_HEAD_TH = {
  title: "OKami24 (OKM) — พอตของแท้ ราคาตรง บริการจริง",
  description:
    "OKami24 (OKM) ร้านพอตของแท้ ราคาตรง บริการจริง มีพอตซิสเต็ม พอตใช้แล้วทิ้ง หัวพอต และคอยล์ บอกราคาทุกตัว สั่งทาง LINE @okm24 แอดมินตอบเอง ไม่ใช่บอท",
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
  return {
    title: `พอต หัวพอต คอยล์ ของแท้ ${count} รุ่น ราคาทุกตัว${OKM_TITLE_SUFFIX}`,
    description: `สินค้าทั้งหมด ${count} รุ่นในหน้าเดียว พอตซิสเต็ม พอตใช้แล้วทิ้ง หัวพอต คอยล์ และ IQOS ของแท้ บอกราคาทุกตัว ค้นด้วยชื่อรุ่นได้ สั่งทาง LINE @okm24`,
  };
}

/** A formatted price for a catalog slug, or null when the product has no approved price. */
export type PriceOf = (slug: string) => string | null;

/** Rows A9–A16 — the four brand pages whose title/description name real models and prices.
 *  Every other brand keeps `brandTitleTh()` + its `descriptionTh`. Prices come through `priceOf`
 *  (see the header comment); a null price drops just that " ฿…" fragment. */
export const BRAND_HEAD_TH: Record<string, (priceOf: PriceOf) => { title: string; description: string }> = {
  relx: (priceOf) => {
    const p = priceOf("relx-smash-go-12k");
    return {
      title: `พอต RELX Smash Go 12K ของแท้${p ? ` ${p}` : ""}${OKM_TITLE_SUFFIX}`,
      description: `RELX ที่ OKami24 (OKM) มีรุ่น Smash Go 12K พอตใช้แล้วทิ้งจากไลน์อัพทางการ รองรับสูงสุด 12,000 พัฟ มีให้เลือก 10 รส ของแท้${p ? ` ราคา ${p}` : ""} สั่งทาง LINE @okm24`,
    };
  },
  salthub: (priceOf) => {
    const p = priceOf("m-bar-15k");
    return {
      title: `SALTHUB M Bar 15K (Marbo) ของแท้${p ? ` ${p}` : ""}${OKM_TITLE_SUFFIX}`,
      description: `SALTHUB M Bar (Marbo) พอตใช้แล้วทิ้ง 15K${p ? ` ${p}` : ""} มี 9K และ 10K ส่วน M Switch และ Zero เป็นเครื่องระบบสวิตช์ เปลี่ยนแค่หัวพอต ไม่ต้องเติมน้ำยา สั่งทาง LINE @okm24`,
    };
  },
  voopoo: (priceOf) => {
    const p = (slug: string) => { const v = priceOf(slug); return v ? ` ${v}` : ""; };
    return {
      title: `VOOPOO DRAG 6 · DRAG S3 · ARGUS G4 ของแท้${OKM_TITLE_SUFFIX}`,
      description: `พอตคิท VOOPOO ที่ OKami24 (OKM) มี DRAG 6${p("drag-6")} ให้ได้ถึง 220 วัตต์ · DRAG S3${p("drag-s3")} · ARGUS G4${p("argus-g4")} พร้อมหัวพอตและคอยล์แท้ สั่งทาง LINE @okm24`,
    };
  },
  uwell: (priceOf) => {
    const p = (slug: string) => { const v = priceOf(slug); return v ? ` ${v}` : ""; };
    return {
      title: `UWELL Caliburn G5 · G4 · G3 Pro ของแท้${OKM_TITLE_SUFFIX}`,
      description: `พอตซิสเต็ม UWELL ที่ OKami24 (OKM) มี Caliburn G5${p("caliburn-g5")} · G4${p("caliburn-g4")} · G3 Pro${p("caliburn-g3-pro")} พร้อมหัวพอตและคอยล์แท้ของ Caliburn สั่งทาง LINE @okm24`,
    };
  },
};

/** Row B2 — appended to every product description; the price is the catalog's, never typed. */
export function productPriceSuffixTh(price: number): string {
  return `ของแท้ ราคา ${formatPriceTh(price)} สั่งทาง LINE @okm24`;
}

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
export function withPriceSuffixTh(base: string, price: number | null): string {
  if (price === null) return base;
  const suffix = productPriceSuffixTh(price);
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
  "m-bar-15k": "M Bar 15K (Marbo 15K) ที่ OKami24 (OKM) พอตใช้แล้วทิ้งชาร์จซ้ำได้ รองรับสูงสุด 15,000 พัฟ คอยล์ cotton mesh มี 15 รส",
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
  "coil-87": "หัวพอตเปล่า VOOPOO TPP Pod ความจุ 5.5mL ใช้กับคอยล์ TPP ยึดด้วยแม่เหล็ก ใช้ได้กับ DRAG 3 Kit และ DRAG X Plus Kit",
  "coil-89": "หัวพอต RINCOE Jellybox V คอยล์ในตัว มี 0.8 และ 1.0 โอห์ม ความจุ 3mL เติมด้านข้าง ใช้ได้กับ Jellybox V1 · V2 · V3",
  "coil-94": "หัวพอต Caliburn G4&G3 Series จากแบรนด์ UWELL คอยล์ mesh ในตัว มี 0.4 · 0.6 · 0.9 · 1.2 โอห์ม ความจุ 2mL",
  "iqosheet-16": "เครื่องอุ่นยาสูบ IQOS ILUMA i PRIME แบต 2380mAh ชาร์จผ่าน USB-C เต็มแล้วใช้ได้สูงสุด 20 ก้าน ใช้กับก้าน TEREA เท่านั้น",
  "iqosheet-18": "เครื่องอุ่นยาสูบ IQOS ILUMA i ใช้ได้กับก้าน TEREA เท่านั้น มี 2 สี Midnight Black และ Breeze Blue",
  "pod-180": "พอตใช้แล้วทิ้ง WOTOFO Nexbar 18K แบต 750mAh ชาร์จซ้ำได้ผ่าน USB-C คอยล์ nexMESH ในตัว น้ำยาประมาณ 18mL มี 10 รส",
};

/** Rows C17 / C18 — keyed by guide id. Round SEO ข (owner เคาะ 2026-09-21): five more head-only
 *  descriptions for the guides grown that round; the dek each page shows is unchanged. No price
 *  ever appears in this map (round-ก rule). */
export const GUIDE_DESCRIPTION_HEAD_TH: Record<string, string> = {
  "choosing-your-first-pod-system":
    "Pod system ตัวไหนดี เริ่มจากเลือกแบบก่อน พอตซิสเต็ม พอตคิท หรือใช้แล้วทิ้ง แนะนำจากของที่ร้านมีจริง Caliburn G5 · ARGUS G3 mini · M Bar 9K พร้อมวิธีเช็คของแท้",
  "open-system-vs-disposable":
    "เทียบพอตใช้แล้วทิ้งกับพอตซิสเต็ม ต่างกันตรงไหน ต้องดูแลแค่ไหน พร้อมตัวอย่างจริง M Bar 10K · M Switch Kit · Caliburn G5 Lite และวิธีเช็คของแท้จากกล่อง",
  "reading-a-spec-sheet":
    "อ่านสเปกพอตทีละบรรทัดจากตัวอย่างจริง ARGUS G4 แบต mAh ช่วงวัตต์ ช่วงโอห์ม แปลว่าอะไร ป้ายยังไม่ยืนยันคืออะไร และทำไมช่วงโอห์มกว้างไม่ได้แปลว่ามีหัวพอตขาย",
  "coil-and-pod-maintenance":
    "หัวพอตใหม่ต้องรอกี่นาที คอยล์ควรเปลี่ยนเมื่อไหร่ หัวพอต GPP ของ UWELL ใช้กับ Caliburn รุ่นไหนได้บ้าง และทำไมหัวพอตเป็นของที่ต้องซื้อซ้ำ",
  "choosing-wattage-and-airflow":
    "ตั้งกี่วัตต์ดี เปิดช่องลมแค่ไหน สองอย่างนี้ปรับไปด้วยกัน พร้อมตัวอย่างจริง Caliburn G3 Pro ที่ให้หัวพอต 2 ค่าโอห์มมาในกล่อง และ VINCI S ช่วงวัตต์ 5–40 วัตต์",
  "understanding-mtl-vs-dtl":
    "MTL กับ DTL ต่างกันยังไง MTL ดึงไอเข้าปากก่อนแล้วค่อยลงปอด ช่องลมแคบ โอห์มสูง วัตต์ต่ำ · DTL ดึงไอลงปอดเลย ช่องลมโล่ง โอห์มต่ำ วัตต์สูง · RDL อยู่ตรงกลาง",
  "battery-care-and-charging":
    "วิธีดูแลแบตพอต แบตในตัวชาร์จผ่าน USB-C ตามที่ผู้ผลิตกำหนด อย่าเสียบชาร์จทิ้งไว้นาน ๆ ถ่าน 18650/21700 ชาร์จด้วยแท่นชาร์จแยก เช็คว่าฟิล์มหุ้มไม่ฉีก",
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
