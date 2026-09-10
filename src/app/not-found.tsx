import { NotFoundContent } from "@/components/layout/NotFoundContent";

// Round 30.3ข: the text lives in NotFoundContent (a client component, so it follows the visitor's
// language like every other page); this file stays the App Router's not-found boundary.
export default function NotFound() {
  return <NotFoundContent />;
}
