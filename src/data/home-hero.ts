/**
 * The homepage hero (round "หน้าแรก hero", owner 20/10 — docs/rounds/รอบหน้าแรก-hero-20-10.txt).
 *
 * The four slots ARE the swappable data the owner asked for. Owner 21/10 ("ทาง 1"): one strong BRAND each —
 * UWELL · VOOPOO · SALTHUB · and Friday's pick IQOS — so two slots may share a type. Models live a few
 * months, so swapping one is a one-line change here — the name, brand and photo are read from the catalog
 * (the product's own card photo), never typed. The tab shows the brand; `type` is a category slug: it picks
 * the tab's English type tag and description (`heroShowcase.types`) and the "browse this category" link.
 * A product that stops being visible
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
export const HOME_HERO_SLOTS: { type: HeroType; product: string; photo?: string; desktopOnly?: boolean }[] = [
  { type: "pod-systems", product: "caliburn-g5", photo: "/assets/hero/caliburn-g5-lying.webp" },
  // ARGUS G4, not P3: P3 is a square box that does not read as "lying"; G4 is slim, sharp, ember-orange
  { type: "pod-systems", product: "argus-g4", photo: "/assets/hero/argus-g4-lying.webp" },
  { type: "switch-pods", product: "m-switch-kit", photo: "/assets/hero/m-switch-kit-lying.webp" },
  { type: "heated-tobacco-devices", product: "iqosheet-17", photo: "/assets/hero/iqos-iluma-one-lying.webp" },
  // desktop deck only (owner 21/10 "มันอาจเพิ่มสินค้าได้ด้วย"): two more strong brands, and the disposables the four lack —
  // Friday's picks, the leads of the homepage disposables row (home-sections.ts). Phones keep the four above.
  { type: "disposables", product: "relx-smash-go-12k", desktopOnly: true },
  { type: "disposables", product: "infy-20k", desktopOnly: true },
];

/**
 * Desktop (64rem up) body of the hero. Owner 21/10 (round "homepage upgrade", the getlayers Artefakt direction):
 * "cards" = the four slots side by side as cards over a lattice that lights up under the cursor · "stage" = one
 * lying product at a time + the tabs (#671, live 21/10). Phones keep the stage + tabs either way. One value is the
 * whole switch back.
 */
export const DESKTOP_HERO: "cards" | "stage" = "cards";

/**
 * Desktop "cards" only. Owner 21/10 (after #677): "ฉากหลังตาราง … ไม่เอาได้มั้ย" and "อยากให้เรียงแบบมี Layers ทับซ้อนกันเล็กน้อย".
 * DESKTOP_BG — "none" = plain dark + the ribbons · "spot" = a soft orange light that follows the cursor, no pattern ·
 *   "lattice" = the #677 grid of squares lit around the cursor.
 * DESKTOP_CARD_LAYOUT — "row" = side by side (#677) · "focus" = one level row, each card overlapping the one before a little;
 *   the hovered card lifts and grows to the front, the others blur (owner 21/10 "1111 … ซ้อนนะ … การ์ดอื่นๆ เบลอไป";
 *   the #679 stagger / fan drafts are in git) · "deck" = the same, spread like a hand of cards: every card the same height,
 *   overlapping far more, so the row holds more slots (owner 21/10 "ซ้อนๆแบบไพ่ แต่แนวสูงเท่ากัน … เพิ่มสินค้าได้").
 */
export const DESKTOP_BG: "none" | "spot" | "lattice" = "spot";
export const DESKTOP_CARD_LAYOUT: "row" | "focus" | "deck" = "deck";

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
