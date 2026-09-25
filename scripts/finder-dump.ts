// Prints every Finder answer combination's result lists (matches || alternatives || unscored), one line per
// combination, so two trees (e.g. a round's base and its working tree) can be diffed line by line.
//   npx tsx scripts/finder-dump.ts [--reasons] > out.txt
// Run from the repo root of each tree; --reasons adds each match's reason keys.
import { matchProducts, unscoredCatalogMatches, type FinderAnswers } from "@/lib/finder";

const formats: FinderAnswers["format"][] = ["open-pod", "pod-kit", "disposable", "no-preference"];
const portability: FinderAnswers["portability"][] = ["ultra-compact", "compact", "no-preference"];
const screen: FinderAnswers["screen"][] = ["none", "basic", "full", "no-preference"];
const battery: FinderAnswers["battery"][] = ["critical", "somewhat", "not-priority"];
const output: FinderAnswers["output"][] = ["low", "flexible", "high"];
const experience: FinderAnswers["experience"][] = ["beginner", "experienced"];

const withReasons = process.argv.includes("--reasons");
for (const f of formats)
  for (const p of portability)
    for (const s of screen)
      for (const b of battery)
        for (const o of output)
          for (const e of experience) {
            const a: FinderAnswers = { format: f, portability: p, screen: s, battery: b, output: o, experience: e };
            const { matches, alternatives } = matchProducts(a);
            const fmt = (m: { product: { slug: string }; reasons: { key: string }[] }) =>
              withReasons ? `${m.product.slug}[${m.reasons.map((r) => r.key).join(",")}]` : m.product.slug;
            const unscored = unscoredCatalogMatches(a).map((i) => i.slug);
            console.log(`${f}|${p}|${s}|${b}|${o}|${e} :: ${matches.map(fmt).join(" ")} || ${alternatives.map(fmt).join(" ")} || ${unscored.join(" ")}`);
          }
