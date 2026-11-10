/**
 * T2-32 — src/lib/flavor-thai.ts: thai-copy's matching traps hold, and every Thai word the tables can show is spelled once.
 *
 *   npx tsx src/lib/flavor-thai-contract-test.ts          # the checks
 *   npx tsx src/lib/flavor-thai-contract-test.ts --list   # every catalog flavour name → its Thai words (for a read-through)
 */
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { flavorThai } from "@/lib/flavor-thai";

const FLAVOR_AXIS = /flav/i;

function catalogFlavorNames(): string[] {
  const names = new Set<string>();
  for (const p of allProducts) for (const v of p.flavorVariants ?? []) names.add(v.name);
  for (const p of getPublishedProducts()) {
    if (!p.optionAxisCode || !FLAVOR_AXIS.test(p.optionAxisCode)) continue;
    for (const v of p.variants) names.add(v.label);
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}

export function runFlavorThaiContractTests() {
  const results: { name: string; passed: boolean; detail: string }[] = [];
  const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });
  const cases: [string, string | null][] = [
    ["Mango", "มะม่วง"],
    ["Pineapple Bubblegum", "สับปะรด หมากฝรั่ง"],
    ["Grapefruit", "เกรปฟรุต"],
    ["Mangosteen Ice", "มังคุด"],
    ["Spearmint", "สเปียร์มินต์"],
    ["Honeydew Melon", "ฮันนี่ดิว เมลอน"],
    ["Watermelon Ice", "แตงโม"],
    ["Blueberry Raspberry", "บลูเบอร์รี่ ราสเบอร์รี่"],
    ["Guava Kiwi Passion Fruit", "ฝรั่ง กีวี เสาวรส"],
    ["Lemon Ice Tea", "ชามะนาว"],
    ["Oolong Ice Tea", "ชาอู่หลง"],
    ["Iced Jasmine Green Tea", "ชาเขียวมะลิ"],
    ["Taro Ice Cream", "ไอศกรีมเผือก"],
    ["Strawberry Ice-Cream", "ไอศกรีมสตรอเบอร์รี่"],
    ["Vanilla Ice Cream", "ไอศกรีมวานิลลา"],
    ["Kyoho Grape", "องุ่นเคียวโฮ"],
    ["Strawberry Milkshake", "สตรอเบอร์รี่"],
    ["Peach Strawberry 50mg", "พีช สตรอเบอร์รี่"],
    ["Blue Ice", null],
    ["Riviera Pearl", null],
  ];
  for (const [en, th] of cases) {
    const got = flavorThai(en);
    check(`"${en}" → ${th === null ? "nothing" : `"${th}"`}`, got === th, `got ${JSON.stringify(got)}`);
  }
  const names = catalogFlavorNames();
  const glossed = names.filter((n) => flavorThai(n) !== null);
  check("the catalog has flavour names, and most get Thai words", names.length > 0 && glossed.length * 2 > names.length, `${glossed.length} of ${names.length}`);
  return results;
}

if (require.main === module) {
  if (process.argv.includes("--list")) {
    for (const n of catalogFlavorNames()) console.log(`${n}\t${flavorThai(n) ?? "—"}`);
    process.exit(0);
  }
  const results = runFlavorThaiContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
