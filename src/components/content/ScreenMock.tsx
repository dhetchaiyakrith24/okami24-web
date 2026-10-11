import type { ReactNode } from "react";

/**
 * A drawn settings screen for the DNS help page (round "site unreachable" v2, designer 11/10) — used where the shop has no
 * screenshot of its own (Android, Mac, Windows). Deliberately an illustration, not a fake screenshot: no phone frame, no
 * status bar, no OS or brand logos; same box as StepShot so drawn and real pictures read as one set on the page. Labels
 * are the official on-screen words (docs/cloud-results/dns-guide-sources.md) — unconfirmed rows are drawn as grey bars,
 * never as made-up text. One `hi` row per screen = the place to tap (ember, the colour of the step numbers).
 * Screen readers get one `aria-label`; the drawn rows are aria-hidden so the step text is not read twice.
 */

export type MockRow =
  | { kind: "nav"; label: ReactNode; value?: string; hi?: boolean }
  | { kind: "radio"; label: ReactNode; on?: boolean; hi?: boolean }
  | { kind: "switch"; label: ReactNode; on: boolean; sub?: string; hi?: boolean }
  | { kind: "input"; label?: string; value: string; hi?: boolean }
  | { kind: "list"; label?: string; items: string[]; plus?: boolean; hi?: boolean }
  | { kind: "button"; label: string; hi?: boolean }
  | { kind: "bar" }
  | { kind: "heading"; label: string };

const HI = "rounded-lg bg-ember/10 font-semibold text-foreground ring-2 ring-inset ring-ember";

function Row({ row }: { row: MockRow }) {
  switch (row.kind) {
    case "bar":
      return (
        <div className="flex h-10 items-center px-3">
          <span className="h-2 w-2/3 rounded-full bg-surface-border-soft" />
        </div>
      );
    case "heading":
      return <p className="px-3 pt-2 text-[13px] text-foreground-dim">{row.label}</p>;
    case "nav":
      return (
        <div className={`flex min-h-10 items-center justify-between gap-2 px-3 py-2 text-sm text-foreground-muted ${row.hi ? HI : ""}`}>
          <span>{row.label}</span>
          <span className="flex shrink-0 items-center gap-1 text-[13px] text-foreground-dim">
            {row.value}
            <span aria-hidden>›</span>
          </span>
        </div>
      );
    case "radio":
      return (
        <div className={`flex min-h-10 items-center gap-2.5 px-3 py-2 text-sm text-foreground-muted ${row.hi ? HI : ""}`}>
          <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${row.on ? "border-ember" : "border-foreground-dim"}`}>
            {row.on && <span className="h-2 w-2 rounded-full bg-ember" />}
          </span>
          <span>{row.label}</span>
        </div>
      );
    case "switch":
      return (
        <div className={`flex min-h-10 items-center justify-between gap-2 px-3 py-2 text-sm text-foreground-muted ${row.hi ? HI : ""}`}>
          <span className="flex flex-col">
            <span>{row.label}</span>
            {row.sub && <span className="text-[13px] text-foreground-dim">{row.sub}</span>}
          </span>
          <span className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 ${row.on ? "justify-end bg-ember" : "justify-start bg-surface-border"}`}>
            <span className="h-4 w-4 rounded-full bg-foreground" />
          </span>
        </div>
      );
    case "input":
      return (
        <div className="px-3 py-2">
          {row.label && <p className="mb-1 text-[13px] text-foreground-dim">{row.label}</p>}
          <div className={`rounded-md border border-surface-border px-2.5 py-1.5 font-mono text-sm text-foreground ${row.hi ? HI : ""}`}>{row.value}</div>
        </div>
      );
    case "list":
      return (
        <div className="px-3 py-2">
          {row.label && <p className="mb-1 text-[13px] text-foreground-dim">{row.label}</p>}
          <div className="rounded-md border border-surface-border">
            {row.items.map((it) => (
              <p key={it} className="border-b border-surface-border-soft px-2.5 py-1 font-mono text-sm text-foreground last:border-b-0">
                {it}
              </p>
            ))}
            {row.plus && (
              <div className="flex gap-1 border-t border-surface-border-soft px-1.5 py-1">
                <span className={`flex h-6 w-6 items-center justify-center text-sm text-foreground ${row.hi ? HI : ""}`}>+</span>
                <span className="flex h-6 w-6 items-center justify-center text-sm text-foreground-dim">−</span>
              </div>
            )}
          </div>
        </div>
      );
    case "button":
      return (
        <div className="flex justify-end px-3 py-2">
          <span className={`rounded-full px-3 py-1 text-sm text-foreground ${row.hi ? HI : "bg-surface-2"}`}>{row.label}</span>
        </div>
      );
  }
}

export function ScreenMock({ title, rows, ariaLabel, kind = "phone", lang }: { title: string; rows: MockRow[]; ariaLabel: string; kind?: "phone" | "window"; lang?: string }): ReactNode {
  return (
    <div role="img" aria-label={ariaLabel} className="w-full max-w-[280px] overflow-hidden rounded-2xl border border-surface-border-soft bg-surface-0 lg:max-w-[300px]">
      <div aria-hidden lang={lang} className="flex flex-col pb-1.5">
        <div className="flex items-center gap-2 border-b border-surface-border-soft px-3 py-2.5">
          {kind === "window" ? (
            <span className="flex shrink-0 gap-1">
              <span className="h-2 w-2 rounded-full bg-surface-border" />
              <span className="h-2 w-2 rounded-full bg-surface-border" />
              <span className="h-2 w-2 rounded-full bg-surface-border" />
            </span>
          ) : (
            <span className="text-sm text-foreground-dim">←</span>
          )}
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <div className="flex flex-col divide-y divide-surface-border-soft px-1.5 pt-1">
          {rows.map((r, i) => (
            <Row key={i} row={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
