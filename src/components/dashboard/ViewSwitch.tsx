"use client";

import { useState, type ReactNode } from "react";
import "./dashboard.css";

export interface DashView {
  id: string;
  label: string;
  content: ReactNode;
}

/**
 * Phones: one view at a time behind a sticky pill switch, flipped at once because every view is already on the page. The
 * address keeps the choice (`?view=`) so a reload stays put. Wide screens: all views side by side, no switch. Swiping is left
 * out on purpose: it would fight the chart under the finger. Takes no data of its own, so the customer pages can use it too.
 */
export function ViewSwitch({ views, initial, label }: { views: DashView[]; initial: string; label: string }) {
  const [active, setActive] = useState(views.some((v) => v.id === initial) ? initial : views[0].id);

  function pick(id: string) {
    setActive(id);
    const url = new URL(window.location.href);
    if (id === views[0].id) url.searchParams.delete("view");
    else url.searchParams.set("view", id);
    window.history.replaceState(window.history.state, "", url);
  }

  return (
    <>
      <div role="group" aria-label={label} className="dash-switch">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={active === v.id}
            onClick={() => pick(v.id)}
            className={`min-h-11 rounded-full text-sm font-semibold transition-colors ${active === v.id ? "bg-ember text-surface-1" : "text-foreground-muted hover:text-foreground"}`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3.5 lg:grid lg:grid-cols-[1.25fr_1fr_0.85fr] lg:items-start lg:gap-5">
        {views.map((v) => (
          <section key={v.id} aria-label={v.label} className={`dash-panel flex flex-col gap-3.5 ${active === v.id ? "" : "max-lg:hidden"}`}>
            {v.content}
          </section>
        ))}
      </div>
    </>
  );
}
