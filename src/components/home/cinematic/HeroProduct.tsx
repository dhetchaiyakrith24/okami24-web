"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useTransform, type MotionValue } from "framer-motion";

export interface DepthKeyframe {
  x?: string;
  y?: string;
  /** translateZ, in px, inside a `perspective`-bearing ancestor. Negative = far/small/behind the
   *  focal plane, 0 = the focal plane itself, positive = past the focal plane toward the camera. */
  z: number;
  rotate?: number;
  blur: number;
}

/**
 * A single product's full depth journey — arrives as a distant, blurred, small presence off to one
 * side, travels toward the viewer along the Z axis, resolves to sharp focus at natural size, HOLDS
 * there (`focusAt`'s middle two breakpoints share the `focus` keyframe, so interpolation between
 * them is flat), then continues travelling *past* the focal plane — apparent size keeps growing
 * past 100%, as if passing close beside the camera — before blurring away into the next moment.
 *
 * Scale is not hand-animated: it's a side effect of `translateZ` inside a `perspective`-bearing
 * ancestor (set by the scene that renders this), which is what makes the "coming from behind/
 * beside you" reading work — this is real perspective-correct foreshortening from the browser's
 * own 3D transform math, not a faked scale curve standing in for it.
 */
export function HeroProduct({
  progress,
  src,
  alt,
  sizeClass,
  glow,
  entry,
  focus,
  exit,
  focusAt,
}: {
  progress: MotionValue<number>;
  src: string;
  alt: string;
  sizeClass: string;
  glow: string;
  entry: DepthKeyframe;
  focus: DepthKeyframe;
  exit: DepthKeyframe;
  focusAt: [number, number, number, number];
}) {
  const x = useTransform(progress, focusAt, [entry.x ?? "0vw", focus.x ?? "0vw", focus.x ?? "0vw", exit.x ?? "0vw"]);
  const y = useTransform(progress, focusAt, [entry.y ?? "0vh", focus.y ?? "0vh", focus.y ?? "0vh", exit.y ?? "0vh"]);
  const z = useTransform(progress, focusAt, [entry.z, focus.z, focus.z, exit.z]);
  const rotate = useTransform(progress, focusAt, [entry.rotate ?? 0, focus.rotate ?? 0, focus.rotate ?? 0, exit.rotate ?? 0]);
  const blurPx = useTransform(progress, focusAt, [entry.blur, focus.blur, focus.blur, exit.blur]);
  const filter = useMotionTemplate`blur(${blurPx}px) drop-shadow(0 0 38px ${glow})`;

  const fadeIn = focusAt[0] - 0.07;
  const fadeOut = focusAt[3] + 0.07;
  const opacity = useTransform(progress, [fadeIn, focusAt[0], focusAt[3], fadeOut], [0, 1, 1, 0]);

  return (
    <motion.div style={{ x, y, z, rotate, filter, opacity }} className={`absolute shrink-0 ${sizeClass}`}>
      <Image src={src} alt={alt} fill sizes="70vh" className="object-contain" priority={false} />
    </motion.div>
  );
}
