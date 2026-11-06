"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { CONTACT } from "@/data/contact";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { shippingDelayActive } from "@/lib/commerce/shipping-delay";
import { SHIPPING_DELAY_COPY } from "@/i18n/shipping-delay-copy";

/**
 * The temporary delay notice (owner 06/11). The banner reads the clock in the browser only (false on the server), so a static
 * page built before the end date never keeps it past that date. Same card language as LineOrderDialog: portal into body, focus trapped, Esc and backdrop close.
 */
const subscribeNever = () => () => {};

/** Thai pieces each stay on one line, so a line can only end between them; en/zh are one piece and wrap as usual. */
function Pieces({ text }: { text: string[] }) {
  if (text.length === 1) return <>{text[0]}</>;
  return text.map((piece, i) => (
    <span key={piece}>
      {i > 0 && " "}
      <span className="inline-block whitespace-nowrap">{piece}</span>
    </span>
  ));
}

export function ShippingDelayBanner({ className = "" }: { className?: string }) {
  const { locale } = useLocale();
  const active = useSyncExternalStore(subscribeNever, () => shippingDelayActive(), () => false);
  if (!active) return null;
  const copy = SHIPPING_DELAY_COPY[locale];
  return (
    <div role="note" className={`rounded-lg border border-ember bg-surface-2 px-4 py-3 text-sm leading-relaxed ${className}`}>
      <p className="font-semibold text-ember">{copy.title}</p>
      <p className="mt-1 text-foreground">
        <Pieces text={copy.body} />
      </p>
    </div>
  );
}

export function ShippingDelayDialog({ onAccept, onClose }: { onAccept: () => void; onClose: () => void }) {
  const { locale } = useLocale();
  const copy = SHIPPING_DELAY_COPY[locale];
  const dialogRef = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const downOnBackdrop = useRef(false);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    acceptRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [onClose]);

  function trapTab(e: React.KeyboardEvent) {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return createPortal(
    <div
      className="line-order-backdrop fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-surface-0/80 px-5 py-8 backdrop-blur-sm"
      onMouseDown={(e) => (downOnBackdrop.current = e.target === e.currentTarget)}
      onMouseUp={(e) => {
        if (downOnBackdrop.current && e.target === e.currentTarget) onClose();
        downOnBackdrop.current = false;
      }}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="ship-delay-title"
        aria-describedby="ship-delay-desc"
        onKeyDown={trapTab}
        className="line-order-card relative my-auto w-full max-w-[420px] rounded-2xl border border-ember bg-surface-1 p-8 shadow-2xl"
      >
        <h2 id="ship-delay-title" className="font-display text-2xl font-semibold tracking-tight text-foreground">
          {copy.title}
        </h2>
        <p id="ship-delay-desc" className="mt-3 text-base leading-relaxed text-foreground">
          <Pieces text={copy.body} />
        </p>
        <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
          <Pieces text={copy.question} />
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            ref={acceptRef}
            type="button"
            onClick={onAccept}
            className="rounded-full border border-transparent bg-ember px-5 py-3 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-ember"
          >
            {copy.accept}
          </button>
          <a
            href={CONTACT.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-line-spot="delay-card"
            className="rounded-full border border-ember px-5 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-ember"
          >
            {copy.line}{String.fromCharCode(0xa0)}{CONTACT.lineId}
          </a>
          <Link
            href="/cart"
            className="rounded-full border border-surface-border px-5 py-3 text-center text-sm font-semibold text-foreground-muted transition-colors hover:border-foreground-dim hover:text-foreground focus-visible:outline-2 focus-visible:outline-ember"
          >
            {copy.back}
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
