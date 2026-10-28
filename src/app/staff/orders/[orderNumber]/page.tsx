import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { orderStatusLabel } from "@/lib/commerce/order-status";
import { formatRunNumber } from "@/lib/commerce/run-number";
import { paymentDeadline } from "@/lib/commerce/unpaid-expiry";
import { stockIssueStage } from "@/lib/commerce/stock-issue-rules";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { availableActions, STAFF_ACTIONS, type StaffAction } from "@/lib/staff/order-actions";
import { getStaffOrder, type StaffOrderDetail } from "@/lib/staff/orders";
import { isStaffJob, STAFF_JOBS, STAFF_STATUS_LABEL, statusTone, TONE_CLASS } from "@/lib/staff/jobs";
import { CARRIER_IDS, CARRIERS } from "@/lib/commerce/carriers";
import { staffMessageAction, staffOrderAction, staffShipnityPushAction } from "@/app/staff/actions";
import { sendState, shipnityReady } from "@/lib/woo/order-push";
import { warehouseChange } from "@/lib/woo/order-events";

const WAREHOUSE_CHANGE_TEXT: Record<string, string> = {
  cancelled: "คลังยกเลิกออเดอร์นี้ใน Shipnity",
  deleted: "คลังลบออเดอร์นี้ใน Shipnity",
  trash: "คลังลบออเดอร์นี้ใน Shipnity",
  refunded: "คลังคืนเงิน / ยกเลิกออเดอร์นี้ใน Shipnity",
  failed: "คลังแจ้งว่าออเดอร์นี้ไม่สำเร็จใน Shipnity",
};
import { customerMessagesFor } from "@/lib/commerce/order-messages";
import { CopyBlock } from "@/app/staff/_components/CopyBlock";
import { StockIssueSection } from "@/app/staff/_components/StockIssueSection";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { formatBaht, formatDateTime, historyNoteTh, REASON_LABEL, VerdictBadge } from "@/app/staff/_components/order-bits";

