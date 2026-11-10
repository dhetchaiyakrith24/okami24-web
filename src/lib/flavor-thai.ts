/**
 * T2-32 (outside tester 10/11: flavour names are English only, a Thai visitor cannot tell "Guava" or "Lychee"): the Thai words a
 * Thai-page flavour option shows under / beside its name — "Mango" + "มะม่วง", "Guava Kiwi Passion Fruit" + "ฝรั่ง กีวี เสาวรส".
 * The maker's English name stays the name (THAI_STYLE layer 1); this is a reading aid only, never a new flavour claim — it
 * translates the words of the name, nothing about taste. A name with no word in the tables gets nothing (Blue Ice, Red Bull,
 * Riviera Pearl).
 *
 * Spellings: thai-copy 11/11 — the site's own spelling where the site already writes the word (สตรอเบอร์รี่ · มินต์ · แอปเปิ้ล ·
 * อโล · หมากฝรั่ง …), พีช is THAI_STYLE §3 locked; otherwise the spelling Thai pod shops use. Every other spelling a visitor may type
 * is a search alias (src/data/search-aliases.ts), not a display word.
 *
 * Matching (thai-copy's traps): whole words, case-insensitive, longest phrase first — "pineapple" is not "apple", "grapefruit" not
 * "grape", "mangosteen" not "mango", "spearmint" not "mint", "honeydew" not "honey", "watermelon" not "melon". "Ice / Iced / Icy"
 * says nothing about the flavour and is skipped (so "Lemon Ice Tea" = "lemon tea" = ชามะนาว), except inside "ice cream", which
 * leads: "Taro Ice Cream" → "ไอศกรีมเผือก". Each Thai word once per name, in the English order, joined by one space (a "·" would
 * read as two flavours). Checked by src/lib/flavor-thai-contract-test.ts (`--list` prints every catalog flavour with its words).
 *
 * Kept as a plain table, not read from the catalog: it runs in client components (THAI_STYLE / flavor-names.ts, same reason).
 */
const PHRASES: ReadonlyArray<readonly [string, string]> = [
  // longest first
  ["thai milk green tea", "ชาเขียวนม"],
  ["jasmine longjing tea", "ชามะลิ"],
  ["jasmine green tea", "ชาเขียวมะลิ"],
  ["thai milk tea", "ชานมไทย"],
  ["green tangerine", "ส้มเขียว"],
  ["honeydew melon", "ฮันนี่ดิว"],
  ["shine muscat", "องุ่นไชน์มัสแคท"],
  ["milk tea cha", "ชานม"],
  ["chocolate dubai", "ช็อกโกแลตดูไบ"],
  ["coconut water", "น้ำมะพร้าว"],
  ["passion fruit", "เสาวรส"],
  ["dragon fruit", "แก้วมังกร"],
  ["black currant", "แบล็กเคอร์แรนต์"],
  ["mixed berries", "เบอร์รี่รวม"],
  ["mixed berry", "เบอร์รี่รวม"],
  ["mix berries", "เบอร์รี่รวม"],
  ["mix berry", "เบอร์รี่รวม"],
  ["black berry", "แบล็กเบอร์รี่"],
  ["sugar apple", "น้อยหน่า"],
  ["green apple", "แอปเปิ้ลเขียว"],
  ["red apple", "แอปเปิ้ลแดง"],
  ["green grape", "องุ่นเขียว"],
  ["green mango", "มะม่วงเขียว"],
  ["fruit tea", "ชาผลไม้"],
  ["hibiscus tea", "ชากระเจี๊ยบ"],
  ["black tea", "ชาดำ"],
  ["peach tea", "ชาพีช"],
  ["kyoho grape", "องุ่นเคียวโฮ"],
  ["honey lemon", "น้ำผึ้งมะนาว"],
  ["jasmine tea", "ชามะลิ"],
  ["oolong tea", "ชาอู่หลง"],
  ["green tea", "ชาเขียว"],
  ["lemon tea", "ชามะนาว"],
  ["milk honey", "นมน้ำผึ้ง"],
  ["milk tea", "ชานม"],
  ["thai tea", "ชาไทย"],
  ["spear mint", "สเปียร์มินต์"],
];

