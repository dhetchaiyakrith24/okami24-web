"use client";

import { useMemo, useState } from "react";
import { setSwitchAction } from "@/app/staff/owner/actions";
import { PendingButton } from "@/app/staff/_components/PendingButton";

interface Product {
  slug: string;
  name: string;
}

const ASK = {
  cart: {
    off: { title: "ปิดตะกร้า?", body: "ลูกค้ายังดูสินค้าได้ แต่จะสั่งผ่าน LINE แทน ออเดอร์ที่สั่งแล้วไม่กระทบ", yes: "ปิดตะกร้า" },
    on: { title: "เปิดตะกร้า?", body: "ลูกค้ากลับมาสั่งซื้อบนเว็บได้ทันที", yes: "เปิดตะกร้า" },
  },
  site: {
    off: { title: "ปิดเว็บชั่วคราว?", body: "ลูกค้าจะเห็นหน้าแจ้งปิดชั่วคราวพร้อมลิงก์ LINE หลังบ้าน บอทตรวจสลิป และหน้าติดตามออเดอร์ยังใช้ได้", yes: "ปิดเว็บชั่วคราว" },
    on: { title: "เปิดเว็บ?", body: "ลูกค้ากลับมาเข้าเว็บได้ตามปกติทันที", yes: "เปิดเว็บ" },
  },
  line: {
    off: { title: "ปิดการส่งออเดอร์ LINE เข้าคลัง?", body: "แอดมินกลับไปคีย์ออเดอร์ LINE ใน Shipnity เองตามเดิม ออเดอร์ที่ส่งไปแล้วไม่กระทบ", yes: "ปิดการส่ง" },
    on: { title: "เปิดการส่งออเดอร์ LINE เข้าคลัง?", body: "ออเดอร์ LINE ที่คีย์ในหลังบ้านจะมีปุ่มส่งเข้าคลังในหน้าออเดอร์ แอดมินไม่ต้องคีย์ใน Shipnity ซ้ำ · เปิดเมื่อคลังกลับมาส่งของได้", yes: "เปิดการส่ง" },
  },
  auto: {
    off: { title: "ปิดการส่งเข้าคลังอัตโนมัติ?", body: "แอดมินกลับไปกดส่งเข้าคลังเองในหน้าออเดอร์ ออเดอร์ที่ส่งไปแล้วไม่กระทบ", yes: "ปิดอัตโนมัติ" },
    on: { title: "เปิดการส่งเข้าคลังอัตโนมัติ?", body: "แอดมินกดยืนยันยอดเงินแล้ว ระบบส่งออเดอร์เข้า Shipnity ให้เองทันที ไม่ต้องกดอีกครั้ง · ออเดอร์ LINE ส่งเองเมื่อเปิดสวิตช์ LINE ด้วย · แอดมินห้ามคีย์ใน Shipnity ซ้ำ · เปิดเมื่อคลังกลับมาส่งของได้", yes: "เปิดอัตโนมัติ" },
  },
} as const;

/** One toggle. Nothing changes on the first tap: a switch this size asks first, and says how to undo it. */
function Toggle({ kind, label, on, onText, offText, locked }: { kind: "cart" | "site" | "line" | "auto"; label: string; on: boolean; onText: string; offText: string; locked?: string }) {
  const [asking, setAsking] = useState(false);
  const ask = ASK[kind][on ? "off" : "on"];
  return (
    <li className="flex flex-col gap-3 py-3">
      <div className="flex min-h-11 items-center justify-between gap-3">
        <span className="flex min-w-0 flex-col">
          <span className="text-foreground">{label}</span>
          <span className={`text-sm ${locked ? "text-unverified" : on ? "text-verified" : "text-danger"}`}>{locked ?? (on ? onText : offText)}</span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={label}
          disabled={Boolean(locked)}
          onClick={() => setAsking(true)}
          className={`relative h-8 w-14 shrink-0 rounded-full transition-colors disabled:opacity-50 ${on ? "bg-ember" : "bg-surface-3"}`}
        >
          <span aria-hidden className={`absolute left-[3px] top-[3px] size-[26px] rounded-full bg-foreground transition-transform ${on ? "translate-x-6" : ""}`} />
        </button>
      </div>
      {asking && (
        <form action={setSwitchAction} onSubmit={() => setTimeout(() => setAsking(false), 0)} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-surface-2 p-3">
          <input type="hidden" name="kind" value={kind} />
          <input type="hidden" name="value" value={on ? "off" : "on"} />
          <span className="font-semibold text-foreground">{ask.title}</span>
          <span className="text-sm leading-relaxed text-foreground-muted">{ask.body}</span>
          <div className="flex flex-wrap gap-2">
            <PendingButton className="inline-flex min-h-11 items-center rounded-full bg-ember px-5 text-sm font-semibold text-surface-1 hover:opacity-90" pendingText="กำลังทำ…">
              {ask.yes}
            </PendingButton>
            <button type="button" onClick={() => setAsking(false)} className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 text-sm font-semibold text-foreground hover:bg-white/5">
              ยังไม่ทำ
            </button>
          </div>
        </form>
      )}
    </li>
  );
}

