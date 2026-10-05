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
 *       · inside the two-word model names the owner listed;
 *       · before the LINE handle "@okm24" (round 8 close, 2026-09-23 — never alone on a line).
 *   - a joined run inside a word the segmenter breaks wrongly — ONLY the owner's listed
 *     exceptions, each scoped to the sentence it was seen in (THAI_STYLE §5 records the position),
 *     plus the short NEVER_SPLIT list of locked compounds joined everywhere (owner, 2026-09-22).
 *     Until round 9 this was a WORD JOINER (U+2060) between the letters; since round 9 (owner,
 *     2026-09-23) the page gets a `<span class="whitespace-nowrap" data-tj>` around the plain letters
 *     instead (thaiTypographyNode), so search engines read the words, not letters split by joiners.
 *
 * Conditions this module exists to enforce (owner):
 *   - applied at render only, Thai locale only — never stored in data/copy strings, so grep, the
 *     site search, <title>, meta description, JSON-LD and the English/Chinese pages keep the
 *     plain text (generateMetadata never calls this);
 *   - no rendered string carries U+2060 (round 9); NBSP stays — it is Unicode White_Space, a
 *     tokenizer splits on it like on a space;
 *   - the escapes below are the only occurrences of both characters in the repo — the checker
 *     greps every source file for the raw characters and reports any other location;
 *   - adding a joiner word or a model name needs the owner's call (docs/THAI_STYLE.md §5/§6).
 */
