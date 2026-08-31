import { useTransform, type MotionValue } from "framer-motion";

/**
 * Maps the container's global scrollYProgress (0→1 across the whole 600vh/380vh pinned track)
 * down to a scene-local 0→1 progress, so each scene's own animation curves can be authored
 * without re-deriving the outer range every time. useTransform clamps outside [start, end] by
 * default, so a scene simply reads 0 before its turn and 1 after — exactly what a fade/hold/exit
 * curve needs.
 */
export function useSceneProgress(scrollYProgress: MotionValue<number>, start: number, end: number) {
  return useTransform(scrollYProgress, [start, end], [0, 1]);
}

/** Standard fade/scale envelope: in, hold, out — expressed as scene-local stops (0→1). */
export const ENTER_HOLD_EXIT = {
  opacity: [0, 0.12, 0.82, 1] as number[],
  opacityValues: [0, 1, 1, 0] as number[],
};
