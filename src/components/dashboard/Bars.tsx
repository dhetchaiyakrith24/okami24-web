import Link from "next/link";

export interface Bar {
  value: number;
  /** A short name for the axis and for a screen reader. */
  label: string;
  /** Spoken value; the page prints the figures it wants read. */
  title?: string;
  href?: string;
}

/**
 * A row of bars, plain markup. `null` = a slot with no data yet, drawn as an empty outline so a young history looks young
 * rather than broken. Below zero hangs under the line, so a losing round reads at a glance. The newest bar carries the colour.
 */
export function Bars({ bars, height = "h-24" }: { bars: (Bar | null)[]; height?: string }) {
  const real = bars.filter((b): b is Bar => b !== null);
  const top = Math.max(...real.map((b) => Math.abs(b.value)), 1);
  const dips = real.some((b) => b.value < 0);
  return (
    <div className="flex flex-col gap-1">
      <div className={`flex items-stretch gap-1.5 ${height}`}>
        {bars.map((bar, i) => {
          if (!bar) return <span key={i} aria-hidden className="min-w-0 flex-1 rounded-md border border-dashed border-white/15" />;
          const size = `${Math.max(4, (Math.abs(bar.value) / top) * 100)}%`;
          const isLast = i === bars.length - 1;
          const colour = bar.value < 0 ? "bg-danger" : isLast ? "bg-ember-strong" : "bg-foreground-muted/35";
          const body = (
            <>
              <span className={`flex items-end ${dips ? "h-3/4" : "h-full"}`}>
                {bar.value >= 0 && <span className={`dash-bar block w-full rounded-t-md ${colour}`} style={{ height: size }} />}
              </span>
              {dips && <span className="block h-1/4">{bar.value < 0 && <span className={`block w-full rounded-b-md ${colour}`} style={{ height: size }} />}</span>}
            </>
          );
          const name = bar.title ?? bar.label;
          return bar.href ? (
            <Link key={i} href={bar.href} aria-label={name} className="flex min-w-0 flex-1 flex-col">
              {body}
            </Link>
          ) : (
            <span key={i} role="img" aria-label={name} className="flex min-w-0 flex-1 flex-col">
              {body}
            </span>
          );
        })}
      </div>
      <div aria-hidden className="flex gap-1.5">
        {bars.map((bar, i) => (
          <span key={i} className="min-w-0 flex-1 text-center text-xs tabular-nums leading-tight text-foreground-muted">
            {bar?.label ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}
