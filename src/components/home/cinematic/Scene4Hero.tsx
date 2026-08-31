"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { CINEMATIC_COPY } from "./copy";
import { DepthLayer } from "./DepthLayer";
import { HeroProduct } from "./HeroProduct";

/**
 * SALTHUB M BAR — the visual energy peak. The M Bar 10K is allowed to dominate: its focus scale is
 * large enough to crop against the top and bottom of the viewport rather than sit neatly inside
 * it, and the M Bar 15K (already red/black — the same identity palette) sits behind it as a second
 * layer. Everything before this scene has been building restraint; this is the one moment allowed
 * to be bold. The flare that peaks here is the same light the finale's convergence stage pulls
 * back inward, so the transition into Scene 5 reads as this scene's energy collapsing, not a new
 * scene starting cold.
 */
export function Scene4Hero({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.08, 0.9, 1], [0, 1, 1, 0]);
  const flareOpacity = useTransform(progress, [0.24, 0.42, 0.9], [0, 0.85, 0.3]);

  const textOpacity = useTransform(progress, [0.36, 0.5, 0.82], [0, 1, 0]);
  const textY = useTransform(progress, [0.36, 0.52], [22, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 overflow-hidden">
      <motion.div aria-hidden style={{ opacity: flareOpacity }} className="absolute h-[85vmin] w-[85vmin]">
        <div
          className="h-full w-full rounded-full"
          style={{ background: "radial-gradient(circle, var(--color-ember-soft) 0%, var(--color-red-soft) 45%, transparent 72%)" }}
        />
      </motion.div>

      <DepthLayer progress={progress} src="/assets/products/m-bar-15k/card.webp" side="left" />

      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 1400 }}>
        <HeroProduct
          progress={progress}
          src="/assets/products/m-bar-10k/card.webp"
          alt="SaltHub M Bar 10K"
          sizeClass="h-[58vh] w-[29vh] sm:h-[78vh] sm:w-[39vh]"
          glow="rgba(255,106,44,0.5)"
          entry={{ y: "48vh", rotate: 14, rotateY: -24, scale: 1.3, blur: 22 }}
          focus={{ y: "0vh", rotate: -4, rotateY: -4, scale: 1.5, blur: 0 }}
          exit={{ y: "-16vh", rotate: -12, rotateY: 8, scale: 1.9, blur: 20 }}
        />
      </div>

      <motion.div style={{ opacity: textOpacity, y: textY }} className="absolute bottom-[10%] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-center">
        <span className="label-mono text-[0.65rem] tracking-[0.25em] text-foreground-dim sm:text-xs">{CINEMATIC_COPY.heroBrand}</span>
        <p className="font-display text-xl font-semibold text-foreground sm:text-3xl">{CINEMATIC_COPY.heroLine}</p>
      </motion.div>
    </motion.div>
  );
}
