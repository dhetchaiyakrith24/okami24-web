"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { CINEMATIC_COPY } from "./copy";
import { DepthLayer } from "./DepthLayer";
import { HeroProduct } from "./HeroProduct";

/**
 * VOOPOO — energy / velocity. Where UWELL rose straight through the center, the ARGUS G4 cuts in
 * fast from the right at speed, crosses in front of the DRAG 6 sitting blurred in the background,
 * and exits hard to the left — the same "arrive close / resolve / depart" grammar as Scene 2, but
 * with lateral velocity instead of a vertical rise, and streaked motion-blur lines standing in for
 * UWELL's static precision guide-line, so the two scenes read as different energy, not a reskin.
 */
export function Scene3Voopoo({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.1, 0.88, 1], [0, 1, 1, 0]);

  const glowOpacity = useTransform(progress, [0.06, 0.4, 0.85], [0, 0.55, 0.15]);

  const streakOpacity = useTransform(progress, [0.28, 0.4, 0.5, 0.6], [0, 0.8, 0.8, 0]);
  const streakScaleX = useTransform(progress, [0.28, 0.42], [0.2, 1]);

  const textOpacity = useTransform(progress, [0.34, 0.48, 0.8], [0, 1, 0]);
  const textY = useTransform(progress, [0.34, 0.5], [16, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 overflow-hidden">
      <motion.div
        aria-hidden
        style={{ opacity: glowOpacity }}
        className="absolute h-[58vmin] w-[58vmin] rounded-full"
      >
        <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(circle, var(--color-ember-soft) 0%, transparent 68%)" }} />
      </motion.div>

      <DepthLayer progress={progress} src="/assets/products/drag-6/card.png" side="right" />

      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 1400 }}>
        <motion.div
          aria-hidden
          style={{ opacity: streakOpacity, scaleX: streakScaleX }}
          className="absolute h-[3px] w-[70vw] origin-center"
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-ember to-transparent" style={{ boxShadow: "0 0 24px 4px var(--color-ember)" }} />
        </motion.div>

        <HeroProduct
          progress={progress}
          src="/assets/products/argus-g4/card.png"
          alt="VOOPOO ARGUS G4"
          sizeClass="h-[54vh] w-[18vh] sm:h-[70vh] sm:w-[24vh]"
          glow="rgba(255,106,44,0.45)"
          entry={{ x: "56vw", rotate: -20, rotateY: 34, scale: 1.5, blur: 20 }}
          focus={{ x: "-6vw", rotate: -8, rotateY: 10, scale: 1.35, blur: 0 }}
          exit={{ x: "-58vw", rotate: -22, rotateY: -30, scale: 1.6, blur: 18 }}
        />
      </div>

      <motion.div style={{ opacity: textOpacity, y: textY }} className="absolute bottom-[14%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-center sm:bottom-[16%]">
        <span className="label-mono text-[0.65rem] tracking-[0.25em] text-ember sm:text-xs">{CINEMATIC_COPY.voopooBrand}</span>
        <p className="font-display text-lg font-semibold text-foreground sm:text-2xl">{CINEMATIC_COPY.voopooLine}</p>
      </motion.div>
    </motion.div>
  );
}
