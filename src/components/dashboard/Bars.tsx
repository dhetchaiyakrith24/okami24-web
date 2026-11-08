import Link from "next/link";

export interface Bar {
  value: number;
  /** A short name for the axis. Shown only where `showLabel` says, so dates never run together. */
  label: string;
  showLabel?: boolean;
  /** Words printed with the bar, e.g. the figure of a losing round. */
  mark?: string;
  /** Spoken name; the visible label is too short to read alone. */
  title: string;
  href?: string;
}

/** A slot for something that is due but not there yet, drawn as an orange outline with its word under it. */
export interface Pending {
  pending: string;
}

export type BarSlot = Bar | Pending;

const isPending = (slot: BarSlot): slot is Pending => "pending" in slot;

/**
 * A row of bars, plain markup. Below zero hangs under the line and keeps a size you can see, so a losing round reads at a
 * glance. The newest real bar carries the colour. Each column is the whole tap area.
 */
export function Bars({ bars, height = "h-24" }: { bars: BarSlot[]; height?: string }) {
  const real = bars.filter((b): b is Bar => !isPending(b));
  const top = Math.max(...real.map((b) => Math.abs(b.value)), 1);
  const dips = real.some((b) => b.value < 0);
  const newest = bars.map((b) => !isPending(b)).lastIndexOf(true);
  return (
    <div className="flex flex-col gap-1">
      <div className={`flex items-stretch gap-1.5 ${height}`}>
        {bars.map((slot, i) => {
          if (isPending(slot)) {
            return <span key={i} aria-label={slot.pending} role="img" className="min-w-0 flex-1 rounded-md border border-dashed border-ember/70" />;
          }
          const size = `${Math.max(4, (Math.abs(slot.value) / top) * 100)}%`;
          const colour = slot.value < 0 ? "bg-danger" : i === newest ? "bg-ember-strong" : "bg-foreground-muted/35";
          const body = (
            <>
              <span className={`flex items-end ${dips ? "h-3/4" : "h-full"}`}>
                {slot.value >= 0 && <span className={`dash-bar block w-full rounded-t-md ${colour}`} style={{ height: size }} />}
              </span>
              {dips && (
                <span className="flex h-1/4 flex-col items-center">
                  {slot.value < 0 && (
                    <>
                      <span className={`block w-full rounded-b-md ${colour}`} style={{ height: `max(12px, ${size})` }} />
                      {slot.mark && <span className="text-xs font-semibold tabular-nums text-danger">{slot.mark}</span>}
                    </>
                  )}
                </span>
              )}
            </>
          );
          return slot.href ? (
            <Link key={i} href={slot.href} aria-label={slot.title} className="flex min-h-11 min-w-0 flex-1 flex-col rounded-md hover:bg-white/5">
              {body}
            </Link>
          ) : (
            <span key={i} role="img" aria-label={slot.title} className="flex min-w-0 flex-1 flex-col">
              {body}
            </span>
          );
        })}
      </div>
      <div aria-hidden className="flex gap-1.5">
        {bars.map((slot, i) => (
          <span key={i} className={`min-w-0 flex-1 whitespace-nowrap text-center text-xs tabular-nums leading-tight ${isPending(slot) ? "text-ember-strong" : "text-foreground-muted"}`}>
            {isPending(slot) ? slot.pending : slot.showLabel ? slot.label : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
