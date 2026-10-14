import { GUIDES_COPY_TH, GUIDES_COPY_ZH } from "@/i18n/guides-copy";

/**
 * One guide's translated title + dek, for a server page to hand to the Client Components that show it (GuideCard,
 * GuideDetailPageHeader, the homepage GuideText) — round SEO ฉ speed work part 3, 14/10. Importing GUIDES_COPY_TH/ZH in a
 * Client Component shipped every guide's full body in two languages (~160 KB) to the browser of every page that shows a
 * guide card. Same lookup the components made before; a locale without an overlay is left out (the component falls back
 * to the English record, as before).
 */
export type GuideHeadCopy = Partial<Record<"th" | "zh", { title: string; dek: string }>>;

export function guideHeadCopy(id: string): GuideHeadCopy {
  const copy: GuideHeadCopy = {};
  const th = GUIDES_COPY_TH[id];
  const zh = GUIDES_COPY_ZH[id];
  if (th) copy.th = { title: th.title, dek: th.dek };
  if (zh) copy.zh = { title: zh.title, dek: zh.dek };
  return copy;
}
