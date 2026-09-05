"use client";

import Image from "next/image";
import { easeIn, easeOut, motion, useMotionTemplate, useTransform, type MotionValue } from "framer-motion";

export interface HeroKeyframe {
  x?: string;
  y?: string;
  rotate?: number;
  /** Y-axis tilt in degrees — with `perspective` on an ancestor this gives real foreshortening
   *  from a flat product photo (the Phase 3.3.1 technique), far cheaper and softer than moving
   *  the element along Z. */
  rotateY?: number;
  scale: number;
  blur: number;
}

/**
 * One product's journey through the shot — Phase 3.3.4: the Phase 3.3.3 *structure* (two
 * products per chapter travelling the same corridor in sequence, four-stop `focusAt` with a
 * readable focus moment) rebuilt on the Phase 3.3.1 *motion model* (scale + rotateY + blur + a
 * wide soft glow), because the owner's verdict on 3.3.3 was "stiff, not smooth" and on 3.3.1
 * "diffuse, better transitions".
 *
 * Why 3.3.3 felt stiff, and what changed:
 *  - Scale used to be a by-product of `translateZ` inside a perspective — perspective-correct, but
 *    that makes apparent size grow hyperbolically near the camera, so products lunged in the last
 *    stretch. Scale is now authored directly (like 3.3.1), so growth is even.
 *  - The focus "hold" was a perfectly flat segment between two linear ramps, i.e. the product
 *    stopped dead and restarted. The hold is now a slow drift (`settle` keyframe) and every
 *    segment is eased — decelerating into focus, accelerating out — so velocity never jumps.
 *  - Blur/glow are back at 3.3.1 strength (blur ~20px on entry/exit, 55px drop-shadow) and a soft
 *    bloom halo sits behind each product at focus — the "diffuse" quality, without re-introducing
 *    the small background-product layer the owner rejected in 3.3.2.
 */
export function HeroProduct({
  progress,
  src,
  alt,
  sizeClass,
  glow,
  entry,
  focus,
  settle,
  exit,
  focusAt,
}: {
  progress: MotionValue<number>;
  src: string;
  alt: string;
  sizeClass: string;
  glow: string;
  entry: HeroKeyframe;
  focus: HeroKeyframe;
  /** Where the product drifts to during the focus hold — small deltas from `focus` only. */
  settle: HeroKeyframe;
  exit: HeroKeyframe;
  focusAt: [number, number, number, number];
}) {
  // ease per segment: arrive (decelerate) → hold (slow linear drift) → depart (accelerate)
  const ease = [easeOut, (v: number) => v, easeIn];
  const x = useTransform(progress, focusAt, [entry.x ?? "0vw", focus.x ?? "0vw", settle.x ?? "0vw", exit.x ?? "0vw"], { ease });
  const y = useTransform(progress, focusAt, [entry.y ?? "0vh", focus.y ?? "0vh", settle.y ?? "0vh", exit.y ?? "0vh"], { ease });
  const rotate = useTransform(progress, focusAt, [entry.rotate ?? 0, focus.rotate ?? 0, settle.rotate ?? 0, exit.rotate ?? 0], { ease });
  const rotateY = useTransform(progress, focusAt, [entry.rotateY ?? 0, focus.rotateY ?? 0, settle.rotateY ?? 0, exit.rotateY ?? 0], { ease });
  const scale = useTransform(progress, focusAt, [entry.scale, focus.scale, settle.scale, exit.scale], { ease });
  const blurPx = useTransform(progress, focusAt, [entry.blur, focus.blur, settle.blur, exit.blur], { ease });
  const filter = useMotionTemplate`blur(${blurPx}px) drop-shadow(0 0 55px ${glow})`;

  const fadeIn = focusAt[0] - 0.07;
  const fadeOut = focusAt[3] + 0.07;
  const opacity = useTransform(progress, [fadeIn, focusAt[0], focusAt[3], fadeOut], [0, 1, 1, 0]);

  // bloom halo: brightest while the product is sharp, gone while it is travelling
  const haloOpacity = useTransform(progress, [focusAt[0], focusAt[1], focusAt[2], focusAt[3]], [0, 0.5, 0.5, 0]);

  return (
    <motion.div
      style={{ x, y, rotate, rotateY, scale, filter, opacity, willChange: "transform, filter, opacity" }}
      className={`absolute shrink-0 ${sizeClass}`}
    >
      <motion.div
        aria-hidden
        style={{ opacity: haloOpacity, background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${glow} 0%, transparent 70%)` }}
        className="pointer-events-none absolute -inset-[30%] hidden blur-3xl lg:block"
      />
      <Image src={src} alt={alt} fill sizes="70vh" className="object-contain" priority={false} />
    </motion.div>
  );
}
