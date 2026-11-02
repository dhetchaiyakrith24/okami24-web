"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Line map of Thailand for the address step (owner picked draft A 03/11: "แผนที่ไทยภาพเส้น หมุดวิ่งไปจังหวัดที่เลือก", no Google
 * Maps). The 77 province outlines come from src/data/thai-address/thai-map.json (Natural Earth, public domain; built by
 * scripts/build-thai-map.js) and are fetched as their own chunk after the page is up, so the form never waits for the map.
 * The picked province lights up and the pin travels to it from the last one; with reduced motion set, it just appears there.
 * Decoration only (aria-hidden): the province is also written out next to the map.
 */

interface MapData {
  viewBox: [number, number];
  provinces: Record<string, { d: string; c: [number, number] }>;
}

let cached: Promise<MapData> | null = null;
const loadMap = () => (cached ??= import("@/data/thai-address/thai-map.json").then((m) => m.default as unknown as MapData));

export function ThaiShipMap({ province, className }: { province: string | null; className?: string }) {
  const [map, setMap] = useState<MapData | null>(null);
  useEffect(() => {
    let live = true;
    loadMap().then((m) => live && setMap(m));
    return () => {
      live = false;
    };
  }, []);

  const target = province && map ? map.provinces[province] : undefined;
  if (!map) return <div aria-hidden className={cn("aspect-[335/605]", className)} />;
  const [w, h] = map.viewBox;
  return (
    <svg aria-hidden viewBox={`0 0 ${w} ${h}`} className={cn("block h-auto w-full", className)}>
      {Object.entries(map.provinces).map(([name, p]) => (
        <path
          key={name}
          d={p.d}
          className={cn(
            "motion-safe:transition-colors motion-safe:duration-500",
            name === province ? "fill-ember-soft stroke-ember" : "fill-transparent stroke-foreground-dim/60",
          )}
          strokeWidth={name === province ? 1.2 : 0.6}
          strokeLinejoin="round"
        />
      ))}
      {/* A transition only runs between two values, so the pin's first appearance (it mounts) lands in place, and every later
          pick slides it from the province before. */}
      {target && (
        <g
          style={{ transform: `translate(${target.c[0]}px, ${target.c[1]}px)` }}
          className="motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out"
        >
          <circle r={9} className="fill-none stroke-ember/40 motion-safe:animate-ping" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          <circle r={4.5} className="fill-ember stroke-surface-1" strokeWidth={1.5} />
        </g>
      )}
    </svg>
  );
}
