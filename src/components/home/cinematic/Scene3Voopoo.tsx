"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { CINEMATIC_COPY } from "./copy";
import { HeroProduct } from "./HeroProduct";

/**
 * VOOPOO — energy / velocity. Mirrors Scene 2's grammar (arrive from depth → resolve → hold →
 * travel past camera) but along the opposite diagonal — lower-right to upper-left — so the two
 * scenes read as different energy, not a reskin. ARGUS G4 travels through first; DRAG 6 is
 * already arriving along the same corridor as it departs.
 */
export function Scene3Voopoo({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.1, 0.88, 1], [0, 1, 1, 0]);

  const glowOpacity = useTransform(progress, [0.14, 0.3, 0.62, 0.9], [0, 0.5, 0.5, 0.15]);

  const textOpacity = useTransform(progress, [0.18, 0.26, 0.9, 0.97], [0, 1, 1, 0]);
  const textY = useTransform(progress, [0.18, 0.26], [16, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 overflow-hidden">
      <motion.div aria-hidden style={{ opacity: glowOpacity }} className="absolute h-[58vmin] w-[58vmin] rounded-full">
        <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(circle, var(--color-ember-soft) 0%, transparent 68%)" }} />
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 1600 }}>
        <HeroProduct
          progress={progress}
          src="/assets/products/argus-g4/card.png"
          alt="VOOPOO ARGUS G4"
          sizeClass="h-[50vh] w-[17vh] sm:h-[64vh] sm:w-[22vh]"
          glow="rgba(255,106,44,0.4)"
          focusAt={[0.06, 0.24, 0.5, 0.64]}
          entry={{ x: "40vw", y: "38vh", z: -1700, rotate: 18, blur: 22 }}
          focus={{ x: "0vw", y: "0vh", z: 0, rotate: -6, blur: 0 }}
          exit={{ x: "-36vw", y: "-44vh", z: 950, rotate: -16, blur: 20 }}
        />
        <HeroProduct
          progress={progress}
          src="/assets/products/drag-6/card.png"
          alt="VOOPOO DRAG 6"
          sizeClass="h-[46vh] w-[27vh] sm:h-[58vh] sm:w-[34vh]"
          glow="rgba(255,106,44,0.4)"
          focusAt={[0.48, 0.66, 0.88, 0.98]}
          entry={{ x: "34vw", y: "42vh", z: -1800, rotate: 22, blur: 24 }}
          focus={{ x: "-2vw", y: "0vh", z: 0, rotate: 6, blur: 0 }}
          exit={{ x: "-40vw", y: "-40vh", z: 1000, rotate: 12, blur: 20 }}
        />
      </div>

      <motion.div style={{ opacity: textOpacity, y: textY }} className="absolute bottom-[14%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-center sm:bottom-[16%]">
        <span className="label-mono text-[0.65rem] tracking-[0.25em] text-ember sm:text-xs">{CINEMATIC_COPY.voopooBrand}</span>
        <p className="font-display text-lg font-semibold text-foreground sm:text-2xl">{CINEMATIC_COPY.voopooLine}</p>
      </motion.div>
    </motion.div>
  );
}
