import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { PendingButton } from "@/app/staff/_components/PendingButton";
import { formatCount, formatShortDateTime } from "@/app/staff/_components/format";
import { SITE_URL } from "@/lib/seo";
import { wooCatalog } from "@/lib/woo/catalog";
import { listKeys } from "@/lib/woo/keys";
import { recentCalls, recentOtherCalls, stockReportCount, stockReports, type LogRow } from "@/lib/woo/store";
import { webhooksForStaff } from "@/lib/woo/webhooks";
import { recentOrderEvents } from "@/lib/woo/order-events";
import { compareStock, type StockRow } from "@/lib/woo/stock-compare";
import { approveWebhookAction, revokeWooKeyAction } from "@/app/staff/shipnity/actions";
import { NewKeyForm } from "@/app/staff/shipnity/NewKeyForm";

const TOPIC_LABEL: Record<string, string> = {
  "order.created": "ออเดอร์ใหม่",
  "order.updated": "ออเดอร์แก้ไข",
  "order.deleted": "ออเดอร์ลบ",
};

const hostOf = (url: string) => {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
};

const ORDER_STATUS_TH: Record<string, string> = {
  cancelled: "ยกเลิก",
  deleted: "ลบ",
  trash: "ลบ",
  refunded: "คืนเงิน",
  failed: "ไม่สำเร็จ",
  completed: "สำเร็จ",
  processing: "กำลังทำ",
  "on-hold": "พักไว้",
  pending: "รอ",
};

const LIST = "flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1";

function CallList({ calls }: { calls: LogRow[] }) {
  return (
    <ul className={`${LIST} text-xs`}>
      {calls.map((c) => (
        <li key={c.id} className="flex flex-col gap-1 px-4 py-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="tabular-nums text-foreground-dim">{formatShortDateTime(c.at)}</span>
            <span className={c.status < 400 ? "font-semibold text-foreground" : "font-semibold text-danger"}>{c.status}</span>
            <span className="label-mono break-all text-foreground">
              {c.method} {c.path}
              {c.query ? `?${c.query}` : ""}
            </span>
            <span className="text-foreground-dim">{c.key_id ? `คีย์ #${c.key_id}` : "ไม่มีคีย์"}</span>
          </div>
          {(c.body || c.user_agent) && (
            <details>
              <summary className="cursor-pointer text-foreground-dim">รายละเอียด</summary>
              <pre className="mt-1 whitespace-pre-wrap break-all rounded bg-surface-2 p-2 text-foreground-muted">
                {[c.ip && `ip ${c.ip}`, c.user_agent && `ua ${c.user_agent}`, c.body].filter(Boolean).join("\n")}
              </pre>
            </details>
          )}
        </li>
      ))}
    </ul>
  );
}

