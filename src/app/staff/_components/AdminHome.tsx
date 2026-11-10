import Link from "next/link";
import "./admin-home.css";
import { formatRunNumber } from "@/lib/commerce/run-number";
import { CARRIERS, STAFF_CARRIER_IDS, toStaffCarrierId } from "@/lib/commerce/carriers";
import type { StaffActor } from "@/lib/staff/account-rules";
import { STAFF_JOBS, TODO_JOBS, jobOf, type StaffJob } from "@/lib/staff/jobs";
import type { StaffOrderRow } from "@/lib/staff/orders";
import type { DayCount } from "@/lib/staff/order-count-rules";
import type { FeedHealth } from "@/lib/woo/watch-rules";
import { greeting, oldestPerStep, priorityQueue, STEP_SINCE, stepAge } from "@/lib/staff/admin-home-rules";
import { staffLogoutAction, staffOrderAction, staffShipnityPushAction } from "@/app/staff/actions";
import { PendingButton } from "@/app/staff/_components/PendingButton";
import { formatSatang } from "@/app/staff/_components/format";
import { FEED_LIGHT } from "@/app/staff/_components/feed-light";
import { OwnerViewPill } from "@/app/staff/_components/OwnerViewPill";

/**
 * The admin home at /staff (owner 10/11: "admin และพี่ แต่ละคนมี dashboard ของตัวเอง"; design v2 passed 11/11 — bigger key
 * numbers, buttons and heads, softer light). What is waiting now and how long, the order of work (money → warehouse → parcels,
 * longest wait first) with the everyday step right in the row — confirm a matched slip · send to Shipnity · enter the tracking
 * number — through the same Server Actions as the order page, landing back here (`from=home`). Then the shortcuts, what this
 * person did today, and the shop's switches. No owner money here: no cost, profit or bill (owner 04/11 — /staff/owner only).
 * Every figure comes from the database; the rules = src/lib/staff/admin-home-rules.ts.
 */

const SHOWN_PHONE = 3;
const SHOWN_WIDE = 5;

const STEP_HREF = (j: StaffJob) => `/staff/orders?f=${j}`;

/** The section links of the back office — one list for the wide-screen menu and the phone's tiles. */
const LINKS = [
  { href: "/staff/orders?f=all", label: "ออเดอร์", wide: true, phone: false },
  { href: "/staff/slip", label: "ตรวจสลิป LINE", wide: true, phone: true },
  { href: "/staff/stock", label: "เช็คสต็อก", wide: true, phone: true },
  { href: "/staff/customers", label: "ลูกค้า", wide: true, phone: true },
  { href: "/staff/tracking", label: "เช็คพัสดุ", wide: false, phone: true },
  { href: "/staff/sales", label: "ยอดเงินรายวัน", wide: true, phone: true },
  { href: "/staff/dev", label: "Okami dev", wide: true, phone: true },
];

export interface AdminHomeProps {
  actor: StaffActor;
  now: number;
  counts: Record<StaffJob, number>;
  waiting: StaffOrderRow[];
  days: DayCount[];
  mine: Record<string, number> | null;
  feed: FeedHealth;
  salesTodaySatang: number;
  shop: { cartOff: boolean; siteClosed: boolean; lineToWarehouse: boolean; autoToWarehouse: boolean; shipnityReady: boolean };
  notice: { tone: "ok" | "error"; text: string; orderNumber: string } | null;
  dateLabel: string;
}

/** A wait line: red text + red dot when late (a day or more), the yellow dot for a slip waiting; plain text otherwise. */
function Age({ late, wait = false, children, className = "" }: { late: boolean; wait?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <span className={`block ${late ? "ah-late" : "text-[#ebebeb]/70"} ${className}`}>
      {(late || wait) && <span aria-hidden className={`ah-dot mr-1.5 align-[0.08em] ${late ? "ah-dot-late" : "ah-dot-wait"}`} />}
      {children}
    </span>
  );
}

/** Keeps "45 นาที" / "เลขพัสดุ" on one line (a number never wraps away from its unit, a word never splits). */
const Keep = ({ children }: { children: React.ReactNode }) => <span className="whitespace-nowrap">{children}</span>;

