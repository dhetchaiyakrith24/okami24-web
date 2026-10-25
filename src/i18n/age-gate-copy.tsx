import type { ReactNode } from "react";
import { B, type ServiceCopy } from "./service-pages/shared";

/**
 * Age-gate copy in the three site languages — round 6 "about3lang" (owner instruction 2026-09-23,
 * item 2: the dialog gets en/zh; group ก is opened for this round ONLY, and only to ADD
 * translations).
 *
 * Two conditions shape this file:
 *
 * 1. **The Thai is the master text and must not change by one character** (THAI_STYLE §5 group ก,
 *    untouchable since round 30.1). The strings below are the literals that used to sit inside
 *    AgeGate.tsx, moved here byte for byte — the proof at the batch close is a diff of the
 *    dialog's rendered HTML in Thai, before against after, which must be empty.
 *
 * 2. **The Thai must NOT go through `thaiTypographyDeep`.** That is why this copy lives in its own
 *    module read directly by the component, instead of in the dictionaries, which LocaleProvider
 *    passes through the render-time typography for `th`. Two of the mechanism's owner-approved
 *    exceptions would fire on this text and add WORD JOINERs to it: the `JOINED` entries scoped to
 *    the phrase "ไม่มีการกล่าวอ้างด้านสุขภาพ" (src/lib/thai-typography.ts) match the nicotine
 *    sentence here word for word, because /about carries the same sentence. Those exceptions were
 *    approved for the /about paragraph, at the width /about breaks at — extending them to the
 *    dialog would change bytes the owner ruled untouchable, and would do it silently. Whether the
 *    dialog should get the same treatment is a separate question for the owner (raised in the
 *    round 6 report), not something this batch decides.
 *
 * The `whitespace-nowrap` around "LINE OA" in en/zh is the designer's close finding (2026-09-23):
 * at 1440 the Chinese line broke between the two words and left "OA。" alone on a third line, which
 * cut the one contact route the dialog offers in half. It is the same fix `CategoryLabel.tsx`
 * already uses — a span, not an invisible character, because raw U+00A0 in source is a hard fail of
 * `scripts/thai-raw-chars-check.js` and the render-time mechanism that would add one runs for Thai
 * only. The Thai keeps its own wording untouched, so it is not wrapped.
 *
 * Shape: `ServiceCopy<T>` = `Record<Locale, T>`, the same contract the service pages use, so a
 * missing language fails `tsc` instead of showing Thai to an English reader. en/zh were written by
 * the writer agent from the Thai on 2026-09-23 (`_incoming/about3lang/brief-writer-b1.md`) and add
 * no fact the Thai does not have; the nicotine and 21+ terms are the ones `footer.ageNotice`
 * already uses in each language, so the dialog and the footer can never disagree.
 */
export interface AgeGateCopy {
  /** small label above the heading */
  eyebrow: string;
  title: string;
  /** the age condition is the one phrase in bold, in every language */
  body: ReactNode;
  /** The body while online ordering is OFF (OKAMI24_ORDERING). Owner 26/10 "แก้ได้เลย หน้าเตือนอายุ … ให้บอกว่าสั่งบนเว็บได้": the
   *  ordering clause of `body` now says order on the site; this keeps the previous wording for the cart-off state. The age and
   *  nicotine sentences are unchanged. */
  bodyWhileOrderingOff: ReactNode;
  /** small print: nicotine + the no-claims line */
  nicotine: string;
  confirm: string;
  decline: string;
  /** Round "site unreachable" (owner 11/10, choice A): one plain line under the buttons pointing to the footer's DNS help
   *  link — NOT group ก (a new line, the strings above are untouched). Text only, no link: the visitor has not confirmed
   *  yet, so a link would open the guide under this same dialog, and the Tab trap counts buttons only (designer 11/10). */
  siteHelp: string;
}

export const AGE_GATE: ServiceCopy<AgeGateCopy> = {
  th: {
    eyebrow: "ประกาศเรื่องอายุ",
    title: "คุณอายุ 21 ปีขึ้นไปหรือไม่?",
    body: <>เว็บไซต์นี้นำเสนอสินค้าอุปกรณ์บุหรี่ไฟฟ้าและน้ำยา สำหรับผู้มีอายุครบ <B>21 ปีบริบูรณ์ขึ้นไปเท่านั้น</B> ดูสินค้าและราคาได้ทั้งเว็บ และสั่งซื้อบนเว็บได้เลย ถ้ามีคำถาม ทักไลน์ OA ของ OKami24 ได้เลยค่ะ</>,
    bodyWhileOrderingOff: <>เว็บไซต์นี้นำเสนอสินค้าอุปกรณ์บุหรี่ไฟฟ้าและน้ำยา สำหรับผู้มีอายุครบ <B>21 ปีบริบูรณ์ขึ้นไปเท่านั้น</B> ดูสินค้าและราคาได้ทั้งเว็บ ส่วนการสั่งซื้อหรือสอบถาม ทักไลน์ OA ของ OKami24 ได้เลย</>,
    nicotine: "นิโคตินเป็นสารเสพติด เว็บไซต์นี้ไม่มีการกล่าวอ้างด้านสุขภาพ ความปลอดภัย หรือการเลิกบุหรี่ใดๆ เกี่ยวกับการสูบไอ",
    confirm: "ใช่ ฉันอายุ 21 ปีขึ้นไป",
    decline: "ไม่ใช่ ฉันอายุต่ำกว่า 21 ปี",
    siteHelp: "ถ้าวันไหนเปิดเว็บไม่ขึ้น ดูวิธีแก้ได้ที่ท้ายเว็บ",
  },
  en: {
    eyebrow: "Age notice",
    title: "Are you 21 or over?",
    body: <>This site shows vape devices and e-liquid, <B>for ages 21 and over only</B>. Browse and order anywhere on the site; for questions, message the OKami24 <span className="whitespace-nowrap">LINE OA</span>.</>,
    bodyWhileOrderingOff: <>This site shows vape devices and e-liquid, <B>for ages 21 and over only</B>. Browse products and prices anywhere on the site; order or ask on the OKami24 <span className="whitespace-nowrap">LINE OA</span>.</>,
    nicotine: "Nicotine is addictive. This site makes no health, safety or quit-smoking claims about vaping.",
    confirm: "Yes, I’m 21 or over",
    decline: "No, I’m under 21",
    siteHelp: "If the site ever won’t open, the fix is linked at the bottom of every page.",
  },
  zh: {
    eyebrow: "年龄提示",
    title: "您已年满21岁了吗？",
    body: <>本网站展示电子烟设备与烟油，<B>仅限年满21岁及以上人士</B>。全站均可浏览商品与价格并直接下单；如有疑问，请加 OKami24 的 <span className="whitespace-nowrap">LINE OA</span>。</>,
    bodyWhileOrderingOff: <>本网站展示电子烟设备与烟油，<B>仅限年满21岁及以上人士</B>。产品与价格全站均可浏览；下单与咨询请加 OKami24 的 <span className="whitespace-nowrap">LINE OA</span>。</>,
    nicotine: "尼古丁为成瘾性物质。本网站不对电子烟做出任何健康、安全或戒烟方面的声明。",
    confirm: "是，我已年满21岁",
    decline: "否，我未满21岁",
    siteHelp: "如果哪天网站打不开，可在页面底部查看解决方法。",
  },
};
