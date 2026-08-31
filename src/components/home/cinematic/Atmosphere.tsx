"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * Persistent atmosphere layer — haze, drifting light shafts, and film grain shared by every
 * scene, rendered once behind the whole sequence rather than duplicated per-scene. This is what
 * makes the five scenes read as one continuous space instead of five separate demos: the haze
 * never resets, it only shifts temperature (steel → ember → red) as `progress` (the *global*
 * scrollYProgress, not a per-scene slice) advances through the sequence.
 *
 * Grain and the second haze layer are `hidden lg:block` — a deliberate mobile quality tier, not
 * an oversight: on a small screen these layers sit far enough in the background that the cost
 * (extra blurred layers + an SVG filter) isn't worth it, per the phase's mobile-choreography
 * direction.
 */
export function Atmosphere({ progress }: { progress: MotionValue<number> }) {
  const steelOpacity = useTransform(progress, [0, 0.22, 0.4], [0.55, 0.55, 0]);
  const emberOpacity = useTransform(progress, [0.22, 0.4, 0.62, 0.78], [0, 0.6, 0.6, 0.15]);
  const redOpacity = useTransform(progress, [0.68, 0.8, 1], [0, 0.65, 0.85]);

  const shaftA_X = useTransform(progress, [0, 1], ["-20%", "115%"]);
  const shaftB_X = useTransform(progress, [0, 1], ["120%", "-15%"]);
  const shaftOpacity = useTransform(progress, [0, 0.06, 0.94, 1], [0, 0.4, 0.4, 0]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ opacity: steelOpacity, background: "radial-gradient(60% 45% at 30% 65%, var(--color-steel-soft) 0%, transparent 70%)" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ opacity: emberOpacity, background: "radial-gradient(55% 50% at 70% 40%, var(--color-ember-soft) 0%, transparent 72%)" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ opacity: redOpacity, background: "radial-gradient(65% 55% at 50% 50%, var(--color-red-soft) 0%, transparent 75%)" }}
      />

      <motion.div style={{ x: shaftA_X, opacity: shaftOpacity }} className="absolute top-[-10%] h-[130%] w-[3px] rotate-[16deg] blur-[2px]">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-foreground/25 to-transparent" />
      </motion.div>
      <motion.div
        style={{ x: shaftB_X, opacity: shaftOpacity }}
        className="absolute top-[-10%] hidden h-[130%] w-[2px] rotate-[16deg] blur-[2px] lg:block"
      >
        <div className="h-full w-full bg-gradient-to-b from-transparent via-foreground/15 to-transparent" />
      </motion.div>

      {/* static grain — feTurbulence is not scroll- or time-animated, so it costs one paint, not one per frame */}
      <svg className="absolute inset-0 hidden h-full w-full opacity-[0.035] mix-blend-overlay lg:block">
        <filter id="cinematic-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cinematic-grain)" />
      </svg>
    </div>
  );
}
