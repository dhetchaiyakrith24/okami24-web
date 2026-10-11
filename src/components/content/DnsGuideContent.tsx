"use client";

import { CONTACT } from "@/data/contact";
import { Button } from "@/components/ui/Button";
import { InfoCard, NumberedSteps, PhaseLabel, StepShot, useServiceCopy } from "@/components/content/ServicePage";
import { DNS_GUIDE } from "@/i18n/dns-guide-copy";

/**
 * Body of the "can't open the website" DNS help page — v2 (owner 11/10: mobile first; three groups "in Settings, no app"
 * · "1.1.1.1 app" · "computer", each with two devices; designer 11/10). Everything is open in the HTML (no hidden tabs):
 * chips jump to a group, the device links jump to a method, every method block ends with "↑ choose another way".
 * Real screenshots (owner's iPhone) and drawn screens (ScreenMock) share one box size, so the page reads as one set.
 * No related products: this page helps, it does not sell. Facts: docs/cloud-results/dns-guide-sources.md.
 */
const LINK = "underline decoration-foreground-dim underline-offset-4 transition-colors hover:text-ember hover:decoration-ember";

export function DnsGuideContent() {
  const c = useServiceCopy(DNS_GUIDE);
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <p className="text-lg font-medium leading-relaxed text-foreground">{c.lead}</p>
        <p className="text-base leading-relaxed text-foreground-muted">{c.intro}</p>
      </div>

      <nav id="choose" aria-label={c.jumpLabel} className="scroll-mt-24">
        <ul className="grid grid-cols-3 gap-2">
          {c.groups.map((g, i) => (
            <li key={g.id}>
              <a href={`#${g.id}`} className="flex h-full flex-col gap-1 rounded-xl border border-surface-border-soft bg-surface-1 px-3 py-2.5 transition-colors hover:border-ember">
                <span className="label-mono text-xs text-steel" lang="en">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium leading-snug text-foreground">{g.chip}</span>
                {/* One device per line: at 390 the chip is ~110px wide and "iPhone · Android" left a dangling dot. */}
                <span className="flex flex-col text-xs text-foreground-dim sm:flex-row sm:gap-1.5" lang="en">
                  {g.chipSub.split(" · ").map((d, di) => (
                    <span key={d}>
                      {di > 0 && <span className="hidden sm:inline">· </span>}
                      {d}
                    </span>
                  ))}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {c.groups.map((g, gi) => (
        <section key={g.id} id={g.id} className="flex scroll-mt-24 flex-col gap-5">
          <div className="flex flex-col gap-2">
            <PhaseLabel>
              {String(gi + 1).padStart(2, "0")} · {g.chip}
            </PhaseLabel>
            <h2 className="font-display text-2xl font-semibold text-foreground">{g.title}</h2>
            <p className="text-sm leading-relaxed text-foreground-muted">{g.lead}</p>
            <p className="flex gap-3 text-sm" lang="en">
              {g.methods.map((m) => (
                <a key={m.id} href={`#${m.id}`} className={`text-foreground-muted ${LINK}`}>
                  {m.device}
                </a>
              ))}
            </p>
          </div>

          {g.methods.map((m) => (
            <div key={m.id} className="flex flex-col gap-4 rounded-2xl bg-surface-1 p-4 lg:p-8">
              {m.alias && <span id={m.alias} className="block scroll-mt-24" aria-hidden />}
              <div id={m.id} className="flex scroll-mt-24 flex-col gap-1.5">
                <span className="label-mono text-xs text-steel" lang="en">
                  {m.device}
                </span>
                <h3 className="font-display text-xl font-semibold text-foreground">{m.title}</h3>
                <p className="flex items-center gap-2 text-sm text-foreground-muted">
                  <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${m.network.everywhere ? "bg-verified" : "bg-steel"}`} />
                  {m.network.text}
                </p>
                {m.cross && (
                  <a href={m.cross.href} className={`w-fit text-sm text-foreground ${LINK}`}>
                    {m.cross.label}
                  </a>
                )}
                {m.caption && <p className="text-xs text-foreground-dim">{m.caption}</p>}
              </div>
              {m.intro && <p className="text-sm leading-relaxed text-foreground-muted">{m.intro}</p>}
              <NumberedSteps steps={m.steps} headingLevel={4} split />
              {m.note && <p className="text-sm leading-relaxed text-foreground-muted">{m.note}</p>}
              <div className="flex flex-col gap-1.5 border-t border-surface-border-soft pt-3 text-sm leading-relaxed text-foreground-dim">
                {m.undo && <p>{m.undo}</p>}
                {m.undoImage && <StepShot image={m.undoImage} />}
                <p className="text-xs">
                  {c.sourceLabel}{" "}
                  {m.sources.map((s, si) => (
                    <span key={s.href}>
                      {si > 0 && " · "}
                      <a href={s.href} target="_blank" rel="noopener noreferrer nofollow" className={LINK}>
                        {s.label}
                      </a>
                    </span>
                  ))}
                </p>
                <a href="#choose" className={`w-fit text-xs text-foreground-muted ${LINK}`}>
                  {c.backToChoice}
                </a>
              </div>
            </div>
          ))}
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
