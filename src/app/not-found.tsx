import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-6 py-32 text-center">
      <span className="label-mono text-xs text-ember">404</span>
      <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Page not found</h1>
      <p className="max-w-md text-base text-foreground-muted">
        The page you're looking for doesn't exist, or the product may have been removed from the catalog.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/products">Browse the catalog</Button>
        <Button href="/" variant="secondary">
          Back home
        </Button>
      </div>
    </Container>
  );
}
