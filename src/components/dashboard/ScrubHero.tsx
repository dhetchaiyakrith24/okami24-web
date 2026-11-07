"use client";

import { useId, useRef, useState, type PointerEvent } from "react";

export interface ScrubPoint {
  value: number;
  /** The words the fixed readout shows for this point. */
  label: string;
  headline: string;
  sub: string;
}

const HEIGHT = 40;

/** Horizontal tangents at every point: the curve can never dip below zero or above a peak, which a real figure never did. */
function curve(values: number[]): string {
  const top = Math.max(...values, 1) * 1.12;
  const points = values.map((v, i) => [(i / Math.max(values.length - 1, 1)) * 100, HEIGHT - (v / top) * (HEIGHT - 3)]);
  return points.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x} ${y}`;
    const [px, py] = points[i - 1];
    const mid = (px + x) / 2;
    return `${d} C${mid} ${py} ${mid} ${y} ${x} ${y}`;
  }, "");
}

/**
 * One big number with its trend underneath. A finger on the chart moves the number, not a tooltip, because a finger hides
 * a tooltip. Plain numbers in, no data of its own. The list of days under it is the way in for a screen reader.
 */
export function ScrubHero({ points, note }: { points: ScrubPoint[]; note?: { text: string; good: boolean } }) {
  const last = points.length - 1;
  const [picked, setPicked] = useState(last);
  const box = useRef<HTMLDivElement>(null);
  const fade = useId();
  const shown = points[picked];
  const line = curve(points.map((p) => p.value));

  function move(e: PointerEvent<HTMLDivElement>) {
    const rect = box.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const share = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setPicked(Math.round(share * last));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1 px-1 pt-1">
        <span className="text-sm text-foreground-muted">{shown.label}</span>
        <span className="font-display text-6xl font-bold tabular-nums leading-none text-foreground">{shown.headline}</span>
        <span className="text-sm tabular-nums text-foreground-muted">{shown.sub}</span>
        {note && picked === last && <span className={`text-sm ${note.good ? "text-verified" : "text-foreground-muted"}`}>{note.text}</span>}
      </div>
      <div
        ref={box}
        role="img"
        aria-label={`กราฟยอด ${points.length} วัน`}
        className="relative h-36 cursor-crosshair touch-pan-y"
        onPointerDown={move}
        onPointerMove={move}
        onPointerLeave={() => setPicked(last)}
      >
        <svg viewBox={`0 0 100 ${HEIGHT}`} preserveAspectRatio="none" aria-hidden className="absolute inset-0 size-full">
          <defs>
            <linearGradient id={fade} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--accent-ember)" stopOpacity="0.42" />
              <stop offset="1" stopColor="var(--accent-ember)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line} L100 ${HEIGHT} L0 ${HEIGHT} Z`} fill={`url(#${fade})`} />
          <path d={line} pathLength={1} className="dash-line" fill="none" stroke="var(--accent-ember-strong)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <span aria-hidden className="absolute inset-y-0 w-px bg-white/25" style={{ left: `${(picked / Math.max(last, 1)) * 100}%` }} />
      </div>
    </div>
  );
}
