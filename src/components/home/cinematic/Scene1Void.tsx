"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CINEMATIC_COPY } from "./copy";

/**
 * ENTRY / VOID — no product yet. A cryptic, tracked-out "OKM" resolves out of drifting smoke and
 * a single light sweep — a HUD-style scan-reveal (clip-path wiping left to right) rather than a
 * plain fade, so even this minimal scene has an authored, mechanical feel rather than a generic
 * fade-in. The full wordmark is withheld deliberately (see `copy.ts`) — this is a promise, not
 * the payoff; the real identity system builds through Scenes 2–4 and resolves in the finale.
 */
export function Scene1Void({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.82, 1], [1, 1, 0]);
  const sweepX = useTransform(progress, [0.05, 0.55], ["-30%", "130%"]);
  const arcOpacity = useTransform(progress, [0, 0.35, 0.85], [0.08, 0.35, 0]);
  const arcScale = useTransform(progress, [0, 1], [0.85, 1.08]);

  const markRevealPct = useTransform(progress, [0.22, 0.5], [0, 100]);
  const markClip = useTransform(markRevealPct, (v) => `inset(0 ${100 - v}% 0 0)`);
  const markOpacity = useTransform(progress, [0.2, 0.3, 0.75], [0, 1, 0]);
  const markTracking = useTransform(progress, [0.22, 0.5], ["0.6em", "0.28em"]);
  const underlineScaleX = useTransform(progress, [0.3, 0.58], [0, 1]);

  const smoke1X = useTransform(progress, [0, 1], ["-10%", "8%"]);
  const smoke2X = useTransform(progress, [0, 1], ["6%", "-12%"]);
  const smokeOpacity = useTransform(progress, [0, 0.4, 0.85], [0.5, 0.5, 0]);

  const hintOpacity = useTransform(progress, [0, 0.06, 0.16], [1, 1, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.div aria-hidden style={{ x: smoke1X, opacity: smokeOpacity }} className="absolute left-[10%] top-[30%] h-[40vh] w-[40vh] rounded-full blur-[60px]">
        <div className="h-full w-full rounded-full bg-surface-2/70" />
      </motion.div>
      <motion.div aria-hidden style={{ x: smoke2X, opacity: smokeOpacity }} className="absolute bottom-[22%] right-[14%] h-[34vh] w-[34vh] rounded-full blur-[70px]">
        <div className="h-full w-full rounded-full bg-ember-soft/40" />
      </motion.div>

      <motion.div aria-hidden style={{ opacity: arcOpacity, scale: arcScale }} className="absolute h-[60vmin] w-[60vmin] rounded-full">
        <div
          className="h-full w-full rounded-full"
          style={{ background: "radial-gradient(circle, transparent 58%, var(--color-red) 60%, transparent 63%)", filter: "blur(2px)" }}
        />
      </motion.div>

      <motion.div aria-hidden style={{ x: sweepX }} className="absolute top-0 h-full w-[2px] rotate-12">
        <div
          className="h-full w-full"
          style={{ background: "linear-gradient(to bottom, transparent, var(--color-steel-strong), transparent)", boxShadow: "0 0 40px 6px var(--color-steel)", opacity: 0.55 }}
        />
      </motion.div>

      <motion.div style={{ opacity: markOpacity }} className="relative z-10 flex flex-col items-center gap-4">
        <motion.p
          style={{ clipPath: markClip, letterSpacing: markTracking }}
          className="font-display text-[3.2rem] font-semibold text-foreground sm:text-[5rem]"
        >
          {CINEMATIC_COPY.void}
        </motion.p>
        <motion.div style={{ scaleX: underlineScaleX }} className="h-px w-24 origin-center bg-red-strong sm:w-32" />
      </motion.div>

      <motion.div aria-hidden style={{ opacity: hintOpacity }} className="absolute bottom-10 flex flex-col items-center gap-1 text-foreground-dim">
        <span className="label-mono text-[0.6rem] tracking-[0.3em]">SCROLL</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