/**
 * /staff/orders/<n> — one web order for staff (cart round 22/10): everything needed to check the payment and send it
 * to the warehouse, and the buttons that move it on. The customer's order page follows every change.
 *
 * Layout (owner 26/10, queue B3: "หน้าออเดอร์ยาวและรก · ใช้บนมือถือ"; designer direction 26/10): the NEXT STEP first, holding
 * exactly what that step needs (the slip and the confirm button · the warehouse text and its button · carrier + tracking ·
 * received) — an out-of-stock problem that is still open takes that place, so nobody ships the wrong items. Then the
 * customer (open). Everything else is one folded card: items, payment, messages, out of stock, history, cancel (last, red,
 * away from the main button). Statuses read in the team's words with the owner's colours (src/lib/staff/jobs.ts).
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
  "shipnity-no-target": "ยังส่งเข้า Shipnity ไม่ได้ — ยังไม่ได้กดอนุญาตที่รับออเดอร์ในหน้า \"เชื่อมคลัง Shipnity\" · ใช้คัดลอกข้อความส่งคลังไปก่อน",
  "shipnity-no-sku": "ส่งเข้า Shipnity ไม่ได้ — มีสินค้าที่ไม่มีรหัสคลัง · ใช้คัดลอกข้อความส่งคลังแทน แล้วแจ้ง Friday",
  "shipnity-failed": "ส่งเข้า Shipnity ไม่สำเร็จ ออเดอร์ยังไม่เปลี่ยน — กดส่งใหม่อีกครั้ง หรือคัดลอกข้อความส่งคลังไปก่อน",
  "shipnity-not-found": "ไม่พบออเดอร์นี้",
  "shipnity-not-approved": "ส่งเข้า Shipnity ไม่ได้ — ส่งได้เฉพาะออเดอร์ที่ยืนยันยอดเงินแล้วและยังไม่ส่งคลัง (อาจมีคนกดเปลี่ยนสถานะไปก่อน) — โหลดหน้าใหม่ดูสถานะล่าสุด",
  "shipnity-already-sent": "ออเดอร์นี้ส่งเข้า Shipnity ไปแล้ว (หรือกำลังส่ง) — ไม่ส่งซ้ำ · โหลดหน้าใหม่ดูสถานะล่าสุด",
  "shipnity-stock-open": "ส่งเข้า Shipnity ไม่ได้ — ยังมีเรื่องสินค้าหมดที่ยังไม่จบ จัดการกล่องสินค้าหมดก่อน",
  "shipnity-sent-status": "ส่งเข้า Shipnity แล้ว แต่สถานะออเดอร์เปลี่ยนไประหว่างนั้น — โหลดหน้าใหม่ แล้วเช็คกับคลังว่าออเดอร์เข้า Shipnity ถูกต้อง",
};

const DONE_TEXT: Record<string, string> = {
  confirm: "บันทึกแล้ว: ยืนยันยอดเงิน",
  "to-warehouse": "บันทึกแล้ว: ส่งรายการให้คลัง",
  shipnity: "ส่งเข้า Shipnity แล้ว และบันทึกว่าส่งรายการให้คลังแล้ว — คลังเห็นออเดอร์ใน Shipnity",
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

const primary =
  "inline-flex h-12 w-full items-center justify-center rounded-full bg-ember px-6 text-base font-semibold text-[#181008] transition-colors hover:bg-ember-strong sm:w-auto";
const input = "h-12 w-full rounded-md border border-surface-border bg-surface-2 px-3 text-base text-foreground";
const card = "flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-4 text-sm sm:p-5";
const foldRow = "group border-surface-border-soft";
const foldSummary =
  "flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm text-foreground hover:bg-surface-2 sm:px-5 [&::-webkit-details-marker]:hidden";
const foldBody = "flex flex-col gap-3 px-4 pb-4 text-sm sm:px-5";

function Chevron() {
  return (
    <span aria-hidden className="text-foreground-dim transition-transform group-open:rotate-90">
      ›
    </span>
  );
}

/** The hidden fields every order form carries: which order, and which list it was opened from (Back goes there). */
function OrderFields({ order, from }: { order: StaffOrderDetail; from: string }) {
  return (
    <>
      <input type="hidden" name="orderNumber" value={order.orderNumber} />
      {from && <input type="hidden" name="from" value={from} />}
    </>
  );
}

/** Shorter words where the step card already says what to fill in (the long list label wrapped onto two lines at 390). */
const BUTTON_LABEL: Partial<Record<StaffAction, string>> = { ship: "บันทึกว่าส่งของแล้ว" };

/** `quiet` = the hand-copy fallback once "ส่งเข้าคลัง Shipnity" is the main button (one main button per card). */
const quietButton =
  "inline-flex h-12 w-full items-center justify-center rounded-full border border-surface-border px-6 text-base font-semibold text-foreground transition-colors hover:border-foreground-dim sm:w-auto";

function ActionForm({
  order,
  from,
  act,
  quiet = false,
  children,
}: {
  order: StaffOrderDetail;
  from: string;
  act: StaffAction;
  quiet?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <form action={staffOrderAction} className="flex flex-col gap-3">
      <OrderFields order={order} from={from} />
      <input type="hidden" name="action" value={act} />
      {children}
      <button type="submit" className={quiet ? quietButton : primary}>
        {BUTTON_LABEL[act] ?? STAFF_ACTIONS[act].label}
      </button>
    </form>
  );
}

