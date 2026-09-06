/**
 * Building blocks for the customer-service pages (how-to-order, shipping, contact, privacy,
 * claims-policy draft) — 2026-09-06, LAUNCH_AUDIT 3/4/12. Nothing new visually: the same
 * PageHeader → Container max-w-2xl → h2/p rhythm as /about, plus the existing Badge/Button and
 * the rounded-xl card that the about page already uses (designer direction 2026-09-06).
 *
 * `PendingFact` is the honesty mechanism these pages rely on: a fact the owner has not confirmed
 * (delivery time, carrier, opening hours, PDPA controller name…) is NEVER made up. In
 * development the note is shown inline so the owner sees exactly what to answer; in a
 * production build only the safe `fallback` sentence renders (or nothing). See
 * docs/PAGE_COPY_2026-09-06.md for the full list of open questions.
 */
"use client";

// Client module since 2026-09-06 (ง): the five service pages now render their body through a
// locale-aware client component (src/components/content/service-pages/*), and AgeNote /
// UpdatedAt read the active locale themselves. Nothing here needs server-only APIs.
import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { CONTACT } from "@/data/contact";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function ServiceSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-foreground">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-base leading-relaxed text-foreground-muted">{children}</div>
    </section>
  );
}

/** Three-up "answer the worry in 3 seconds" cards — placed first in the body (designer). */
export function SummaryCards({ items }: { items: { label: string; value: ReactNode; note?: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border border-surface-border-soft bg-surface-1 p-4">
          <span className="label-mono text-xs text-foreground-dim">{it.label}</span>
          {/* text-balance: keeps a two-line value from stranding one character on line 2 (zh, designer 2026-09-06) */}
          <p className="mt-2 font-display text-xl font-semibold leading-tight text-balance text-foreground">{it.value}</p>
          {it.note && <p className="mt-1 text-xs text-foreground-muted">{it.note}</p>}
        </div>
      ))}
    </div>
  );
}

/** Small label that groups steps into phases ("01 สั่ง / 02 จ่าย / 03 รับของ") — same idiom as the
 *  FAQ category headings. */
export function PhaseLabel({ children }: { children: ReactNode }) {
  return <span className="label-mono block text-xs text-ember">{children}</span>;
}

export interface Step {
  title: string;
  body: ReactNode;
}

/** Numbered steps — one column, number in an ember ring, title + at most two short lines. */
export function NumberedSteps({ steps, start = 1 }: { steps: Step[]; start?: number }) {
  return (
    <ol className="flex flex-col gap-5">
      {steps.map((s, i) => (
        <li key={s.title} className="flex gap-4">
          <span className="label-mono flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ember/40 bg-ember-soft/30 text-xs text-ember">
            {start + i}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground">{s.title}</h3>
            <div className="mt-1 text-sm leading-relaxed text-foreground-muted">{s.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Plain card, same look as the brand cards on /about. */
export function InfoCard({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-surface-border-soft bg-surface-1 p-4">
      <p className="font-semibold text-balance text-foreground">{title}</p>
      <div className="mt-1.5 flex flex-col gap-1.5 text-sm leading-relaxed text-foreground-muted">{children}</div>
    </div>
  );
}

export function LineLink({ children }: { children?: ReactNode }) {
  return (
    <Link href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-red">
      {children ?? CONTACT.lineId}
    </Link>
  );
}

/** The shop's official written channel (owner 2026-09-06, BSOT §3) — same styling as LineLink. */
export function EmailLink({ children }: { children?: ReactNode }) {
  return (
    <a href={`mailto:${CONTACT.email}`} className="font-semibold text-foreground hover:text-red">
      {children ?? CONTACT.email}
    </a>
  );
}

/**
 * A fact the owner still has to confirm. Dev: shows the question inline (unverified tone, same
 * as the spec labels). Production: renders `fallback` only — never the placeholder, never an
 * invented number. `always` forces the note to show (used on the claims-policy DRAFT page, which
 * itself never ships to production).
 */
const PENDING_FACT = {
  th: { badge: "เจ้าของต้องตอบ", prefix: "[ยังไม่มีข้อมูล]" },
  en: { badge: "Owner to confirm", prefix: "[No data yet]" },
  zh: { badge: "待店主确认", prefix: "[暂无资料]" },
} as const;

export function PendingFact({ question, fallback, always = false }: { question: string | Record<"th" | "en" | "zh", string>; fallback?: ReactNode; always?: boolean }) {
  const { locale } = useLocale();
  const showNote = always || process.env.NODE_ENV !== "production";
  const text = typeof question === "string" ? question : question[locale];
  return (
    <>
      {fallback && <p>{fallback}</p>}
      {showNote && (
        <div className="rounded-xl border border-unverified/30 bg-unverified/10 p-3 text-sm leading-relaxed text-unverified">
          <Badge tone="unverified" className="mb-1.5">
            {PENDING_FACT[locale].badge}
          </Badge>
          <p>
            {PENDING_FACT[locale].prefix} {text}
          </p>
        </div>
      )}
    </>
  );
}

const AGE_NOTE = {
  th: "เว็บไซต์นี้สำหรับผู้มีอายุ 21 ปีขึ้นไป · นิโคตินเป็นสารเสพติด",
  en: "This site is for people aged 21 and over · Nicotine is addictive",
  zh: "本网站面向 21 岁及以上人士 · 尼古丁具有成瘾性",
} as const;

const UPDATED_AT = { th: "อัปเดตล่าสุด", en: "Last updated", zh: "最后更新" } as const;

export function AgeNote() {
  const { locale } = useLocale();
  return <p className="border-t border-surface-border-soft pt-6 text-xs leading-relaxed text-foreground-dim">{AGE_NOTE[locale]}</p>;
}

export function UpdatedAt({ date }: { date: string }) {
  const { locale } = useLocale();
  return (
    <span className="label-mono text-xs text-foreground-dim">
      {UPDATED_AT[locale]} {date}
    </span>
  );
}

export const SERVICE_PAGES_UPDATED = "2026-09-06";
