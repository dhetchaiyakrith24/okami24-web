/**
 * Contract test for address-line1.ts (owner 29/10: Shipnity showed order C159's address twice).
 * Run: npx tsx src/lib/commerce/address-line1-contract-test.ts
 */
import { trimLine1 } from "./address-line1";

let failed = 0;
function check(name: string, got: string, want: string) {
  if (got === want) console.log(`PASS  ${name}`);
  else {
    failed++;
    console.log(`FAIL  ${name} — got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
  }
}

const nsw = { subdistrict: "นครสวรรค์ตก", district: "เมืองนครสวรรค์", province: "นครสวรรค์", postalCode: "60000" };
check(
  "C159: the whole address typed into line 1",
  trimLine1("หอพักพนาสวรรค์ , 609/6 ตำบลนครสวรรค์ตก อำเภอเมืองนครสวรรค์ นครสวรรค์ 60000", nsw),
  "หอพักพนาสวรรค์ , 609/6",
);
check(
  "boxes typed with their prefixes, province box mistyped",
  trimLine1("หอพักพนาสวรรค์ , 609/6 ตำบลนครสวรรค์ตก อำเภอเมืองนครสวรรค์ นครสวรรค์ 60000", {
    subdistrict: "ต.นครสวรรค์ตก",
    district: "อำเภอเมืองนครสวรรค์",
    province: "นครนครสวรรค์",
    postalCode: "60000",
  }),
  "หอพักพนาสวรรค์ , 609/6",
);
check("short forms + split prefix words", trimLine1("12/3 ม.4 ถ.สุขุมวิท ต. นครสวรรค์ตก อ. เมืองนครสวรรค์ จ. นครสวรรค์", nsw), "12/3 ม.4 ถ.สุขุมวิท");
check("a normal line 1 is untouched", trimLine1("99/1 หมู่ 2 ซอยร่วมใจ ถนนพหลโยธิน", nsw), "99/1 หมู่ 2 ซอยร่วมใจ ถนนพหลโยธิน");
check("a street named like the province stays", trimLine1("45 ถนนนครสวรรค์", nsw), "45 ถนนนครสวรรค์");
check("only a repeat in the middle stays (end-anchored)", trimLine1("นครสวรรค์ทาวเวอร์ ห้อง 5", nsw), "นครสวรรค์ทาวเวอร์ ห้อง 5");
check("never empties the line", trimLine1("นครสวรรค์ 60000", nsw), "นครสวรรค์");
check("trailing comma and spaces", trimLine1("8 ซอย 3, นครสวรรค์ตก, 60000 ", nsw), "8 ซอย 3");
const bkk = { subdistrict: "แขวงคลองเตย", district: "เขตคลองเตย", province: "กรุงเทพมหานคร", postalCode: "10110" };
check("Bangkok แขวง/เขต", trimLine1("1 อาคารเอ ชั้น 3 แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110", bkk), "1 อาคารเอ ชั้น 3");

if (failed) {
  console.log(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\naddress-line1 contract: all checks passed");
