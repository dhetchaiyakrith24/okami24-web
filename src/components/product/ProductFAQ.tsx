"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQItem } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProductFAQ({ faqs }: { faqs: FAQItem[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  if (faqs.length === 0) return null;

  return (
    <section className="border-b border-surface-border-soft bg-surface-1 py-14 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="FAQ" title="Common questions about this device." />
        <div className="flex flex-col divide-y divide-surface-border-soft border-t border-surface-border-soft">
          {faqs.map((faq) => {
            const open = openId === faq.id;
            return (
              <div key={faq.id}>
                <button
                  onClick={() => setOpenId(open ? null : faq.id)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-display text-lg font-semibold text-foreground">{faq.question}</span>
                  <ChevronDown size={18} className={`shrink-0 text-foreground-dim transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {open && <p className="max-w-2xl pb-5 text-sm leading-relaxed text-foreground-muted">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
