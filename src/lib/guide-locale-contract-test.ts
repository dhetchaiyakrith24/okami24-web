/**
 * OKami24 — no Thai reaches an English or Chinese visitor from the guide DATA (round 10B, owner ruling 2026-09-24).
 *
 * thai-leak-scan.js reads component source for Thai literals; it cannot see Thai that arrives through a record's
 * fields. Round 10B's Thai-only articles hold their Thai in the record itself, so an English visitor saw them in Thai
 * (checker, 2026-09-24). The standing rule since then (docs/THAI_STYLE.md §2): a Thai-only guide carries
 * `thaiOnly: true` and, on en/zh, is left out of every listing and shows only the one-line notice. This test walks
 * every guide the way each en/zh surface picks its text and fails on any Thai letter:
 *   - the guide page (title, dek, body, FAQ): the zh overlay when it exists, else the record; a thaiOnly guide shows
 *     `dict.guides.thaiOnlyNotice` instead;
 *   - the /guides card and the "อ่านต่อ" box title: the same pick, and a thaiOnly guide must not be listed at all
 *     (the components filter it — checked here on the data the filter reads).
 * The running page is checked separately after hydration by scripts/locale-hydration-scan.js.
 */
import { guides } from "@/data/guides";
import { GUIDES_COPY_ZH } from "@/i18n/guides-copy";
import { getDictionary } from "@/i18n/dictionaries";
import type { Guide } from "@/types/catalog";

export interface GuideLocaleContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

const THAI = /[ก-ฺเ-๛]/;

function guideStrings(g: Guide, locale: "en" | "zh"): string[] {
  const zh = locale === "zh" ? GUIDES_COPY_ZH[g.id] : undefined;
  const body = zh?.body ?? g.body;
  const faq = zh?.faq ?? g.faq ?? [];
  return [
    zh?.title ?? g.title,
    zh?.dek ?? g.dek,
    ...body.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.subsections ?? []).flatMap((x) => [x.heading, ...x.paragraphs])]),
    ...faq.flatMap((f) => [f.question, f.answer]),
  ];
}

export function runGuideLocaleContractTests(): GuideLocaleContractResult[] {
  const results: GuideLocaleContractResult[] = [];
  const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

  for (const locale of ["en", "zh"] as const) {
    const dict = getDictionary(locale);
    const notice = dict.guides.thaiOnlyNotice;
    check(`${locale}: the Thai-only notice exists and holds no Thai`, Boolean(notice) && !THAI.test(notice), notice ? JSON.stringify(notice) : "missing dict.guides.thaiOnlyNotice");

    const leaks: string[] = [];
    for (const g of guides) {
      if (g.thaiOnly) continue; // shows the notice instead — checked above
      const bad = guideStrings(g, locale).filter((s) => THAI.test(s));
      if (bad.length) leaks.push(`${g.id} (${bad.length} string(s), e.g. ${JSON.stringify(bad[0].slice(0, 40))})`);
    }
    check(`${locale}: every guide an ${locale} visitor can read is Thai-free (or marked thaiOnly)`, leaks.length === 0, leaks.join("; ") || `${guides.length} guides checked`);
  }

  // A guide whose own record is Thai must say so — otherwise the en/zh page renders it.
  const unmarked = guides.filter((g) => !g.thaiOnly && (THAI.test(g.title) || THAI.test(g.dek))).map((g) => g.id);
  check(`every guide whose record text is Thai is marked thaiOnly`, unmarked.length === 0, unmarked.join(", ") || "none");
  // …and the flag is not a way to hide an English guide from en/zh by accident.
  const needless = guides.filter((g) => g.thaiOnly && !THAI.test(g.title)).map((g) => g.id);
  check(`thaiOnly is set only on guides whose record is Thai`, needless.length === 0, needless.join(", ") || "none");
  return results;
}

if (require.main === module) {
  const results = runGuideLocaleContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
