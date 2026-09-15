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
 *       · between a number and its unit (วัตต์ โอห์ม พัฟ นิ้ว กรัม บาท วัน รุ่น นาที · mAh mL W — the
 *         units บาท วัน รุ่น added at the owner's call 2026-09-16 after the post-typography scan
 *         still showed "500 | บาท", "3 | วัน", "4 | รุ่น" on /how-to-order /warranty /compare;
 *         นาที proposed the same day after "เต็มใน 45 | นาที" appeared on the ARGUS G4 lede);
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
import { Children, cloneElement, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";

const NBSP = String.fromCharCode(0x00a0); // NO-BREAK SPACE (written as a code point so the repo never holds the raw character)
const WJ = String.fromCharCode(0x2060); // WORD JOINER (same reason)

// A joiner at one break point only moves the break: the designer's closing check (2026-09-16) saw
// "กล่า | วอ้าง" become "ก | ล่าวอ้าง". So the whole word is joined — a WORD JOINER before every
// consonant (ก–ฮ) and every leading vowel (เ–ไ) inside it, never before a combining
// mark or a following vowel (they attach to the letter before them), never after a leading vowel
// (the segmenter cannot separate "เ" from its consonant anyway).
const JOIN_BEFORE = /[ก-ฮเ-ไ]/u;
const LEADING_VOWEL = /[เ-ไ]/u;
function joinWord(word: string): string {
  let out = "";
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    if (i > 0 && JOIN_BEFORE.test(ch) && !LEADING_VOWEL.test(word[i - 1])) out += WJ;
    out += ch;
  }
  return out;
}

/** Owner-approved joiner exceptions: the word (joined whole at render) and a phrase that must be
 *  present in the text so the joiner never spreads beyond the sentence it was approved for. */
const JOINED: ReadonlyArray<{ word: string; within: string; joined: string }> = ([
  // /e-liquid/beverage lede (round 30.4 Q1)
  { word: "เบเกอรี่", within: "ไม่ได้ตั้งต้นจากผลไม้หรือเบเกอรี่" },
  // /technology/onboard-touch-displays, first paragraph (round 30.4 Q1)
  { word: "จอทัช", within: "จอพอตยุคแรกส่วนใหญ่โชว์แค่ระดับแบต" },
  // ARGUS P3 tagline — the segmenter does not know "คิท" (closing pass 2026-09-16)
  { word: "พอตคิท", within: "บนพอตคิทสาย ARGUS" },
  // GPP compatibility-card evidence sentence — the segmenter split "รุ่น" (closing pass)
  { word: "รุ่นนี้", within: "หัวพอตรุ่นนี้ที่ OKami24" },
  // /about compliance paragraph (THAI_STYLE §5 group ก text — wording untouchable) (closing pass).
  // Joining "กล่าวอ้าง" alone pushed the break to "ไม่มี | การกล่าวอ้าง" and "เลิกบุ | หรี่" (designer,
  // 2026-09-16), so the negation is joined with its object and "บุหรี่" is kept whole in this sentence.
  { word: "ไม่มีการกล่าวอ้าง", within: "ไม่มีการกล่าวอ้างด้านสุขภาพ" },
  { word: "บุหรี่", within: "ไม่มีการกล่าวอ้างด้านสุขภาพ" },
] as const).map((j) => ({ ...j, joined: joinWord(j.word) }));

/** Two-word model / platform names the owner listed — kept on one line. */
const MODEL_NAMES: ReadonlyArray<string> = ["Zero Nano", "Zero Cartridge", "M Switch", "M Bar", "Smash Go", "G Pod Platform"];

// a number (with , . – - inside) followed by ONE plain space and a unit. A Thai unit may run
// straight into the next Thai word ("5,000 พัฟต่อหัวพอต"); a Latin unit must end there ("35 Watt"
// and "5 Wh" are left alone).
const NUMBER = "(\\d[\\d,.]*(?:[–-]\\d[\\d,.]*)?)";
const NUMBER_UNIT_TH = new RegExp(`${NUMBER} (?:วัตต์|โอห์ม|พัฟ|นิ้ว|กรัม|บาท|วัน|รุ่น|นาที)`, "g");
const NUMBER_UNIT_EN = new RegExp(`${NUMBER} (?:mAh|mL|W)(?![A-Za-z])`, "g");
// a range's dash is itself a break opportunity — with the unit bound, "5–35 วัตต์" broke as
// "5– | 35 วัตต์" (designer, closing check 2026-09-16), so the dash inside a bound number is joined
const RANGE_DASH = /([–-])(?=\d)/g;
const THAI = /\p{Script=Thai}/u;
const REPEAT_MARK = / ๆ/g;
const bindUnit = (m: string) => m.replace(RANGE_DASH, `$1${WJ}`).replace(" ", NBSP);

/** Returns `text` with the render-time typography applied. Idempotent; safe on any string. */
export function thaiTypography(text: string): string {
  if (!text || !THAI.test(text)) return text;
  let out = text;
  for (const j of JOINED) if (out.includes(j.within)) out = out.split(j.word).join(j.joined);
  out = out.replace(REPEAT_MARK, `${NBSP}ๆ`);
  out = out.replace(NUMBER_UNIT_TH, bindUnit);
  out = out.replace(NUMBER_UNIT_EN, bindUnit);
  for (const name of MODEL_NAMES) out = out.split(name).join(name.split(" ").join(NBSP));
  return out;
}

/** Deep-maps every string in a dictionary/overlay object (used by LocaleProvider for the Thai
 *  dictionary the client components render; the raw dictionary stays plain for metadata).
 *  The service-page copy (src/i18n/service-pages/*) mixes strings with inline JSX (<B>, <E>,
 *  links), so a React element is walked through its children and cloned — the element itself,
 *  its props and its key stay as written. */
export function thaiTypographyDeep<T>(value: T): T {
  if (typeof value === "string") return thaiTypography(value) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => thaiTypographyDeep(v)) as unknown as T;
  if (isValidElement(value)) {
    const el = value as ReactElement<{ children?: ReactNode }>;
    if (el.props.children === undefined || el.props.children === null) return value;
    const kids = Children.map(el.props.children, (k) => thaiTypographyDeep(k)) ?? [];
    return cloneElement(el, undefined, ...kids) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = thaiTypographyDeep(v);
    return out as T;
  }
  return value;
}
