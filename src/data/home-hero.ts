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

/**
 * `photo` (optional, desktop only): the product lying almost flat across the stage, pod toward the headline,
 * end toward the name (owner 20–21/10), transparent so the ribbons run on behind it; phones keep the standing
 * card photo. It is the product's own card photo rotated (AI re-renders warped the device — owner: "บิดๆ
 * เบี้ยวๆ"). Remove the field = that slot is back to the card photo everywhere.
 */
export const HOME_HERO_SLOTS: { type: HeroType; product: string; photo?: string }[] = [
  { type: "pod-systems", product: "caliburn-g5", photo: "/assets/hero/caliburn-g5-lying.webp" },
  { type: "switch-pods", product: "m-switch-kit", photo: "/assets/hero/m-switch-kit-lying.webp" },
  { type: "disposables", product: "infy-20k", photo: "/assets/hero/infy-20k-lying.webp" },
  { type: "heated-tobacco-devices", product: "iqosheet-17", photo: "/assets/hero/iqos-iluma-one-lying.webp" },
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

/**
 * The light that flows down the homepage below the hero (HomeFlow) at all. Owner 21/10: "เก็บแสงส้มตอนเลื่อน
 * และมันวิ่งตาม เข้าคลังไว้ ไม่เปิดใช้" — kept in the code, switched off; the hero's own light and the four
 * brand slots stay on desktop and phones. true = back exactly as #645/#640 (the two flags below still apply).
 */
export const HOME_FLOW = false;

/**
 * The light that flows down the homepage below the hero (HomeFlow). Owner 20/10 ~05:40: "keep this
 * version" (#639 — the ribbon fully laid on the page, brightness swelling by itself) and try the
 * scroll as the thing that plays the light:
 *   FLOW_DRAW_ON_SCROLL — the line is laid as the visitor scrolls; nothing waits further down.
 *   FLOW_GLOW_ON_SCROLL — the part of the line at the scroll position brightens while scrolling.
 * Both false = the #639 version, unchanged. Either can be on alone.
 */
export const FLOW_DRAW_ON_SCROLL = true;
export const FLOW_GLOW_ON_SCROLL = true;
