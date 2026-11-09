"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { useLiveSoldOut } from "@/components/catalog/useLiveCardStock";
import { SoldOutPhotoBadge } from "@/components/product/SoldOutPhotoBadge";

/**
 * "สินค้าหมด" on a product card's photo (owner 10/11 ~02:00: "อยากให้มีป้ายบอกสินค้าหมด ลูกค้าจะได้ไม่เสียเวลากดเข้าไป").
 * The product page's own pill (SoldOutPhotoBadge, owner 08/10), centred on the bottom edge of the photo area — half on the photo,
 * half on the card's top padding — so it never covers the product (checker #1355: at 390 it sat over the device base) and
 * never meets the option count / flagship tag (top-left) or the heart (top-right). `builtSoldOut` = every option sold out as built — so the badge is in
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
        className="bottom-0 left-3 top-auto translate-y-1/2 max-lg:bottom-0 max-lg:left-2 max-lg:top-auto"
      />
    </span>
  );
}
