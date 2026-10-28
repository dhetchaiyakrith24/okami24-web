import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { formatCount, formatShortDateTime } from "@/app/staff/_components/format";
import { SITE_URL } from "@/lib/seo";
import { wooCatalog } from "@/lib/woo/catalog";
import { listKeys } from "@/lib/woo/keys";
import { recentCalls, stockReportCount } from "@/lib/woo/store";
import { webhooksForStaff } from "@/lib/woo/webhooks";
import { approveWebhookAction, revokeWooKeyAction } from "@/app/staff/shipnity/actions";

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
import { NewKeyForm } from "@/app/staff/shipnity/NewKeyForm";

/**
 * /staff/shipnity — the warehouse link (Shipnity link step 1, owner 27/10): make the key pair the warehouse types into
 * Shipnity ("Url · cs · ck", like every Woo shop), switch a key off, and read every call Shipnity made. In step 1 the
 * stock numbers Shipnity sends are only recorded; the site keeps its hourly read until they are compared (step 3).
 * Orders (owner 28/10): the webhooks Shipnity registered are listed with their host; an order is sent to one only after
 * staff press "อนุญาต" here — then the order page shows "ส่งเข้าคลัง Shipnity". Same lock as every staff page.
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
  const catalog = wooCatalog();
  const codes = catalog.reduce((n, p) => n + (p.variations.length || 1), 0);
  const hooks = webhooksForStaff();
  const sending = hooks.some((h) => h.topic === "order.created" && h.approvedAt && h.status === "active");

  return (
    <Container className="flex max-w-2xl flex-col gap-5 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar back={{ href: "/staff", label: "งาน" }} />
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">เชื่อมคลัง Shipnity</h1>
        <p className="text-sm leading-relaxed text-foreground-muted">
          คลังเชื่อมเว็บนี้แบบเดียวกับร้าน Woo: ใส่ Url · ck · cs ใน Shipnity · ตอนนี้ระบบส่งให้คลังแค่รายการสินค้าและรหัส (
          {formatCount(catalog.length)} สินค้า · {formatCount(codes)} รหัส) · {sending ? "ส่งออเดอร์ได้ด้วยปุ่มในหน้าออเดอร์" : "ยังไม่ส่งออเดอร์"} · ยังไม่เปลี่ยนสต็อกบนเว็บ
        </p>
      </header>

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
                    <button
                      type="submit"
                      className={
                        h.approvedAt
                          ? "rounded-full border border-surface-border px-4 py-2 text-sm text-foreground transition-colors hover:border-danger hover:text-danger"
                          : "rounded-full bg-ember px-4 py-2 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong"
                      }
                    >
                      {h.approvedAt ? "หยุดส่ง" : "อนุญาต"}
                    </button>
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
                    <button
                      type="submit"
                      className="rounded-full border border-surface-border px-4 py-2 text-sm text-foreground transition-colors hover:border-danger hover:text-danger"
                    >
                      ยกเลิกคีย์นี้
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">
          Shipnity เรียกอะไรบ้าง <span className="text-sm font-normal text-foreground-dim">· 100 ครั้งล่าสุด · สต็อกที่ส่งมาแล้ว {formatCount(stockReportCount())} รหัส</span>
        </h2>
        {calls.length === 0 ? (
          <p className="text-sm text-foreground-dim">ยังไม่มีการเรียก</p>
        ) : (
          <ul className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1 text-xs">
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
        )}
      </section>
    </Container>
  );
}
