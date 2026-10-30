import { Container } from "@/components/ui/Container";

/**
 * Shown the instant a staff link is pressed (owner 30/10: "กดปุ่มแล้วหน่วง ๆ"). Every /staff page is rendered on request
 * (`force-dynamic`), so without this the screen stayed on the old page until the new one was ready. Plain grey bars, no
 * text: it covers the staff pages only and carries nothing a visitor reads.
 */
export default function StaffLoading() {
  return (
    <Container className="flex max-w-2xl flex-col gap-4 pb-8 pt-6" aria-busy="true">
      <span className="sr-only">กำลังโหลด</span>
      <div className="h-11 w-40 animate-pulse rounded-full bg-surface-2" />
      <div className="h-8 w-28 animate-pulse rounded bg-surface-2" />
      <div className="h-24 animate-pulse rounded-xl bg-surface-2" />
      <div className="h-24 animate-pulse rounded-xl bg-surface-2" />
      <div className="h-24 animate-pulse rounded-xl bg-surface-2" />
    </Container>
  );
}
