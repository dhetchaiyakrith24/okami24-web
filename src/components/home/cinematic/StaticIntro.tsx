import Image from "next/image";

/**
 * Reduced-motion / no-JS-scroll-tracking fallback for the cinematic intro. Same brand story
 * (void → identity), same real imagery, told as one calm static screen instead of a scroll-
 * scrubbed sequence — no scroll-jacking, no motion beyond what the site's global
 * `prefers-reduced-motion` CSS rule already allows. Cinematic copy is English-only regardless of
 * site locale (see `copy.ts`), so this needs no dictionary at all.
 */
export function StaticIntro() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center gap-10 overflow-hidden border-b border-surface-border-soft bg-surface-0 px-6 py-20 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, var(--color-red-soft) 0%, transparent 65%)" }}
      />
      <div className="relative h-28 w-28 sm:h-36 sm:w-36">
        <Image src="/brand/okami-logo-red.png" alt="OKami24" fill sizes="144px" className="object-contain" priority />
      </div>
      <p className="label-mono relative text-xs tracking-[0.35em] text-foreground-dim">OKAMI24</p>
      <div className="relative flex flex-wrap items-center justify-center gap-x-10 gap-y-4 pt-4 text-sm text-foreground-dim">
        <span className="label-mono">UWELL</span>
        <span className="label-mono">VOOPOO</span>
        <span className="label-mono">SaltHub</span>
      </div>
    </section>
  );
}