import { Children, cloneElement, createElement, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import { MULTI_WORD_FLAVOR_NAMES } from "@/lib/flavor-names";
// (Round 9, 2026-09-23: the U+2060 below is the binding PLAN's internal marker — see typeset(); no
// rendered string carries it any more.)

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
  // Round 9 B2 (see the block further down): these two widen an older entry for the same sentence, so they
  // must come FIRST — once the older entry has joined "พอตคิท"/"พอตซิสเต็ม", its sentence no longer matches.
  { word: "บนพอตคิท", within: "บนพอตคิทสาย ARGUS" }, // ARGUS G4 tagline on home/products/brand/technology cards (1440)
  { word: "ในพอตซิสเต็ม", within: "คอยล์เป็นของสิ้นเปลืองในพอตซิสเต็ม" }, // coil-and-pod-maintenance (390)
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
  // Round SEO ข close (owner ruling 2026-09-22, item ค): a negation that ended a line read as its
  // opposite on the next line ("ยังไม่ | ใช่ข้อมูล"), so the negation is joined with the shortest
  // object that fixes the meaning — never the whole phrase. One entry per sentence it was seen in.
  { word: "ยังไม่ใช่ข้อมูล", within: "ตามรายการความเข้ากันได้ของร้านค้าปลีก ยังไม่ใช่ข้อมูล" },
  { word: "ยังไม่โล่ง", within: "โล่งกว่า MTL แต่ยังไม่โล่ง" },
  { word: "ยังไง", within: "โอห์มกับวัตต์ส่งผลต่อแนวการสูบยังไง" },
  { word: "ไม่ได้", within: "ยังยืนยันจากแหล่งทางการไม่ได้" },
  { word: "ไม่พอ", within: "แต่หลักฐานระดับนั้นไม่พอ" },
  { word: "ไม่ได้", within: "ใช้แบตในตัว ถอดไม่ได้" },
  { word: "ยังคุม", within: "นอกจากตัวเลขวัตต์ที่เห็น ชิปยังคุม" },
  // Round SEO ข close (item ก, 6 compound words the segmenter split, each in the sentence seen):
  { word: "โล่งแบบ", within: "สูบแน่นแบบ MTL (ดูดเข้าปากก่อน ใกล้เคียงบุหรี่)" },
  { word: "แน่นแบบ", within: "เริ่มที่วัตต์กลาง ๆ ของช่วงที่เครื่องรองรับ" },
  { word: "ค่าโอห์ม", within: "จอ HD 0.85 นิ้ว โชว์แบต วัตต์ ค่าโอห์ม" },
  { word: "พอตซิสเต็ม", within: "คอยล์เป็นของสิ้นเปลืองในพอตซิสเต็ม" },
  { word: "ให้เอง", within: "อ่านโอห์มของคอยล์แล้วปรับค่าให้เอง" },
  { word: "ให้เอง", within: "วัตต์คงที่ ปรับให้เอง" },
  { word: "เติมด้านบน", within: "จอสี 0.85 นิ้ว ชาร์จผ่าน USB-C หัวพอตเติมด้านบน" },
  // Second scan after the entries above moved four breaks (same close, 2026-09-22):
  { word: "ยังไง", within: "ให้ความรู้สึกต่างกันยังไง" },
  { word: "ยังไม่มี", within: "แต่ตอนนี้เว็บเรายังไม่มีหัวพอต ARGUS" },
  { word: "แนวการสูบ", within: "โอห์มกับวัตต์ส่งผลต่อแนวการสูบ" },
  { word: "บรรจุสำเร็จ", within: "เปลี่ยนแค่หัวพอตบรรจุสำเร็จ" },
  { word: "ไม่ต้อง", within: "แต่ไม่ต้องทิ้งทั้งเครื่อง" },
  // Round 8 close (owner ruling 2026-09-23, report item 8 ก — owner allowed touching this list):
  // the 390px scan still split these after one rewording each.
  { word: "พอตซิสเต็ม", within: "หลายคนเรียกบุหรี่ไฟฟ้า เราเรียกพอต" }, // home hero lede, first phone screen
  { word: "ตัดสินใจ", within: "หลายคนเรียกบุหรี่ไฟฟ้า เราเรียกพอต" }, // same lede at 1440: "ตัดสิน | ใจ" on the first desktop screen (designer round 2 — the scan cannot see a split whose last line holds several words)
  { word: "ทางไลน์", within: "หลายคนเรียกบุหรี่ไฟฟ้า เราเรียกพอต" }, // same lede: last line reads "ทางไลน์ @okm24", not "สั่งทาง | ไลน์" (designer)
  { word: "บรรจุสำเร็จ", within: "เครื่องระบบสวิตช์ที่ใช้หัวพอตบรรจุสำเร็จ" }, // first-pod guide, "Pod System คืออะไร" p1
  { word: "ให้ถูกแบบ", within: "เลือกพอตเครื่องแรกให้ถูกแบบ" }, // that guide's title: «แบบ» stranded alone (round 7 carry)
  { word: "ส่วนพอตคิท", within: "ส่วนพอตคิทก็ใช้ซ้ำได้" }, // same paragraph: the segmenter does not know "คิท" (split at 1440 once the words above were bound); "ส่วน" joined too so the connective never ends a line (designer)
  // Round 9 B2 (owner 2026-09-23 allowed touching this module so the page keeps its look after the
  // joiners became nowrap spans): with U+2060 the segmenter kept the short word before a joined word
  // on the next line; a span lets it end the upper line ("2.01 นิ้ว บน | พอตคิทสาย"). The designer
  // (line-map crops, `_incoming/round9/moved-crops/`) asked for the old break back in these sentences
  // only — "มีหัวพอต" site-wide would strand "เว็บเรายังไม่ | มีหัวพอต" elsewhere.
  { word: "บนตัวเครื่องสาย", within: "2.51 นิ้ว บนตัวเครื่องสาย G4" }, // Caliburn G4 Pro tagline (1440)
  { word: "มีหัวพอต", within: "ช่วงโอห์มกว้างไม่ได้แปลว่ามีหัวพอตขายเสมอ" }, // reading-a-spec-sheet heading (390)
  { word: "มีหัวพอต", within: "และในกล่องมีหัวพอต GPP มาให้" }, // GPP compatibility note, caliburn-g5 / coil-94 (390)
  // Round 8 carry, listed by the owner in the round-9 instruction ("เก็บตกจากรอบ 8"):
  { word: "ข้อเดียว", within: "ตัดสินใจข้อนี้ข้อเดียว" }, // first-pod guide, 390 + 1440: "ข้อ | เดียว"
  { word: "เหมาะกับคุณ", within: "หรือพอตซิสเต็ม แบบไหนเหมาะกับคุณ" }, // open-system guide title on read-more cards, 390: "เหมาะ | กับคุณ"
  // Round 10B owner-fix close (negation rule of the SEO ข close, one entry per sentence seen): the reworded Esko capacity
  // line broke "SALTHUB ไม่ | ได้เขียนความจุ…" at 390 — the second line alone reads as the opposite.
  { word: "ไม่ได้", within: "ส่วนเว็บ SALTHUB ไม่ได้เขียนความจุของหัว M Switch Pod" },
] as const).map((j) => ({ ...j, joined: joinWord(j.word) }));

