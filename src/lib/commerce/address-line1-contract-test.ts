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

// Checker #1010: a bare name with no anchor, or a name right after a place word, is part of the address — never cut.
const lp = { subdistrict: "จอมพล", district: "ลาดพร้าว", province: "กรุงเทพมหานคร", postalCode: "10900" };
check("street name = district, no anchor", trimLine1("123 ถนน ลาดพร้าว", lp), "123 ถนน ลาดพร้าว");
check("street name = district, anchored run after a place word", trimLine1("123 ถนน ลาดพร้าว 10900", lp), "123 ถนน ลาดพร้าว");
check("soi name = district", trimLine1("7 ซอย บางกะปิ", { ...lp, district: "บางกะปิ" }), "7 ซอย บางกะปิ");
check("market name = district", trimLine1("88 ตลาดสด คลองเตย", bkk), "88 ตลาดสด คลองเตย");
check("condo name = province", trimLine1("99 คอนโด เชียงใหม่", { subdistrict: "สุเทพ", district: "เมืองเชียงใหม่", province: "เชียงใหม่", postalCode: "50200" }), "99 คอนโด เชียงใหม่");
check("village name = sub-district", trimLine1("12 หมู่ 5 หนองบัว", { subdistrict: "หนองบัว", district: "เมือง", province: "อุดรธานี", postalCode: "41000" }), "12 หมู่ 5 หนองบัว");
check("short word inside a province name", trimLine1("15 หมู่บ้าน ใหม่", { subdistrict: "สุเทพ", district: "เมืองเชียงใหม่", province: "เชียงใหม่", postalCode: "50200" }), "15 หมู่บ้าน ใหม่");
check("short word inside a district name", trimLine1("5 หมู่บ้าน ศรี", { subdistrict: "สุรศักดิ์", district: "ศรีราชา", province: "ชลบุรี", postalCode: "20110" }), "5 หมู่บ้าน ศรี");
check("unanchored tail word", trimLine1("77 ศรีสุข บุรี", { subdistrict: "ท่าหิน", district: "เมืองลพบุรี", province: "ลพบุรี", postalCode: "15000" }), "77 ศรีสุข บุรี");
check("temple word", trimLine1("4 วัด พระ", { subdistrict: "บางนา", district: "พระโขนง", province: "กรุงเทพมหานคร", postalCode: "10260" }), "4 วัด พระ");
check("soi + district word", trimLine1("ซอย เมือง", nsw), "ซอย เมือง");

// Owner 30/10 "ตรวจเรื่องที่อยู่ซ้ำ": short Bangkok, a country word at the end, a glued postcode.
const bn = { subdistrict: "บางนาใต้", district: "บางนา", province: "กรุงเทพมหานคร", postalCode: "10260" };
check("Bangkok written กทม.", trimLine1("55/1 ซอยอุดมสุข แขวงบางนาใต้ เขตบางนา กทม. 10260", bn), "55/1 ซอยอุดมสุข");
check("Bangkok written กรุงเทพฯ", trimLine1("55/1 ซอยอุดมสุข แขวงบางนาใต้ เขตบางนา กรุงเทพฯ", bn), "55/1 ซอยอุดมสุข");
check("a street named กรุงเทพ stays (after a place word)", trimLine1("9 ถนน กรุงเทพ", bn), "9 ถนน กรุงเทพ");
check("กทม. alone, no anchor, stays", trimLine1("9 ซอย 5 กทม.", bn), "9 ซอย 5 กทม.");
const pk = { subdistrict: "ป่าตอง", district: "กะทู้", province: "ภูเก็ต", postalCode: "83150" };
check("country word at the end", trimLine1("99/1 ม.5 ต.ป่าตอง อ.กะทู้ จ.ภูเก็ต 83150 ประเทศไทย", pk), "99/1 ม.5");
check("postcode glued to the province", trimLine1("99/1 ม.5 ต.ป่าตอง อ.กะทู้ ภูเก็ต83150", pk), "99/1 ม.5");
check("glued postcode on a street name stays whole (checker #1030)", trimLine1("12 ม.5 ถนน ภูเก็ต83150", pk), "12 ม.5 ถนน ภูเก็ต83150");
check("glued postcode on a street name, boxes before it", trimLine1("12 ถนน ภูเก็ต83150", pk), "12 ถนน ภูเก็ต83150");
check("country word alone stays",trimLine1("99/1 ม.5 ประเทศไทย", pk), "99/1 ม.5 ประเทศไทย");
check("a number ending in the postcode digits stays", trimLine1("ห้อง 183150", pk), "ห้อง 183150");

if (failed) {
  console.log(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\naddress-line1 contract: all checks passed");
