"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { useLiveSoldOut } from "@/components/catalog/useLiveCardStock";
import { SoldOutPhotoBadge } from "@/components/product/SoldOutPhotoBadge";

/**
 * "สินค้าหมด" on a product card's photo (owner 10/11 ~02:00: "อยากให้มีป้ายบอกสินค้าหมด ลูกค้าจะได้ไม่เสียเวลากดเข้าไป").
 * The product page's own pill (SoldOutPhotoBadge, owner 08/10), placed bottom-left so it never meets the option count /
 * flagship tag (top-left) or the heart (top-right). `builtSoldOut` = every option sold out as built — so the badge is in
 * the first paint for those — and the warehouse's live answer then overrides it (useLiveCardStock, one request per page):
 * a product that sold out or came back since the build changes without a rebuild. The photo stays full colour (owner 08/10).
 */
export function CardSoldOutBadge({ slug, builtSoldOut }: { slug: string; builtSoldOut: boolean }) {
  const { dict } = useLocale();
  const soldOut = useLiveSoldOut(slug, builtSoldOut);
  if (!soldOut) return null;
  return (
    <span data-card-soldout="">
      <SoldOutPhotoBadge
        label={dict.product.outOfStockChip}
        className="bottom-3 left-3 top-auto max-lg:bottom-2 max-lg:left-2 max-lg:top-auto"
      />
    </span>
  );
}
