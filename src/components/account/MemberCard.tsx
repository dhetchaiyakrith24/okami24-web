"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ROOM_ORDER, type MemberTier } from "@/lib/members/tiers";
import { cn } from "@/lib/utils";
import { GOLD } from "./account-ui";
import s from "./member-card.module.css";

/**
 * Thai sentence that may break only at its own spaces (between phrases): Chrome's dictionary break split "ที่|นี่" and, with
 * text-wrap: balance, "บัตร|สมาชิก" at 390 (measured 10/11 on the test server). Each phrase is short enough for a 320 px
 * screen (widest 227 px at 13-15 px). en/zh render as they are — zh has no spaces, one chunk would run off the screen.
 */
function Phrases({ text, locale }: { text: string; locale: "th" | "en" | "zh" }) {
  if (locale !== "th") return <>{text}</>;
  // A number stays with the word after it ("2 ครั้ง" — never a number split from its Thai unit).
  const parts: string[] = [];
  for (const w of text.split(" ")) {
    const last = parts[parts.length - 1];
    if (last !== undefined && /^\d+$/.test(last)) parts[parts.length - 1] = `${last}${String.fromCharCode(0xa0)}${w}`;
    else parts.push(w);
  }
  // The space sits OUTSIDE the no-wrap span: inside it, the line could not break there (10/11, 360 px ran off the box).
  return (
    <>
      {parts.map((w, i) => (
        <span key={i}>
          {i > 0 ? " " : ""}
          <span className="whitespace-nowrap">{w}</span>
        </span>
      ))}
    </>
  );
}

/** "ต.ค. 2569" — the month the account was made, in the visitor's language (members.created_at is UTC). */
function memberSinceLabel(iso: string, locale: "th" | "en" | "zh"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const tag = locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-GB";
  return d.toLocaleDateString(tag, { month: "short", year: "numeric", timeZone: "Asia/Bangkok" });
}

/**
 * The member's moon card (owner 10/11, draft v8): tier name · member since · counted orders — nothing else. Below the first
 * card, one quiet line says when it comes. No perk is shown: BSOT "no member perks yet" (the draft's "สิทธิพิเศษ" placeholder
 * stays off the live page until the owner sets one).
 */
export function MemberCard({ tier, count, memberSince, firstCardAt }: { tier: MemberTier | null; count: number; memberSince: string | null; firstCardAt: number }) {
  const { dict, locale } = useLocale();
  const t = dict.account;
  if (!tier) {
    return (
      <div className="rounded-[20px] border border-white/[0.07] p-[22px]">
        <p className="text-[15px] text-foreground">
          <Phrases text={t.tierComing.replace("{count}", String(firstCardAt))} locale={locale} />
        </p>
        <p className="mt-1.5 text-[13px] text-foreground-muted">
          <Phrases text={t.tierCountNote} locale={locale} />
        </p>
      </div>
    );
  }
  const name = { crescent: t.tierCrescent, half: t.tierHalf, full: t.tierFull }[tier];
  const en = { crescent: "Crescent", half: "Half Moon", full: "Full Moon" }[tier];
  const since = memberSince ? memberSinceLabel(memberSince, locale) : "";
  return (
    <div>
      <div className={cn(s.card, s[tier])} role="group" aria-label={`${t.tierCardLabel} · ${name}`}>
        {tier === "crescent" && <i className={s.slash} aria-hidden />}
        {tier === "half" && (
          <div className={s.panel} aria-hidden>
            <i className={s.halfArt} />
          </div>
        )}
        {tier === "full" && (
          <>
            <i className={s.fullArt} aria-hidden />
            <i className={s.shade} aria-hidden />
            <i className={s.moon} aria-hidden />
          </>
        )}
        <div className={s.top}>
          <span className={s.brand} lang="en">
            OKAMI24 MEMBER
          </span>
          {tier === "half" && (
            <span className={s.tag} lang="en">
              HALF MOON
            </span>
          )}
        </div>
        {tier === "half" && <i className={s.chip} aria-hidden />}
        <div className={s.tier}>
          <span className={s.th}>{name}</span>
          {locale !== "en" && (
            <span className={s.en} lang="en">
              {en}
            </span>
          )}
        </div>
        <div className={s.facts}>
          <span>{since ? t.memberSince.replace("{date}", since) : ""}</span>
          <span>
            {t.ordersCounted.split("{count}")[0]}
            <b>{count}</b>
            {t.ordersCounted.split("{count}")[1] ?? ""}
          </span>
        </div>
      </div>
      <p className="mt-2 text-xs text-foreground-dim">
        <Phrases text={t.tierCountNote} locale={locale} />
      </p>
    </div>
  );
}

/** The full-moon room (10+ only — the server renders it only then, and every picture is checked again by the art route). */
export function MemberRoom() {
  const { dict, locale } = useLocale();
  const t = dict.account;
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const shut = () => {
    setOpen(null);
    lastRef.current?.focus();
  };

  return (
    <section className={s.room} aria-labelledby="member-room">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="member-room" className="font-[family-name:var(--font-member-serif)] text-2xl" style={{ color: "#f2efe9" }}>
          {t.roomTitle}
        </h2>
        <span className="text-xs" style={{ color: GOLD }}>
          {t.roomSource}
        </span>
      </div>
      <p className="text-sm text-foreground-muted"><Phrases text={t.roomHint} locale={locale} /></p>
      <div className={s.gallery}>
        {ROOM_ORDER.map((name, i) => (
          <button
            key={name}
            type="button"
            className={s.thumb}
            onClick={(e) => {
              lastRef.current = e.currentTarget;
              setOpen(i);
            }}
            aria-label={t.roomOpen.replace("{n}", String(i + 1))}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- a gated per-member file: next/image's optimizer would cache it for everyone */}
            <img src={`/api/account/art/${name}`} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      {open !== null && (
        <div className={s.lightbox} role="dialog" aria-modal="true" aria-label={t.roomTitle} onClick={(e) => e.target === e.currentTarget && shut()}>
          {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
          <img src={`/api/account/art/${ROOM_ORDER[open]}`} alt="" />
          <button ref={closeRef} type="button" className={s.close} onClick={shut}>
            {t.roomClose}
          </button>
        </div>
      )}
    </section>
  );
}
