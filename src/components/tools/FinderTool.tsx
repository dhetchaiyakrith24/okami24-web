"use client";

import { useMemo, useState } from "react";
import type { FinderAnswers } from "@/lib/finder";
import { matchProducts, unscoredCatalogMatches } from "@/lib/finder";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PilotProductCard } from "@/components/catalog-bridge/PilotProductCard";
import { getPublishedProduct } from "@/data/shipnity-seed/storefront-bridge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * The 6 questions/options below are deliberately left in English regardless of locale — this is
 * real, substantial interactive content (24 option label/description pairs), not generic chrome,
 * and translating it accurately without an owner-reviewed glossary risks subtly mis-describing a
 * real product-fit question. The surrounding chrome (progress line, back button, results labels)
 * IS translated below — see the Phase 3.2.1 report §LANGUAGE FIX RESULT for this scope line.
 */

interface Question<K extends keyof FinderAnswers> {
  key: K;
  title: string;
  options: { value: FinderAnswers[K]; label: string; description: string }[];
}

const QUESTIONS: Question<keyof FinderAnswers>[] = [
  {
    key: "format",
    title: "What kind of device are you looking for?",
    options: [
      { value: "open-pod", label: "Open-system pod", description: "I'll fill my own e-liquid and swap coil pods." },
      { value: "pod-kit", label: "Pod kit / pod mod", description: "I want more output and a swappable resistance platform." },
      { value: "disposable", label: "Disposable", description: "Prefilled, no filling or coil-swapping." },
      { value: "no-preference", label: "Not sure yet", description: "Show me the best match regardless of format." },
    ],
  },
  {
    key: "portability",
    title: "How important is a compact size?",
    options: [
      { value: "ultra-compact", label: "As small as possible", description: "Pocketability is the top priority." },
      { value: "compact", label: "Compact is fine", description: "Doesn't need to be the smallest option." },
      { value: "no-preference", label: "Doesn't matter", description: "Size isn't a deciding factor for me." },
    ],
  },
  {
    key: "screen",
    title: "What kind of interface do you want?",
    options: [
      { value: "none", label: "No screen", description: "Just draw or press a button — nothing to look at." },
      { value: "basic", label: "A simple display", description: "Battery, wattage, and mode at a glance." },
      { value: "full", label: "Full touchscreen", description: "Complete menu and mode control." },
      { value: "no-preference", label: "No preference", description: "The screen isn't a deciding factor." },
    ],
  },
  {
    key: "battery",
    title: "How important is battery life?",
    options: [
      { value: "critical", label: "Critical", description: "I want the longest stretch between charges." },
      { value: "somewhat", label: "Somewhat important", description: "I'll charge regularly either way." },
      { value: "not-priority", label: "Not a priority", description: "I don't mind charging often." },
    ],
  },
  {
    key: "output",
    title: "What kind of draw and output do you prefer?",
    options: [
      { value: "low", label: "Tight, MTL, lower wattage", description: "Closer to a cigarette draw." },
      { value: "flexible", label: "Flexible / in-between", description: "I switch between tighter and looser draws." },
      { value: "high", label: "Airy, DTL, higher wattage", description: "I want more power and a looser draw." },
    ],
  },
  {
    key: "experience",
    title: "How would you describe your experience?",
    options: [
      { value: "beginner", label: "New to vaping", description: "I want something simple and forgiving." },
      { value: "experienced", label: "Experienced", description: "I'm comfortable with more advanced controls." },
    ],
  },
];

export function FinderTool() {
  const { dict } = useLocale();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<FinderAnswers>>({});

  const isComplete = step >= QUESTIONS.length;
  const results = useMemo(() => (isComplete ? matchProducts(answers as FinderAnswers) : null), [isComplete, answers]);
  // Real, purchasable ProductMaster devices the scored quiz structurally cannot rank — see
  // `unscoredCatalogMatches`. Shown separately and unranked rather than excluded or fake-scored.
  const unranked = useMemo(() => (isComplete ? unscoredCatalogMatches(answers as FinderAnswers) : []), [isComplete, answers]);

  function selectAnswer(key: keyof FinderAnswers, value: FinderAnswers[keyof FinderAnswers]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  if (isComplete && results) {
    return (
      <div className="flex flex-col gap-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold text-foreground">{dict.finder.topMatches}</h2>
          <Button variant="secondary" onClick={restart}>
            {dict.finder.startOver}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.matches.map((m, i) => (
            <div key={m.product.slug} className="flex flex-col gap-4">
              <div className="relative">
                {i === 0 && (
                  <span className="label-mono absolute left-3 top-3 z-10 rounded-full border border-ember/40 bg-ember-soft/60 px-2.5 py-1 text-[0.65rem] text-ember">
                    {dict.finder.bestMatch}
                  </span>
                )}
                <ProductCard product={m.product} />
              </div>
              <ul className="flex flex-col gap-1.5">
                {m.reasons.slice(0, 3).map((reason, ri) => (
                  <li key={ri} className="flex gap-2 text-xs leading-relaxed text-foreground-muted">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-steel" aria-hidden />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {results.alternatives.length > 0 && (
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">{dict.finder.alternatives}</h3>
            <p className="mt-1 max-w-xl text-sm text-foreground-muted">{dict.finder.alternativesHint}</p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {results.alternatives.map((m) => (
                <ProductCard key={m.product.slug} product={m.product} />
              ))}
            </div>
          </div>
        )}

        {unranked.length > 0 && (
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">{dict.finder.alsoInCatalogTitle}</h3>
            <p className="mt-1 max-w-xl text-sm text-foreground-muted">{dict.finder.scopeNote}</p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {unranked.map((item) => {
                const published = getPublishedProduct(item.slug);
                return published ? <PilotProductCard key={item.slug} product={published} /> : null;
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  const question = QUESTIONS[step];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <div className="flex items-center gap-2">
        {QUESTIONS.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-ember" : "bg-surface-border-soft"}`} />
        ))}
      </div>
      <div>
        <span className="label-mono text-xs text-foreground-dim">
          {dict.finder.questionProgressPrefix} {step + 1} {dict.finder.questionProgressMiddle} {QUESTIONS.length}
        </span>
        <h2 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">{question.title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            key={String(option.value)}
            onClick={() => selectAnswer(question.key, option.value)}
            className="flex flex-col gap-1.5 rounded-xl border border-surface-border bg-surface-1 p-5 text-left transition-colors hover:border-ember/50 hover:bg-surface-2"
          >
            <span className="font-display text-lg font-semibold text-foreground">{option.label}</span>
            <span className="text-sm text-foreground-muted">{option.description}</span>
          </button>
        ))}
      </div>
      {step > 0 && (
        <button onClick={() => setStep((s) => s - 1)} className="label-mono w-fit text-xs text-foreground-dim hover:text-foreground">
          {dict.finder.back}
        </button>
      )}
    </div>
  );
}
