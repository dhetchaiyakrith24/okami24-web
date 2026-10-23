import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { orderStatusLabel } from "@/lib/commerce/order-status";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { availableActions, STAFF_ACTIONS, type StaffAction } from "@/lib/staff/order-actions";
import { getStaffOrder } from "@/lib/staff/orders";
import { CARRIER_IDS, CARRIERS } from "@/lib/commerce/carriers";
import { staffOrderAction } from "@/app/staff/actions";
import { CopyBlock } from "@/app/staff/_components/CopyBlock";
import { formatBaht, formatDateTime, historyNoteTh, REASON_LABEL, VerdictBadge } from "@/app/staff/_components/order-bits";

/**
 * /staff/orders/<n> — one web order for staff (cart round 22/10): everything needed to check the payment and send it
 * to the warehouse, and the buttons that move it on. The customer's order page follows every change.
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
  note: "ยกเลิกต้องเขียนเหตุผลสั้น ๆ (เช่น ของหมด ลูกค้าเลือกคืนเงิน)",
  "not-found": "ไม่พบออเดอร์นี้",
};

const DONE_TEXT: Record<StaffAction, string> = {
  confirm: "บันทึกแล้ว: ยืนยันยอดเงิน",
  "to-warehouse": "บันทึกแล้ว: ส่งรายการให้คลัง",
  ship: "บันทึกแล้ว: ส่งของแล้ว ลูกค้าเห็นขนส่ง เลขพัสดุ และปุ่มเช็คสถานะในหน้าออเดอร์",
  complete: "บันทึกแล้ว: ลูกค้าได้รับของ",
  cancel: "บันทึกแล้ว: ยกเลิกออเดอร์",
};

const button =
  "rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong";
const input = "rounded-md border border-surface-border bg-surface-2 px-3 py-2.5 text-base text-foreground";

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
  const a = order.shippingAddress;

  return (
    <Container className="flex max-w-2xl flex-col gap-6 pb-28 pt-8 lg:pt-12">
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

      {error && ERROR_TEXT[error] && (
        <p role="alert" className="rounded-lg border border-danger/60 bg-danger/10 px-4 py-3 text-sm text-foreground">
          {ERROR_TEXT[error]}
        </p>
      )}
      {done && done in DONE_TEXT && (
        <p className="rounded-lg border border-verified/40 bg-verified/10 px-4 py-3 text-sm text-foreground">{DONE_TEXT[done as StaffAction]}</p>
      )}

      <section className="flex flex-col gap-2 rounded-xl border border-surface-border-soft bg-surface-1 p-5 text-sm">
        <h2 className="text-base font-semibold text-foreground">สลิป</h2>
        {order.slip ? (
          <>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {order.slip.verdict && <VerdictBadge verdict={order.slip.verdict} />}
            </div>
            {order.slip.reasons.length > 0 && (
              <ul className="list-disc pl-5 text-foreground">
                {order.slip.reasons.map((r) => (
                  <li key={r}>{REASON_LABEL[r] ?? r}</li>
                ))}
              </ul>
            )}
            <p className="text-foreground-muted">
              ยอดในสลิป {order.slip.amount === null ? "—" : formatBaht(order.slip.amount)} · ยอดออเดอร์ {formatBaht(order.total)}
            </p>
            <p className="text-foreground-muted">
              ส่งสลิปเมื่อ {formatDateTime(order.slip.submittedAt)}
              {order.slip.transRef ? ` · เลขอ้างอิง ${order.slip.transRef}` : ""}
            </p>
            {order.slip.verdict !== "pass" && (
              <p className="text-foreground">ก่อนยืนยัน เปิดแอปธนาคารของร้านดูยอดเข้าจริงอีกครั้ง</p>
            )}
          </>
        ) : (
          <p className="text-foreground-muted">ลูกค้ายังไม่ได้แนบสลิป</p>
        )}
      </section>

      {/* Cart UX batch C (owner 24/10): the customer's optional note — here only (not in the LINE alert, not in the export). */}
      {order.customerNote && (
        <section className="flex flex-col gap-2 rounded-xl border border-ember/40 bg-surface-1 p-5 text-sm">
          <h2 className="text-base font-semibold text-foreground">หมายเหตุจากลูกค้า</h2>
          <p className="whitespace-pre-wrap break-words text-foreground">{order.customerNote}</p>
        </section>
      )}

      <section className="flex flex-col gap-2 rounded-xl border border-surface-border-soft bg-surface-1 p-5 text-sm">
        <h2 className="text-base font-semibold text-foreground">สินค้า</h2>
        <ul className="flex flex-col divide-y divide-surface-border-soft">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-3 py-2">
              <span className="text-foreground">
                {i.productName}
                {i.variantLabel ? ` · ${i.variantLabel}` : ""} × {i.quantity}
                <span className="block text-xs text-foreground-dim">รหัสคลัง {order.lines[idx]?.sku ?? "ไม่มี — ถามเจ้าของร้าน"}</span>
              </span>
              <span className="whitespace-nowrap text-foreground">{formatBaht(i.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between border-t border-surface-border-soft pt-2 font-semibold text-foreground">
          <span>รวม (ค่าส่ง {formatBaht(order.shippingFee)})</span>
          <span>{formatBaht(order.total)}</span>
        </p>
      </section>

      <section className="flex flex-col gap-2 rounded-xl border border-surface-border-soft bg-surface-1 p-5 text-sm">
        <h2 className="text-base font-semibold text-foreground">ส่งถึง</h2>
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
      </section>

      <section className="flex flex-col gap-2 rounded-xl border border-surface-border-soft bg-surface-1 p-5">
        <h2 className="text-base font-semibold text-foreground">ข้อความส่งคลัง</h2>
        <CopyBlock text={order.warehouseText} label="คัดลอกส่งคลัง" doneLabel="คัดลอกแล้ว" />
      </section>

      {actions.length > 0 && (
        <section className="flex flex-col gap-4 rounded-xl border border-surface-border-soft bg-surface-1 p-5">
          <h2 className="text-base font-semibold text-foreground">ขั้นต่อไป</h2>
          {actions
            .filter((act) => act !== "cancel")
            .map((act) => (
              <form key={act} action={staffOrderAction} className="flex flex-wrap items-end gap-2">
                <input type="hidden" name="orderNumber" value={order.orderNumber} />
                <input type="hidden" name="action" value={act} />
                {act === "ship" && (
                  <>
                    {/* Staff pick the carrier — never guessed from the number (owner 23/10: the customer sees it). */}
                    <fieldset className="flex flex-col gap-1 text-sm text-foreground-muted">
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
                    <label className="flex flex-col gap-1 text-sm text-foreground-muted">
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
            <form action={staffOrderAction} className="flex flex-col gap-2 border-t border-surface-border-soft pt-4">
              <input type="hidden" name="orderNumber" value={order.orderNumber} />
              <input type="hidden" name="action" value="cancel" />
              <label className="flex flex-col gap-1 text-sm text-foreground-muted">
                เหตุผลที่ยกเลิก (ลูกค้าไม่เห็น)
                <input name="note" required minLength={3} autoComplete="off" className={input} />
              </label>
              <button
                type="submit"
                className="self-start rounded-full border border-danger/60 px-5 py-2.5 text-sm font-semibold text-danger hover:bg-danger/10"
              >
                {STAFF_ACTIONS.cancel.label}
              </button>
              {order.slip && (
                <p className="text-xs text-foreground-dim">
                  ลูกค้าโอนแล้ว: ยกเลิกได้เฉพาะกรณีของหมด แล้วคืนเงินหรือเปลี่ยนสินค้าราคาเท่ากันตามที่ลูกค้าเลือก
                </p>
              )}
            </form>
          )}
        </section>
      )}

      <section className="flex flex-col gap-2 rounded-xl border border-surface-border-soft bg-surface-1 p-5 text-sm">
        <h2 className="text-base font-semibold text-foreground">ประวัติ</h2>
        <ul className="flex flex-col gap-1 text-foreground-muted">
          {order.statusHistory.map((h, i) => (
            <li key={i}>
              {formatDateTime(h.createdAt)} · {orderStatusLabel(h.status as Parameters<typeof orderStatusLabel>[0], "th")}
              {h.note ? ` — ${historyNoteTh(h.note)}` : ""}
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