/**
 * Locked compounds that must never break inside, on EVERY Thai string (owner ruling 2026-09-22,
 * round SEO ข close, item ก1). This list is NOT THAI_STYLE §3's "locked words" — §3 decides WHICH
 * word to use, this list only says the word is never split across two lines. The owner's reason:
 * these five appear on nearly every page and were being re-listed sentence by sentence every
 * round ("หัว | พอต" on the H1 of guide 5, the summary of /technology/multi-resistance-cartridges,
 * three spec-sheet paragraphs …). Adding a word here needs the owner's call, like JOINED. A word
 * that makes a 390px page scroll sideways is withdrawn from this list and handled per sentence
 * instead (the close gate: scrollWidth = clientWidth on every sitemap page at 390).
 */
// Round 10B (owner ruling 2026-09-24, question 3 ก): "กะพริบ" "ผู้ผลิต" "จอทัช" "กี่วัน" added — the round-10B article
// scan split each of them ("ไฟกะ | พริบ", "ผู้ | ผลิต", "จอ | ทัช", "กี่ | วัน"). "จอทัช" keeps its older JOINED entry too
// (harmless: that sentence is joined first, then this entry finds nothing left to join there).
const NEVER_SPLIT: ReadonlyArray<{ word: string; joined: string }> = ["หัวพอต", "ตัวเครื่อง", "ใช้แล้วทิ้ง", "ยังไม่ยืนยัน", "ชาร์จซ้ำ", "กะพริบ", "ผู้ผลิต", "จอทัช", "กี่วัน"].map(
  (word) => ({ word, joined: joinWord(word) })
);
// Round 10B (same ruling): "USB-C" broke after its hyphen ("USB- | C", 390). The joiner after the hyphen becomes a
// nowrap run over "-C"; a line never breaks before a hyphen, so the whole name stays on one line.
const USB_C = "USB-C";

/** Multi-word model / platform / term names the owner listed — kept on one line. The 11 added at the
 *  SEO ข close (owner 2026-09-22, item ข) are the ones the article scan saw split across lines;
 *  longer names come first so "ARGUS G4 mini" is bound before "ARGUS G4" sees it. */
const MODEL_NAMES: ReadonlyArray<string> = [
  "Zero Nano", "Zero Cartridge", "M Switch", "M Bar", "Smash Go", "G Pod Platform",
  "ARGUS Top Fill Cartridge V2", "Smart Triple-Tap Control", "iCOSM CODE 2.0", "Cotton mesh coil", "Mesh coil",
  "ARGUS G4 mini", "ARGUS G3 mini", "ARGUS G4", "ARGUS P3", "salt nic", "box mod",
  // Round 10B (owner ruling 2026-09-24, designer extras): a split product name / screen message reads wrong.
  "Esko Bar Switch", "No Atomizer",
  // Data round (owner instruction 2026-09-24, batch 4): the G5 line's upper-case message, same rule.
  "NO ATOMIZER",
];

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
// Round 8 close (owner allowed touching this module, 2026-09-23): the shop's LINE handle never
// sits alone on a line — binding the home lede's "พอตซิสเต็ม" moved its last break to "… ไลน์ |
// @okm24" at 390. The handle is bound to the word before it, like a unit to its number.
const LINE_HANDLE = / (@okm24)/g;
const bindUnit = (m: string) => m.replace(RANGE_DASH, `$1${WJ}`).replace(" ", NBSP);

/**
 * The binding plan: `text` with every no-break decision applied, joiners written as U+2060 — an
 * INTERNAL marker only since round 9 (owner, 2026-09-23). The characters never reach the page:
 * thaiTypography() strips them, thaiTypographyNode() turns each joined run into a nowrap <span>.
 * Reason: a tokenizer that does not drop U+2060 reads "ขายพอตซิสเต็ม" with a joiner between every letter as one token and loses
 * the keywords "พอต"/"พอตซิสเต็ม" (ICU Intl.Segmenter("th") does exactly that —
 * _incoming/round9/b2-evidence-u2060.md), and nobody can prove Google drops it first.
 * The plan is computed exactly as before round 9, so the set of joined runs cannot drift; a
 * no-break space already in the input (a second pass over text the string API returned) is read
 * back as a plain space first, so a `within` phrase holding "0.85 นิ้ว" still matches.
 */
