import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { requireOwner } from "@/lib/owner/auth";
import { listAccounts } from "@/lib/staff/accounts";
import { auditCounts, auditForDay } from "@/lib/staff/audit";
import { auditLabel, parseDay, parseWho, shiftDay, whoParam, type AuditWho } from "@/lib/staff/audit-rules";
import { OWNER_NAME, SHARED_NAME } from "@/lib/staff/account-rules";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import "@/components/dashboard/dashboard.css";

/**
 * /staff/owner/team/activity — "ใครทำอะไร" (owner 10/11: "พี่เห็นว่าใครคีย์ออเดอร์ไหน ใครให้ส่วนลดอะไร ใครกดรับออเดอร์เว็บ").
 * One Bangkok day at a time, newest first, filtered by person. Rows come from `staff_audit` (src/lib/staff/audit.ts) and are
 * never edited. The owner's eyes only (requireOwner).
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ใครทำอะไร",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const DAY_LABEL = new Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", weekday: "long", day: "numeric", month: "short" });
const TIME = new Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit" });
const readClock = () => Date.now();

function href(day: string, today: string, who: AuditWho): string {
  const q = new URLSearchParams();
  if (day !== today) q.set("day", day);
  const w = whoParam(who);
  if (w) q.set("who", w);
  const s = q.toString();
  return `/staff/owner/team/activity${s ? `?${s}` : ""}`;
}

const same = (a: AuditWho, b: AuditWho) => a.kind === b.kind && (a.kind !== "account" || (b.kind === "account" && a.id === b.id));

export default async function OwnerActivityPage({ searchParams }: { searchParams: Promise<{ day?: string; who?: string }> }) {
  await requireOwner();
  const q = await searchParams;
  const now = readClock();
  const today = parseDay(undefined, now);
  const day = parseDay(q.day, now);
  const who = parseWho(q.who);
  const rows = auditForDay(day, who);
  const counts = auditCounts(day);
  const total = counts.reduce((n, c) => n + c.n, 0);

  // Every account is a chip (even with nothing that day), then the owner and the shared password when they did something.
  const chips: { who: AuditWho; label: string; n: number }[] = [
    { who: { kind: "all" }, label: "ทุกคน", n: total },
    ...listAccounts().map((a) => ({ who: { kind: "account" as const, id: a.id }, label: a.name, n: counts.find((c) => c.kind === "account" && c.accountId === a.id)?.n ?? 0 })),
    ...(["owner", "shared"] as const)
      .map((kind) => ({ who: { kind }, label: kind === "owner" ? OWNER_NAME : SHARED_NAME, n: counts.find((c) => c.kind === kind)?.n ?? 0 }))
      .filter((c) => c.n > 0 || same(c.who, who)),
  ];

  return (
    <Container className="flex max-w-2xl flex-col gap-5 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar />
      <Link href="/staff/owner/team" className="-ml-2 inline-flex min-h-11 w-fit items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-foreground hover:bg-surface-2">
        <span aria-hidden>←</span> ทีมงาน
      </Link>
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">ใครทำอะไร</h1>

      <nav aria-label="เลือกวัน" className="flex items-center justify-between gap-3">
        <Link href={href(shiftDay(day, -1), today, who)} aria-label="วันก่อน" className="inline-flex size-11 items-center justify-center rounded-full border border-surface-border text-foreground hover:bg-white/5">
          ‹
        </Link>
        <span className="text-base font-semibold text-foreground">
          {day === today ? "วันนี้ · " : ""}
          {DAY_LABEL.format(new Date(`${day}T12:00:00+07:00`))}
        </span>
        {day < today ? (
          <Link href={href(shiftDay(day, 1), today, who)} aria-label="วันถัดไป" className="inline-flex size-11 items-center justify-center rounded-full border border-surface-border text-foreground hover:bg-white/5">
            ›
          </Link>
        ) : (
          <span aria-hidden className="size-11" />
        )}
      </nav>

      <nav aria-label="เลือกคน" className="flex flex-wrap gap-2">
        {chips.map((c) => {
          const on = same(c.who, who);
          return (
            <Link
              key={c.label}
              href={href(day, today, c.who)}
              aria-current={on ? "page" : undefined}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-sm ${on ? "bg-foreground font-semibold text-background" : "border border-surface-border text-foreground hover:bg-white/5"}`}
            >
              {c.label} <span className="tabular-nums">{c.n}</span>
            </Link>
          );
        })}
      </nav>

      {rows.length === 0 ? (
        <p className="text-sm text-foreground-muted">วันนี้ยังไม่มีใครทำอะไรในหลังบ้าน</p>
      ) : (
        <ol className="dash-card flex flex-col gap-0! py-1!">
          {rows.map((r) => (
            <li key={r.id} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-3 border-b border-surface-border-soft py-3 last:border-b-0">
              <span className="text-sm tabular-nums text-foreground-dim">{TIME.format(new Date(r.at))}</span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm text-foreground">
                  <b>{r.actorName}</b> {auditLabel(r.action)}
                  {r.orderNumber && (
                    <>
                      {" "}
                      <Link href={`/staff/orders/${encodeURIComponent(r.orderNumber)}`} className="text-ember-strong hover:underline">
                        {r.orderNumber}
                      </Link>
                    </>
                  )}
                </span>
                {r.detail && <span className="break-words text-xs text-foreground-dim">{r.detail}</span>}
              </span>
            </li>
          ))}
        </ol>
      )}
      <p className="text-xs leading-relaxed text-foreground-dim">บันทึกทุกอย่างที่ทีมกดในหลังบ้าน แก้หรือลบย้อนหลังไม่ได้ · ก่อนเปิดระบบบัญชีแอดมิน ระบบไม่รู้ว่าใครทำ</p>
    </Container>
  );
}
