"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { MemberProvider } from "@/lib/members/providers";
import { GOLD, MEMBER_GLOW, ProviderMark } from "./account-ui";

/**
 * /account/login — drafts v2 (owner 26/10 "พรีเมียม เรียบหรู"): phone = one column on a warm glow; desktop = product photo
 * half + sign-in half. LINE green and Google white are the providers' own button colours. No member perks here (owner).
 * The buttons are plain links to /api/auth/<provider> — a full-page redirect to the provider, no client JS needed.
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

  return (
    <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-2">
      <div className="relative hidden items-center justify-center overflow-hidden bg-[#0d0d10] lg:flex" style={{ backgroundImage: MEMBER_GLOW }}>
        <div className="relative h-[560px] w-[320px]">
          <Image
            src="/assets/products/argus-g4/card-v3.webp"
            alt=""
            fill
            sizes="320px"
            priority
            className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
          />
        </div>
        <span className="absolute bottom-12 left-14 font-display text-xs font-semibold tracking-[0.32em]" style={{ color: GOLD }} lang="en">
          AUTHENTIC · DIRECT · OKAMI24
        </span>
      </div>

      <div className="flex items-start justify-center px-7 py-14 lg:items-center lg:py-20" style={{ backgroundImage: MEMBER_GLOW }}>
        <div className="w-full max-w-[420px]">
          <span className="font-display text-xs font-semibold tracking-[0.32em]" style={{ color: GOLD }} lang="en">
            {t.eyebrow}
          </span>
          <h1 className="mt-3.5 font-display text-[40px] font-semibold leading-[1.05] tracking-[0.02em] text-foreground">{t.loginTitle}</h1>
          <p className="mt-3 text-[15px] leading-[1.8] text-foreground-muted">
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
  );
}
