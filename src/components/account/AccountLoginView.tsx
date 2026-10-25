"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { MemberProvider } from "@/lib/members/providers";
import { GOLD, ProviderMark } from "./account-ui";
import s from "./member-stage.module.css";

/** The curtain + moon stage (direction A, owner 26/10). `moon` = the moon's size and top offset for this stage. */
function Stage({ className, moon, children }: { className: string; moon: { size: number; top: string }; children?: ReactNode }) {
  return (
    <div className={`${s.stage} ${className}`} aria-hidden>
      <div className={s.moon} style={{ width: moon.size, height: moon.size, top: moon.top }} />
      <div className={s.grain} />
      <div className={`${s.curtain} ${s.curtainLeft}`} />
      <div className={`${s.curtain} ${s.curtainRight}`} />
      <div className={s.seam} />
      {children}
    </div>
  );
}

/**
 * /account/login — direction A "ลอดม่านเข้าบ้าน" (owner 26/10 picked A + the heading "ยินดีต้อนรับสู่บ้าน OKami24" + the new
 * sub-lines; drafts `_incoming/q4-drafts/v3/`). Desktop: the curtain stage fills the left half, the sign-in column the right.
 * Phone: a short stage band on top, the column overlapping its lower edge. LINE green and Google white are the providers' own
 * button colours. No member perks here (owner). The buttons are plain links to /api/auth/<provider> — no client JS needed.
 * The heading face comes from the page (`memberSerif.variable`, see member-font.ts).
 */
export function AccountLoginView({
  providers,
  showError,
  orderingEnabled,
  next,
}: {
  providers: MemberProvider[];
  showError: boolean;
  orderingEnabled: boolean;
  next: string | null;
}) {
  const { dict } = useLocale();
  const t = dict.account;
  const query = next ? `?next=${encodeURIComponent(next)}` : "";
  // "\n" in the dictionary = where the heading breaks (th: the shop name on its own line, owner-approved wording).
  const titleLines = t.loginTitle.split("\n");

  return (
    <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-2">
      <Stage className="hidden lg:block" moon={{ size: 460, top: "22%" }}>
        <span className="absolute bottom-12 left-14 font-display text-xs font-semibold tracking-[0.32em]" style={{ color: GOLD }} lang="en">
          AUTHENTIC · DIRECT · OKAMI24
        </span>
      </Stage>

      <div className="flex flex-col bg-[#0a0a0c] lg:items-center lg:justify-center lg:py-20">
        <Stage className="h-[170px] lg:hidden" moon={{ size: 300, top: "40px" }} />
        <div className="relative -mt-7 w-full px-7 pb-14 lg:mt-0 lg:max-w-[470px] lg:px-0 lg:pb-0">
          <span className="font-display text-xs font-semibold tracking-[0.32em]" style={{ color: GOLD }} lang="en">
            {t.eyebrow}
          </span>
          <h1 className="mt-4 font-[family-name:var(--font-member-serif)] text-[40px] font-light leading-[1.12] text-foreground lg:text-[60px]">
            {titleLines.map((line, i) => (
              <span key={line} className={s.line}>
                <span className={`${s.lineInner} ${i > 0 ? "font-normal" : ""}`} style={{ animationDelay: `${500 + i * 120}ms` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <div className={`${s.rule} mt-6`} />

          <div className={s.fadeIn}>
            <p className="mt-6 text-[15px] leading-[1.85] text-foreground-muted [text-wrap:pretty]">
              {t.loginLine1}
              <br />
              {t.loginLine2}
            </p>

            {showError && <p className="mt-6 text-sm text-ember">{t.loginError}</p>}

            {providers.length === 0 ? (
              <p className="mt-9 text-sm leading-relaxed text-foreground-muted">{t.loginUnavailable}</p>
            ) : (
              <div className="mt-9 flex flex-col gap-3">
                {providers.includes("line") && (
                  <a
                    href={`/api/auth/line${query}`}
                    className="flex h-[54px] items-center justify-center gap-3 rounded-[14px] bg-[#06C755] text-[15px] font-medium text-white transition-[filter] hover:brightness-110"
                  >
                    <ProviderMark provider="line" />
                    {t.continueLine}
                  </a>
                )}
                {providers.includes("google") && (
                  <a
                    href={`/api/auth/google${query}`}
                    className="flex h-[54px] items-center justify-center gap-3 rounded-[14px] bg-[#f4f2ee] text-[15px] font-medium text-[#1b1b1d] transition-[filter] hover:brightness-95"
                  >
                    <ProviderMark provider="google" />
                    {t.continueGoogle}
                  </a>
                )}
              </div>
            )}

            <p className="mt-5 text-xs leading-relaxed text-foreground-dim">
              {t.privacyNote}{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground-muted">
                {t.privacyLink}
              </Link>
            </p>

            <div className="mb-5 mt-9 h-px bg-[linear-gradient(90deg,transparent,rgba(200,178,138,0.45),transparent)]" />
            <p className="text-center text-[13px] leading-[1.8] text-foreground-muted">
              {orderingEnabled && (
                <>
                  {t.guestOrdering}
                  <br />
                </>
              )}
              <Link href="/orders" className="hover:underline" style={{ color: GOLD }}>
                {t.guestLookup}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
