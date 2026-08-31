"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * The OKami "cinematic identity" — four abstract geometric elements (steel ring, red arc, a
 * blade-sharp diagonal, an ink-stroke curve) built from the same visual DNA as the real logo
 * (brush-circle, red accent, a single confident stroke) without being the logo. Two modes:
 *
 * - "ambient": a faint, slow-rotating presence used behind Scenes 1–4 so the brand is felt
 *   throughout the sequence (owner requirement — not just revealed at the end), never resolving
 *   into anything readable.
 * - "assemble": the same four elements, now driven to converge into precise alignment as the
 *   finale's construction system — the real raster logo then crossfades in already sitting where
 *   these pieces landed, so the reveal reads as "the abstract became real" rather than "a logo
 *   faded in."
 */
export function CinematicMark({
  progress,
  mode,
}: {
  progress: MotionValue<number>;
  mode: "ambient" | "assemble";
}) {
  const isAmbient = mode === "ambient";

  const ringRotate = useTransform(progress, [0, 1], isAmbient ? [0, 34] : [-70, 0]);
  const ringScale = useTransform(progress, [0, 1], isAmbient ? [1, 1.08] : [1.6, 1]);
  const ringOpacity = useTransform(progress, [0, 0.15, 1], isAmbient ? [0, 0.09, 0.09] : [0, 0.5, 0.85]);

  const arcRotate = useTransform(progress, [0, 1], isAmbient ? [0, -26] : [95, 0]);
  const arcX = useTransform(progress, [0, 1], isAmbient ? ["0vw", "0vw"] : ["18vw", "0vw"]);
  const arcOpacity = useTransform(progress, [0, 0.2, 1], isAmbient ? [0, 0.07, 0.07] : [0, 0.4, 1]);

  const bladeRotate = useTransform(progress, [0, 1], isAmbient ? [-8, -14] : [-40, -18]);
  const bladeX = useTransform(progress, [0, 1], isAmbient ? ["0vw", "0vw"] : ["-22vw", "0vw"]);
  const bladeOpacity = useTransform(progress, [0, 0.25, 1], isAmbient ? [0, 0.06, 0.06] : [0, 0.5, 0.95]);

  const inkY = useTransform(progress, [0, 1], isAmbient ? ["0vh", "0vh"] : ["14vh", "0vh"]);
  const inkOpacity = useTransform(progress, [0, 0.3, 1], isAmbient ? [0, 0.05, 0.05] : [0, 0.35, 0.9]);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute h-[62vmin] w-[62vmin]"
        style={{ rotate: ringRotate, scale: ringScale, opacity: ringOpacity }}
      >
        <circle cx="200" cy="200" r="168" fill="none" stroke="var(--color-steel-strong)" strokeWidth="1.5" strokeDasharray="220 620" strokeLinecap="round" />
      </motion.svg>

      <motion.svg
        viewBox="0 0 400 400"
        className="absolute h-[54vmin] w-[54vmin]"
        style={{ rotate: arcRotate, x: arcX, opacity: arcOpacity }}
      >
        <circle cx="200" cy="200" r="150" fill="none" stroke="var(--color-red-strong)" strokeWidth="3" strokeDasharray="130 830" strokeLinecap="round" />
      </motion.svg>

      <motion.div
        aria-hidden
        style={{ rotate: bladeRotate, x: bladeX, opacity: bladeOpacity }}
        className="absolute h-[46vmin] w-[2px] bg-gradient-to-b from-transparent via-steel to-transparent"
      />

      <motion.svg viewBox="0 0 400 200" className="absolute h-[20vmin] w-[42vmin]" style={{ y: inkY, opacity: inkOpacity }}>
        <path d="M 40 150 Q 160 40 380 70" fill="none" stroke="var(--color-red)" strokeWidth="4" strokeLinecap="round" />
      </motion.svg>
    </div>
  );
}
