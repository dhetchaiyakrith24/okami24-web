"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
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
 * OKami24 — Phase 3.3.3: cinematic rebuild.
 *
 * Same core architecture as every prior pass (one tall sticky track, one global
 * `scrollYProgress`, each scene reading a slice of it) — that mechanism has held up across three
 * revisions and stays. `Atmosphere` and the ambient `CinematicMark` are unchanged from Phase
 * 3.3.1 on purpose: the owner called that lighting/identity treatment "beautiful" and it was not
 * part of the 3.3.2 rejection, so it was left alone rather than re-touched for its own sake.
 *
 * What changed here: each product scene (`Scene2Uwell`/`Scene3Voopoo`/`Scene4Hero`) now shows
 * exactly TWO real products traveling through in sequence — never more, never simultaneous small
 * background/secondary layers — via `HeroProduct`'s real `translateZ`-based depth travel (see
 * that file). 3.3.2's `DepthLayer`/`SecondaryProduct`/`ForegroundPass` tiers are gone entirely;
 * the owner's own feedback was that small background products made the composition worse, not
 * better. `SceneWipe` cuts still connect each chapter boundary, unchanged from 3.3.1.
 */
export function CinematicIntro() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // Phase 3.3.4: every scene, wipe and the atmosphere read ONE spring-smoothed copy of the scroll
  // position rather than the raw value. Wheels/trackpads deliver scroll in discrete steps (a
  // wheel notch is ~100px, i.e. ~2% of the whole desktop sequence), so a value bound 1:1 to
  // scrollY makes the products hop between poses. The spring turns those steps into a continuous
  // glide with a small amount of weight (~0.2s settle, overdamped so it never overshoots back
  // through a SceneWipe window). skipInitialAnimation: when the browser restores a mid-page
  // scroll position on reload, jump straight there instead of replaying the intro from 0.
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 160,
    damping: 32,
    mass: 0.6,
    restDelta: 0.0005,
    skipInitialAnimation: true,
  });

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
      {/* h-svh, not h-screen: on phones 100vh is the LARGEST viewport (URL bar hidden), so a
          100vh stage overflowed the visible screen by the bar's height whenever the bar was
          showing — the skip button and captions sat under it. 100svh is the stable smallest
          visible height (no mid-scroll resize like dvh would cause); desktop is unaffected. */}
      <div className="sticky top-0 z-10 h-svh w-full overflow-hidden bg-surface-0">
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
