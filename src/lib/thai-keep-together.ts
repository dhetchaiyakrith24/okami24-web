/**
 * Round 30.4 Q1 (owner, 2026-09-12) — a WORD JOINER (U+2060) keeps a Thai word from being broken
 * across lines by the browser's dictionary segmenter. The owner allowed it for exactly two words
 * in exactly two paragraphs (the first line the eye lands on of /e-liquid/beverage and
 * /technology/onboard-touch-displays) and nowhere else until the dedicated mid-word line-break
 * round. Conditions that this module exists to enforce:
 *   - the joiner is inserted at RENDER time only — it is never stored in a data/copy string, so
 *     grep, the site search, <title>, meta description and JSON-LD all keep the plain word;
 *   - the escape below is the only occurrence of the character in the repo (the checker greps
 *     for the raw character and for this escape and reports every location).
 * Adding a site or a word here needs the owner's call — see docs/THAI_STYLE.md §6.
 */
const WORD_JOINER = "\u2060";

/** site key → [plain word, word with the joiner at the segmenter's break point] */
const KEEP: Record<string, Array<[string, string]>> = {
  // /e-liquid/beverage lede (flavor-copy.ts description of the beverage family)
  "flavor:beverage:description": [["เบเกอรี่", `เบ${WORD_JOINER}เกอรี่`]],
  // /technology/onboard-touch-displays, section 0, paragraph 0 (technology-copy.ts)
  "technology:onboard-touch-displays:0:0": [["จอทัช", `จอ${WORD_JOINER}ทัช`]],
};

/** Returns `text` with the approved words for `site` kept together; unchanged for any other site. */
export function keepTogether(text: string, site: string): string {
  const pairs = KEEP[site];
  if (!pairs) return text;
  let out = text;
  for (const [plain, joined] of pairs) out = out.split(plain).join(joined);
  return out;
}
