"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useSceneProgress } from "./scroll-range";
import { Atmosphere } from "./Atmosphere";
import { CinematicMark } from "./CinematicMark";
import { SceneWipe } from "./SceneWipe";
import { Scene1Void } from "./Scene1Void";
import { Scene2Uwell } from "./Scene2Uwell";
import { Scene3Voopoo } from "./Scene3Voopoo";
import { Scene4Hero } from "./Scene4Hero";
import { Scene5Finale } from "./Scene5Finale";
import { StaticIntro } from "./StaticIntro";
import { CINEMATIC_COPY } from "./copy";

/**
 * OKami24 — Phase 3.3.1: cinematic homepage impact pass.
 *
 * Same core architecture as Draft 1 (one tall sticky track, one global `scrollYProgress`, each
 * scene reading a slice of it) — that mechanism was validated and kept. What changed is what's
 * layered on top of it: a persistent `Atmosphere` (haze/light-shafts/grain) and a persistent,
 * *abstract* `CinematicMark` both run across the full sequence instead of resetting per scene, so
 * the brand is felt throughout rather than only revealed at the end; each product scene now
 * layers a blurred background product (`DepthLayer`) behind a focal-plane hero product
 * (`HeroProduct`) that travels through the shot instead of sliding into a fixed spot; and
 * `SceneWipe` cuts physically connect each scene boundary instead of a plain crossfade.
 *
 * STACK: still Framer Motion + native sticky — no new dependency, and that was a deliberate
 * re-evaluation, not inertia. The added depth/atmosphere/scale come from real 2D product photos
 * composited with CSS filters (blur/drop-shadow), `perspective`+`rotateY` for cheap foreshortening,
 * and layered gradients — not from fabricated 3D geometry, which real photography can't back up
 * honestly. See the Phase 3.3.1 report §STACK RE-EVALUATION for the full reasoning, including why
 * WebGL/Three.js was reconsidered and still not chosen for this pass.
 */
export function CinematicIntro() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // Adjacent scenes overlap substantially on purpose (~0.06–0.10 of the whole sequence) so that at
  // each SceneWipe boundary below, the outgoing product is still mid-exit (visible, blurred,
  // departing) at the same moment the incoming product is mid-entry (visible, blurred, arriving)
  // — an earlier version with near-zero overlap produced a dead gap right at each cut, where the
  // wipe swept across nothing because scene A had already fully exited before scene B started.
  const scene1 = useSceneProgress(scrollYProgress, 0, 0.2);
  const scene2 = useSceneProgress(scrollYProgress, 0.14, 0.4);
  const scene3 = useSceneProgress(scrollYProgress, 0.34, 0.6);
  const scene4 = useSceneProgress(scrollYProgress, 0.54, 0.82);
  const scene5 = useSceneProgress(scrollYProgress, 0.76, 1);
  const ambientMark = useSceneProgress(scrollYProgress, 0, 0.76);

  // The button lives inside the sticky viewport, so once the container releases (progress → 1)
  // its remaining height still scrolls past normally for a moment — without this, "Skip intro"
  // would linger and visually overlap the real Hero content right where it hands off. Fading it
  // out slightly before the release point (and in slightly after the void's own scroll hint has
  // done its job) keeps exactly one "what do I do here" affordance on screen at a time.
  const skipOpacity = useTransform(scrollYProgress, [0.03, 0.08, 0.93, 0.98], [0, 0.7, 0.7, 0]);

  function skipToStore() {
    const el = containerRef.current;
    if (!el) return;
    window.scrollTo({ top: el.offsetTop + el.offsetHeight - window.innerHeight * 0.05, behavior: "smooth" });
  }

  if (prefersReducedMotion) {
    return <StaticIntro />;
  }

  return (
    <div ref={containerRef} className="relative h-[320vh] sm:h-[420vh] lg:h-[600vh]">
      <div className="sticky top-0 z-10 h-screen w-full overflow-hidden bg-surface-0">
        <Atmosphere progress={scrollYProgress} />
        <CinematicMark progress={ambientMark} mode="ambient" />

        <Scene1Void progress={scene1} />
        <Scene2Uwell progress={scene2} />
        <Scene3Voopoo progress={scene3} />
        <Scene4Hero progress={scene4} />
        <Scene5Finale progress={scene5} />

        <SceneWipe progress={scrollYProgress} at={0.17} tint="var(--color-steel)" />
        <SceneWipe progress={scrollYProgress} at={0.37} tint="var(--color-ember)" />
        <SceneWipe progress={scrollYProgress} at={0.57} tint="var(--color-ember-strong)" />
        <SceneWipe progress={scrollYProgress} at={0.775} tint="var(--color-red-strong)" width={0.03} />

        <motion.button
          type="button"
          onClick={skipToStore}
          style={{ opacity: skipOpacity }}
          whileHover={{ opacity: 1 }}
          className="label-mono absolute bottom-6 left-6 z-40 rounded-full border border-surface-border bg-surface-0/60 px-4 py-2 text-[0.65rem] text-foreground-muted backdrop-blur-sm sm:bottom-8 sm:left-8"
        >
          {CINEMATIC_COPY.skip} ↓
        </motion.button>
      </div>

      {/* Handoff afterglow: sits at the very bottom of the scroll track, behind the sticky
          viewport (z-index-less, under the sticky's z-10) so it's invisible until the sticky
          content releases and scrolls away — at which point it's already positioned exactly
          where the real Hero begins, carrying the finale's warm light into it instead of cutting
          straight from black to Hero's own background. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[26vh] opacity-40"
        style={{ background: "linear-gradient(to bottom, transparent 0%, var(--color-ember-soft) 100%)" }}
      />
    </div>
  );
}
