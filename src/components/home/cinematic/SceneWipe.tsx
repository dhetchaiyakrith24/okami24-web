"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * A physical "cut" between two scenes — a bright diagonal wipe sweeps across the whole frame at
 * the boundary, plus a brief full-screen light flash underneath it, so the transition reads as
 * one shape passing through the shot (connecting the two scenes) rather than scene A's opacity
 * dropping to 0 while scene B's rises to 1 in the same spot. Driven off the *global* scrollYProgress
 * so its timing is independent of (and layered on top of) each scene's own local progress.
 */
export function SceneWipe({
  progress,
  at,
  width = 0.045,
  tint,
}: {
  progress: MotionValue<number>;
  at: number;
  width?: number;
  tint: string;
}) {
  const flashOpacity = useTransform(progress, [at - width, at - width * 0.3, at + width * 0.3, at + width], [0, 0.3, 0.3, 0]);
  const sweepX = useTransform(progress, [at - width * 1.5, at + width * 1.5], ["-60vw", "140vw"]);
  const sweepOpacity = useTransform(progress, [at - width * 1.5, at - width * 0.6, at + width * 0.6, at + width * 1.5], [0, 1, 1, 0]);

  return (
    <>
      <motion.div
        aria-hidden
        style={{ opacity: flashOpacity, background: tint }}
        className="pointer-events-none absolute inset-0 z-30"
      />
      <motion.div
        aria-hidden
        style={{ x: sweepX, opacity: sweepOpacity }}
        className="pointer-events-none absolute top-[-10%] z-30 h-[120%] w-[38vw] -skew-x-[16deg]"
      >
        <div
          className="h-full w-full"
          style={{ background: `linear-gradient(90deg, transparent 0%, ${tint} 45%, var(--color-foreground) 50%, ${tint} 55%, transparent 100%)`, opacity: 0.9 }}
        />
      </motion.div>
    </>
  );
}
