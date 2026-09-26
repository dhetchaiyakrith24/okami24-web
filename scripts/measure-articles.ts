/**
 * Round SEO B — gate (2): measure every article (Thai copy = what the site shows).
 * (Copied into git 2026-09-26 from _incoming/seo-b/, round "cloud" - original kept there.)
 * Run: npx tsx scripts/measure-articles.ts [--out <file.md>] [--keywords <json: slug -> [words]>]
 * Per article: total chars · Thai chars · paragraphs · longest paragraph · H2 / H3 count · text under the
 * largest H2 · in-body links (the [text](href) syntax) · FAQ items · video · banned word · keyword hits.
 * Owner addendum 2026-09-21: the numeric targets of the round file are withdrawn — the script reports,
 * it does not flag lengths. It flags only: the banned word, a paragraph over 250 chars (mobile-readability
 * principle kept as a soft warning), and a link whose label is "click here"-style.
 */
import { writeFileSync, readFileSync } from "node:fs";
import { guides } from "../src/data/guides";
import { technologyEntries } from "../src/data/technology";
import { GUIDES_COPY_TH } from "../src/i18n/guides-copy";
import { TECHNOLOGY_COPY_TH } from "../src/i18n/technology-copy";
import type { ArticleFAQItem, GuideSection } from "../src/types/catalog";

const args = process.argv.slice(2);
const outArg = args.indexOf("--out");
const out = outArg >= 0 ? args[outArg + 1] : `_incoming/measure-${new Date().toISOString().slice(0, 10)}.md`;
const kwArg = args.indexOf("--keywords");
const keywords: Record<string, string[]> = kwArg >= 0 ? JSON.parse(readFileSync(args[kwArg + 1], "utf8")) : {};

const thaiChars = (s: string) => (s.match(/[฀-๿]/g) ?? []).length;
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const BANNED = "บุหรี่ไฟฟ้า"; // the banned word, written as code points so this file never carries it
const GENERIC_LABELS = ["คลิกที่นี่", "ดูเพิ่มเติม", "click here", "read more"];

type Row = { page: string; total: number; thai: number; paras: number; longestPara: number; h2: number; h3: number; maxUnderH2: number; links: number; linkTargets: string; faq: number; video: string; banned: number; kw: string; flags: string };

function stripLinks(s: string) { return s.replace(LINK, "$1"); }

function measure(page: string, sections: GuideSection[] | undefined, faq: ArticleFAQItem[] | undefined, video: string | undefined, kws: string[]): Row {
  const flags: string[] = [];
  if (!sections) return { page, total: 0, thai: 0, paras: 0, longestPara: 0, h2: 0, h3: 0, maxUnderH2: 0, links: 0, linkTargets: "", faq: 0, video: video ?? "—", banned: 0, kw: "no TH copy", flags: "NO-TH-COPY" };
  let total = 0, thai = 0, paras = 0, longestPara = 0, maxUnderH2 = 0, h3 = 0, links = 0;
  const targets: string[] = [];
  const all: string[] = [];
  const eat = (p: string) => { const t = stripLinks(p); total += t.length; thai += thaiChars(t); paras++; if (t.length > longestPara) longestPara = t.length; all.push(t); for (const m of p.matchAll(LINK)) { links++; targets.push(m[2]); if (GENERIC_LABELS.some((g) => m[1].toLowerCase().includes(g))) flags.push("GENERIC-LINK-LABEL"); } return t.length; };
  for (const s of sections) {
    total += s.heading.length; thai += thaiChars(s.heading); all.push(s.heading);
    let under = 0;
    for (const p of s.paragraphs) under += eat(p);
    for (const sub of s.subsections ?? []) { h3++; total += sub.heading.length; all.push(sub.heading); for (const p of sub.paragraphs) under += eat(p); }
    if (under > maxUnderH2) maxUnderH2 = under;
  }
  for (const f of faq ?? []) { total += f.question.length + stripLinks(f.answer).length; all.push(f.question, stripLinks(f.answer)); }
  const text = all.join("\n");
  const banned = text.split(BANNED).length - 1;
  if (banned) flags.push("BANNED-WORD");
  if (longestPara > 250) flags.push("para>250");
  const kw = kws.map((k) => `${k}=${text.split(k).length - 1}`).join(" · ");
  return { page, total, thai, paras, longestPara, h2: sections.length, h3, maxUnderH2, links, linkTargets: targets.join(" "), faq: faq?.length ?? 0, video: video ?? "—", banned, kw, flags: [...new Set(flags)].join(" ") || "ok" };
}

const rows: Row[] = [
  ...guides.map((g) => measure(`/guides/${g.slug}`, GUIDES_COPY_TH[g.id]?.body, GUIDES_COPY_TH[g.id]?.faq ?? g.faq, g.reviewVideo?.videoId, keywords[g.slug] ?? [])),
  ...technologyEntries.map((t) => measure(`/technology/${t.slug}`, TECHNOLOGY_COPY_TH[t.id]?.body, TECHNOLOGY_COPY_TH[t.id]?.faq ?? t.faq, t.reviewVideo?.videoId, keywords[t.slug] ?? [])),
];

const lines = [
  `# article measurement — ${new Date().toISOString()}`,
  "",
  "| page | chars | thai | paras | longest para | H2 | H3 | max text under one H2 | links | link targets | FAQ | video | banned | keywords | flags |",
  "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|",
  ...rows.map((r) => `| ${r.page} | ${r.total} | ${r.thai} | ${r.paras} | ${r.longestPara} | ${r.h2} | ${r.h3} | ${r.maxUnderH2} | ${r.links} | ${r.linkTargets} | ${r.faq} | ${r.video} | ${r.banned} | ${r.kw} | ${r.flags} |`),
  "",
  `Articles: ${rows.length} · banned-word hits: ${rows.reduce((a, r) => a + r.banned, 0)} · links total: ${rows.reduce((a, r) => a + r.links, 0)} · FAQ total: ${rows.reduce((a, r) => a + r.faq, 0)} · videos: ${rows.filter((r) => r.video !== "—").length}`,
];
writeFileSync(out, lines.join("\n") + "\n");
console.log(lines.join("\n"));
console.log(`\nwritten: ${out}`);