function typeset(text: string): string {
  let out = text.includes(NBSP) ? text.split(NBSP).join(" ") : text;
  for (const j of JOINED) if (out.includes(j.within)) out = out.split(j.word).join(j.joined);
  for (const n of NEVER_SPLIT) out = out.split(n.word).join(n.joined);
  out = out.replace(REPEAT_MARK, `${NBSP}ๆ`);
  out = out.replace(LINE_HANDLE, `${NBSP}$1`);
  out = out.replace(NUMBER_UNIT_TH, bindUnit);
  out = out.replace(NUMBER_UNIT_EN, bindUnit);
  for (const name of MODEL_NAMES) out = out.split(name).join(name.split(" ").join(NBSP));
  // Round 10B (owner ruling 2026-09-24): every multi-word flavour name on one line — "Peach | Strawberry" at 390 read
  // as two flavours. The list is src/lib/flavor-names.ts, kept complete by its contract test.
  for (const name of MULTI_WORD_FLAVOR_NAMES) out = out.split(name).join(name.split(" ").join(NBSP));
  out = out.split(USB_C).join(`USB-${WJ}C`);
  return out;
}

/** Returns `text` with the render-time typography applied as a plain string: the no-break spaces
 *  only, no joined runs (a string cannot carry them without U+2060). For attributes, data that
 *  travels as a string, and the dictionary deep-map — a caller that renders text where a joined
 *  run must hold uses thaiTypographyNode(). Idempotent; safe on any string. */
export function thaiTypography(text: string): string {
  if (!text || !THAI.test(text)) return text;
  const out = typeset(text);
  return out.includes(WJ) ? out.split(WJ).join("") : out;
}

// Thai marks that belong to the letter before them (above/below vowels, tone marks, thanthakhat …)
// and the following vowels ะ า ำ ๅ — a run never ends in front of one of them.
const TRAILING = /[ะ-ฺๅ็-๎]/u;
const DIGIT = /[\d,.]/;

/** thaiTypography() for text that is RENDERED: every run the plan joins becomes
 *  `<span class="whitespace-nowrap" data-tj>` around the plain letters, so the line can still not
 *  break inside it but the page text holds no U+2060. Returns the plain string when nothing is
 *  joined. Pure and deterministic (no runtime segmenter), so server and client render the same
 *  markup. Accepts raw text or thaiTypography() output. */
export function thaiTypographyNode(text: string): ReactNode {
  if (!text || !THAI.test(text)) return text;
  const planned = typeset(text);
  if (!planned.includes(WJ)) return planned;
  // clean text + the boundaries that must not break (a boundary b sits between clean[b-1] and clean[b])
  let clean = "";
  const glued: number[] = [];
  for (const ch of planned) {
    if (ch === WJ) glued.push(clean.length);
    else clean += ch;
  }
  // grow each glued boundary into a run [start, end) over whole letters, then merge touching runs
  const runs: Array<[number, number]> = [];
  for (const b of glued) {
    let start = b - 1;
    while (start > 0 && TRAILING.test(clean[start])) start--;
    // a range's dash joined to its second number: the run takes the whole range ("5–35", not "5<–35>")
    if (/[\d,.–-]/.test(clean[start])) while (start > 0 && DIGIT.test(clean[start - 1])) start--;
    if (start > 0 && LEADING_VOWEL.test(clean[start - 1])) start--;
    let end = b + 1;
    while (end < clean.length && (TRAILING.test(clean[end]) || LEADING_VOWEL.test(clean[end - 1]) || (DIGIT.test(clean[end]) && DIGIT.test(clean[end - 1])))) end++;
    // merge only overlapping runs: two joined words side by side keep the break between them
    const last = runs[runs.length - 1];
    if (last && start < last[1]) last[1] = Math.max(last[1], end);
    else runs.push([start, end]);
  }
  const nodes: ReactNode[] = [];
  let at = 0;
  runs.forEach(([s, e], i) => {
    if (s > at) nodes.push(clean.slice(at, s));
    nodes.push(createElement("span", { key: i, className: "whitespace-nowrap", "data-tj": "" }, clean.slice(s, e)));
    at = e;
  });
  if (at < clean.length) nodes.push(clean.slice(at));
  // One inline wrapper around the whole string: inside a flex/grid parent (a CTA link, a list row with an
  // icon) bare pieces would each become their own flex item and move apart — the wrapper keeps the text
  // one item, exactly as the single text node was before (line-map scan, round 9).
  return createElement("span", { "data-tjw": "" }, ...nodes);
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
