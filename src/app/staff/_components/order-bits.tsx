import type { SlipVerdict } from "@/lib/commerce/slip-decision";

export { formatBaht, formatDateTime } from "@/app/staff/_components/format";

const VERDICT: Record<SlipVerdict, { label: string; className: string }> = {
  pass: { label: "✅ สลิปผ่าน", className: "border-verified/40 bg-verified/10 text-verified" },
  check: { label: "⚠️ สลิปต้องดูเอง", className: "border-unverified/50 bg-unverified/10 text-unverified" },
  unchecked: { label: "⏳ สลิปยังไม่ได้ตรวจ", className: "border-surface-border text-foreground-muted" },
};

/** The slip verdict as a small badge — same colours as the slip-check page. */
export function VerdictBadge({ verdict }: { verdict: SlipVerdict }) {
  const v = VERDICT[verdict];
  return <span className={`rounded-full border px-2 py-0.5 ${v.className}`}>{v.label}</span>;
}

export const REASON_LABEL: Record<string, string> = {
  "receiver-mismatch": "เงินเข้าบัญชีอื่น ไม่ใช่บัญชีร้าน",
  "receiver-unclear": "ดูบัญชีผู้รับไม่ชัด",
  "amount-mismatch": "ยอดในสลิปไม่ตรงยอดออเดอร์",
  "seen-before": "สลิปนี้เคยตรวจแล้ว",
};
