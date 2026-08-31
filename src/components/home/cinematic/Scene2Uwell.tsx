"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { CINEMATIC_COPY } from "./copy";
import { DepthLayer } from "./DepthLayer";
import { HeroProduct } from "./HeroProduct";

/**
 * UWELL — precision / engineering. The Caliburn G5 arrives from close-up (oversized, blurred, as
 * if passing near the camera), resolves to sharp focus dead-center-right, then continues rising
 * and exits cropped off the top edge rather than settling into a static "card" position. A second
 * UWELL device (G4 Pro KOKO) sits blurred in the background-left, drifting slower, so the scene
 * reads as one populated space rather than a single isolated product. Focus brackets — a small
 * precision-HUD frame — snap in right at the resolve moment, reinforcing the focal-plane idea
 * rather than decorating it.
 */
export function Scene2Uwell({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.1, 0.88, 1], [0, 1, 1, 0]);

  const bracketOpacity = useTransform(progress, [0.32, 0.42, 0.56, 0.66], [0, 1, 1, 0]);
  const bracketScale = useTransform(progress, [0.32, 0.42], [1.15, 1]);

  const textOpacity = useTransform(progress, [0.36, 0.5, 0.8], [0, 1, 0]);
  const textY = useTransform(progress, [0.36, 0.52], [16, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 overflow-hidden">
      <DepthLayer progress={progress} src="/assets/products/caliburn-g4-pro-koko/card.png" side="left" />

      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 1400 }}>
        <HeroProduct
          progress={progress}
          src="/assets/products/caliburn-g5/card.png"
          alt="UWELL Caliburn G5"
          sizeClass="h-[58vh] w-[24vh] sm:h-[74vh] sm:w-[30vh]"
          glow="rgba(111,184,216,0.4)"
          entry={{ y: "34vh", x: "4vw", rotateY: -30, scale: 1.4, blur: 20 }}
          focus={{ y: "2vh", x: "8vw", rotateY: -6, rotate: -1, scale: 1.3, blur: 0 }}
          exit={{ y: "-40vh", x: "12vw", rotateY: 22, rotate: 5, scale: 1.6, blur: 16 }}
        />

        <motion.div
          aria-hidden
          style={{ opacity: bracketOpacity, scale: bracketScale }}
          className="absolute h-[38vh] w-[20vh] sm:h-[48vh] sm:w-[24vh]"
        >
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
