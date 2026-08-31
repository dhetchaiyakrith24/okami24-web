"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useTransform, type MotionValue } from "framer-motion";

/**
 * A second, background-plane product — heavily blurred, darkened, and desaturated so it reads as
 * "another product further back in the same space," not as a second hero competing for focus. It
 * drifts slower than the scene's main product (a cheap but effective parallax cue: closer things
 * move faster) and never resolves to sharp focus.
 *
 * Desktop/tablet only (`hidden lg:block`) — the mobile choreography intentionally drops this
 * layer rather than shrinking it, per the phase's "fewer simultaneous products" mobile direction.
 */
export function DepthLayer({
  progress,
  src,
  side,
}: {
  progress: MotionValue<number>;
  src: string;
  side: "left" | "right";
}) {
  const sign = side === "left" ? -1 : 1;
  const x = useTransform(progress, [0, 1], [`${sign * 34}vw`, `${sign * 10}vw`]);
  const y = useTransform(progress, [0, 1], ["6vh", "-4vh"]);
  const rotate = useTransform(progress, [0, 1], [sign * -10, sign * -4]);
  const scale = useTransform(progress, [0, 0.5, 1], [1.3, 1.45, 1.55]);
  const opacity = useTransform(progress, [0, 0.15, 0.75, 1], [0, 0.55, 0.55, 0.2]);
  const blurPx = useTransform(progress, [0, 1], [14, 22]);
  const filter = useMotionTemplate`blur(${blurPx}px) brightness(0.4) saturate(0.7)`;

  return (
    <motion.div
      aria-hidden
      style={{ x, y, rotate, scale, opacity, filter }}
      className="absolute hidden h-[46vh] w-[20vh] lg:block"
    >
      <Image src={src} alt="" fill sizes="20vh" className="object-contain" />
    </motion.div>
  );
}
