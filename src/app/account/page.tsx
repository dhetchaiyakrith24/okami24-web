import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/members/session";
import { listOrdersForMember } from "@/lib/commerce/orders";
import { getMemberStanding } from "@/lib/members/standing";
import { TIER_THRESHOLDS } from "@/lib/members/tiers";
import { lineImage } from "@/lib/commerce/line-image";
import { AccountView, type AccountOrder } from "@/components/account/AccountView";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";
import { memberSerif } from "@/components/account/member-font";

export const metadata: Metadata = {
  title: "บัญชีสมาชิก",
  description: "บัญชีสมาชิก — OKami24",
  ...canonicalFor("/account"),
  ...NOINDEX_FOLLOW,
};

/** The member page (queue Q4, owner 26/10: no member perks yet; moon cards owner 10/11). Not signed in → the login page. */
export default async function AccountPage() {
  const member = await getMember();
  if (!member) redirect("/account/login");
  const orders: AccountOrder[] = listOrdersForMember(member.id).map((o) => ({
    orderNumber: o.orderNumber,
    status: o.status,
    total: o.total,
    createdAt: o.createdAt,
    itemCount: o.itemCount,
    image: o.firstItem ? lineImage(o.firstItem.productSlug, o.firstItem.variantId) : null,
  }));
  const standing = { ...getMemberStanding(member.id), firstCardAt: TIER_THRESHOLDS[0].from };
  return (
    <div className={memberSerif.variable}>
      <AccountView displayName={member.displayName} provider={member.provider} orders={orders} standing={standing} />
    </div>
  );
}
