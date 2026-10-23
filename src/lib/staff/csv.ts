/**
 * CSV that opens straight in Excel with Thai intact (owner 23/10: "เขียนลงคอมได้มั้ยเป็นไฟล์ Excel … ให้เปิดดูข้อมูลออเดอร์และ
 * ประวัติการสั่งของลูกค้า"). Pure — no database, so the contract test can run it under plain tsx.
 *
 *   - UTF-8 with a BOM and CRLF rows: Excel on Windows reads Thai only with the BOM;
 *   - every field is quoted, inner quotes doubled;
 *   - a text field that starts with = + - @ (or a tab / carriage return) gets a leading ' so Excel never runs it as a
 *     formula (CSV injection — names and addresses are typed by customers);
 *   - `keepZeros` values (phone numbers, postal codes, order numbers) are written as ="0812…" so Excel keeps the
 *     leading zero instead of turning them into numbers.
 */

export type CsvCell = string | number | null | undefined | { keepZeros: string };

function cell(value: CsvCell): string {
  if (value === null || value === undefined) return '""';
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : '""';
  if (typeof value === "object") return `"=""${value.keepZeros.replace(/[^0-9A-Za-z\-]/g, "")}"""`;
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function toCsv(header: string[], rows: CsvCell[][]): string {
  return "﻿" + [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}
