// Pure (no I/O) so the contract test can run it under plain tsx — same convention as customer-note.ts.
import { UNSAFE_CHARS } from "./customer-note";

/** Longest message staff may write to the customer on the order page (owner 24/10: "กล่องข้อความแจ้งรายละเอียดจากแอดมิน"). */
export const ORDER_MESSAGE_MAX = 600;

/**
 * A message from the shop to the customer, made safe to store: control and invisible characters out, each line trimmed with
 * runs of spaces folded, at most one blank line in a row (a message may have short paragraphs), cut at 600 characters.
 * Shorter than 3 characters after cleaning = null (nothing worth showing). React escapes it on the order page.
 */
export function cleanOrderMessage(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const lines = raw
    .split(/\r\n|\r|\n/)
    .map((line) => line.replace(UNSAFE_CHARS, " ").replace(/\s+/g, " ").trim());
  const text = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  if (Array.from(text).length < 3) return null;
  return Array.from(text).slice(0, ORDER_MESSAGE_MAX).join("").trim();
}
