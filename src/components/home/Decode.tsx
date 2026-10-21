"use client";

import { useEffect, useRef, useState } from "react";

// letters and digits only — symbols in the display face read as broken glyphs, not as "tuning in" (designer 21/10)
const NOISE = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";

/** True when the visitor asked for less motion, or Save-Data / 2G is on (`html[data-okami-lite]`, page.tsx). */
export function still() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.okamiLite === "1";
}

/**
 * Latin text that "tunes in" (the Artefakt reference, owner 21/10): for about half a second the letters are noise, then
 * they settle left to right. Only Latin letters and digits are scrambled — Thai (stacked vowels and tone marks would
 * smear) and prices (a wrong number for a moment) are never passed in. ONE span: the real text is the server HTML (what
 * search engines and screen readers get); the animation writes its textContent directly (no React render per frame)
 * only while it runs, and puts the word back when it ends. No second sr-only copy — inside a link it doubled the
 * anchor text ("VOOPOOVOOPOOARGUS G4ARGUS G4", line 2 SEO 21/10). `run` changes = play again; reduced motion /
 * Save-Data = never plays.
 */
export function Decode({ text, run, delay = 0 }: { text: string; run: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || run === 0 || still()) return;
    let timer = 0;
    let start = 0;
    const DURATION = 520;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / DURATION);
      const settled = Math.floor(t * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        out += i < settled || !/[A-Za-z0-9]/.test(c) ? c : NOISE[(Math.random() * NOISE.length) | 0];
      }
      el.textContent = out;
      if (t < 1) timer = window.setTimeout(tick, 45);
    };
    const begin = window.setTimeout(() => {
      start = performance.now();
      tick();
    }, delay);
    return () => {
      window.clearTimeout(begin);
      window.clearTimeout(timer);
      el.textContent = text;
    };
  }, [text, run, delay]);
  return <span ref={ref}>{text}</span>;
}

/**
 * A section tag that tunes in once, when it first scrolls into view (owner 21/10: the homepage only — the hero cards'
 * Decode on the English tags above each section). Latin text only; the server HTML carries the real words.
 */
export function DecodeOnView({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setRun(1);
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref}>
      <Decode text={text} run={run} />
    </span>
  );
}
