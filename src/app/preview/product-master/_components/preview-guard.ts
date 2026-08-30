import { notFound } from "next/navigation";

/**
 * Blocks this isolated preview from ever serving in a production deployment, even if someone
 * finds the URL directly — combined with `robots: { index: false }` (not discoverable) and no
 * link from any navigation (not reachable by browsing). No new framework: just the same
 * `notFound()` the rest of the app already uses for missing records.
 */
export function assertPreviewAllowedInThisEnvironment(): void {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
}
