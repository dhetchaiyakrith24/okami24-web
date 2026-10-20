/**
 * The visitor's switch for the homepage light (owner 20/10: "a button to turn the effect on and off").
 * Kept in this browser only (localStorage), read after hydration — the light itself only starts after
 * load + idle, so nothing flashes. Off = the hero and flow ribbons never start (no worker, no GPU work);
 * switched off while running = they stop and fade out (globals.css `html[data-okami-fx="off"]`).
 */
const KEY = "okami24-fx";
const EVENT = "okami24-fx-change";
/** this visit's choice once made (storage may be blocked) */
let chosen: boolean | null = null;

export function fxIsOff(): boolean {
  if (chosen !== null) return chosen;
  try {
    return localStorage.getItem(KEY) === "off";
  } catch {
    return false;
  }
}

/** Marks the page (for the fade-out) without touching the stored choice. */
export function markFx(off: boolean) {
  if (off) document.documentElement.dataset.okamiFx = "off";
  else delete document.documentElement.dataset.okamiFx;
}

export function setFxOff(off: boolean) {
  chosen = off;
  try {
    if (off) localStorage.setItem(KEY, "off");
    else localStorage.removeItem(KEY);
  } catch {
    // storage blocked (private mode): the switch still works for this visit
  }
  markFx(off);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: off }));
}

/** Calls back with the new state whenever the switch is flipped; returns the unsubscribe. */
export function onFxChange(cb: (off: boolean) => void): () => void {
  const h = (e: Event) => cb(Boolean((e as CustomEvent<boolean>).detail));
  // the same switch flipped in another tab of this site
  const s = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    chosen = null;
    markFx(fxIsOff());
    cb(fxIsOff());
  };
  window.addEventListener(EVENT, h);
  window.addEventListener("storage", s);
  return () => {
    window.removeEventListener(EVENT, h);
    window.removeEventListener("storage", s);
  };
}
