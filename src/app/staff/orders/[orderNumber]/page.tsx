import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { orderStatusLabel } from "@/lib/commerce/order-status";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { availableActions, STAFF_ACTIONS } from "@/lib/staff/order-actions";
import { getStaffOrder } from "@/lib/staff/orders";
import { CARRIER_IDS, CARRIERS } from "@/lib/commerce/carriers";
import { staffMessageAction, staffOrderAction } from "@/app/staff/actions";
import { customerMessagesFor } from "@/lib/commerce/order-messages";
import { CopyBlock } from "@/app/staff/_components/CopyBlock";
import { StockIssueSection } from "@/app/staff/_components/StockIssueSection";
import { formatBaht, formatDateTime, historyNoteTh, REASON_LABEL, VerdictBadge } from "@/app/staff/_components/order-bits";

/**
 * /staff/orders/<n> — one web order for staff (cart round 22/10): everything needed to check the payment and send it
 * to the warehouse, and the buttons that move it on. The customer's order page follows every change.
 *
 * Layout (owner 26/10: "หัวข้อมันซ้ำซ้อน และเยอะเกินไป … ไม่รก เรียบง่าย หัวข้อสำคัญอยู่ครบ"): four cards in working order —
 * payment · items (+ the warehouse text) · customer (address, their note, the ONE message box) · next step — and the rarely
 * used parts folded: cancel, out of stock after payment, history.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ออเดอร์ (ทีมงาน)",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const ERROR_TEXT: Record<string, string> = {
  "not-allowed": "ทำขั้นนี้กับออเดอร์สถานะนี้ไม่ได้ (อาจมีคนกดไปก่อนแล้ว) — โหลดหน้าใหม่ดูสถานะล่าสุด",
  tracking: "เลขพัสดุไม่ถูกต้อง — ใส่ตัวอักษรอังกฤษ ตัวเลข หรือขีด 6–40 ตัว",
  carrier: "เลือกขนส่งก่อน (ไปรษณีย์ไทย หรือ Flash Express) — ลูกค้าจะเห็นชื่อขนส่งและปุ่มเช็คสถานะพัสดุ",
  message: "เขียนข้อความถึงลูกค้าอย่างน้อย 3 ตัวอักษร — ลูกค้าจะเห็นในหน้าออเดอร์ (ยกเลิกต้องบอกลูกค้าว่าเพราะอะไร)",
  "not-found": "ไม่พบออเดอร์นี้",
};

const DONE_TEXT: Record<string, string> = {
  confirm: "บันทึกแล้ว: ยืนยันยอดเงิน",
  "to-warehouse": "บันทึกแล้ว: ส่งรายการให้คลัง",
  ship: "บันทึกแล้ว: ส่งของแล้ว ลูกค้าเห็นขนส่ง เลขพัสดุ และปุ่มเช็คสถานะในหน้าออเดอร์",
  complete: "บันทึกแล้ว: ลูกค้าได้รับของ",
  cancel: "บันทึกแล้ว: ยกเลิกออเดอร์ ลูกค้าเห็นเหตุผลในหน้าออเดอร์",
  message: "ส่งข้อความแล้ว: ลูกค้าเห็นในหน้าออเดอร์ — ถ้าเรื่องด่วน โทรหรือทัก LINE บอกลูกค้าด้วย",
  "stock-open": "บันทึกแล้ว: ลูกค้าจะเห็นในหน้าออเดอร์ให้เลือกเปลี่ยนสินค้าหรือรับเงินคืน — โทรหรือทัก LINE บอกลูกค้าด้วย",
  "stock-swap": "บันทึกแล้ว: เปลี่ยนสินค้าในออเดอร์แล้ว — ข้อความส่งคลังในกล่องสินค้าเป็นรายการใหม่",
  "stock-refunded": "บันทึกแล้ว: คืนเงินแล้ว ลูกค้าเห็นในหน้าออเดอร์",
};

const STOCK_ERROR_TEXT: Record<string, string> = {
  "stock-not-allowed": "ทำขั้นนี้ไม่ได้ (สถานะเปลี่ยนไปแล้ว หรือมีคนกดไปก่อน) — โหลดหน้าใหม่ดูสถานะล่าสุด",
  "stock-no-lines": "ติ๊กเลือกสินค้าที่หมดอย่างน้อย 1 รายการ",
  "stock-swap-invalid": "สินค้าที่ลูกค้าเลือกหมดหรือราคาเปลี่ยนแล้ว — กด \"แจ้งใหม่\" ให้ลูกค้าเลือกอีกครั้ง",
  "stock-refund-ref": "ใส่เลขอ้างอิงการโอนจากแอปธนาคาร (ตัวอักษรอังกฤษ ตัวเลข 4–60 ตัว)",
  "stock-not-found": "ไม่พบออเดอร์นี้",
};

const button =
  "rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong";
const input = "rounded-md border border-surface-border bg-surface-2 px-3 py-2.5 text-base text-foreground";
const card = "flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-5 text-sm";
const h2 = "text-base font-semibold text-foreground";
const fold = "cursor-pointer text-sm font-semibold text-foreground-muted hover:text-foreground";

export default async function StaffOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ error?: string; done?: string }>;
}) {
  if (!staffAreaEnabled()) notFound();
  if (!(await isStaff())) redirect("/staff");
  const { orderNumber } = await params;
  const { error, done } = await searchParams;
  const order = getStaffOrder(orderNumber);
  if (!order) notFound();

  const actions = availableActions(order.status);
  const steps = actions.filter((act) => act !== "cancel");
  const messages = customerMessagesFor(order.id);
  const a = order.shippingAddress;

  return (
    <Container className="flex max-w-2xl flex-col gap-5 pb-28 pt-8 lg:pt-12">
      <header className="flex flex-col gap-2">
        <Link href="/staff/orders" className="text-sm text-foreground-muted underline-offset-4 hover:text-foreground hover:underline">
          ← ออเดอร์ทั้งหมด
        </Link>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{order.orderNumber}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full border border-surface-border px-3 py-1 text-foreground">{orderStatusLabel(order.status, "th")}</span>
          <span className="text-foreground-muted">สั่งเมื่อ {formatDateTime(order.createdAt)}</span>
        </div>
      </header>

      {error && (ERROR_TEXT[error] ?? STOCK_ERROR_TEXT[error]) && (
        <p role="alert" className="rounded-lg border border-danger/60 bg-danger/10 px-4 py-3 text-sm text-foreground">
          {ERROR_TEXT[error] ?? STOCK_ERROR_TEXT[error]}
        </p>
      )}
      {done && done in DONE_TEXT && (
        <p className="rounded-lg border border-verified/40 bg-verified/10 px-4 py-3 text-sm text-foreground">{DONE_TEXT[done]}</p>
      )}

      <section className={card}>
        <h2 className={h2}>การชำระเงิน</h2>
        {order.slip ? (
          <>
            {order.slip.verdict && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <VerdictBadge verdict={order.slip.verdict} />
              </div>
            )}
            {order.slip.reasons.length > 0 && (
              <ul className="list-disc pl-5 text-foreground">
                {order.slip.reasons.map((r) => (
                  <li key={r}>{REASON_LABEL[r] ?? r}</li>
                ))}
              </ul>
            )}
            <p className="text-foreground-muted">
              ยอดในสลิป {order.slip.amount === null ? "—" : formatBaht(order.slip.amount)} · ยอดออเดอร์ {formatBaht(order.total)}
              <br />
              ส่งสลิปเมื่อ {formatDateTime(order.slip.submittedAt)}
              {order.slip.transRef ? ` · เลขอ้างอิง ${order.slip.transRef}` : ""}
            </p>
            {order.slip.verdict !== "pass" && <p className="text-foreground">ก่อนยืนยัน เปิดแอปธนาคารของร้านดูยอดเข้าจริงอีกครั้ง</p>}
          </>
        ) : (
          <p className="text-foreground-muted">ลูกค้ายังไม่ได้แนบสลิป</p>
        )}
      </section>

      <section className={card}>
        <h2 className={h2}>สินค้า</h2>
        <ul className="flex flex-col divide-y divide-surface-border-soft">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-3 py-2">
              <span className="text-foreground">
                {i.productName}
                {i.variantLabel ? ` · ${i.variantLabel}` : ""} × {i.quantity}
                <span className="block text-xs text-foreground-dim">รหัสคลัง {order.lines[idx]?.sku ?? "ไม่มี — ถามเจ้าของร้าน"}</span>
                {order.stockIssue?.resolution === "refunded" &&
                  order.stockIssue.outLines.some((l) => l.itemId === order.itemLines[idx]?.itemId) && (
                    <span className="block text-xs text-unverified">คืนเงินแล้ว — ไม่ส่ง</span>
                  )}
              </span>
              <span className="whitespace-nowrap text-foreground">{formatBaht(i.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between border-t border-surface-border-soft pt-2 font-semibold text-foreground">
          <span>รวม (ค่าส่ง {formatBaht(order.shippingFee)})</span>
          <span>{formatBaht(order.total)}</span>
        </p>
        <div className="flex flex-col gap-2 border-t border-surface-border-soft pt-3">
          <p className="text-foreground-muted">ข้อความส่งคลัง</p>
          <CopyBlock text={order.warehouseText} label="คัดลอกส่งคลัง" doneLabel="คัดลอกแล้ว" />
        </div>
      </section>

      {/* The ONE place staff write to the customer (owner 26/10: two message boxes were confusing). */}
      <section id="customer-messages" className={card}>
        <h2 className={h2}>ลูกค้า</h2>
        <div className="flex flex-col gap-1">
          <p className="text-foreground">
            {a.recipientName} · {a.phone}
          </p>
          <p className="text-foreground-muted">
            {a.line1} ต.{a.subdistrict} อ.{a.district} จ.{a.province} {a.postalCode}
          </p>
          <p className="text-foreground-muted">เบอร์ที่ใช้สั่ง {order.customerPhone}</p>
          {order.trackingNumber && (
            <p className="text-foreground">
              {order.carrier ? `${CARRIERS[order.carrier].name.th} · ` : ""}เลขพัสดุ {order.trackingNumber}
            </p>
          )}
        </div>
        {/* Cart UX batch C (owner 24/10): the customer's optional note — here only (not in the LINE alert, not in the export). */}
        {order.customerNote && (
          <div className="rounded-lg border border-ember/40 bg-surface-2 p-3">
            <p className="text-xs text-foreground-dim">หมายเหตุจากลูกค้า</p>
            <p className="whitespace-pre-wrap break-words text-foreground">{order.customerNote}</p>
          </div>
        )}
        <div className="flex flex-col gap-2 border-t border-surface-border-soft pt-3">
          {/* #807 checker note (a): a message stays on the order page after the customer acts, so one that points at "ด้านล่าง" (the swap / refund box) would later point at nothing — staff are told here, where they type. */}
          <p className="text-foreground-muted">ข้อความถึงลูกค้า (ลูกค้าเห็นในหน้าออเดอร์ · ส่งแล้วแก้ไม่ได้ · ข้อความอยู่ในหน้าออเดอร์ตลอด จึงไม่เขียนชี้ว่า &ldquo;ด้านล่าง&rdquo;)</p>
          {messages.length > 0 && (
            <ul className="flex flex-col gap-2">
              {messages.map((m, i) => (
                <li key={i} className="rounded-lg border border-surface-border-soft bg-surface-2 p-3">
                  <p className="text-xs text-foreground-dim">{formatDateTime(m.createdAt)}</p>
                  <p className="whitespace-pre-wrap break-words text-foreground">{m.body}</p>
                </li>
              ))}
            </ul>
          )}
          <form action={staffMessageAction} className="flex flex-col gap-2">
            <input type="hidden" name="orderNumber" value={order.orderNumber} />
            <textarea name="message" required minLength={3} maxLength={600} rows={2} aria-label="ข้อความถึงลูกค้า" className={input} />
            <button type="submit" className={`${button} self-start`}>
              ส่งข้อความ
            </button>
          </form>
        </div>
      </section>

      {actions.length > 0 && (
        <section className={`${card} gap-4`}>
          <h2 className={h2}>ขั้นต่อไป</h2>
          {steps.map((act) => (
            <form key={act} action={staffOrderAction} className="flex flex-wrap items-end gap-3">
              <input type="hidden" name="orderNumber" value={order.orderNumber} />
              <input type="hidden" name="action" value={act} />
              {act === "ship" && (
                <>
                  {/* Staff pick the carrier — never guessed from the number (owner 23/10: the customer sees it). */}
                  <fieldset className="flex flex-col gap-1 text-foreground-muted">
                    <legend className="mb-1">ขนส่ง</legend>
                    <div className="flex flex-wrap gap-3">
                      {CARRIER_IDS.map((id) => (
                        <label key={id} className="flex items-center gap-2 text-foreground">
                          <input type="radio" name="carrier" value={id} required />
                          {CARRIERS[id].name.th}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className="flex flex-col gap-1 text-foreground-muted">
                    เลขพัสดุ
                    <input name="tracking" required autoComplete="off" className={input} />
                  </label>
                </>
              )}
              <button type="submit" className={button}>
                {STAFF_ACTIONS[act].label}
              </button>
            </form>
          ))}
          {actions.includes("cancel") && (
            <details className={steps.length > 0 ? "border-t border-surface-border-soft pt-3" : undefined}>
              <summary className={fold}>ยกเลิกออเดอร์</summary>
              <form action={staffOrderAction} className="flex flex-col gap-2 pt-3">
                <input type="hidden" name="orderNumber" value={order.orderNumber} />
                <input type="hidden" name="action" value="cancel" />
                {order.slip && (
                  <p className="text-xs text-foreground-dim">
                    ลูกค้าโอนแล้ว: ถ้าสินค้าหมด ใช้ &ldquo;สินค้าหมดหลังลูกค้าโอน&rdquo; ด้านล่างแทน — ลูกค้าเลือกเปลี่ยนสินค้าหรือรับเงินคืนเองในหน้าออเดอร์
                  </p>
                )}
                <label className="flex flex-col gap-1 text-foreground-muted">
                  เหตุผลที่ยกเลิก — ลูกค้าเห็นข้อความนี้ในหน้าออเดอร์
                  <textarea name="message" required minLength={3} maxLength={600} rows={2} className={input} />
                </label>
                <label className="flex flex-col gap-1 text-foreground-muted">
                  หมายเหตุทีมงาน (ลูกค้าไม่เห็น · ไม่ใส่ก็ได้)
                  <input name="note" autoComplete="off" maxLength={300} className={input} />
                </label>
                <button
                  type="submit"
                  className="self-start rounded-full border border-danger/60 px-5 py-2.5 text-sm font-semibold text-danger hover:bg-danger/10"
                >
                  {STAFF_ACTIONS.cancel.label}
                </button>
              </form>
            </details>
          )}
        </section>
      )}

      <StockIssueSection order={order} />

      <details className={card}>
        <summary className={fold}>ประวัติออเดอร์</summary>
        <ul className="flex flex-col gap-1 pt-1 text-foreground-muted">
          {order.statusHistory.map((h, i) => (
            <li key={i}>
              {formatDateTime(h.createdAt)} · {orderStatusLabel(h.status as Parameters<typeof orderStatusLabel>[0], "th")}
              {h.note ? ` — ${historyNoteTh(h.note)}` : ""}
            </li>
          ))}
        </ul>
      </details>
    </Container>
  );
}
