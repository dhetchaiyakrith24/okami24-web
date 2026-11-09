import { PendingButton } from "@/app/staff/_components/PendingButton";
import { formatSatang, formatShortDateTime } from "@/app/staff/_components/format";
import { REASON_TH, type RefundReason } from "@/lib/staff/refund-rules";
import type { RefundRow } from "@/lib/staff/refunds";
import { addRefundAction, matchRefundAction, undoRefundAction } from "@/app/staff/slip/refund-actions";

/**
 * LINE refunds on /staff/slip (owner 10/11 "ทาง 1"): what the bot tied to a slip from the refund group, what it could not,
 * and two ways to fix it by hand — match by the end of the slip's reference (as /staff/sales prints it), or add a refund
 * that was never posted. Undo puts the money back into sales. No customer name or account is shown or kept.
 */

const ERROR_TH: Record<string, string> = {
  "error:short": "ใส่เลขอ้างอิงท้ายสลิปอย่างน้อย 6 ตัว",
  "error:none": "ไม่พบสลิปที่ลงท้ายด้วยเลขนี้ในระบบ",
  "error:many": "เลขนี้ตรงกับสลิปหลายใบ ใส่ให้ยาวขึ้น",
  "error:no-amount": "ใส่ยอดคืนเป็นตัวเลข",
};

function resultText(result: string | undefined): { text: string; good: boolean } | null {
  if (!result) return null;
  if (result === "matched") return { text: "บันทึกคืนเงินแล้ว ยอดขาย LINE หักให้แล้ว", good: true };
  if (result === "duplicate") return { text: "คืนเงินยอดนี้ของสลิปนี้มีอยู่แล้ว ไม่นับซ้ำ", good: true };
  if (result === "undone") return { text: "ยกเลิกการจับคู่แล้ว ยอดกลับเข้ายอดขาย", good: true };
  if (result.startsWith("unmatched:")) return { text: `ยังจับคู่ไม่ได้ — ${REASON_TH[result.slice(10) as RefundReason] ?? result}`, good: false };
  return { text: ERROR_TH[result] ?? "ทำไม่สำเร็จ ลองใหม่", good: false };
}

const STATUS_TH = { waiting: "รอรูปสลิป", matched: "หักแล้ว", unmatched: "ยังไม่จับคู่", duplicate: "ซ้ำ ไม่นับ", undone: "ยกเลิกแล้ว" } as const;
const FIELD = "min-h-11 rounded-lg border border-surface-border bg-surface-2 px-3 text-sm text-foreground";
const BUTTON = "min-h-11 rounded-full border border-surface-border px-4 text-sm text-foreground transition-colors hover:border-foreground-dim";

export function RefundList({ rows, result }: { rows: RefundRow[]; result?: string }) {
  const note = resultText(result);
  const open = rows.filter((r) => r.status === "unmatched").length;
  return (
    <section id="refunds" aria-label="คืนเงินลูกค้า LINE" className="flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-foreground">คืนเงินลูกค้า LINE</h2>
        <p className="text-sm leading-relaxed text-foreground-muted">
          บอทอ่านโพสต์ &ldquo;แจ้งยอดโอนคืน&rdquo; ในกลุ่มแจ้งคืนเงิน แล้วจับคู่กับสลิปของลูกค้าให้เอง · ยอดที่คืนจะหักออกจากยอดขาย LINE ของวันที่ลูกค้าโอน
        </p>
        {open > 0 && <p className="text-sm text-unverified">ยังไม่จับคู่ {open} รายการ — ใส่เลขอ้างอิงท้ายสลิปของลูกค้า (ดูได้ในหน้ายอดขาย)</p>}
        {note && <p className={`text-sm ${note.good ? "text-verified" : "text-danger"}`}>{note.text}</p>}
      </div>

      {rows.length > 0 && (
        <ul className="flex flex-col divide-y divide-surface-border-soft">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-col gap-2 py-3 first:pt-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold tabular-nums text-foreground">คืน {r.amountSatang === null ? "—" : formatSatang(r.amountSatang)}</span>
                  <span className="text-xs text-foreground-dim">
                    {r.source === "line" ? "จากกลุ่ม LINE" : "ทีมงานลงเอง"} · {formatShortDateTime(r.postedAt)}
                  </span>
                </span>
                <span className={`shrink-0 text-sm ${r.status === "matched" ? "text-verified" : r.status === "unmatched" ? "text-unverified" : "text-foreground-muted"}`}>
                  {STATUS_TH[r.status]}
                </span>
              </div>
              {r.slip && (
                <p className="text-xs tabular-nums text-foreground-muted">
                  สลิปลูกค้า {formatShortDateTime(r.slip.transferredAt)} · {formatSatang(r.slip.amountSatang)} · อ้างอิง …{r.slip.transRef.slice(-6)}
                </p>
              )}
              {r.status === "unmatched" && r.reason && <p className="text-xs text-unverified">{REASON_TH[r.reason]}</p>}
              {r.status === "unmatched" && r.amountSatang !== null && (
                <form action={matchRefundAction} className="flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <input name="ref" required minLength={6} maxLength={40} placeholder="เลขอ้างอิงท้ายสลิป" aria-label="เลขอ้างอิงท้ายสลิปของลูกค้า" className={`${FIELD} w-44`} />
                  <PendingButton className={BUTTON} pendingText="กำลังจับคู่…">
                    จับคู่
                  </PendingButton>
                </form>
              )}
              {(r.status === "matched" || r.status === "duplicate") && (
                <form action={undoRefundAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <PendingButton className="min-h-11 text-sm text-foreground-dim underline-offset-4 hover:text-foreground hover:underline" pendingText="กำลังยกเลิก…">
                    ยกเลิกการจับคู่
                  </PendingButton>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}

      <details className="group">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm text-foreground-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
          ลงคืนเงินเอง (ไม่ได้โพสต์ในกลุ่ม หรือรายการย้อนหลัง)
          <span aria-hidden className="transition-transform group-open:rotate-90">
            ›
          </span>
        </summary>
        <form action={addRefundAction} className="flex flex-wrap gap-2 pt-2">
          <input name="amount" required inputMode="decimal" placeholder="ยอดคืน (บาท)" aria-label="ยอดคืนเป็นบาท" className={`${FIELD} w-32`} />
          <input name="ref" required minLength={6} maxLength={40} placeholder="เลขอ้างอิงท้ายสลิป" aria-label="เลขอ้างอิงท้ายสลิปของลูกค้า" className={`${FIELD} w-44`} />
          <PendingButton className={BUTTON} pendingText="กำลังบันทึก…">
            บันทึกคืนเงิน
          </PendingButton>
        </form>
      </details>
    </section>
  );
}
