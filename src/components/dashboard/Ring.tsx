/** A share of a whole, 0–100. Only for a share: a figure that can go negative has no ring. */
export function Ring({ percent, label }: { percent: number; label: string }) {
  return (
    <svg viewBox="0 0 42 42" role="img" aria-label={label} className="size-24 shrink-0">
      <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--surface-3)" strokeWidth="5" />
      <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--accent-ember-strong)" strokeWidth="5" strokeDasharray={`${percent} ${100 - percent}`} strokeDashoffset="25" />
    </svg>
  );
}
