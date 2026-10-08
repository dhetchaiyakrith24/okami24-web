import { cn } from "@/lib/utils";

/**
 * "Sold out" pill on the hero photo while the option on screen cannot be ordered (stock round batch 2c, owner 08/10:
 * sold-out colours stay viewable, the page stays premium, and the customer is told on that page). Sits top-left,
 * the same height and glass as the FavoriteButton top-right, so the two read as one set; the photo itself stays full
 * colour. No motion (owner 30/09: switching options is not animated). `aria-hidden`: the chip's label and the buy
 * action already say it to screen readers. The parent must be `relative`. Phones get a smaller pill tucked closer to
 * the corner: full-frame photos (IQOS, wide boxes) reach the top-left there, and the full size covered the device
 * (checker #404).
 */
export function SoldOutPhotoBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute left-2 top-2 z-10 inline-flex h-9 items-center gap-2 rounded-full border border-ember/40 bg-surface-0/70 px-3.5 backdrop-blur max-lg:left-1 max-lg:top-1 max-lg:h-6 max-lg:gap-1.5 max-lg:px-2.5",
        className
      )}
      aria-hidden
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember max-lg:h-1 max-lg:w-1" />
      <span className="label-mono text-xs text-ember max-lg:text-[0.7rem]">{label}</span>
    </span>
  );
}