const WORDS: Readonly<Record<string, string>> = {
  grape: "องุ่น",
  strawberry: "สตรอเบอร์รี่",
  watermelon: "แตงโม",
  mint: "มินต์",
  lychee: "ลิ้นจี่",
  cola: "โคล่า",
  peach: "พีช",
  apple: "แอปเปิ้ล",
  lemon: "เลมอน",
  lime: "มะนาว",
  blueberry: "บลูเบอร์รี่",
  tea: "ชา",
  berry: "เบอร์รี่",
  berries: "เบอร์รี่",
  aloe: "อโล",
  mango: "มะม่วง",
  mixberry: "เบอร์รี่รวม",
  pineapple: "สับปะรด",
  banana: "กล้วย",
  bubblegum: "หมากฝรั่ง",
  menthol: "เมนทอล",
  melon: "เมลอน",
  kiwi: "กีวี",
  candy: "ลูกอม",
  orange: "ส้ม",
  soda: "โซดา",
  guava: "ฝรั่ง",
  kyoho: "องุ่นเคียวโฮ",
  tobacco: "ยาสูบ",
  raspberry: "ราสเบอร์รี่",
  cream: "ครีม",
  passion: "เสาวรส",
  oolong: "ชาอู่หลง",
  jasmine: "มะลิ",
  cherry: "เชอร์รี่",
  honeydew: "ฮันนี่ดิว",
  honey: "น้ำผึ้ง",
  yakult: "ยาคูลท์",
  milk: "นม",
  yogurt: "โยเกิร์ต",
  taro: "เผือก",
  matcha: "มัทฉะ",
  coconut: "มะพร้าว",
  chocolate: "ช็อกโกแลต",
  coke: "โค้ก",
  spearmint: "สเปียร์มินต์",
  grapefruit: "เกรปฟรุต",
  mangosteen: "มังคุด",
  blackcurrant: "แบล็กเคอร์แรนต์",
  // 11/11 Friday, from the catalog read-through (thai-copy check pending): words the first table did not have.
  blackberry: "แบล็กเบอร์รี่",
  tangerine: "ส้ม",
  yuzu: "ยูซุ",
  pomegranate: "ทับทิม",
  plum: "พลัม",
  starfruit: "มะเฟือง",
  coffee: "กาแฟ",
  vanilla: "วานิลลา",
  cucumber: "แตงกวา",
  peppermint: "เปปเปอร์มินต์",
  // thai-copy 11/11 second pass
  lemonade: "เลมอนเนด",
  caramel: "คาราเมล",
  cookies: "คุกกี้",
};

/** Words that name the kind of sweet or drink lead the Thai, the flavour follows: "Taro Ice Cream" → "ไอศกรีมเผือก",
 *  "Lemon Candy Mint" → "ลูกอมเลมอน มินต์" (thai-copy 11/11 — "ลูกอมรส…", not "เลมอน ลูกอม"). */
const LEADS: Readonly<Record<string, string>> = { icecream: "ไอศกรีม", custard: "คัสตาร์ด", milkshake: "มิลค์เชค", candy: "ลูกอม" };

/** A word that changes the fruit the rest names ("Blueraz Berry" is blue raspberry, not a berry) — the whole name gets nothing. */
const VETO = new Set(["blueraz", "razz"]);
/** Names whose Thai drink is not confirmed from the maker (thai-copy 11/11: "Red Soda" may be น้ำแดงโซดา) — nothing until it is. */
const VETO_NAMES = new Set(["red soda", "green soda", "red lemon soda"]);

const SKIP = new Set(["ice", "iced", "icy"]);

/** The Thai words for an English flavour name, or null when none of its words is in the tables. A twin-flavour name
 *  "A + B" keeps its " + " (thai-copy 11/11: without it two flavours read as one mix), and gets Thai only when both parts do. */
export function flavorThai(name: string): string | null {
  const parts = name.split(" + ");
  if (parts.length > 1) {
    const each = parts.map(onePart);
    return each.every((x) => x !== null) ? each.join(" + ") : null;
  }
  return onePart(name);
}

function onePart(name: string): string | null {
  const plain = name.toLowerCase().replace(/(ice|iced|icy)/g, " ").replace(/s+/g, " ").trim();
  if (VETO_NAMES.has(plain)) return null;
  const tokens = name
    .toLowerCase()
    .replace(/ice[\s-]+cream/g, "icecream")
    .split(/[\s-]+/)
    .map((w) => w.replace(/[^a-z]/g, ""))
    .filter((w) => w && !SKIP.has(w));
  if (tokens.some((w) => VETO.has(w))) return null;
  const out: string[] = [];
  let lead: string | null = null;
  for (let i = 0; i < tokens.length; ) {
    if (LEADS[tokens[i]]) {
      lead = lead ?? LEADS[tokens[i]];
      i++;
      continue;
    }
    const phrase = PHRASES.find(([p]) => {
      const words = p.split(" ");
      return words.every((w, k) => tokens[i + k] === w);
    });
    if (phrase) {
      out.push(phrase[1]);
      i += phrase[0].split(" ").length;
      continue;
    }
    const word = WORDS[tokens[i]];
    if (word) out.push(word);
    i++;
  }
  const unique = [...new Set(out)];
  if (lead) return lead + unique.join(" ");
  return unique.length > 0 ? unique.join(" ") : null;
}
