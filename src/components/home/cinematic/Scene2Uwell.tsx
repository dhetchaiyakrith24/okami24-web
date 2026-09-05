"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { CINEMATIC_COPY } from "./copy";
import { HeroProduct } from "./HeroProduct";

/**
 * UWELL — precision / engineering. Two real UWELL devices travel through the same shot in
 * sequence, not simultaneously: the Caliburn G5 rises from the lower-left as a distant, blurred
 * presence, travels toward the viewer along Z, resolves to sharp focus, holds, then continues past
 * the focal plane toward the upper-right — and while it's still departing, the Caliburn G4 Pro
 * KOKO is already arriving along the same diagonal, so the hand-off reads as one continuous
 * corridor of travel rather than two disconnected products. Every product here is full-size and
 * dominant — no small background silhouettes propping up the composition.
 */
export function Scene2Uwell({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.1, 0.88, 1], [0, 1, 1, 0]);

  const bracketOpacity = useTransform(progress, [0.16, 0.24, 0.92, 0.98], [0, 1, 1, 0]);

  const textOpacity = useTransform(progress, [0.18, 0.26, 0.9, 0.97], [0, 1, 1, 0]);
  const textY = useTransform(progress, [0.18, 0.26], [16, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 1400 }}>
        <HeroProduct
          progress={progress}
          src="/assets/products/caliburn-g5/card.png"
          alt="UWELL Caliburn G5"
          sizeClass="h-[50vh] w-[20vh] sm:h-[62vh] sm:w-[25vh]"
          glow="rgba(111,184,216,0.45)"
          focusAt={[0.06, 0.22, 0.42, 0.56]}
          entry={{ x: "-34vw", y: "32vh", rotate: -14, rotateY: -32, scale: 0.6, blur: 22 }}
          focus={{ x: "0vw", y: "-5vh", rotate: -2, rotateY: -8, scale: 1, blur: 0 }}
          settle={{ x: "1vw", y: "-6vh", rotate: -1, rotateY: -4, scale: 1.04, blur: 0 }}
          exit={{ x: "30vw", y: "-40vh", rotate: 12, rotateY: 24, scale: 1.55, blur: 18 }}
        />
        <HeroProduct
          progress={progress}
          src="/assets/products/caliburn-g4-pro-koko/card.png"
          alt="UWELL Caliburn G4 Pro KOKO"
          sizeClass="h-[46vh] w-[30vh] sm:h-[58vh] sm:w-[38vh]"
          glow="rgba(111,184,216,0.4)"
          focusAt={[0.40, 0.56, 0.72, 0.84]}
          entry={{ x: "-30vw", y: "34vh", rotate: -16, rotateY: -34, scale: 0.6, blur: 24 }}
          focus={{ x: "2vw", y: "-5vh", rotate: 2, rotateY: -6, scale: 1, blur: 0 }}
          settle={{ x: "3vw", y: "-6vh", rotate: 1, rotateY: -3, scale: 1.04, blur: 0 }}
          exit={{ x: "34vw", y: "-38vh", rotate: -8, rotateY: 22, scale: 1.55, blur: 18 }}
        />

        <motion.div aria-hidden style={{ opacity: bracketOpacity, y: "-5vh" }} className="absolute h-[36vh] w-[22vh] sm:h-[44vh] sm:w-[28vh]">
          {[
            "left-0 top-0 border-l border-t",
            "right-0 top-0 border-r border-t",
            "left-0 bottom-0 border-l border-b",
            "right-0 bottom-0 border-r border-b",
          ].map((pos) => (
            <span key={pos} className={`absolute h-4 w-4 border-steel ${pos}`} />
          ))}
        </motion.div>
      </div>

      <motion.div style={{ opacity: textOpacity, y: textY }} className="absolute bottom-[14%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-center sm:bottom-[16%]">
        <span className="label-mono text-[0.65rem] tracking-[0.25em] text-steel sm:text-xs">{CINEMATIC_COPY.uwellBrand}</span>
        <p className="font-display text-lg font-semibold text-foreground sm:text-2xl">{CINEMATIC_COPY.uwellLine}</p>
      </motion.div>
    </motion.div>
  );
}