/** Slip verdict, the reasons (red — a "no", HANDOFF §18), the two amounts side by side and the picture. */
function SlipDetails({ order, slipImageHref, compact }: { order: StaffOrderDetail; slipImageHref: string; compact: boolean }) {
  const slip = order.slip;
  if (!slip) return <p className="text-foreground-muted">ลูกค้ายังไม่ได้แนบสลิป</p>;
  const amountOff = slip.amount !== null && slip.amount !== order.total;
  return (
    <>
      {/* The verdict stays on the step card in every case — staff confirm by the ✅ (admin manual step 2.1; checker 27/10). */}
      {slip.verdict && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <VerdictBadge verdict={slip.verdict} />
        </div>
      )}
      {slip.reasons.length > 0 && (
        <ul className="list-disc pl-5 text-danger">
          {slip.reasons.map((r) => (
            <li key={r}>{REASON_LABEL[r] ?? r}</li>
          ))}
        </ul>
      )}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <p className="text-xs text-foreground-muted">ยอดในสลิป</p>
          <p className={`text-xl font-semibold tabular-nums ${amountOff ? "text-danger" : "text-foreground"}`}>
            {slip.amount === null ? "—" : formatBaht(slip.amount)}
          </p>
        </div>
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <p className="text-xs text-foreground-muted">ยอดออเดอร์</p>
          <p className="text-xl font-semibold tabular-nums text-foreground">{formatBaht(order.total)}</p>
        </div>
      </div>
      {/* The step card keeps one line of small text (staff declutter 27/10) — when it came, and the ref, are in "รายละเอียด". */}
      {!compact && (
        <p className="text-xs text-foreground-muted">
          ส่งสลิปเมื่อ {formatDateTime(slip.submittedAt)}
          {slip.transRef ? ` · เลขอ้างอิง ${slip.transRef}` : ""}
        </p>
      )}
      {/* Owner 26/10 (queue B2 (c)): the slip picture is kept 90 days. Plain <img>: the route is staff-only and sends
          no-store, so next/image's optimiser must not fetch and cache it. */}
      {slip.hasImage ? (
        <a href={slipImageHref} target="_blank" rel="noopener" className="flex w-fit flex-col gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slipImageHref}
            alt="รูปสลิปที่ลูกค้าแนบ"
            className={`${compact ? "max-h-72 min-w-40" : "max-h-96"} w-auto max-w-full rounded-lg border border-surface-border-soft bg-surface-2 object-contain`}
          />
          <span className="text-xs text-foreground-dim">{compact ? "แตะเพื่อเปิดรูปเต็ม" : "แตะเพื่อเปิดรูปเต็ม · รูปสลิปเก็บไว้ 90 วันนับจากวันที่ลูกค้าส่ง"}</span>
        </a>
      ) : slip.imageDeletedAt ? (
        <p className="text-xs text-foreground-dim">รูปสลิปลบแล้วเมื่อครบ 90 วัน ผลตรวจด้านบนยังอยู่</p>
      ) : null}
    </>
  );
}

