import { getProduct } from "@/data/products";
import { getPublishedProductBySlug } from "@/data/shipnity-seed/storefront-preview-read-model";
import { RAIL_CARDS } from "@/data/home-sections";
import { newArrivalSlugs } from "@/lib/new-arrivals";
import { HomeText } from "@/components/home/HomeCopy";
import { HomeCardRail, type HomeCardItem } from "@/components/home/HomeCardRail";

/**
 * "สินค้าเข้าใหม่" (owner 29/10: new products show near the top of the homepage by themselves). The same section as the type
 * rows below it, filled from the listing dates — nothing to update by hand; a new product appears with its listing deploy.
 * No "see all" link: there is no newest-first page to send it to, and every card it holds is on the row itself.
 */
export function HomeNewArrivals() {
  const items: HomeCardItem[] = newArrivalSlugs(RAIL_CARDS).flatMap<HomeCardItem>((slug) => {
    const legacy = getProduct(slug);
    if (legacy) return [{ slug, legacy, published: null }];
    const published = getPublishedProductBySlug(slug);
    return published ? [{ slug, legacy: null, published }] : [];
  });
  if (items.length === 0) return null;
  return <HomeCardRail tag="New In" title={<HomeText k="newTitle" />} desc={<HomeText k="newDesc" />} items={items} />;
}
