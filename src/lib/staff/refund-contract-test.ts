/**
 * Run: npx tsx src/lib/staff/refund-contract-test.ts
 * LINE refunds (refund-rules.ts, owner 10/11 "ทาง 1"): reading the admin's post, tying it to a slip, partial refunds,
 * duplicates, and never guessing. The posts below follow the admin's real layout; names and accounts are made up.
 */
import { applyRefunds, decideRefund, netSatang, parseRefundPost, postForPicture, type SlipFact } from "./refund-rules";
import { dailySales, type SalesSlip } from "./daily-sales-rules";
import { formatRefundReply } from "../line/messages";

let failed = 0;
function check(name: string, ok: boolean, got?: unknown): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || got === undefined ? "" : ` — got ${JSON.stringify(got)}`}`);
  if (!ok) failed++;
}

// --- reading the post
const p1 = parseRefundPost("แจ้งยอดโอนคืนเนื่องจากยกเลิกการสั่ง\n\n340.-\n\n0123456789\nกสิกร\nทดสอบ\n\nMP 05/11/26 : 13.05 #\nLine :  test\n\n@S.MOGz @OKM");
check("amount '340.-' with an account number around it", p1?.amountSatang === 34000, p1);
check("order time from 'MP 05/11/26 : 13.05'", p1?.hintAt === "2026-11-05T13:05:00+07:00", p1);
check("' 750 ฿'", parseRefundPost("แจ้งยอดโอนคืนเนื่องจากยกเลิกการสั่ง\n\n 750 ฿\n\nธ. กสิกร\n0123456700")?.amountSatang === 75000);
check("'ยอด 800 ฿' + account on one line", parseRefundPost("แจ้งยอดโอนคืนเนื่องจากของหมดคลังยกเลิก\n\nยอด 800 ฿\n\nไทยพาณิชย์  8600000000 ทดสอบ")?.amountSatang === 80000);
check("'1,300.-'", parseRefundPost("แจ้งยอดโอนคืนเนื่องจากสินค้าหมดกะทันหัน\n\n1,300.-\n\nกรุงไทย\n6600000000")?.amountSatang === 130000);
check("head on two lines ('แจ้งยอดโอนคืน\\nเนื่องจาก…')", parseRefundPost("แจ้งยอดโอนคืน\nเนื่องจากยกเลิกสินค้า\n\n400.-\n\nICE 06/11/26: 17.59#")?.amountSatang === 40000);
check("'ICE 06/11/26: 17.59#' time", parseRefundPost("แจ้งยอดโอนคืน\n400.-\nICE 06/11/26: 17.59#")?.hintAt === "2026-11-06T17:59:00+07:00");
check("phone '088-6000000' is not an amount", parseRefundPost("แจ้งยอดโอนคืนเนื่องจากลูกค้าโอนมาผิด\n\nยอด 900 ฿\n\nพร้อมเพย์ 088-6000000")?.amountSatang === 90000);
check("account '411-252568-1' is not an amount", parseRefundPost("แจ้งยอดโอนคืน\n411-252568-1\nยอด 400 ฿")?.amountSatang === 40000);
check("two different amounts = none (staff decide)", parseRefundPost("แจ้งยอดโอนคืน\nยอด 2,600 ฿\nคืน 1,300.-")?.amountSatang === null);
check("no amount line = none", parseRefundPost("แจ้งยอดโอนคืน\nเดี๋ยวแจ้งยอดนะคะ")?.amountSatang === null);
check("ordinary chatter is not a refund post", parseRefundPost("ส่งของแล้วนะคะ 350.-") === null);

// --- deciding
const slip = (transRef: string, baht: number, at: string, receiverStatus = "match"): SlipFact => ({ transRef, amountSatang: baht * 100, transferredAt: at, receiverStatus });
const none = () => [] as number[];
const s340 = slip("R340", 340, "2026-11-05T13:02:00+07:00");
check("picture read → matched by ref", decideRefund({ amountSatang: 34000, hintAt: null, slip: s340, matchedOnRef: none, candidates: [] }).status === "matched");
const partial = decideRefund({ amountSatang: 130000, hintAt: null, slip: slip("R2600", 2600, "2026-11-04T08:36:00+07:00"), matchedOnRef: none, candidates: [] });
check("partial refund 1,300 of a 2,600 slip → matched", partial.status === "matched", partial);
check("same amount again on the same slip → duplicate, counted once", decideRefund({ amountSatang: 34000, hintAt: null, slip: s340, matchedOnRef: () => [34000], candidates: [] }).status === "duplicate");
const two = decideRefund({ amountSatang: 100000, hintAt: null, slip: slip("R2600", 2600, "x"), matchedOnRef: () => [130000], candidates: [] });
check("a second, different partial refund that still fits → matched", two.status === "matched", two);
const over = decideRefund({ amountSatang: 140000, hintAt: null, slip: slip("R2600", 2600, "x"), matchedOnRef: () => [130000], candidates: [] });
check("refunds past the slip's amount → unmatched over-slip", over.status === "unmatched" && over.reason === "over-slip", over);
const refundSlip = decideRefund({ amountSatang: 90000, hintAt: null, slip: slip("OUT", 900, "x", "mismatch"), matchedOnRef: none, candidates: [] });
check("picture is the shop's own refund transfer → not-shop-slip", refundSlip.status === "unmatched" && refundSlip.reason === "not-shop-slip", refundSlip);
check("no amount → unmatched, even with a slip", decideRefund({ amountSatang: null, hintAt: null, slip: s340, matchedOnRef: none, candidates: [] }).status === "unmatched");

const hint = "2026-11-05T13:05:00+07:00";
const fb1 = decideRefund({ amountSatang: 34000, hintAt: hint, slip: null, matchedOnRef: none, candidates: [s340, slip("R999", 999, hint)] });
check("unreadable picture, one slip of that amount near the post's time → matched amount-time", fb1.status === "matched" && fb1.matchedBy === "amount-time", fb1);
const fb2 = decideRefund({ amountSatang: 34000, hintAt: hint, slip: null, matchedOnRef: none, candidates: [s340, slip("R340b", 340, "2026-11-05T13:40:00+07:00")] });
check("two such slips → ambiguous, never guessed", fb2.status === "unmatched" && fb2.reason === "ambiguous", fb2);
const fb3 = decideRefund({ amountSatang: 34000, hintAt: hint, slip: null, matchedOnRef: none, candidates: [slip("Rfar", 340, "2026-11-05T16:00:00+07:00")] });
check("only a slip hours away → slip-unreadable", fb3.status === "unmatched" && fb3.reason === "slip-unreadable", fb3);
const fb4 = decideRefund({ amountSatang: 34000, hintAt: null, slip: null, matchedOnRef: none, candidates: [s340] });
check("unreadable picture and no time in the post → no fallback", fb4.status === "unmatched", fb4);
const fb5 = decideRefund({ amountSatang: 34000, hintAt: hint, slip: null, matchedOnRef: () => [34000], candidates: [s340] });
check("fallback skips a slip already refunded", fb5.status === "unmatched", fb5);

// --- pairing a picture with its post
const w = [
  { id: 1, posterHash: "aaa", postedAt: "2026-11-05T14:43:00.000Z" },
  { id: 2, posterHash: "bbb", postedAt: "2026-11-05T14:44:00.000Z" },
];
check("picture goes to the same poster's post", postForPicture(w, "aaa", "2026-11-05T14:45:00.000Z")?.id === 1);
check("a stranger's picture takes no post", postForPicture(w, "ccc", "2026-11-05T14:45:00.000Z") === null);
check("past 15 minutes the post no longer takes a picture", postForPicture(w, "aaa", "2026-11-05T15:00:00.000Z") === null);
check("no user id, two posts waiting → none (never guessed)", postForPicture(w, null, "2026-11-05T14:45:00.000Z") === null);
check("no user id, one post waiting → that post", postForPicture([{ id: 3, posterHash: null, postedAt: "2026-11-05T14:43:00.000Z" }], null, "2026-11-05T14:44:00.000Z")?.id === 3);

// --- sales
check("net: full refund = 0", netSatang(34000, 34000) === 0);
check("net: never below zero", netSatang(34000, 99000) === 0);
check("net: partial", netSatang(260000, 130000) === 130000);
const s = (transRef: string, baht: number, at: string): SalesSlip => ({ transRef, amountSatang: baht * 100, transferredAt: at, receiverStatus: "match" });
const netSlips = applyRefunds([s("A", 2600, "2026-11-04T08:36:00+07:00"), s("B", 800, "2026-11-04T12:34:00+07:00"), s("C", 500, "2026-11-04T15:00:00+07:00")], new Map([["A", 130000], ["B", 99999999]]));
check("applyRefunds: partial leaves the rest, refunded kept", netSlips[0].amountSatang === 130000 && netSlips[0].refundedSatang === 130000, netSlips[0]);
check("applyRefunds: never more than the slip", netSlips[1].amountSatang === 0 && netSlips[1].refundedSatang === 80000, netSlips[1]);
check("applyRefunds: untouched slip has no refundedSatang", netSlips[2].amountSatang === 50000 && netSlips[2].refundedSatang === undefined, netSlips[2]);
const [day] = dailySales(["2026-11-04"], [], netSlips, new Set());
check("day LINE = slips minus their refunds (2,600−1,300 + 800−800 + 500)", day.lineSatang === 180000, day.lineSatang);
check("the refunded slips are still listed", day.slips.length === 3);

// --- the bot's reply carries amounts and a time only
const r1 = formatRefundReply({ status: "matched", transRef: "Aed488eb2bb53466b", matchedBy: "ref" }, 130000, slip("Aed488eb2bb53466b", 2600, "2026-11-04T08:36:00+07:00"));
check("reply: partial refund names both amounts", r1.includes("฿1,300") && r1.includes("฿2,600") && r1.includes("บางส่วน"), r1);
check("reply: no reference or account digits", !/[0-9]{6,}/.test(r1.replace(/[,]/g, "")), r1);
const r2 = formatRefundReply({ status: "unmatched", reason: "ambiguous" }, 34000, null);
check("reply: unmatched says why and where to fix", r2.includes("หลายใบ") && r2.includes("หน้าตรวจสลิป"), r2);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