export default async function StaffOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ error?: string; done?: string; from?: string }>;
}) {
  if (!staffAreaEnabled()) notFound();
  if (!(await isStaff())) redirect("/staff");
  const { orderNumber } = await params;
  const { error, done, from: fromParam } = await searchParams;
  const order = getStaffOrder(orderNumber);
  if (!order) notFound();

  const from = isStaffJob(fromParam) || fromParam === "all" ? fromParam : "";
  const back =
    from === "all"
      ? { href: "/staff/orders?f=all", label: "ออเดอร์ทั้งหมด" }
      : isStaffJob(from)
        ? { href: `/staff/orders?f=${from}`, label: STAFF_JOBS[from].label }
        : { href: "/staff", label: "งาน" };

  const actions = availableActions(order.status);
  const steps = actions.filter((act) => act !== "cancel");
  const messages = customerMessagesFor(order.id);
  const a = order.shippingAddress;
  const slipImageHref = `/staff/orders/${encodeURIComponent(order.orderNumber)}/slip-image`;
  const runNumber = formatRunNumber(order.runNumber);
  const tone = TONE_CLASS[statusTone(order.status)];
  const stockOpen = order.stockIssue !== null && stockIssueStage(order.stockIssue) !== "resolved";
  // Refunded but the bank slip is not attached yet (queue B4) = the problem card stays on top until it is; it does not
  // hold back the next-step card (a partial refund still ships).
  const refundSlipDue = order.stockIssue?.resolution === "refunded" && order.stockIssue.refundSlipAt === null;
  const paymentStep = order.status === "payment_submitted" || order.status === "awaiting_verification";
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
  // "cancelled" is final (order-status.ts), so the FIRST cancelled row is the cancellation itself — later rows on a cancelled
  // order (e.g. the refund slip attached afterwards, queue B4) must not replace its reason (checker #877).
  const cancelNote = order.status === "cancelled" ? order.statusHistory.find((h) => h.status === "cancelled")?.note ?? null : null;
  // Shipnity link (owner 28/10): the button shows once staff approved where Shipnity takes orders (/staff/shipnity).
  const shipnity = shipnityReady();
  const sent = sendState(order.id);
  const warehouse = warehouseChange(order.id);

  return (
    <Container className="flex max-w-2xl flex-col gap-4 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar back={back} />

      {/* One number (the shop's running number once the payment is confirmed — owner 26/10, queue B2 (a); OK-… and the
          order date live in "รายละเอียด"). The status pill only while an open stock problem hides the step card — every
          other status is named by the card below (staff declutter 27/10: the same status said twice). */}
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">{runNumber ?? order.orderNumber}</h1>
        {stockOpen && <span className={`rounded-full border px-3 py-1 text-sm font-medium ${tone.pill}`}>{STAFF_STATUS_LABEL[order.status]}</span>}
      </header>

      {error && (ERROR_TEXT[error] ?? STOCK_ERROR_TEXT[error]) && (
        <p role="alert" className="rounded-lg border border-danger/60 bg-danger/10 px-4 py-3 text-sm text-foreground">
          {ERROR_TEXT[error] ?? STOCK_ERROR_TEXT[error]}
        </p>
      )}
      {done && done in DONE_TEXT && (
        <p className="rounded-lg border border-verified/40 bg-verified/10 px-4 py-3 text-sm text-foreground">{DONE_TEXT[done]}</p>
      )}

      {/* The warehouse cancelled / deleted the order in Shipnity (owner 28/10) — the team also got a LINE alert. The order's
          status here is not changed by it: staff call the customer and the warehouse's admin first. */}
      {warehouse && (
        <p role="alert" className="rounded-lg border border-danger/60 bg-danger/10 px-4 py-3 text-sm leading-relaxed text-foreground">
          {WAREHOUSE_CHANGE_TEXT[warehouse.status] ?? "คลังเปลี่ยนสถานะออเดอร์นี้ใน Shipnity"} เมื่อ {formatDateTime(warehouse.at)} — คุยกับแอดมินคลัง
          แล้วแจ้งลูกค้า (เปลี่ยนสินค้า / คืนเงิน ใช้กล่อง &quot;สินค้าหมดหลังลูกค้าโอน&quot;)
        </p>
      )}

      {/* An out-of-stock problem still open IS the next step (designer 26/10): shown first, before any ship button. */}
      {(stockOpen || refundSlipDue) && <StockIssueSection order={order} />}

      {/* NEXT STEP — what this status needs, nothing else. */}
      {order.status === "pending_payment" && (
        <section className={`${card} border-unverified/40`}>
          <h2 className="text-base font-semibold text-foreground">ขั้นต่อไป · รอลูกค้าโอน</h2>
          <p className="text-foreground-muted">
            ลูกค้ายังไม่ได้แนบสลิป · ถ้าไม่แนบภายใน {formatDateTime(paymentDeadline(order.createdAt).toISOString())} ระบบยกเลิกให้เอง
          </p>
        </section>
      )}
      {paymentStep && (
        <section className={`${card} border-unverified/40`}>
          <h2 className="text-base font-semibold text-foreground">ขั้นต่อไป · {STAFF_JOBS.slip.label}</h2>
          <SlipDetails order={order} slipImageHref={slipImageHref} compact />
          {/* One warning line above the button (designer 26/10: three stacked notes read as clutter). */}
          <p className="text-unverified">
            {order.slip?.verdict !== "pass" ? "ก่อนยืนยัน ดูยอดเข้าในแอปธนาคารของร้าน และเช็คของในหน้าคีย์ออเดอร์ Shipnity" : "ก่อนยืนยัน เช็คของในหน้าคีย์ออเดอร์ Shipnity — หมด = ใช้ “สินค้าหมดหลังลูกค้าโอน”"}
          </p>
          {steps.includes("confirm") && <ActionForm order={order} from={from} act="confirm" />}
        </section>
      )}
      {order.status === "approved" && !stockOpen && (
        <section className={`${card} border-unverified/40`}>
          <h2 className="text-base font-semibold text-foreground">ขั้นต่อไป · {STAFF_JOBS.warehouse.label}</h2>
          {shipnity && (
            <form action={staffShipnityPushAction} className="flex flex-col gap-2">
              <OrderFields order={order} from={from} />
              <button type="submit" className={primary}>
                ส่งเข้าคลัง Shipnity
              </button>
              <p className="text-xs text-foreground-dim">
                ส่งชื่อ ที่อยู่ เบอร์ สินค้า และค่าส่ง ไม่ส่งสลิป{sent?.status === "failed" ? " · ครั้งก่อนส่งไม่สำเร็จ" : ""}
              </p>
            </form>
          )}
          {shipnity ? (
            <details className="group">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-sm text-foreground-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
                ส่งเองแบบเดิม (คัดลอกข้อความ)
                <Chevron />
              </summary>
              <div className="flex flex-col gap-3 pt-2">
                <CopyBlock text={order.warehouseText} label="คัดลอกข้อความส่งคลัง" doneLabel="คัดลอกแล้ว" outline />
                {steps.includes("to-warehouse") && <ActionForm order={order} from={from} act="to-warehouse" quiet />}
              </div>
            </details>
          ) : (
            <>
              <CopyBlock text={order.warehouseText} label="คัดลอกข้อความส่งคลัง" doneLabel="คัดลอกแล้ว" outline />
              {steps.includes("to-warehouse") && <ActionForm order={order} from={from} act="to-warehouse" />}
            </>
          )}
        </section>
      )}
      {order.status === "processing" && !stockOpen && (
        <section className={`${card} border-unverified/40`}>
          <h2 className="text-base font-semibold text-foreground">ขั้นต่อไป · {STAFF_JOBS.tracking.label}</h2>
          {steps.includes("ship") && (
            <ActionForm order={order} from={from} act="ship">
              {/* Staff pick the carrier — never guessed from the number (owner 23/10: the customer sees it). */}
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-foreground-muted">ขนส่ง</legend>
                <div className="grid grid-cols-2 gap-2">
                  {CARRIER_IDS.map((id) => (
                    <label key={id} className="relative">
                      <input type="radio" name="carrier" value={id} required className="peer absolute inset-0 opacity-0" />
                      <span className="flex h-12 items-center justify-center rounded-xl border border-surface-border text-sm text-foreground peer-checked:border-ember peer-checked:bg-ember/10 peer-checked:font-semibold peer-focus-visible:outline-2 peer-focus-visible:outline-ember">
                        {CARRIERS[id].name.th}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="flex flex-col gap-1 text-foreground-muted">
                เลขพัสดุ
                <input name="tracking" required autoComplete="off" autoCapitalize="characters" className={input} />
              </label>
            </ActionForm>
          )}
        </section>
      )}
      {order.status === "shipped" && (
        <section className={`${card} border-verified/40`}>
          <h2 className="text-base font-semibold text-foreground">ส่งแล้ว · รอลูกค้าได้รับของ</h2>
          {order.trackingNumber && (
            <p className="text-foreground">
              {order.carrier ? `${CARRIERS[order.carrier].name.th} · ` : ""}เลขพัสดุ <span className="select-all font-semibold">{order.trackingNumber}</span>
            </p>
          )}
          {steps.includes("complete") && <ActionForm order={order} from={from} act="complete" />}
        </section>
      )}
      {order.status === "completed" && (
        <p className="rounded-xl border border-verified/40 bg-verified/10 px-4 py-3 text-sm text-verified">เสร็จแล้ว — ลูกค้าได้รับของแล้ว</p>
      )}
      {order.status === "cancelled" && (
        <p className="rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger">
          ยกเลิกแล้ว{cancelNote ? ` — ${historyNoteTh(cancelNote)}` : ""}
        </p>
      )}

      {/* The customer — open: staff call or LINE them often. */}
      <section className={card}>
        <h2 className="text-base font-semibold text-foreground">ลูกค้า</h2>
        <div className="flex flex-col gap-1">
          <p className="text-foreground">
            {a.recipientName} ·{" "}
            <a href={`tel:${a.phone}`} className="font-semibold text-ember underline underline-offset-4">
              {a.phone}
            </a>
          </p>
          <p className="text-foreground-muted">
            {a.line1} ต.{a.subdistrict} อ.{a.district} จ.{a.province} {a.postalCode}
          </p>
          {order.customerPhone !== a.phone && <p className="text-foreground-muted">เบอร์ที่ใช้สั่ง {order.customerPhone}</p>}
          {order.trackingNumber && order.status !== "shipped" && (
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
      </section>

      {/* Everything else, folded into ONE card — each row says what is inside before it is opened. */}
      <div className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1">
        {/* Staff declutter 27/10: items, payment, history and the order's own facts are one row ("รายละเอียด"), not three. */}
        <details className={foldRow}>
          <summary className={foldSummary}>
            <span>
              รายละเอียด · {itemCount} ชิ้น · {formatBaht(order.total)}
            </span>
            <Chevron />
          </summary>
          <div className={foldBody}>
            <p className="text-foreground-muted">
              {runNumber ? `${order.orderNumber} · ` : ""}สั่งเมื่อ {formatDateTime(order.createdAt)}
              {paymentStep && order.slip
                ? ` · ส่งสลิปเมื่อ ${formatDateTime(order.slip.submittedAt)}${order.slip.transRef ? ` · เลขอ้างอิง ${order.slip.transRef}` : ""}`
                : ""}
            </p>
            <ul className="flex flex-col divide-y divide-surface-border-soft">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-3 py-2">
                  <span className="text-foreground">
                    {i.productName}
                    {i.variantLabel ? ` · ${i.variantLabel}` : ""} × {i.quantity}
                    <span className="block text-xs text-foreground-dim">รหัสคลัง {order.lines[idx]?.sku ?? "ไม่มี — ถามเจ้าของร้าน"}</span>
                    {order.stockIssue?.resolution === "refunded" &&
                      order.stockIssue.outLines.some((l) => l.itemId === order.itemLines[idx]?.itemId) && (
                        <span className="block text-xs text-danger">คืนเงินแล้ว — ไม่ส่ง</span>
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
            {order.status !== "approved" && (
              <div className="flex flex-col gap-2 border-t border-surface-border-soft pt-3">
                <p className="text-foreground-muted">ข้อความส่งคลัง</p>
                {sent?.firstSentAt ? (
                  <p className="text-foreground">ส่งเข้า Shipnity แล้ว {formatDateTime(sent.firstSentAt)}</p>
                ) : sent?.status === "failed" ? (
                  <p className="text-danger">ส่งเข้า Shipnity ไม่สำเร็จ</p>
                ) : null}
                <CopyBlock text={order.warehouseText} label="คัดลอกข้อความส่งคลัง" doneLabel="คัดลอกแล้ว" />
              </div>
            )}
            {!paymentStep && order.slip && (
              <div className="flex flex-col gap-3 border-t border-surface-border-soft pt-3">
                <p className="font-semibold text-foreground">การชำระเงิน</p>
                <SlipDetails order={order} slipImageHref={slipImageHref} compact={false} />
              </div>
            )}
            <div className="flex flex-col gap-1 border-t border-surface-border-soft pt-3">
              <p className="font-semibold text-foreground">ประวัติ</p>
              <ul className="flex flex-col gap-1 text-foreground-muted">
                {order.statusHistory.map((h, i) => (
                  <li key={i}>
                    {formatDateTime(h.createdAt)} · {orderStatusLabel(h.status as Parameters<typeof orderStatusLabel>[0], "th")}
                    {h.note ? ` — ${historyNoteTh(h.note)}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </details>

        {/* The ONE place staff write to the customer (owner 26/10: two message boxes were confusing). Opens itself after a
            message was just sent, so the "sent" line and the message are in view. */}
        <details id="customer-messages" className={foldRow} open={done === "message" || undefined}>
          <summary className={foldSummary}>
            <span>
              ข้อความถึงลูกค้า{messages.length > 0 ? ` · ${messages.length}` : ""}
            </span>
            <Chevron />
          </summary>
          <div className={foldBody}>
            <p className="text-xs text-foreground-muted">ลูกค้าเห็นในหน้าออเดอร์ · ส่งแล้วแก้ไม่ได้ · ไม่เขียนชี้ว่า &ldquo;ด้านล่าง&rdquo;</p>
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
              <OrderFields order={order} from={from} />
              <textarea
                name="message"
                required
                minLength={3}
                maxLength={600}
                rows={2}
                aria-label="ข้อความถึงลูกค้า"
                className="w-full rounded-md border border-surface-border bg-surface-2 px-3 py-2.5 text-base text-foreground"
              />
              <button type="submit" className="self-start rounded-full border border-surface-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-foreground-dim">
                ส่งข้อความ
              </button>
            </form>
          </div>
        </details>

        {!stockOpen && !refundSlipDue && <StockIssueSection order={order} asRow />}

        {actions.includes("cancel") && (
          <details className={foldRow}>
            <summary className={foldSummary}>
              <span className="text-danger">ยกเลิกออเดอร์</span>
              <Chevron />
            </summary>
            <form action={staffOrderAction} className={foldBody}>
              <OrderFields order={order} from={from} />
              <input type="hidden" name="action" value="cancel" />
              {order.slip && (
                <p className="text-xs text-foreground-dim">
                  ลูกค้าโอนแล้ว: ถ้าสินค้าหมด ใช้ &ldquo;สินค้าหมดหลังลูกค้าโอน&rdquo; แทน — ลูกค้าเลือกเปลี่ยนสินค้าหรือรับเงินคืนเองในหน้าออเดอร์
                </p>
              )}
              <label className="flex flex-col gap-1 text-foreground-muted">
                เหตุผลที่ยกเลิก — ลูกค้าเห็นข้อความนี้ในหน้าออเดอร์
                <textarea
                  name="message"
                  required
                  minLength={3}
                  maxLength={600}
                  rows={2}
                  className="w-full rounded-md border border-surface-border bg-surface-2 px-3 py-2.5 text-base text-foreground"
                />
              </label>
              <label className="flex flex-col gap-1 text-foreground-muted">
                หมายเหตุทีมงาน (ลูกค้าไม่เห็น · ไม่ใส่ก็ได้)
                <input name="note" autoComplete="off" maxLength={300} className={input} />
              </label>
              <button type="submit" className="self-start rounded-full border border-danger/60 px-5 py-2.5 text-sm font-semibold text-danger hover:bg-danger/10">
                {STAFF_ACTIONS.cancel.label}
              </button>
            </form>
          </details>
        )}
      </div>
    </Container>
  );
}