/** A no-break space + "·" — written as a code so no raw U+00A0 sits in the source (THAI_STYLE §5(ฉ)). */
const NBSP_DOT = String.fromCharCode(0xa0) + "·";

/** "a · b · c" where each part stays whole and a line may break only after a "·" — never before it (designer 11/11). */
function Pieces({ parts }: { parts: (string | null)[] }) {
  const shown = parts.filter((p): p is string => Boolean(p));
  return shown.map((p, i) => (
    <span key={p}>
      <Keep>
        {p}
        {i < shown.length - 1 ? NBSP_DOT : ""}
      </Keep>
      {i < shown.length - 1 ? " " : ""}
    </span>
  ));
}

/** The step tile's label: "รอใส่เลขพัสดุ" breaks as "รอใส่ / เลขพัสดุ" on a phone, never inside "เลขพัสดุ" (designer 11/11). */
const tileLabel = (j: StaffJob) => (j === "tracking" ? <>รอใส่<Keep>เลขพัสดุ</Keep></> : STAFF_JOBS[j].label);

function QueueRow({ o, now, shop, wideOnly }: { o: StaffOrderRow; now: number; shop: AdminHomeProps["shop"]; wideOnly: boolean }) {
  const job = jobOf(o.status);
  const name = formatRunNumber(o.runNumber) ?? o.orderNumber;
  const href = `/staff/orders/${encodeURIComponent(o.orderNumber)}`;
  const age = stepAge(o, now);
  const carrier = toStaffCarrierId(o.carrier);
  const canPush = shop.shipnityReady && (o.channel !== "line" || shop.lineToWarehouse);
  const btn = "ah-press min-h-[3.25rem] px-6 text-base lg:min-h-12";
  const quiet = "ah-quiet min-h-[3.25rem] px-5 text-[0.95rem] lg:min-h-12";

  const status = (
    <Age late={age.late} wait={job === "slip"} className="text-sm leading-relaxed lg:text-[0.95rem]">
      <Pieces
        parts={[
          STAFF_JOBS[job].label,
          job === "slip" ? (o.slipVerdict === "pass" ? "สลิปยอดตรง" : "สลิปต้องดูเอง") : null,
          `${STEP_SINCE[job]} ${age.text}`,
          job === "tracking" && carrier ? CARRIERS[carrier].name.th : null,
        ]}
      />
    </Age>
  );

  let action: React.ReactNode;
  if (job === "slip") {
    action =
      o.slipVerdict === "pass" ? (
        <form action={staffOrderAction} className="flex gap-2 lg:flex-row-reverse">
          <input type="hidden" name="orderNumber" value={o.orderNumber} />
          <input type="hidden" name="action" value="confirm" />
          <input type="hidden" name="from" value="home" />
          <PendingButton className={`${btn} flex-1 lg:min-w-40 lg:flex-none`} pendingText="กำลังยืนยัน…">
            ยืนยันเงิน
          </PendingButton>
          <Link href={href} className={quiet}>
            ดูสลิป
          </Link>
        </form>
      ) : (
        <Link href={href} className={`${btn} lg:min-w-40`}>
          เปิดดูสลิป
        </Link>
      );
  } else if (job === "warehouse") {
    action = canPush ? (
      <form action={staffShipnityPushAction} className="flex">
        <input type="hidden" name="orderNumber" value={o.orderNumber} />
        <input type="hidden" name="from" value="home" />
        <PendingButton className={`${btn} flex-1 lg:min-w-40 lg:flex-none`} pendingText="กำลังส่งเข้าคลัง…">
          ส่งเข้าคลัง Shipnity
        </PendingButton>
      </form>
    ) : (
      <Link href={href} className={`${quiet} lg:text-sm`}>
        {o.channel === "line" ? "เปิดออเดอร์ · คีย์ใน Shipnity เอง" : "เปิดออเดอร์ · คัดลอกรายการส่งคลัง"}
      </Link>
    );
  } else {
    action = (
      <form action={staffOrderAction} className="flex flex-wrap gap-2">
        <input type="hidden" name="orderNumber" value={o.orderNumber} />
        <input type="hidden" name="action" value="ship" />
        <input type="hidden" name="from" value="home" />
        <label className="flex min-w-0 flex-[1_1_9rem] lg:w-44 lg:flex-none">
          <span className="sr-only">เลขพัสดุ {name}</span>
          <input
            name="tracking"
            required
            autoComplete="off"
            autoCapitalize="characters"
            placeholder="วางเลขพัสดุ"
            className="ah-field min-h-[3.25rem] w-full min-w-0 px-4 text-base lg:min-h-12"
          />
        </label>
        {carrier ? (
          <input type="hidden" name="carrier" value={carrier} />
        ) : (
          <label className="flex">
            <span className="sr-only">ขนส่ง {name}</span>
            <select name="carrier" defaultValue="thailand-post" className="ah-field min-h-[3.25rem] px-3 text-sm lg:min-h-12">
              {STAFF_CARRIER_IDS.map((c) => (
                <option key={c} value={c}>
                  {CARRIERS[c].name.th}
                </option>
              ))}
            </select>
          </label>
        )}
        <PendingButton className={btn} pendingText="กำลังบันทึก…">
          บันทึก
        </PendingButton>
      </form>
    );
  }

  return (
    // Phones: a card (number + price, the wait line, the button). Wide screens: one row on a grid — number · wait · who ·
    // price · button — the link's parts placed straight onto the row's columns (display: contents keeps them in the link).
    <li
      className={`${age.late ? "ah-well ah-well-late" : "ah-well"} flex flex-col gap-3 p-3.5 lg:grid lg:grid-cols-[6.5rem_minmax(0,1fr)_5.5rem_17.5rem] lg:items-center lg:gap-x-4 lg:px-4 lg:py-3 ${wideOnly ? "max-lg:hidden" : ""}`}
    >
      <Link href={href} className="flex min-w-0 flex-col gap-1 hover:opacity-90 lg:contents">
        <span className="flex items-baseline justify-between gap-3 lg:contents">
          <span className="min-w-0 truncate text-[1.06rem] font-bold lg:col-start-1 lg:row-start-1">
            {name}
            <span className="ml-2 text-sm font-normal text-[#ebebeb]/65 lg:hidden">
              {o.itemCount} ชิ้น · {o.channel === "line" ? "LINE" : "เว็บ"}
            </span>
          </span>
          <span className="shrink-0 text-[1.06rem] font-semibold tabular-nums lg:col-start-3 lg:row-start-1 lg:text-right">{formatSatang(o.total * 100)}</span>
        </span>
        <span className="flex min-w-0 flex-col gap-0.5 lg:col-start-2 lg:row-start-1">
          {status}
          <span className="hidden truncate text-sm text-[#ebebeb]/55 lg:block">
            {o.recipientName} · {o.itemCount} ชิ้น · {o.channel === "line" ? "LINE" : "เว็บ"}
          </span>
        </span>
      </Link>
      {/* The parcel form with the carrier picker is too wide for the row's last column: it takes its own line. */}
      <div className={job === "tracking" && !carrier ? "lg:col-span-full lg:row-start-2 lg:justify-self-end" : "lg:col-start-4 lg:row-start-1 lg:justify-self-end"}>{action}</div>
    </li>
  );
}

