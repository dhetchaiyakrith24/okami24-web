/**
 * Thai characters per stated reading minute for every guide (round 10B, 2026-09-24) — so a new guide's
 * readingTimeMin follows the rate the existing seven already use instead of a guess.
 *
 *   npx tsx scripts/guide-reading-rate.ts
 */
import { guides, heldGuides } from "@/data/guides";
import { GUIDES_COPY_TH } from "@/i18n/guides-copy";

for (const g of [...guides, ...heldGuides]) {
  const th = GUIDES_COPY_TH[g.id];
  const body = th?.body ?? g.body;
  const faq = th?.faq ?? g.faq ?? [];
  const text = [
    ...body.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.subsections ?? []).flatMap((x) => [x.heading, ...x.paragraphs])]),
    ...faq.flatMap((f) => [f.question, f.answer]),
  ].join("");
  const thai = (text.match(/[฀-๿]/g) ?? []).length;
  console.log(`${g.id}\t${g.readingTimeMin} min\t${thai} Thai chars\t${Math.round(thai / g.readingTimeMin)} per min\t${th ? "th-copy" : "record"}`);
}
