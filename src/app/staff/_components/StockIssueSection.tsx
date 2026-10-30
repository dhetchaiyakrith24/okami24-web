import { staffStockAction } from "@/app/staff/actions";
import { canOpenStockIssue, stockIssueStage } from "@/lib/commerce/stock-issue-rules";
import type { StaffOrderDetail } from "@/lib/staff/orders";
import { formatBaht, formatDateTime } from "@/app/staff/_components/order-bits";
import { RefundSlipUpload } from "@/app/staff/_components/RefundSlipUpload";
import { PendingButton } from "@/app/staff/_components/PendingButton";

/**
 * "สินค้าหมดหลังลูกค้าโอน" on /staff/orders/<n> (cart UX batch E, owner 24/10). Staff tick the lines that are out → the
 * customer's order page offers a same-price swap or a refund → staff carry it out here. Nothing here moves money:
 * the refund is made in the bank app first, then recorded with its reference.
 * Owner 26/10 ("ส่งข้อความถึงลูกค้าก็ดูจะมีถึง 2 ข้อ"): no message or note fields of its own any more — staff write to the
 * customer in the page's one "ลูกค้า" box — and folded shut until an order actually has a stock problem.
 */

const button = "rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong";
const ghost = "rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-foreground-muted hover:text-foreground";
const input = "rounded-md border border-surface-border bg-surface-2 px-3 py-2.5 text-base text-foreground";

const lineName = (l: { productName: string; variantLabel: string | null; quantity: number }) =>
  `${l.productName}${l.variantLabel ? ` · ${l.variantLabel}` : ""} × ${l.quantity}`;

function OpenForm({ order, again }: { order: StaffOrderDetail; again: boolean }) {
  const marked = new Set(order.stockIssue?.outLines.map((l) => l.itemId) ?? []);
  return (
    <form action={staffStockAction} className="flex flex-col gap-3">
      <input type="hidden" name="orderNumber" value={order.orderNumber} />
      <input type="hidden" name="step" value="open" />
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-foreground-muted">ติ๊กสินค้าที่หมด</legend>
        {order.itemLines.map((l) => (
          <label key={l.itemId} className="flex items-start gap-2 text-foreground">
            <input type="checkbox" name="itemId" value={l.itemId} defaultChecked={marked.has(l.itemId)} className="mt-1" />
            <span>{lineName(l)}</span>
          </label>
        ))}
      </fieldset>
      <PendingButton className={again ? `${ghost} self-start` : `${button} self-start`}>
        {again ? "แจ้งใหม่ (ให้ลูกค้าเลือกอีกครั้ง)" : "แจ้งลูกค้าว่าสินค้าหมด"}
      </PendingButton>
      <p className="text-xs text-foreground-dim">
        ลูกค้าจะเห็นในหน้าออเดอร์: เปลี่ยนเป็นสินค้าที่มีของราคาเท่ากัน หรือรับเงินคืน — โทรหรือทัก LINE บอกลูกค้าด้วย
      </p>
    </form>
  );
}

function RefundForm({ order }: { order: StaffOrderDetail }) {
  return (
    <form action={staffStockAction} className="flex flex-col gap-2 border-t border-surface-border-soft pt-3">
      <input type="hidden" name="orderNumber" value={order.orderNumber} />
      <input type="hidden" name="step" value="refunded" />
      <label className="flex flex-col gap-1 text-foreground-muted">
        โอนคืนแล้ว — เลขอ้างอิงจากแอปธนาคาร
        <input name="ref" required minLength={4} maxLength={60} autoComplete="off" className={input} />
      </label>
      <PendingButton className={`${button} self-start`} pendingText="กำลังบันทึก…">
        บันทึกว่าคืนเงินแล้ว
      </PendingButton>
      <p className="text-xs text-foreground-dim">บันทึกแล้วแนบรูปสลิปโอนคืนต่อได้ทันที — ลูกค้าจะเห็นสลิปในหน้าออเดอร์</p>
    </form>
  );
}

/** `asRow`: drawn as one row of the staff order page's folded card (staff redesign 26/10, queue B3) instead of a card of
 *  its own — used while nothing is open, or once the problem is settled. An open problem is always its own card, on top. */
