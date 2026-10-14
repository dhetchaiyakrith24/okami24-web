 
// Recipe kept from _incoming/seo-f/b6b/rel.tsx (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
import { allProducts } from "@/data/products";
import { relatedArticlesForLegacy } from "@/lib/article-relevance";
for (const s of ["m-bar-9k", "relx-smash-go-12k", "argus-g4-mini", "caliburn-g3-pro", "vinci-s", "caliburn-g4-pro-koko", "drag-x3"]) {
  const p = allProducts.find((x) => x.slug === s);
  console.log(s.padEnd(22), p ? relatedArticlesForLegacy(p).map((a) => a.id).join(" · ") : "(not legacy)");
}