function StockRows({ rows }: { rows: StockRow[] }) {
  return (
    <ul className={`${LIST} text-sm`}>
      {rows.slice(0, 200).map((r) => (
        <li key={r.sku} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-2">
          <span className="min-w-0 text-foreground">
            {r.name} <span className="label-mono text-xs text-foreground-dim">{r.sku}</span>
          </span>
          <span className="whitespace-nowrap text-xs text-foreground-muted">
            Shipnity {r.shipnity ?? "—"} · เว็บรอบสร้างล่าสุด {r.siteInStock ? "มีของ" : "หมด"}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * /staff/shipnity — the warehouse link (Shipnity link step 1, owner 27/10): make the key pair the warehouse types into
 * Shipnity ("Url · cs · ck", like every Woo shop), switch a key off, and read every call Shipnity made. In step 1 the
 * stock numbers Shipnity sends are only recorded; the site keeps its hourly read until they are compared (step 3).
 * Orders (owner 28/10): the webhooks Shipnity registered are listed with their host; an order is sent to one only after
 * staff press "อนุญาต" here — then the order page shows "ส่งเข้าคลัง Shipnity". Same lock as every staff page.
 * Owner 28/10: "เทียบสต็อก" (every code: Shipnity's last number vs what the site sells), the orders the warehouse changed
 * (cancel = LINE alert, order-events.ts) and the non-product calls on their own list, so 700 stock writes cannot hide them.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "เชื่อมคลัง Shipnity (ทีมงาน)",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function StaffShipnityPage() {
  if (!staffAreaEnabled()) notFound();
  if (!(await isStaff())) redirect("/staff");
  const keys = listKeys();
  const calls = recentCalls(100);
  const otherCalls = recentOtherCalls(50);
  const orderEvents = recentOrderEvents(30);
  const catalog = wooCatalog();
  const codes = catalog.reduce((n, p) => n + (p.variations.length || 1), 0);
  const cmp = compareStock(catalog, stockReports());
  const hooks = webhooksForStaff();
  const sending = hooks.some((h) => h.topic === "order.created" && h.approvedAt && h.status === "active");

  return (
    <Container className="flex max-w-2xl flex-col gap-5 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar back={{ href: "/staff/dev", label: "Okami dev" }} />
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">เชื่อมคลัง Shipnity</h1>
        <p className="text-sm leading-relaxed text-foreground-muted">
          คลังเชื่อมเว็บนี้แบบเดียวกับร้าน Woo: ใส่ Url · ck · cs ใน Shipnity · ตอนนี้ระบบส่งให้คลังแค่รายการสินค้าและรหัส (
          {formatCount(catalog.length)} สินค้า · {formatCount(codes)} รหัส) · {sending ? "ส่งออเดอร์ได้ด้วยปุ่มในหน้าออเดอร์" : "ยังไม่ส่งออเดอร์"} · สต็อกจาก Shipnity ใช้กับหน้าสินค้า ตะกร้า และการสั่งซื้อแล้ว (เทียบด้านล่าง = ตัวเลข Shipnity กับสต็อกตอนสร้างเว็บรอบล่าสุด)
        </p>
      </header>

      <section id="stock" className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">เทียบสต็อก Shipnity กับหน้าเว็บ</h2>
        <p className="text-sm leading-relaxed text-foreground-muted">
          {formatCount(cmp.total)} รหัส · Shipnity ส่งตัวเลขมาแล้ว {formatCount(cmp.reported)} · ตรงกัน {formatCount(cmp.agree)}
          {" · "}
          <span className={cmp.siteSellsButEmpty.length > 0 ? "font-semibold text-danger" : ""}>
            Shipnity หมดแต่เว็บยังขาย {formatCount(cmp.siteSellsButEmpty.length)}
          </span>
          {" · "}Shipnity มีแต่เว็บขึ้นหมด {formatCount(cmp.siteOutButStocked.length)} · ยังไม่มีตัวเลข {formatCount(cmp.missing.length)}
        </p>
        {cmp.siteSellsButEmpty.length > 0 && (
          <details open>
            <summary className="cursor-pointer text-sm font-semibold text-danger">Shipnity หมด แต่เว็บยังขาย</summary>
            <div className="pt-2">
              <StockRows rows={cmp.siteSellsButEmpty} />
            </div>
          </details>
        )}
        {cmp.siteOutButStocked.length > 0 && (
          <details>
            <summary className="cursor-pointer text-sm text-foreground">Shipnity มีของ แต่เว็บขึ้นหมด (อาจเป็นรายการปิดขายของพี่)</summary>
            <div className="pt-2">
              <StockRows rows={cmp.siteOutButStocked} />
            </div>
          </details>
        )}
        {cmp.missing.length > 0 && (
          <details>
            <summary className="cursor-pointer text-sm text-foreground-muted">ยังไม่มีตัวเลขจาก Shipnity</summary>
            <div className="pt-2">
              <StockRows rows={cmp.missing} />
            </div>
          </details>
        )}
      </section>

      <section id="order-events" className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">ออเดอร์ที่คลังเปลี่ยนใน Shipnity</h2>
        <p className="text-sm leading-relaxed text-foreground-muted">ยกเลิก / ลบ = บอทแจ้งกลุ่ม OKM Order · สถานะบนเว็บไม่เปลี่ยนเอง · คลังส่งเลขพัสดุมา = ออเดอร์ขึ้น “ส่งแล้ว” พร้อมเลขพัสดุเอง</p>
        <p className="text-sm leading-relaxed text-foreground-muted">
          <a href="/staff/api/shipnity-order-writes" className="font-medium text-foreground underline underline-offset-2">
            ดาวน์โหลดสิ่งที่ Shipnity ส่งกลับมาในออเดอร์ (ไฟล์ JSON)
          </a>{" "}
          · ซ่อนชื่อ เบอร์ และที่อยู่ลูกค้าแล้ว · ใช้ดูว่าเลขพัสดุมาทางไหน
        </p>
        {orderEvents.length === 0 ? (
          <p className="text-sm text-foreground-dim">ยังไม่มี</p>
        ) : (
          <ul className={`${LIST} text-sm`}>
            {orderEvents.map((e, i) => (
              <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-2">
                <a href={`/staff/orders/${encodeURIComponent(e.orderNumber)}`} className="text-foreground hover:underline">
                  {e.orderNumber}
                </a>
                <span className="text-xs text-foreground-muted">
                  {e.status ? ORDER_STATUS_TH[e.status] ?? e.status : "แก้ไข"} · {formatShortDateTime(e.at)}
                  {e.notifiedAt ? " · แจ้ง LINE แล้ว" : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <NewKeyForm siteUrl={SITE_URL} />

      <section id="hooks" className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">ที่รับออเดอร์ของ Shipnity</h2>
        <p className="text-sm leading-relaxed text-foreground-muted">
          Shipnity ตั้งไว้เองตอนเชื่อม · ออเดอร์ (ชื่อ ที่อยู่ เบอร์ลูกค้า) ส่งไปเฉพาะที่ที่กด &quot;อนุญาต&quot; · ยืนยันกับคลังก่อนว่าที่อยู่นี้เป็นของ Shipnity
        </p>
        {hooks.length === 0 ? (
          <p className="text-sm text-foreground-dim">ยังไม่มี — จะขึ้นเองเมื่อคลังเชื่อม Shipnity</p>
        ) : (
          <ul className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1">
            {hooks.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-medium text-foreground">{TOPIC_LABEL[h.topic] ?? h.topic}</span>
                  <span className="label-mono break-all text-xs text-foreground-dim">{hostOf(h.deliveryUrl)}</span>
                  <span className={`text-xs ${h.approvedAt ? "text-verified" : "text-unverified"}`}>
                    {h.approvedAt ? `อนุญาตแล้ว ${formatShortDateTime(h.approvedAt)}` : "ยังไม่อนุญาต"}
                  </span>
                </div>
                {h.topic === "order.created" && (
                  <form action={approveWebhookAction}>
                    <input type="hidden" name="id" value={h.id} />
                    <input type="hidden" name="approve" value={h.approvedAt ? "0" : "1"} />
                    <PendingButton
                      className={
                        h.approvedAt
                          ? "rounded-full border border-surface-border px-4 py-2 text-sm text-foreground transition-colors hover:border-danger hover:text-danger"
                          : "rounded-full bg-ember px-4 py-2 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong"
                      }
                    >
                      {h.approvedAt ? "หยุดส่ง" : "อนุญาต"}
                    </PendingButton>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">คีย์ที่มี</h2>
        {keys.length === 0 ? (
          <p className="text-sm text-foreground-dim">ยังไม่มีคีย์</p>
        ) : (
          <ul className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1">
            {keys.map((k) => (
              <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">
                    {k.description} <span className="label-mono text-xs text-foreground-dim">…{k.key_last7}</span>
                  </span>
                  <span className="text-xs text-foreground-dim">
                    สร้าง {formatShortDateTime(k.created_at)} · ใช้ล่าสุด {k.last_used_at ? formatShortDateTime(k.last_used_at) : "ยังไม่เคย"}
                  </span>
                </div>
                {k.revoked_at ? (
                  <span className="text-xs text-danger">ยกเลิกแล้ว {formatShortDateTime(k.revoked_at)}</span>
                ) : (
                  <form action={revokeWooKeyAction}>
                    <input type="hidden" name="id" value={k.id} />
                    <PendingButton
                      className="rounded-full border border-surface-border px-4 py-2 text-sm text-foreground transition-colors hover:border-danger hover:text-danger"
                      pendingText="กำลังยกเลิก…"
                    >
                      ยกเลิกคีย์นี้
                    </PendingButton>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">
          Shipnity เรียกอะไรบ้าง (ไม่นับสินค้า) <span className="text-sm font-normal text-foreground-dim">· ออเดอร์ · ที่รับออเดอร์ · อื่น ๆ · 50 ครั้งล่าสุด</span>
        </h2>
        {otherCalls.length === 0 ? <p className="text-sm text-foreground-dim">ยังไม่มี</p> : <CallList calls={otherCalls} />}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">
          Shipnity เรียกอะไรบ้าง <span className="text-sm font-normal text-foreground-dim">· 100 ครั้งล่าสุด · สต็อกที่ส่งมาแล้ว {formatCount(stockReportCount())} รหัส</span>
        </h2>
        {calls.length === 0 ? <p className="text-sm text-foreground-dim">ยังไม่มีการเรียก</p> : <CallList calls={calls} />}
      </section>
    </Container>
  );
}