export function AdminHome(p: AdminHomeProps) {
  const { actor, now, counts, days, feed, shop } = p;
  const todo = TODO_JOBS.reduce((n, j) => n + counts[j], 0);
  const queue = priorityQueue(p.waiting);
  const oldest = oldestPerStep(p.waiting);
  const light = FEED_LIGHT[feed.state];
  const today = days[0];
  const yesterday = days[1];
  const waitingToday = today.line.waiting + today.web.waiting;
  const morePhone = queue.length - SHOWN_PHONE;
  const moreWide = queue.length - SHOWN_WIDE;
  const nextHref = (shown: number) => STEP_HREF(queue[shown] ? jobOf(queue[shown].status) : "tracking");
  const mine = p.mine && [
    { label: "คีย์ออเดอร์", n: p.mine["line-order"] ?? 0 },
    { label: "ยืนยันเงิน", n: p.mine["order-confirm"] ?? 0 },
    { label: "ส่งเข้าคลัง", n: (p.mine["order-shipnity"] ?? 0) + (p.mine["order-to-warehouse"] ?? 0) },
    { label: "ใส่เลขพัสดุ", n: p.mine["order-ship"] ?? 0 },
  ];
  const head = "text-[1.25rem] font-bold lg:text-[1.375rem]";

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      {actor.kind === "owner" && (
        <>
          <OwnerViewPill active="admin" waiting={todo} ownerHref="/staff/owner" />
          <p className="ah-banner flex items-center gap-2.5 px-4 py-3 text-sm leading-relaxed">
            <span aria-hidden className="ah-dot bg-[var(--ah-orange)]" />
            พี่กำลังเห็นหน้าเดียวกับแอดมิน · กดอะไรตรงนี้ บันทึกในชื่อ “เจ้าของ”
          </p>
        </>
      )}

      {/* Wide screens: the section menu as one glass bar (phones get the tiles below the queue). */}
      <nav aria-label="หลังบ้าน" className="ah-glass hidden items-center justify-between gap-3 rounded-full! py-2 pl-5 pr-2 lg:flex">
        <span className="font-bold">
          OKami24 <span className="font-normal text-[#ebebeb]/62">· หลังบ้าน</span>
        </span>
        <span className="flex flex-wrap gap-1">
          <span aria-current="page" className="ah-pill-on inline-flex min-h-11 items-center rounded-full px-4 text-[0.95rem] font-bold">
            งาน
          </span>
          {LINKS.filter((l) => l.wide).map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center rounded-full px-4 text-[0.95rem] hover:bg-white/10">
              {l.label}
            </Link>
          ))}
        </span>
      </nav>

      <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1 px-1">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-[#ebebeb]/62">{p.dateLabel}</span>
          <h1 className="text-[1.6rem] font-bold leading-tight lg:text-[2.1rem]">{greeting(actor)}</h1>
        </div>
      </header>

      {p.notice && (
        <p role={p.notice.tone === "error" ? "alert" : "status"} className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${p.notice.tone === "ok" ? "border-verified/40 bg-verified/10" : "border-danger/50 bg-danger/10"}`}>
          {p.notice.text}{" "}
          <Link href={`/staff/orders/${encodeURIComponent(p.notice.orderNumber)}`} className="ah-link whitespace-nowrap font-semibold">
            เปิดออเดอร์ ›
          </Link>
        </p>
      )}

      {(shop.siteClosed || shop.cartOff || feed.state !== "ok") && (
        <p className="flex flex-wrap gap-2 text-sm">
          {shop.siteClosed && <span className="rounded-full border border-danger/50 bg-danger/10 px-3 py-1.5 text-danger">เว็บปิดอยู่</span>}
          {shop.cartOff && <span className="rounded-full border border-unverified/40 bg-unverified/10 px-3 py-1.5 text-unverified">ตะกร้าปิดอยู่</span>}
          {feed.state !== "ok" && <span className={`rounded-full border px-3 py-1.5 ${feed.state === "down" ? "border-danger/50 bg-danger/10 text-danger" : "border-unverified/40 bg-unverified/10 text-unverified"}`}>คลัง{light.long}</span>}
        </p>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-1 lg:gap-5">
          <section aria-label="งานรอทำ" className="ah-glass ah-glass-hero flex flex-col gap-4 p-[1.15rem] lg:flex-row lg:items-stretch lg:gap-5 lg:p-6">
            <div className="flex items-end justify-between gap-3 lg:w-56 lg:flex-none lg:flex-col lg:items-start lg:justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[0.95rem] text-[#ebebeb]/72 lg:text-base">งานรอทำตอนนี้</span>
                <span className={`font-display text-[6rem] font-bold leading-[0.85] tabular-nums lg:text-[8.25rem] ${todo > 0 ? "" : "text-[#ebebeb]/40"}`}>{todo}</span>
              </div>
              <div className="flex flex-col items-end gap-0.5 pb-1.5 text-right lg:items-start lg:pb-0 lg:text-left">
                <span className="text-[0.8rem] text-[#ebebeb]/62">ออเดอร์วันนี้</span>
                <span className="text-base font-semibold tabular-nums lg:text-[1.05rem]">
                  เว็บ {today.web.orders} · LINE {today.line.orders}
                </span>
                {yesterday && (
                  <span className="text-[0.8rem] tabular-nums text-[#ebebeb]/55">
                    เมื่อวาน เว็บ {yesterday.web.orders} · LINE {yesterday.line.orders}
                  </span>
                )}
              </div>
            </div>
            <nav aria-label="งานแต่ละขั้น" className="grid grid-cols-3 gap-2 lg:flex-1 lg:gap-2.5">
              {TODO_JOBS.map((j) => {
                const first = oldest[j];
                const age = first ? stepAge(first, now) : null;
                return (
                  <Link key={j} href={STEP_HREF(j)} className={`${age?.late ? "ah-well ah-well-late" : "ah-well"} flex flex-col justify-between gap-1.5 p-3.5 hover:brightness-125 lg:gap-2 lg:p-4`}>
                    {/* Two lines kept for the label on a phone, so the three counts sit on one line. */}
                    <span className="min-h-[2.6em] text-[0.82rem] leading-snug text-[#ebebeb]/75 lg:min-h-0 lg:text-[0.95rem]">{tileLabel(j)}</span>
                    <span className={`font-display text-[2.5rem] font-bold leading-none tabular-nums lg:text-[4rem] ${counts[j] > 0 ? "" : "text-[#ebebeb]/35"}`}>{counts[j]}</span>
                    {age ? (
                      <Age late={age.late} className="whitespace-nowrap text-[0.76rem] lg:text-[0.95rem]">
                        เก่าสุด {age.text}
                      </Age>
                    ) : (
                      <span className="text-[0.76rem] text-[#ebebeb]/45 lg:text-[0.95rem]">ไม่มีค้าง</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </section>

          <section id="q" aria-label="ทำก่อน" className="ah-glass flex flex-col gap-2.5 p-4 lg:p-5">
            <h2 className="flex flex-wrap items-baseline justify-between gap-x-3 px-0.5 pb-1">
              <span className={head}>ทำก่อน</span>
              <span className="text-[0.82rem] text-[#ebebeb]/58">เงิน → คลัง → พัสดุ · รอนานสุดก่อน</span>
            </h2>
            {queue.length === 0 ? (
              <p className="px-0.5 text-base text-verified">ไม่มีงานค้าง</p>
            ) : (
              <ul className="flex flex-col gap-2.5 lg:gap-2">
                {queue.slice(0, SHOWN_WIDE).map((o, i) => (
                  <QueueRow key={o.orderNumber} o={o} now={now} shop={shop} wideOnly={i >= SHOWN_PHONE} />
                ))}
              </ul>
            )}
            {morePhone > 0 && (
              <Link href={nextHref(SHOWN_PHONE)} className="ah-link inline-flex min-h-11 items-center px-0.5 text-[0.95rem] font-semibold lg:hidden">
                ดูอีก {morePhone} ออเดอร์ ›
              </Link>
            )}
            {moreWide > 0 && (
              <Link href={nextHref(SHOWN_WIDE)} className="ah-link hidden min-h-11 items-center px-0.5 text-[0.95rem] font-semibold lg:inline-flex">
                ดูอีก {moreWide} ออเดอร์ ›
              </Link>
            )}
            <p className="flex flex-wrap items-center gap-x-4 px-0.5 text-sm text-[#ebebeb]/62 [&>*]:min-h-10!">
              <span className="text-[#ebebeb]/45">ดูออเดอร์อื่น</span>
              {(["unpaid", "done", "cancelled"] as const).map((j) => (
                <Link key={j} href={STEP_HREF(j)} className="inline-flex min-h-11 items-center hover:text-[#ebebeb]">
                  {STAFF_JOBS[j].label} <span className={`ml-1 tabular-nums ${j === "unpaid" && counts[j] > 0 ? "font-semibold text-unverified" : ""}`}>{counts[j]}</span>
                </Link>
              ))}
              <Link href="/staff/orders?f=all" className="inline-flex min-h-11 items-center hover:text-[#ebebeb]">
                ทั้งหมด
              </Link>
            </p>
          </section>
        </div>

        <div className="flex min-w-0 flex-col gap-4 lg:w-[22rem] lg:flex-none lg:gap-5">
          <nav aria-label="ทางลัด" className="grid grid-cols-2 gap-2 lg:rounded-[1.6rem] lg:border lg:border-white/12 lg:bg-white/[0.055] lg:p-[1.15rem]">
            <Link href="/staff/line-order" className="ah-press ah-press-glow col-span-2 min-h-[3.6rem] text-[1.06rem]">
              + คีย์ออเดอร์ LINE
            </Link>
            {LINKS.filter((l) => l.phone).map((l) => (
              <Link key={l.href} href={l.href} className={`ah-tile min-h-[3.25rem] px-2 text-[0.95rem] ${l.href === "/staff/slip" || l.href === "/staff/tracking" ? "" : "lg:hidden"}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {mine && (
            <section aria-label={`วันนี้ ${actor.name} ทำไปแล้ว`} className="ah-glass flex flex-col gap-3 p-4 lg:p-[1.15rem]">
              <h2 className={head}>วันนี้ {actor.name} ทำไปแล้ว</h2>
              <div className="grid grid-cols-4 gap-2 text-center">
                {mine.map((m) => (
                  <div key={m.label} className="ah-well flex flex-col gap-1 px-1 py-3">
                    <span className={`font-display text-[2.25rem] font-bold leading-none tabular-nums lg:text-[2.4rem] ${m.n > 0 ? "" : "text-[#ebebeb]/40"}`}>{m.n}</span>
                    <span className="text-[0.78rem] leading-snug text-[#ebebeb]/65">{m.label}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section aria-label="ร้านตอนนี้" className="ah-glass flex flex-col gap-3 p-4 text-[0.95rem] lg:p-[1.15rem]">
            <h2 className={head}>ร้านตอนนี้</h2>
            <p className="flex justify-between gap-3">
              <span className="text-[#ebebeb]/68">คลัง Shipnity</span>
              <Link href="/staff/dev" className={`inline-flex items-center gap-1.5 ${light.text}`}>
                <span aria-hidden className={`size-2 rounded-full ${light.dot}`} />
                สต็อก {light.short}
              </Link>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-[#ebebeb]/68">ส่งเข้าคลังอัตโนมัติ</span>
              <span>{shop.autoToWarehouse ? "เปิดอยู่" : "ปิดอยู่"}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-[#ebebeb]/68">ตะกร้าบนเว็บ</span>
              <span className={shop.cartOff ? "text-unverified" : ""}>{shop.cartOff ? "ปิดอยู่" : "เปิดอยู่"}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-[#ebebeb]/68">ยอดขายวันนี้ (เว็บ + LINE)</span>
              <Link href="/staff/sales" className="tabular-nums hover:text-[var(--ah-orange-hi)]">
                {formatSatang(p.salesTodaySatang)}
              </Link>
            </p>
            {waitingToday > 0 && <p className="text-sm text-unverified">วันนี้รอยืนยันยอด {waitingToday}</p>}
          </section>
        </div>
      </div>

      <form action={staffLogoutAction} className="flex flex-wrap items-center justify-between gap-x-3 px-1 text-sm text-[#ebebeb]/58">
        {/* Owner 10/11: every session names its person — what they press is recorded under this name. */}
        <span>เข้าระบบเป็น {actor.name}</span>
        <PendingButton className="inline-flex min-h-11 items-center rounded-full px-3 text-sm text-[#ebebeb]/70 hover:bg-white/10" pendingText="กำลังออก…">
          ออกจากระบบ
        </PendingButton>
      </form>
    </div>
  );
}
