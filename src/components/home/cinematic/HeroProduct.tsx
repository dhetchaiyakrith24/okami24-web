"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useTransform, type MotionValue } from "framer-motion";

export interface HeroKeyframe {
  x?: string;
  y?: string;
  rotate?: number;
  rotateY?: number;
  scale: number;
  blur: number;
}

/**
 * The scene's main focal product. Unlike a card that fades/slides into a fixed on-screen spot,
 * this travels through a focal plane: it arrives oversized and out-of-focus (as if closer to the
 * camera than the resting frame — "from behind the viewer"), resolves to sharp focus near the
 * scene's midpoint, then continues moving and blurs again as it exits — so the product is never
 * simply "placed," it passes through the shot. `rotateY` (combined with `perspective` set on an
 * ancestor) gives real foreshortening from a flat 2D photo, cheaply.
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
  focusAt = [0.08, 0.42, 0.92],
}: {
  progress: MotionValue<number>;
  src: string;
  alt: string;
  sizeClass: string;
  glow: string;
  entry: HeroKeyframe;
  focus: HeroKeyframe;
  exit: HeroKeyframe;
  focusAt?: [number, number, number];
}) {
  const x = useTransform(progress, focusAt, [entry.x ?? "0vw", focus.x ?? "0vw", exit.x ?? "0vw"]);
  const y = useTransform(progress, focusAt, [entry.y ?? "0vh", focus.y ?? "0vh", exit.y ?? "0vh"]);
  const rotate = useTransform(progress, focusAt, [entry.rotate ?? 0, focus.rotate ?? 0, exit.rotate ?? 0]);
  const rotateY = useTransform(progress, focusAt, [entry.rotateY ?? 0, focus.rotateY ?? 0, exit.rotateY ?? 0]);
  const scale = useTransform(progress, focusAt, [entry.scale, focus.scale, exit.scale]);
  const blurPx = useTransform(progress, focusAt, [entry.blur, focus.blur, exit.blur]);
  const filter = useMotionTemplate`blur(${blurPx}px) drop-shadow(0 0 55px ${glow})`;
  const opacity = useTransform(progress, [0, 0.06, 0.94, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ x, y, rotate, rotateY, scale, filter, opacity }}
      className={`relative shrink-0 ${sizeClass}`}
    >
      <Image src={src} alt={alt} fill sizes="60vh" className="object-contain" priority={false} />
    </motion.div>
  );
}
