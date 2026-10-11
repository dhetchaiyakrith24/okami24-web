"use client";

import { CONTACT } from "@/data/contact";
import { Button } from "@/components/ui/Button";
import { InfoCard, NumberedSteps, PhaseLabel, useServiceCopy } from "@/components/content/ServicePage";
import { DNS_GUIDE } from "@/i18n/dns-guide-copy";

/**
 * Body of the "can't open the website" DNS guide (round "site unreachable", owner 11/10). Designer direction 11/10: every
 * method stacked on one page with jump chips on top (anchors, not tabs — all text stays in the HTML, and LINE staff can send
 * `…#iphone`), each method = PhaseLabel + H2 + one "which networks" line + NumberedSteps + undo line + official source.
 * No related products: this page helps, it does not sell. Every step comes from docs/cloud-results/dns-guide-sources.md.
 */
export function DnsGuideContent() {
  const c = useServiceCopy(DNS_GUIDE);
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3 text-base leading-relaxed text-foreground-muted">
        {c.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <nav aria-label={c.jumpLabel}>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {c.methods.map((m, i) => (
            <li key={m.id}>
              <a href={`#${m.id}`} className="flex h-full flex-col gap-1 rounded-xl border border-surface-border-soft bg-surface-1 px-3 py-2.5 transition-colors hover:border-ember">
                <span className="label-mono text-xs text-steel" lang="en">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-foreground">{m.chip}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {c.methods.map((m, i) => (
        <section key={m.id} id={m.id} className="flex scroll-mt-24 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <PhaseLabel>
              {String(i + 1).padStart(2, "0")} · {m.chip}
            </PhaseLabel>
            <h2 className="font-display text-2xl font-semibold text-foreground">{m.title}</h2>
            <p className="flex items-center gap-2 text-sm text-foreground-muted">
              <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${m.network.everywhere ? "bg-verified" : "bg-steel"}`} />
              {m.network.text}
            </p>
          </div>
          {m.intro && <p className="text-base leading-relaxed text-foreground-muted">{m.intro}</p>}
          <NumberedSteps steps={m.steps} />
          {m.note && <p className="text-sm leading-relaxed text-foreground-muted">{m.note}</p>}
          <div className="flex flex-col gap-1.5 border-t border-surface-border-soft pt-3 text-sm leading-relaxed text-foreground-dim">
            {m.undo && <p>{m.undo}</p>}
            <p>
              {c.sourceLabel}{" "}
              {m.sources.map((s, si) => (
                <span key={s.href}>
                  {si > 0 && " · "}
                  <a href={s.href} target="_blank" rel="noopener noreferrer nofollow" className="underline decoration-foreground-dim underline-offset-4 transition-colors hover:text-ember hover:decoration-ember">
                    {s.label}
                  </a>
                </span>
              ))}
            </p>
          </div>
        </section>
      ))}

      <div data-line-spot="dns-guide">
        <InfoCard title={c.afterTitle}>
          <p>{c.afterBody}</p>
          <div className="mt-2">
            <Button href={CONTACT.lineUrl} external className="w-full sm:w-auto">
              {c.lineCta}
            </Button>
          </div>
        </InfoCard>
      </div>
    </div>
  );
}
