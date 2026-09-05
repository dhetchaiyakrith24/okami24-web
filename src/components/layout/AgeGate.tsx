"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const STORAGE_KEY = "okami24-age-verified";
const EVENT = "okami24-age-gate-change";

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

// Assume verified during SSR/first paint so the gate never server-renders —
// the client corrects this on mount via useSyncExternalStore.
function getServerSnapshot() {
  return true;
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function AgeGate() {
  const verified = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const open = !verified;
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

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
      window.dispatchEvent(new Event(EVENT));
    } catch {
      // localStorage unavailable — the gate will simply reappear next load
    }
  }

  function decline() {
    window.location.href = "https://www.google.com";
  }

  if (!open) return null;

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
        <span className="label-mono text-xs text-ember">ประกาศเรื่องอายุ</span>
        <h2 id="age-gate-title" className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
          คุณอายุ 21 ปีขึ้นไปหรือไม่?
        </h2>
        <p id="age-gate-desc" className="mt-4 text-sm leading-relaxed text-foreground-muted">
          เว็บไซต์นี้นำเสนอสินค้าอุปกรณ์บุหรี่ไฟฟ้าและน้ำยา สำหรับผู้มีอายุครบ <strong className="text-foreground">21
          ปีบริบูรณ์ขึ้นไปเท่านั้น</strong> สั่งซื้อบนเว็บนี้ได้เลย หรือทักไลน์ OA ของ OKami24 หากต้องการสอบถามก่อน
        </p>
        <p className="mt-3 text-xs leading-relaxed text-foreground-dim">
          นิโคตินเป็นสารเสพติด เว็บไซต์นี้ไม่มีการกล่าวอ้างด้านสุขภาพ ความปลอดภัย หรือการเลิกบุหรี่ใดๆ เกี่ยวกับการสูบไอ
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            ref={confirmRef}
            onClick={confirm}
            className="flex-1 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-ember"
          >
            ใช่ ฉันอายุ 21 ปีขึ้นไป
          </button>
          <button
            onClick={decline}
            className="flex-1 rounded-full border border-surface-border px-6 py-3 text-sm font-semibold text-foreground-muted transition-colors hover:border-foreground-dim hover:text-foreground focus-visible:outline-2 focus-visible:outline-ember"
          >
            ไม่ใช่ ฉันอายุต่ำกว่า 21 ปี
          </button>
        </div>
      </div>
    </div>
  );
}