export function StockIssueSection({ order, asRow = false }: { order: StaffOrderDetail; asRow?: boolean }) {
  const issue = order.stockIssue;
  const open = canOpenStockIssue(order.status);
  if (!issue && !open) return null;

  const box = "flex flex-col gap-3 rounded-xl border bg-surface-1 p-5 text-sm";
  if (!issue) {
    return asRow ? (
      <details className="group">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm text-foreground hover:bg-surface-2 sm:px-5 [&::-webkit-details-marker]:hidden">
          <span>สินค้าหมดหลังลูกค้าโอน</span>
          <span aria-hidden className="text-foreground-dim transition-transform group-open:rotate-90">›</span>
        </summary>
        <div className="px-4 pb-4 text-sm sm:px-5">
          <OpenForm order={order} again={false} />
        </div>
      </details>
    ) : (
      <details className={`${box} border-surface-border-soft`}>
        <summary className="cursor-pointer text-sm font-semibold text-foreground-muted hover:text-foreground">สินค้าหมดหลังลูกค้าโอน</summary>
        <OpenForm order={order} again={false} />
      </details>
    );
  }

  const stage = stockIssueStage(issue);
  return (
    <section
      className={
        asRow ? "flex flex-col gap-3 px-4 py-4 text-sm sm:px-5" : `${box} ${stage === "resolved" ? "border-surface-border-soft" : "border-unverified/50"}`
      }
    >
      <h2 className="text-base font-semibold text-foreground">สินค้าหมดหลังลูกค้าโอน</h2>
      <p className="text-foreground-muted">แจ้งเมื่อ {formatDateTime(issue.openedAt)}{issue.staffNote ? ` — ${issue.staffNote}` : ""}</p>
      {issue.resolution === "swapped" && issue.swap ? (
        // The order lines now hold the new items — show what changed from the customer's recorded choice.
        <ul className="list-disc pl-5 text-foreground">
          {issue.swap.map((p) => (
            <li key={p.itemId}>
              {p.fromLabel ?? "?"} → {p.name}
              {p.variantLabel ? ` · ${p.variantLabel}` : ""}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="list-disc pl-5 text-foreground">
          {issue.outLines.map((l) => (
            <li key={l.itemId}>{lineName(l)}</li>
          ))}
        </ul>
      )}

      {stage === "waiting-choice" && (
        <p className="text-foreground">
          รอลูกค้าเลือกในหน้าออเดอร์ · ถ้าลูกค้าบอกทางโทรศัพท์หรือ LINE ว่าขอเงินคืน โอนคืน {formatBaht(issue.refund.amount)} แล้วบันทึกด้านล่างได้เลย
        </p>
      )}

      {stage === "chosen" && issue.choice === "swap" && issue.swap && (
        <form action={staffStockAction} className="flex flex-col gap-2">
          <input type="hidden" name="orderNumber" value={order.orderNumber} />
          <input type="hidden" name="step" value="swap" />
          <p className="font-semibold text-foreground">ลูกค้าเลือกเปลี่ยนสินค้า ({formatDateTime(issue.chosenAt ?? issue.openedAt)})</p>
          <ul className="list-disc pl-5 text-foreground">
            {issue.swap.map((p) => (
              <li key={p.itemId}>
                {p.fromLabel ?? "?"} → {p.name}
                {p.variantLabel ? ` · ${p.variantLabel}` : ""}
              </li>
            ))}
          </ul>
          <p className="text-xs text-foreground-dim">เช็คของจริงที่คลังก่อนกด — กดแล้วรายการในออเดอร์และข้อความส่งคลังเปลี่ยนตาม ยอดเงินเท่าเดิม</p>
          <PendingButton className={`${button} self-start`}>ยืนยันเปลี่ยนสินค้าในออเดอร์</PendingButton>
        </form>
      )}

      {stage === "chosen" && issue.choice === "refund" && (
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-foreground">ลูกค้าเลือกรับเงินคืน ({formatDateTime(issue.chosenAt ?? issue.openedAt)})</p>
          <p className="text-foreground">
            {issue.refundBankAccount ? (
              <>
                โอนคืน {formatBaht(issue.refund.amount)} เข้าบัญชี <span className="font-semibold">{issue.refundBankAccount.bank}</span>{" "}
                {issue.refundBankAccount.branch && (
                  <>
                    สาขา <span className="font-semibold">{issue.refundBankAccount.branch}</span>{" "}
                  </>
                )}
                เลขที่{" "}
                <span className="select-all font-semibold">{issue.refundBankAccount.account}</span>
              </>
            ) : (
              <>
                โอนคืน {formatBaht(issue.refund.amount)} เข้าพร้อมเพย์ <span className="select-all font-semibold">{issue.refundPromptPay}</span>
              </>
            )}
          </p>
          {/* Anyone holding the order link can type another number (checker #802) — staff check the receiver name first. */}
          {(issue.refundBankAccount || (issue.refundPromptPay && issue.refundPromptPay !== order.customerPhone)) && (
            <p className="text-unverified">ไม่ใช่เบอร์ที่ใช้สั่ง (หรือเป็นเลขบัญชี) — ก่อนโอนเช็คว่าชื่อบัญชีปลายทางตรงกับชื่อลูกค้า ({order.shippingAddress.recipientName})</p>
          )}
          <p className="text-xs text-foreground-dim">
            {issue.refund.wholeOrder ? "สินค้าหมดทุกรายการ — บันทึกแล้วออเดอร์จะถูกยกเลิก" : "คืนเฉพาะรายการที่หมด (ค่าส่งไม่คืน) — รายการที่เหลือส่งตามปกติ"}
          </p>
        </div>
      )}

      {stage !== "resolved" && <RefundForm order={order} />}

      {stage === "resolved" && (
        <p className="text-foreground">
          {issue.resolution === "swapped"
            ? `เปลี่ยนสินค้าแล้ว ${formatDateTime(issue.resolvedAt ?? "")}`
            : `คืนเงิน ${formatBaht(issue.refund.amount)} แล้ว ${formatDateTime(issue.resolvedAt ?? "")} · เลขอ้างอิง ${issue.refundRef ?? "—"}`}
        </p>
      )}

      {/* Owner 26/10 evening (queue B4): the bank's refund slip, shown to the customer under "คืนเงินแล้ว". */}
      {issue.resolution === "refunded" && (
        <div className="flex flex-col gap-2 border-t border-surface-border-soft pt-3">
          {issue.refundSlipAt ? (
            <>
              <p className="text-foreground-muted">สลิปโอนคืน (ลูกค้าเห็นในหน้าออเดอร์) · แนบเมื่อ {formatDateTime(issue.refundSlipAt)}</p>
              <a href={`/staff/orders/${encodeURIComponent(order.orderNumber)}/refund-slip`} target="_blank" rel="noopener" className="self-start">
                {/* eslint-disable-next-line @next/next/no-img-element -- private picture behind the staff session, not an optimisable asset */}
                <img
                  src={`/staff/orders/${encodeURIComponent(order.orderNumber)}/refund-slip?v=${encodeURIComponent(issue.refundSlipAt)}`}
                  alt="สลิปโอนคืน"
                  className="max-h-72 w-auto rounded-md border border-surface-border-soft object-contain"
                />
              </a>
            </>
          ) : (
            <p className="font-semibold text-foreground">แนบสลิปโอนคืน — ลูกค้าจะเห็น &quot;คืนเงินแล้ว&quot; พร้อมสลิปในหน้าออเดอร์</p>
          )}
          <RefundSlipUpload orderNumber={order.orderNumber} hasSlip={issue.refundSlipAt !== null} />
        </div>
      )}

      {open && issue.resolution !== "refunded" && (
        <details className="border-t border-surface-border-soft pt-3">
          <summary className="cursor-pointer text-foreground-muted">แจ้งใหม่ / เปลี่ยนรายการที่หมด</summary>
          <div className="pt-3">
            <OpenForm order={order} again />
          </div>
        </details>
      )}
    </section>
  );
}
