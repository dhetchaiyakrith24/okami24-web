import { cn } from "@/lib/utils";

/**
 * "Sold out" pill on the hero photo while the option on screen cannot be ordered (stock round batch 2c, owner 08/10:
 * sold-out colours stay viewable, the page stays premium, and the customer is told on that page). Sits top-left,
 * the same height and glass as the FavoriteButton top-right, so the two read as one set; the photo itself stays full
 * colour. No motion (owner 30/09: switching options is not animated). `aria-hidden`: the chip's label and the buy
 * action already say it to screen readers. The parent must be `relative`.
 */
export function SoldOutPhotoBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute left-2 top-2 z-10 inline-flex h-9 items-center gap-2 rounded-full border border-ember/40 bg-surface-0/70 px-3.5 backdrop-blur",
        className
      )}
      aria-hidden
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
      <span className="label-mono text-xs text-ember">{label}</span>
    </span>
  );
}
