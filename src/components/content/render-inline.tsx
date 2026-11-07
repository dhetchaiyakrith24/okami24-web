import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { thaiTypography, thaiTypographyNode } from "@/lib/thai-typography";
import { INLINE_LINK } from "@/lib/article-text";

/**
 * Inline links inside a paragraph (`[text](href)`), on their own (round SEO full 07/11): the block at the foot of the home page
 * needs only this, and importing it from ArticleBody brought the article body, its FAQ and its video into the home page's scripts.
 * ArticleBody re-exports it, so nothing else changes.
 */
function isInternal(href: string): boolean {
  return href.startsWith("/");
}

/** A link label longer than this may not fit a phone line. Kept whole it pushed the page wider than the screen
 *  (/products/pod-169: 431 px at 375, 04/11), so it wraps — but only at its spaces, never mid-word. */
const LONG_LINK_LABEL = 28;

/** Splits one paragraph into text runs and links. Thai typography is applied per text run and per
 *  link label, so the render-time NBSP/joiner rules keep working around a link (a link boundary is
 *  not a break opportunity in itself — the segmenter reads across inline elements). */
export function renderInline(text: string, locale: string, keyPrefix: string): ReactNode[] {
  const t = (s: string) => (locale === "th" ? thaiTypographyNode(s) : s);
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const m of text.matchAll(INLINE_LINK)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(t(text.slice(last, idx)));
    const [, label, href] = m;
    // whitespace-nowrap: a link label never wraps mid-word (owner condition, batch 3 — the scan
    // caught "พอตใช้แล้ว|ทิ้ง" and "ช่อง|ลม" inside labels at 390). A long label: per word, see LONG_LINK_LABEL.
    const long = label.length > LONG_LINK_LABEL;
    const cls = `${long ? "" : "whitespace-nowrap "}font-medium text-foreground underline decoration-foreground-dim underline-offset-4 transition-colors hover:text-ember hover:decoration-ember`;
    const body = long
      ? // Typography first: a model name is bound with no-break spaces, so "Esko Bar Switch 20K" stays one piece.
        (locale === "th" ? thaiTypography(label) : label).split(" ").map((word, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="whitespace-nowrap">{t(word)}</span>
          </Fragment>
        ))
      : t(label);
    out.push(
      isInternal(href) ? (
        <Link key={`${keyPrefix}-l${n}`} href={href} className={cls}>
          {body}
        </Link>
      ) : (
        // A brand-site source citation (§ข-4): same contract as SourceNote — new tab, nofollow.
        <a key={`${keyPrefix}-l${n}`} href={href} target="_blank" rel="noopener noreferrer nofollow" className={cls}>
          {body}
        </a>
      ),
    );
    last = idx + m[0].length;
    n++;
  }
  if (last < text.length) out.push(t(text.slice(last)));
  return out;
}
