import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-ember text-[#181008] hover:bg-ember-strong",
  secondary: "border border-surface-border text-foreground hover:border-foreground-dim hover:bg-surface-2",
  ghost: "text-foreground-muted hover:text-foreground",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-ember";

export function Button({
  children,
  variant = "primary",
  href,
  external = false,
  className,
  onClick,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  /** Off-site link (LINE, YouTube): opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  /** Buttons only (ignored with `href`): e.g. a submit while its form is pending, so a double tap cannot post twice. */
  disabled?: boolean;
}) {
  const classes = cn(baseClasses, variantClasses[variant], className);
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled || undefined} className={classes}>
      {children}
    </button>
  );
}