function HideForm({ slug, value, label, tone }: { slug: string; value: "on" | "off"; label: string; tone: string }) {
  return (
    <form action={setSwitchAction}>
      <input type="hidden" name="kind" value="hide" />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="value" value={value} />
      <PendingButton className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold ${tone}`} pendingText="กำลังทำ…">
        {label}
      </PendingButton>
    </form>
  );
}

export function ShopSwitchPanel({
  orderingBuilt,
  cartOff,
  siteClosed,
  lineToWarehouse,
  autoToWarehouse,
  hidden,
  products,
}: {
  orderingBuilt: boolean;
  cartOff: boolean;
  siteClosed: boolean;
  lineToWarehouse: boolean;
  autoToWarehouse: boolean;
  hidden: Product[];
  products: Product[];
}) {
  const [query, setQuery] = useState("");
  const found = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const shown = new Set(hidden.map((p) => p.slug));
    return products.filter((p) => !shown.has(p.slug) && (p.name.toLowerCase().includes(q) || p.slug.includes(q))).slice(0, 8);
  }, [query, products, hidden]);

  return (
    <>
      <section aria-label="สวิตช์ร้าน" className="dash-card dash-rise">
        <h2 className="font-semibold text-foreground">สวิตช์ร้าน</h2>
        <ul className="dash-rows flex flex-col">
          <Toggle kind="cart" label="ตะกร้าและการสั่งซื้อ" on={orderingBuilt && !cartOff} onText="เปิดอยู่ ลูกค้าสั่งบนเว็บได้" offText="ปิดอยู่ ลูกค้าสั่งผ่าน LINE" locked={orderingBuilt ? undefined : "ปิดจากค่าระบบ เปิดจากปุ่มนี้ไม่ได้"} />
          <Toggle kind="site" label="เปิดเว็บ" on={!siteClosed} onText="เปิดอยู่ตามปกติ" offText="ปิดชั่วคราว ลูกค้าเห็นหน้าแจ้งปิด" />
          <Toggle kind="line" label="ส่งออเดอร์ LINE เข้าคลังจากหลังบ้าน" on={lineToWarehouse} onText="เปิดอยู่ แอดมินกดส่งจากหน้าออเดอร์" offText="ปิดอยู่ แอดมินคีย์ใน Shipnity ตามเดิม" />
          <Toggle kind="auto" label="ส่งเข้าคลังอัตโนมัติเมื่อยืนยันยอด" on={autoToWarehouse} onText="เปิดอยู่ ยืนยันยอดแล้วระบบส่งเข้า Shipnity เอง" offText="ปิดอยู่ แอดมินกดส่งเข้าคลังเอง" />
        </ul>
      </section>
      <section aria-label="ซ่อนสินค้า" className="dash-card dash-rise">
        <h2 className="font-semibold text-foreground">ซ่อนสินค้า</h2>
        <label className="flex flex-col gap-1.5 text-sm text-foreground-muted">
          ค้นหาสินค้าที่จะซ่อน
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="พิมพ์ชื่อรุ่น"
            className="min-h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-base text-foreground placeholder:text-foreground-muted"
          />
        </label>
        {query.trim().length >= 2 && found.length === 0 && <p className="text-sm text-foreground-muted">ไม่พบสินค้า</p>}
        {found.length > 0 && (
          <ul className="dash-rows flex flex-col">
            {found.map((p) => (
              <li key={p.slug} className="flex items-center justify-between gap-3 py-2">
                <span className="min-w-0 text-sm text-foreground">{p.name}</span>
                <HideForm slug={p.slug} value="on" label="ซ่อน" tone="border-white/15 text-foreground hover:bg-white/5" />
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-foreground-muted">ซ่อนอยู่ตอนนี้ · ลูกค้าไม่เห็นและสั่งไม่ได้</h3>
          {hidden.length === 0 ? (
            <p className="text-sm text-foreground-muted">ไม่มีสินค้าที่ซ่อนอยู่</p>
          ) : (
            <ul className="dash-rows flex flex-col">
              {hidden.map((p) => (
                <li key={p.slug} className="flex items-center justify-between gap-3 py-2">
                  <span className="min-w-0 text-sm text-foreground">{p.name}</span>
                  <HideForm slug={p.slug} value="off" label="เปิดกลับ" tone="border-ember text-ember-strong hover:bg-white/5" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
