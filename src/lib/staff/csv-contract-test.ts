/**
 * OKami24 — staff order export CSV contract (owner 23/10: orders on the shop's own computer, opened in Excel).
 *
 *   1. the file starts with a UTF-8 BOM and uses CRLF rows (Excel on Windows reads Thai only with the BOM);
 *   2. every text field is quoted and inner quotes are doubled — commas and line breaks in an address stay in one cell;
 *   3. a customer-typed field starting with = + - @ cannot run as a formula (CSV injection);
 *   4. phone numbers and postal codes keep their leading zero.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { toCsv } from "./csv";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

const csv = toCsv(["ชื่อ", "เบอร์", "ที่อยู่", "จำนวน"], [
  ["สมชาย \"ใจดี\"", { keepZeros: "0812345678" }, "99/1 ซอย 5,\nแขวงคลองเตย", 2],
  ["=HYPERLINK(\"http://x\")", { keepZeros: "0012" }, "+66 test", null],
]);

check("starts with a UTF-8 BOM", csv.startsWith("﻿"), JSON.stringify(csv.slice(0, 3)));
check("rows end with CRLF", csv.endsWith("\r\n") && csv.split("\r\n").length === 4, JSON.stringify(csv));
check("Thai header is quoted text", csv.includes('"ชื่อ","เบอร์","ที่อยู่","จำนวน"'), csv);
check("inner quotes doubled", csv.includes('"สมชาย ""ใจดี"""'), csv);
check("comma and newline stay inside one quoted cell", csv.includes('"99/1 ซอย 5,\nแขวงคลองเตย"'), csv);
check("phone keeps its leading zero", csv.includes('"=""0812345678"""'), csv);
check("a formula-looking name is defused with a leading quote", csv.includes(`"'=HYPERLINK(""http://x"")"`), csv);
check("a value starting with + is defused", csv.includes(`"'+66 test"`), csv);
check("numbers stay numbers, empty stays empty", csv.includes(",2\r\n") && csv.endsWith(',""\r\n'), JSON.stringify(csv));
check("keepZeros drops anything but letters, digits and dashes", toCsv(["x"], [[{ keepZeros: '08"1);=' }]]).includes('"=""081"""'));

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
