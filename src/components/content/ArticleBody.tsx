import type { GuideSection } from "@/types/catalog";

export function ArticleBody({ sections }: { sections: GuideSection[] }) {
  return (
    <div className="flex flex-col gap-10">
      {sections.map((section, i) => (
        <div key={i} className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-semibold text-foreground">{section.heading}</h2>
          {section.paragraphs.map((p, pi) => (
            <p key={pi} className="text-base leading-relaxed text-foreground-muted">
              {p}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
