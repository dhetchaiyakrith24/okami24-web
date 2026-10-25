import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/members/session";
import { enabledMemberProviders } from "@/lib/members/providers";
import { ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";
import { AccountLoginView } from "@/components/account/AccountLoginView";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";
import { memberSerif } from "@/components/account/member-font";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบสมาชิก",
  description: "เข้าสู่ระบบสมาชิก — OKami24",
  ...canonicalFor("/account/login"),
  ...NOINDEX_FOLLOW,
};

/** Member sign-in (queue Q4, owner 26/10 — drafts v2 `_incoming/q4-drafts/`). Reads the member cookie, so never prerendered. */
export default async function AccountLoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  if (await getMember()) redirect("/account");
  const { error, next } = await searchParams;
  return (
    <div className={memberSerif.variable}>
      <AccountLoginView
        providers={enabledMemberProviders()}
        showError={error !== undefined}
        orderingEnabled={ORDERING_ENABLED}
        next={next ?? null}
      />
    </div>
  );
}
