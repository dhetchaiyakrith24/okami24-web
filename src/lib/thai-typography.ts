/**
 * Thai typography at RENDER time — round 30.4ค closing pass (owner rulings 2026-09-15/16).
 * Supersedes src/lib/thai-keep-together.ts (round 30.4 Q1): one file, one list, one gate.
 *
 * The browser breaks Thai lines with a dictionary segmenter, so a line can end on "ไม่", split a
 * number from its unit ("5–35 | วัตต์"), split a two-word model name ("Zero | Nano"), start a
 * line with the repeat mark "ๆ", or — when a word is not in its dictionary — break inside the
 * word ("พอตคิ | ทสาย"). The fixes are two invisible characters:
 *   - NO-BREAK SPACE (U+00A0) where a plain space must not become a line break:
 *       · before "ๆ"  ("ต่าง ๆ" — THAI_STYLE §4 keeps the space in the source);
 *       · between a number and its unit (วัตต์ โอห์ม พัฟ นิ้ว กรัม · mAh mL W);
 *       · inside the two-word model names the owner listed.
 *   - WORD JOINER (U+2060) inside a word the segmenter breaks wrongly — ONLY the owner's listed
 *     exceptions, each scoped to the sentence it was seen in (THAI_STYLE §5 records the position).
 *
 * Conditions this module exists to enforce (owner):
 *   - applied at render only, Thai locale only — never stored in data/copy strings, so grep, the
 *     site search, <title>, meta description, JSON-LD and the English/Chinese pages keep the
 *     plain text (generateMetadata never calls this);
 *   - the escapes below are the only occurrences of both characters in the repo — the checker
 *     greps every source file for the raw characters and reports any other location;
 *   - adding a joiner word or a model name needs the owner's call (docs/THAI_STYLE.md §5/§6).
 */
const NBSP = String.fromCharCode(0x00a0); // NO-BREAK SPACE (written as a code point so the repo never holds the raw character)
const WJ = String.fromCharCode(0x2060); // WORD JOINER (same reason)

/** Owner-approved joiner exceptions: the word, the word with the joiner at the segmenter's break
 *  point, and a phrase that must be present in the text so the joiner never spreads beyond the
 *  sentence it was approved for. */
const JOINED: ReadonlyArray<{ word: string; joined: string; within: string }> = [
  // /e-liquid/beverage lede (round 30.4 Q1)
  { word: "เบเกอรี่", joined: `เบ${WJ}เกอรี่`, within: "ไม่ได้ตั้งต้นจากผลไม้หรือเบเกอรี่" },
  // /technology/onboard-touch-displays, first paragraph (round 30.4 Q1)
  { word: "จอทัช", joined: `จอ${WJ}ทัช`, within: "จอพอตยุคแรกส่วนใหญ่โชว์แค่ระดับแบต" },
  // ARGUS P3 tagline — the segmenter does not know "คิท" (closing pass 2026-09-16)
  { word: "พอตคิท", joined: `พอตคิ${WJ}ท`, within: "บนพอตคิทสาย ARGUS" },
  // GPP compatibility-card evidence sentence — the segmenter split "รุ่น" (closing pass)
  { word: "รุ่นนี้", joined: `รุ่${WJ}นนี้`, within: "หัวพอตรุ่นนี้ที่ OKami24" },
  // /about compliance paragraph (THAI_STYLE §5 group ก text — wording untouchable) (closing pass)
  { word: "กล่าวอ้าง", joined: `กล่า${WJ}วอ้าง`, within: "ไม่มีการกล่าวอ้างด้านสุขภาพ" },
];

/** Two-word model / platform names the owner listed — kept on one line. */
const MODEL_NAMES: ReadonlyArray<string> = ["Zero Nano", "Zero Cartridge", "M Switch", "M Bar", "Smash Go", "G Pod Platform"];

// a number (with , . – - inside) followed by ONE plain space and a unit. A Thai unit may run
// straight into the next Thai word ("5,000 พัฟต่อหัวพอต"); a Latin unit must end there ("35 Watt"
// and "5 Wh" are left alone).
const NUMBER = "(\\d[\\d,.]*(?:[–-]\\d[\\d,.]*)?)";
const NUMBER_UNIT_TH = new RegExp(`${NUMBER} (?:วัตต์|โอห์ม|พัฟ|นิ้ว|กรัม)`, "g");
const NUMBER_UNIT_EN = new RegExp(`${NUMBER} (?:mAh|mL|W)(?![A-Za-z])`, "g");
const THAI = /\p{Script=Thai}/u;
const REPEAT_MARK = / ๆ/g;

/** Returns `text` with the render-time typography applied. Idempotent; safe on any string. */
export function thaiTypography(text: string): string {
  if (!text || !THAI.test(text)) return text;
  let out = text;
  for (const j of JOINED) if (out.includes(j.within)) out = out.split(j.word).join(j.joined);
  out = out.replace(REPEAT_MARK, `${NBSP}ๆ`);
  out = out.replace(NUMBER_UNIT_TH, (m) => m.replace(" ", NBSP));
  out = out.replace(NUMBER_UNIT_EN, (m) => m.replace(" ", NBSP));
  for (const name of MODEL_NAMES) out = out.split(name).join(name.split(" ").join(NBSP));
  return out;
}

/** Deep-maps every string in a dictionary/overlay object (used by LocaleProvider for the Thai
 *  dictionary the client components render; the raw dictionary stays plain for metadata). */
export function thaiTypographyDeep<T>(value: T): T {
  if (typeof value === "string") return thaiTypography(value) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => thaiTypographyDeep(v)) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = thaiTypographyDeep(v);
    return out as T;
  }
  return value;
}
