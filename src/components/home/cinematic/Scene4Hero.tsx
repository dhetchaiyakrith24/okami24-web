"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { CINEMATIC_COPY } from "./copy";
import { HeroProduct } from "./HeroProduct";

/**
 * SALTHUB M BAR — the visual energy peak. Straighter, more centered travel than the two previous
 * chapters (less lateral, more toward-camera) so this chapter reads as the most direct, most
 * dominant pass of the sequence. The M Bar 10K travels through first; the M Bar 15K — already
 * red/black, the same identity palette as OKami itself — follows along the same corridor. The
 * flare that peaks here is the same energy the finale's convergence stage pulls back inward.
 */
export function Scene4Hero({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.08, 0.9, 1], [0, 1, 1, 0]);
  const flareOpacity = useTransform(progress, [0.16, 0.3, 0.6, 0.9], [0, 0.65, 0.65, 0.25]);

  const textOpacity = useTransform(progress, [0.18, 0.28, 0.9, 0.97], [0, 1, 1, 0]);
  const textY = useTransform(progress, [0.18, 0.28], [22, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 overflow-hidden">
      <motion.div aria-hidden style={{ opacity: flareOpacity }} className="absolute h-[85vmin] w-[85vmin]">
        <div
          className="h-full w-full rounded-full"
          style={{ background: "radial-gradient(circle, var(--color-ember-soft) 0%, var(--color-red-soft) 45%, transparent 72%)" }}
        />
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 1400 }}>
        <HeroProduct
          progress={progress}
          src="/assets/products/m-bar-10k/card.webp"
          alt="SaltHub M Bar 10K"
          sizeClass="h-[52vh] w-[26vh] sm:h-[60vh] sm:w-[30vh]"
          glow="rgba(255,106,44,0.5)"
          focusAt={[0.06, 0.22, 0.40, 0.54]}
          entry={{ x: "6vw", y: "38vh", rotate: 10, rotateY: -24, scale: 0.6, blur: 22 }}
          focus={{ x: "0vw", y: "-5vh", rotate: -3, rotateY: -4, scale: 1, blur: 0 }}
          settle={{ x: "0vw", y: "-5vh", rotate: -2, rotateY: -2, scale: 1.05, blur: 0 }}
          exit={{ x: "-8vw", y: "-44vh", rotate: -8, rotateY: 10, scale: 1.6, blur: 18 }}
        />
        <HeroProduct
          progress={progress}
          src="/assets/products/m-bar-15k/card.webp"
          alt="SaltHub M Bar 15K"
          sizeClass="h-[50vh] w-[25vh] sm:h-[58vh] sm:w-[29vh]"
          glow="rgba(255,60,60,0.45)"
          focusAt={[0.38, 0.54, 0.68, 0.80]}
          entry={{ x: "-8vw", y: "38vh", rotate: -12, rotateY: 26, scale: 0.6, blur: 24 }}
          focus={{ x: "4vw", y: "-5vh", rotate: 5, rotateY: 4, scale: 1, blur: 0 }}
          settle={{ x: "4vw", y: "-5vh", rotate: 4, rotateY: 2, scale: 1.05, blur: 0 }}
          exit={{ x: "10vw", y: "-44vh", rotate: 10, rotateY: -10, scale: 1.6, blur: 18 }}
        />
      </div>

      <motion.div style={{ opacity: textOpacity, y: textY }} className="absolute bottom-[10%] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-center">
        <span className="label-mono text-[0.65rem] tracking-[0.25em] text-foreground-dim sm:text-xs">{CINEMATIC_COPY.heroBrand}</span>
        <p className="font-display text-xl font-semibold text-foreground sm:text-3xl">{CINEMATIC_COPY.heroLine}</p>
      </motion.div>
    </motion.div>
  );
}
