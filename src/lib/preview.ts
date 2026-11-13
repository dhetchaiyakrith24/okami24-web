/**
 * Preview links (owner 12/11 ~03:00, "ลิงก์พิเศษบนเว็บจริง"): the owner tries a design draft on his phone on the live site
 * before customers see it. `?preview=<word>` on any page sets a cookie on that device only; `?preview=off` clears it.
 * A tiny inline script in the root layout (PREVIEW_BOOT) reads the cookie before the first paint and sets
 * `<html data-preview="<word>">`; every draft is scoped under `html[data-preview="<word>"]` (CSS) or `previewOn("<word>")`
 * (browser code). The server never reads the cookie, so every page stays static/ISR and the HTML search engines get is
 * unchanged — no new URL is linked or indexed (the query is dropped from the address bar; canonical tags stay as they are).
 * When the owner approves a draft, a follow-up PR makes it the default and deletes its scoping.
 */
export const PREVIEW_COOKIE = "okami24_preview";
export const PREVIEW_PARAM = "preview";
/** A preview word: short, lower-case — anything else (and "off") clears the preview. */
export const PREVIEW_WORD = /^[a-z0-9-]{1,24}$/;
/** Thirty days: long enough for the owner to look again tomorrow, short enough to end on its own. */
const MAX_AGE = 60 * 60 * 24 * 30;

/**
 * Runs inline in <head> on every page, before the first paint (no flash of the old look). Plain ES5, wrapped in try:
 * a blocked cookie jar just means no preview. Strips `?preview=` from the address bar so a shared link does not carry it.
 */
export const PREVIEW_BOOT =
  "try{var d=document,u=new URL(location.href),q=u.searchParams.get(" + JSON.stringify(PREVIEW_PARAM) + "),k=" +
  JSON.stringify(PREVIEW_COOKIE) + ",s=location.protocol==='https:'?';secure':'';" +
  "if(q!==null){if(q!=='off'&&" + PREVIEW_WORD.toString() + ".test(q))d.cookie=k+'='+q+';path=/;max-age=" + MAX_AGE +
  ";samesite=lax'+s;else d.cookie=k+'=;path=/;max-age=0;samesite=lax'+s;" +
  "u.searchParams.delete(" + JSON.stringify(PREVIEW_PARAM) + ");history.replaceState(history.state,'',u.pathname+u.search+u.hash)}" +
  "var m=d.cookie.match(/(?:^|; )" + PREVIEW_COOKIE + "=([a-z0-9-]{1,24})/);if(m)d.documentElement.dataset.preview=m[1]}catch(e){}";

/** The preview word this page runs under, or null (browser only — the server always answers null). */
export function previewWord(): string | null {
  if (typeof document === "undefined") return null;
  return document.documentElement.dataset.preview ?? null;
}

export function previewOn(word: string): boolean {
  return previewWord() === word;
}

/** Turn the preview off on this device and reload into the normal site. */
export function endPreview(): void {
  const secure = location.protocol === "https:" ? ";secure" : "";
  document.cookie = `${PREVIEW_COOKIE}=;path=/;max-age=0;samesite=lax${secure}`;
  delete document.documentElement.dataset.preview;
  location.reload();
}

/** The shop orange as "R G B" channels for a glow drawn from script (WAAPI keyframes): whatever --ember-rgb resolves to on
 *  this page, so a preview that changes the orange changes these glows too. */
export function emberRgb(): string {
  if (typeof document === "undefined") return "255 106 44";
  return getComputedStyle(document.documentElement).getPropertyValue("--ember-rgb").trim() || "255 106 44";
}
