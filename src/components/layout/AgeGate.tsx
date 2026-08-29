"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "nova-vapor-age-verified";

export function AgeGate() {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setChecked(true);
    try {
      const verified = window.localStorage.getItem(STORAGE_KEY);
      if (verified !== "true") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (open) {
      confirmRef.current?.focus();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button");
    if (focusable.length === 0) return;
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

  function confirm() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore — localStorage may be unavailable; session-only gate is an acceptable fallback
    }
    setOpen(false);
  }

  function decline() {
    window.location.href = "https://www.google.com";
  }

  if (!checked || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-0/95 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
      ref={dialogRef}
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface-1 p-8 shadow-2xl">
        <span className="label-mono text-xs text-ember">Age &amp; Content Notice</span>
        <h2 id="age-gate-title" className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
          Are you 21 or older?
        </h2>
        <p id="age-gate-desc" className="mt-4 text-sm leading-relaxed text-foreground-muted">
          This site presents nicotine vaping products for informational and demonstration purposes. It is intended
          for adults of legal purchase age in their jurisdiction and is <strong className="text-foreground">not
          an active storefront</strong> — no products can be purchased here.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-foreground-dim">
          Nicotine is an addictive chemical. This project makes no health, safety, or cessation claims about
          vaping.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            ref={confirmRef}
            onClick={confirm}
            className="flex-1 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-ember"
          >
            Yes, I&apos;m 21+
          </button>
          <button
            onClick={decline}
            className="flex-1 rounded-full border border-surface-border px-6 py-3 text-sm font-semibold text-foreground-muted transition-colors hover:border-foreground-dim hover:text-foreground focus-visible:outline-2 focus-visible:outline-ember"
          >
            No, I&apos;m under 21
          </button>
        </div>
      </div>
    </div>
  );
}
