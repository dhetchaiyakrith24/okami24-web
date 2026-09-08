import { CONTACT } from "@/data/contact";

const ARIA_LABEL = "ติดต่อสอบถามสินค้าทาง LINE";

/**
 * Global floating LINE contact affordance, present on every route. Sits at a lower
 * stacking order than AgeGate's full-screen overlay (z-[100]) and Header's mobile drawer
 * (z-40), so it's automatically covered — not just visually but for pointer/keyboard
 * reach — whenever either is open, without needing to track their state separately.
 */
export function LineContact() {
  return (
    <>
      {/* Desktop: compact icon pill, expands to show the label on hover AND keyboard focus.
          Below lg (tablet widths, where this pill already shows) it also climbs above a product
          page's mobile buy bar via --okami-fab-lift from globals.css (owner B-ก, 2026-09-08);
          at lg and above the original bottom-8 applies untouched. */}
      <a
        href={CONTACT.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ARIA_LABEL}
        className="group fixed bottom-8 right-8 z-30 hidden items-center gap-2 overflow-hidden rounded-full border border-surface-border bg-surface-1/95 px-3.5 py-3.5 text-foreground shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-red/50 hover:px-5 focus-visible:border-red/50 focus-visible:px-5 focus-visible:outline-2 focus-visible:outline-red focus-visible:outline-offset-2 max-lg:bottom-[calc(2rem+var(--okami-fab-lift,0px))] sm:flex"
      >
        <LineIcon className="h-5 w-5 shrink-0 text-red" />
        <span
          aria-hidden
          className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[9rem] group-hover:opacity-100 group-focus-visible:max-w-[9rem] group-focus-visible:opacity-100"
        >
          สอบถามสินค้า
        </span>
      </a>

      {/* Mobile: compact FAB, icon-only, safe-area aware */}
      <a
        href={CONTACT.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ARIA_LABEL}
        className="okami-line-fab fixed z-30 flex h-12 w-12 items-center justify-center rounded-full border border-surface-border bg-surface-1/95 text-red shadow-2xl backdrop-blur-md transition-colors focus-visible:outline-2 focus-visible:outline-red focus-visible:outline-offset-2 sm:hidden"
        style={{
          // + --okami-fab-lift: above the product page's sticky buy bar on phones (B-ก, 2026-09-08)
          bottom: "calc(1rem + var(--okami-fab-lift, 0px) + env(safe-area-inset-bottom, 0px))",
          right: "calc(1rem + env(safe-area-inset-right, 0px))",
        }}
      >
        <LineIcon className="h-5 w-5" />
      </a>
    </>
  );
}

function LineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C6.477 2 2 5.626 2 10.1c0 4.008 3.567 7.36 8.386 7.99.327.07.771.216.883.497.101.254.066.652.033.909l-.144.865c-.043.254-.203.996.872.543 1.076-.454 5.805-3.42 7.92-5.856C21.402 13.325 22 11.79 22 10.1 22 5.626 17.523 2 12 2zM8.5 12.75H6.9a.35.35 0 0 1-.35-.35V8.1a.35.35 0 0 1 .7 0v3.95h1.25a.35.35 0 0 1 0 .7zm1.75-.35a.35.35 0 0 1-.7 0V8.1a.35.35 0 0 1 .7 0v4.3zm4.4 0a.35.35 0 0 1-.629.213l-2.166-2.947v2.734a.35.35 0 0 1-.7 0V8.1a.35.35 0 0 1 .629-.213l2.166 2.947V8.1a.35.35 0 0 1 .7 0v4.3zm3.15-2.5a.35.35 0 0 1 0 .7h-1.25v1.05h1.25a.35.35 0 0 1 0 .7h-1.6a.35.35 0 0 1-.35-.35V8.1a.35.35 0 0 1 .35-.35h1.6a.35.35 0 0 1 0 .7h-1.25v1.05z" />
    </svg>
  );
}
