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

      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 1400 }}>
        <HeroProduct
          progress={progress}
          src="/assets/products/argus-g4/card.webp"
          alt="VOOPOO ARGUS G4"
          sizeClass="h-[48vh] w-[16vh] sm:h-[62vh] sm:w-[21vh]"
          glow="rgba(255,106,44,0.45)"
          focusAt={[0.06, 0.22, 0.42, 0.56]}
          entry={{ x: "36vw", y: "30vh", rotate: 16, rotateY: 34, scale: 0.6, blur: 22 }}
          focus={{ x: "0vw", y: "-5vh", rotate: -6, rotateY: 10, scale: 1, blur: 0 }}
          settle={{ x: "-1vw", y: "-6vh", rotate: -5, rotateY: 5, scale: 1.04, blur: 0 }}
          exit={{ x: "-32vw", y: "-40vh", rotate: -16, rotateY: -26, scale: 1.55, blur: 18 }}
        />
        <HeroProduct
          progress={progress}
          src="/assets/products/drag-6/home-brown-v2.webp"
          alt="VOOPOO DRAG 6"
          sizeClass="h-[44vh] w-[26vh] sm:h-[56vh] sm:w-[33vh]"
          glow="rgba(255,106,44,0.4)"
          focusAt={[0.40, 0.56, 0.72, 0.84]}
          entry={{ x: "32vw", y: "34vh", rotate: 20, rotateY: 36, scale: 0.6, blur: 24 }}
          focus={{ x: "-2vw", y: "-5vh", rotate: 6, rotateY: 8, scale: 1, blur: 0 }}
          settle={{ x: "-3vw", y: "-6vh", rotate: 5, rotateY: 4, scale: 1.04, blur: 0 }}
          exit={{ x: "-36vw", y: "-36vh", rotate: 12, rotateY: -24, scale: 1.55, blur: 18 }}
        />
      </div>

      <motion.div style={{ opacity: textOpacity, y: textY }} className="absolute bottom-[14%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-center sm:bottom-[16%]">
        <span className="label-mono text-[0.65rem] tracking-[0.25em] text-ember sm:text-xs">{CINEMATIC_COPY.voopooBrand}</span>
        <p className="font-display text-lg font-semibold text-foreground sm:text-2xl">{CINEMATIC_COPY.voopooLine}</p>
      </motion.div>
    </motion.div>
  );
}
