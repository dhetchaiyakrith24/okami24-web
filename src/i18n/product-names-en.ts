/**
 * OKami24 — English names and option labels for the warehouse-listed products whose name carries a Thai word
 * (line-1 side chat, 21/10 — the follow-up of spec-seed-en.ts).
 *
 * `displayName` of a Shipnity-seed product is the warehouse name with the brand prepended
 * (`deriveDisplayName` in `src/data/shipnity-seed/active-catalog-to-product-master.ts`), so a name like
 * "คอยล์ Argus Pod" reached English and Chinese visitors in Thai on cards, rails and the product page
 * (locale-hydration-scan FAIL on /products/*). Same overlay pattern as product-copy-en.ts / spec-seed-en.ts:
 * read only when the locale is NOT Thai (Chinese gets the English, as for every other product name) —
 * Thai visitors, <title>, JSON-LD and the LINE order message keep the warehouse name.
 *
 * Names: the Thai word translated in place, nothing added — "คอยล์" = Coil, "หัวเปล่า" = Empty Pod (an empty
 * refillable pod), "หัวแทงค์" = Pod. Where the record's own cited evidence (TAXONOMY_MATCHES) shows the
 * warehouse word "คอยล์" names a pod, not a bare coil, the English follows the evidence and the tagline already
 * on the page (product-copy-en.ts): Coil-21 = VOOPOO's "Argus Pod Cartridge", Coil-72 / Coil-94 = pods.
 * Option labels: keyed by the exact Thai label; "ยาง" = rubber (the colour of the coil's rubber ring), "เติมบน" repeats "Top Fill".
 */
const NAMES_EN: Record<string, string> = {
  "coil-21": "VOOPOO Argus Pod Cartridge",
  "coil-54": "NEVOKS Feelin Mini Empty Pod",
  "coil-55": "UWELL Caliburn G2 Pod",
  "coil-56": "Voopoo PnP-X Empty Pod",
  "coil-68": "VOOPOO ITO-X Empty Pod",
  "coil-70": "Dotmod Aio V2 Coil",
  "coil-72": "VOOPOO Vmate Infinity Edition Pod",
  "coil-74": "UWELL Caliburn X Empty Pod",
  "coil-83": "VOOPOO Argus P1 Empty Pod",
  "coil-92": "Voopoo PnP X Coil",
  "coil-94": "UWELL Caliburn G4&G3 Series Pod",
  // List-new (27/10, HANDOFF §18): "เทียบแท้" = Clone (thai-copy 27/10: the plain trade word; not "replica"/"genuine").
  "marbo-10k-clone": "Marbo 10K (Clone)",
};

const OPTION_LABELS_EN: Record<string, string> = {
  "1.2Ω ยางขาว": "1.2Ω white rubber",
  "1.2Ω ยางฟ้า": "1.2Ω blue rubber",
  "0.4 Ω Top Fill เติมบน": "0.4 Ω Top Fill",
  "0.7 Ω Top Fill เติมบน": "0.7 Ω Top Fill",
};

/** The product name a visitor reads: the English overlay on en/zh when one exists, otherwise the stored name. */
export function pilotName(slug: string, displayName: string, locale: string): string {
  if (locale === "th") return displayName;
  return NAMES_EN[slug] ?? displayName;
}

/** The option label a visitor reads: the English overlay on en/zh when one exists, otherwise the stored label. */
export function pilotOptionLabel(label: string, locale: string): string {
  if (locale === "th") return label;
  return OPTION_LABELS_EN[label] ?? label;
}
