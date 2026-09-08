"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({ slug, className }: { slug: string; className?: string }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        // Phones (mobile round A, M3, 2026-09-08): the visible 36px circle stays, an invisible
        // ::before ring widens the tap target to the 44px the spec requires (max-lg only).
        "z-10 flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-surface-0/70 backdrop-blur transition-colors hover:border-foreground-dim max-lg:before:absolute max-lg:before:-inset-1 max-lg:before:content-['']",
        className
      )}
    >
      <Heart size={16} aria-hidden className={active ? "fill-ember text-ember" : "text-foreground-muted"} />
    </button>
  );
}
