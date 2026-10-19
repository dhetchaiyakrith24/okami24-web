"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import qrcode from "qrcode-generator";
import { CONTACT } from "@/data/contact";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LINE_ORDER_COPY } from "@/i18n/line-order-copy";
import { lineOaMessageUrl } from "@/lib/line-order";

/**
 * "Scan to order on LINE" (owner 19/10). On a computer the buy button opens this over the product page: a QR of LINE's
 * ready-message link, the message itself (copyable), close. Designer spec 19/10: one 420px column like the age gate,
 * QR dark-on-light (#0e0e10 on #f3f1ec) so phones read it on the dark theme, focus trapped, Esc / backdrop / X close,
 * focus returns to the button that opened it. Phones never see this — their tap opens LINE directly.
 * Rendered into document.body (portal): inside the product hero it sat under the hero image's stacking context.
 */
export function LineOrderDialog({ message, mode, onClose }: { message: string; mode: "order" | "ask"; onClose: () => void }) {
  const { locale } = useLocale();
  const copy = LINE_ORDER_COPY[locale];
  const dialogRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const downOnBackdrop = useRef(false);
  const [copied, setCopied] = useState(false);
  const url = lineOaMessageUrl(message);

  const qr = useMemo(() => {
    const code = qrcode(0, "M");
    code.addData(url, "Byte");
    code.make();
    const n = code.getModuleCount();
    let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (code.isDark(r, c)) d += `M${c + 4} ${r + 4}h1v1h-1z`;
    return { size: n + 8, d, modules: n };
  }, [url]);
  // ≥ 3 px per module (designer): 208 px holds up to ~61 modules, beyond that the code grows to 240.
  const px = qr.modules > 61 ? 240 : 208;

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    copyRef.current?.focus();
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

  function selectMessage() {
    const el = textRef.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  function copyMessage() {
    try {
      navigator.clipboard
        .writeText(message)
        .then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        })
        .catch(selectMessage);
    } catch {
      selectMessage();
    }
  }

  const lines = message.split("\n");
  const urlLine = lines[lines.length - 1];

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
        role="dialog"
        aria-modal="true"
        aria-labelledby="line-order-title"
        aria-describedby="line-order-desc"
        onKeyDown={trapTab}
        className="line-order-card relative my-auto w-full max-w-[420px] rounded-2xl border border-surface-border bg-surface-1 p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.close}
          className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-full text-foreground-dim transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ember"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <span lang="en" className="label-mono text-xs text-ember">
          LINE <span className="normal-case">{CONTACT.lineId}</span>
        </span>
        <h2 id="line-order-title" className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
          {mode === "ask" ? copy.titleAsk : copy.titleOrder}
        </h2>
        <p id="line-order-desc" className="mt-2 text-sm leading-relaxed text-foreground-muted">
          {copy.body}
        </p>
        <div className="mt-6 flex justify-center">
          <div className="rounded-xl bg-[#f3f1ec] p-4">
            <svg role="img" aria-label={mode === "ask" ? copy.titleAsk : copy.titleOrder} viewBox={`0 0 ${qr.size} ${qr.size}`} width={px} height={px} shapeRendering="crispEdges">
              <rect width={qr.size} height={qr.size} fill="#f3f1ec" />
              <path d={qr.d} fill="#0e0e10" />
            </svg>
          </div>
        </div>
        <p className="mt-6 text-xs text-foreground-dim">{copy.messageLabel}</p>
        <div className="mt-2 rounded-xl border border-surface-border-soft bg-surface-0 p-4 text-sm leading-relaxed text-foreground">
          <p ref={textRef} className="whitespace-pre-line">
            {lines.slice(0, -1).join("\n")}
            {"\n"}
            <span className="break-all text-xs text-foreground-muted">{urlLine}</span>
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            ref={copyRef}
            type="button"
            onClick={copyMessage}
            aria-live="polite"
            className="rounded-full border border-transparent bg-ember px-5 py-3 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-ember"
          >
            {copied ? `✓ ${copy.copied}` : copy.copy}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-surface-border px-5 py-3 text-sm font-semibold text-foreground-muted transition-colors hover:border-foreground-dim hover:text-foreground focus-visible:outline-2 focus-visible:outline-ember"
          >
            {copy.close}
          </button>
        </div>
        <p className="mt-5 text-center text-xs text-foreground-dim">
          <a href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer" data-line-spot="buy-dialog-friend" className="underline-offset-4 hover:text-foreground hover:underline">
            {copy.addFriend}
            {" "}
            {CONTACT.lineId}
          </a>
        </p>
      </div>
    </div>,
    document.body
  );
}
