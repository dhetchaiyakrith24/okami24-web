"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { CINEMATIC_COPY } from "./copy";
import { CinematicMark } from "./CinematicMark";

const PARTICLES = [
  { x: "-38vw", y: "-22vh" },
  { x: "34vw", y: "-18vh" },
  { x: "-30vw", y: "26vh" },
  { x: "40vw", y: "24vh" },
  { x: "0vw", y: "-34vh" },
  { x: "2vw", y: "32vh" },
];

function ConvergenceParticle({ progress, from }: { progress: MotionValue<number>; from: { x: string; y: string } }) {
  const x = useTransform(progress, [0, 0.16], [from.x, "0vw"]);
  const y = useTransform(progress, [0, 0.16], [from.y, "0vh"]);
  const opacity = useTransform(progress, [0, 0.1, 0.16], [0, 0.7, 0]);
  const scale = useTransform(progress, [0, 0.16], [1, 0.1]);
  return <motion.div aria-hidden style={{ x, y, opacity, scale }} className="absolute h-2 w-2 rounded-full bg-ember" />;
}

/**
 * OKAMI FINALE — five beats, not one fade: (1) convergence — the previous scene's leftover
 * energy collapses inward as darkness deepens; (2) the cut — a full red slash + a brief flash to
 * near-black; (3) the abstract cinematic mark (see `CinematicMark`) assembles from scattered
 * fragments into alignment; (4) the real logo crossfades in already sitting where the mark
 * landed, so it reads as "the abstract became real"; (5) settle — a small breathing scale and the
 * OKAMI24 wordmark, then the scene holds (it does not fade itself out — see CinematicIntro for
 * why: an artificial fade-to-invisible right at the climax would undercut the reveal, so instead
 * this scene simply scrolls away naturally once the sticky container releases).
 */
export function Scene5Finale({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.06], [0, 1]);

  const vignetteOpacity = useTransform(progress, [0, 0.16], [0, 0.92]);

  const flashOpacity = useTransform(progress, [0.16, 0.2, 0.26], [0, 0.85, 0]);
  const sweepScaleX = useTransform(progress, [0.17, 0.25], [0, 1]);
  const sweepOpacity = useTransform(progress, [0.25, 0.32], [1, 0]);

  const assembleProgress = useTransform(progress, [0.26, 0.62], [0, 1]);
  const assembleOpacity = useTransform(progress, [0.26, 0.32, 0.56, 0.66], [0, 1, 1, 0]);

  const logoScale = useTransform(progress, [0.5, 0.66, 1], [0.9, 1, 1.04]);
  const logoOpacity = useTransform(progress, [0.5, 0.66], [0, 1]);

  const labelOpacity = useTransform(progress, [0.64, 0.78], [0, 1]);
  const labelY = useTransform(progress, [0.64, 0.78], [10, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-hidden">
      <motion.div aria-hidden style={{ opacity: vignetteOpacity }} className="absolute inset-0 bg-surface-0" />

      {PARTICLES.map((p, i) => (
        <ConvergenceParticle key={i} progress={progress} from={p} />
      ))}

      {/* the cut */}
      <motion.div aria-hidden style={{ opacity: flashOpacity }} className="absolute inset-0 bg-surface-0" />
      <motion.div
        aria-hidden
        style={{ scaleX: sweepScaleX, opacity: sweepOpacity }}
        className="absolute left-0 top-1/2 z-10 h-[3px] w-full origin-left -translate-y-1/2"
      >
        <div className="h-full w-full" style={{ background: "var(--color-red-strong)", boxShadow: "0 0 40px 6px var(--color-red-strong)" }} />
      </motion.div>

      <motion.div style={{ opacity: assembleOpacity }} className="absolute inset-0">
        <CinematicMark progress={assembleProgress} mode="assemble" />
      </motion.div>

      <motion.div style={{ scale: logoScale, opacity: logoOpacity }} className="relative z-10 h-[26vh] w-[26vh] sm:h-[36vh] sm:w-[36vh]">
        <Image src="/brand/okami-logo-red.png" alt="OKami24" fill sizes="36vh" className="object-contain" priority={false} />
      </motion.div>

      <motion.p style={{ opacity: labelOpacity, y: labelY }} className="label-mono relative z-10 text-xs tracking-[0.35em] text-foreground-dim sm:text-sm">
        {CINEMATIC_COPY.finaleMark}
      </motion.p>
    </motion.div>
  );
}
