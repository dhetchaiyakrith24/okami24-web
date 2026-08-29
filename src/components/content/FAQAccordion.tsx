"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Item {
  id: string;
  question: string;
  answer: string;
}

export function FAQAccordion({ items }: { items: Item[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col divide-y divide-surface-border-soft border-t border-surface-border-soft">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-display text-lg font-semibold text-foreground">{item.question}</span>
              <ChevronDown size={18} className={`shrink-0 text-foreground-dim transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {open && <p className="max-w-2xl pb-5 text-sm leading-relaxed text-foreground-muted">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
