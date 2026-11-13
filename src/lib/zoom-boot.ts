/**
 * The Zoom's first tap (owner 13/11 23:33: "กดครั้งแรก … ต้องกดซ้ำอีกรอบถึงจะเกิดการซูม"; checker 14/11: at 4× CPU a tap 0–3 s
 * after load was the plain link, 5 of 5 — the engine came 6.6–8 s after load, behind hydration).
 *
 * Runs inline in <head> right after PREVIEW_BOOT, on every page. It does something only on a device under the "zoom"
 * preview in a browser with View Transitions (`<html data-preview="zoom">`, set by PREVIEW_BOOT just before); for everyone
 * else it is a few bytes of script that return at once — no listener, no fetch, nothing in the page.
 *
 * Under the preview, a tap on a product card before the engine is attached — even before the page is hydrated, when the
 * card is still a plain <a> — is held: the card dips at once (the tap is never dead) and the tap waits up to HOLD ms for
 * the engine (ZoomNav.tsx takes it over and zooms). Past that it is the plain page change: the router's push once the
 * page is hydrated (ZoomNav sets `push`), else the browser's own navigation, as the link would have done.
 *
 * Shared with ZoomNav.tsx through `window.__okZoom`: `{ q: held tap or null, on: engine attached, push: router.push }`.
 * Plain ES5 in a try: anything unexpected just leaves the links as they are.
 */
export const ZOOM_HOLD_MS = 600;

export const ZOOM_BOOT =
  "try{var Zd=document;if(Zd.documentElement.dataset.preview==='zoom'&&typeof Zd.startViewTransition==='function'){" +
  "var Z=window.__okZoom={q:null,on:false,push:null};" +
  "Zd.addEventListener('click',function(e){" +
  "if(Z.on||Z.q||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;" +
  "var t=e.target,a=t&&t.closest&&t.closest('a[data-card-cut]');if(!a||t.closest('button'))return;" +
  "var h=a.getAttribute('href');if(!h||h.indexOf('/products/')!==0)return;" +
  "e.preventDefault();a.style.transition='transform .12s ease-out';a.style.transform='scale(.97)';" +
  "Z.q={a:a,h:h,t:Date.now(),k:setTimeout(function(){if(!Z.q||Z.q.a!==a)return;Z.q=null;a.style.transform='';" +
  "if(Z.push)Z.push(h);else location.assign(h)}," + ZOOM_HOLD_MS + ")}},true)}}catch(e){}";
