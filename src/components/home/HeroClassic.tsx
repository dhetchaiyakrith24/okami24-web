"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { Hero } from "./Hero";

/**
 * The previous phone hero (Hero.tsx, PHONE_HERO "classic" in src/data/home-hero.ts), loaded only when it is rendered —
 * with its stylesheet (hero-classic.css, imported by hero-classic-entry.ts). While the showcase hero is live, neither
 * is shipped: the shared stylesheet stays under Turbopack's merge size (round homepage upgrade 21/10). Server-rendered
 * as before when the switch is on (next/dynamic keeps SSR), so its CSS-only first-frame motion is unchanged.
 */
const Lazy = dynamic(() => import("./hero-classic-entry").then((m) => m.Hero));

export function HeroClassic(props: ComponentProps<typeof Hero>) {
  return <Lazy {...props} />;
}
