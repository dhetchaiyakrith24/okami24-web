/**
 * The homepage hero (round "หน้าแรก hero", owner 20/10 — docs/rounds/รอบหน้าแรก-hero-20-10.txt).
 *
 * The four slots ARE the swappable data the owner asked for: one representative product per type,
 * shown in this order. Models live a few months, so swapping one is a one-line change here — the
 * name, brand and photo are read from the catalog (the product's own card photo), never typed.
 * `type` is a category slug: it picks the tab's label/description in the dictionaries
 * (`heroShowcase.types`) and the "browse this category" link. A product that stops being visible
 * on the storefront drops its slot instead of breaking the page (see page.tsx).
 */
export const HERO_TYPES = ["pod-systems", "switch-pods", "disposables", "heated-tobacco-devices"] as const;
export type HeroType = (typeof HERO_TYPES)[number];

export const HOME_HERO_SLOTS: { type: HeroType; product: string }[] = [
  { type: "pod-systems", product: "caliburn-g5" },
  { type: "switch-pods", product: "m-switch-kit" },
  { type: "disposables", product: "infy-20k" },
  { type: "heated-tobacco-devices", product: "iqosheet-17" },
];

/**
 * Phones (below 64rem): "showcase" = the new hero · "classic" = the previous phone hero
 * (Hero.tsx, owner-liked "calm, plain") on phones while desktop keeps the new one. One value is the
 * whole switch back (owner 20/10: keep the current mobile hero restorable in one step).
 */
export const PHONE_HERO: "showcase" | "classic" = "showcase";

/**
 * Desktop: the scroll-scrubbed cinematic intro (HomeIntro → cinematic/) above the hero.
 * Owner 20/10: "เอาฉากเปิดบนคอมออก ให้ hero ใหม่เป็นจอแรก" → false. true puts the intro back (code untouched).
 */
export const DESKTOP_INTRO = false;
