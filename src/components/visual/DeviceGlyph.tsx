import type { Product } from "@/types/catalog";
import { cn } from "@/lib/utils";

interface DeviceGlyphProps {
  product: Pick<Product, "systemType" | "isFlagship" | "attributes">;
  className?: string;
}

/**
 * A parametric, original vector device silhouette derived from a product's
 * own catalog attributes (system type / screen type / flagship status) —
 * no manufacturer photography, no per-product asset files. Ember accent is
 * reserved for flagship products; every other device renders in steel.
 */
export function DeviceGlyph({ product, className }: DeviceGlyphProps) {
  const accent = product.isFlagship ? "var(--color-ember)" : "var(--color-steel)";
  const accentSoft = product.isFlagship ? "var(--color-ember-soft)" : "var(--color-steel-soft)";
  const hasScreen = product.attributes.screenType === "color-display" || product.attributes.screenType === "touchscreen";
  const hasLed = product.attributes.screenType === "led-indicator";

  const gradientId = `glyph-body-${accent === "var(--color-ember)" ? "ember" : "steel"}`;

  return (
    <svg
      viewBox="0 0 240 400"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Device illustration"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-surface-3)" />
          <stop offset="55%" stopColor="var(--color-surface-1)" />
          <stop offset="100%" stopColor="var(--color-surface-0)" />
        </linearGradient>
        <linearGradient id={`${gradientId}-edge`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      {product.systemType === "disposable" ? (
        <DisposableBody gradientId={gradientId} accent={accent} hasLed={hasLed} />
      ) : product.systemType === "pod-cartridge" ? (
        <CartridgeBody gradientId={gradientId} accent={accent} accentSoft={accentSoft} />
      ) : product.systemType === "coil" || product.systemType === "accessory" ? (
        <CoilBody gradientId={gradientId} accent={accent} />
      ) : (
        <PodKitBody gradientId={gradientId} accent={accent} accentSoft={accentSoft} hasScreen={hasScreen} hasLed={hasLed} />
      )}
    </svg>
  );
}

function PodKitBody({
  gradientId,
  accent,
  accentSoft,
  hasScreen,
  hasLed,
}: {
  gradientId: string;
  accent: string;
  accentSoft: string;
  hasScreen: boolean;
  hasLed: boolean;
}) {
  return (
    <g>
      {/* body */}
      <rect x="55" y="40" width="130" height="320" rx="26" fill={`url(#${gradientId})`} stroke="var(--color-surface-border)" strokeWidth="1.5" />
      {/* edge highlight */}
      <rect x="55" y="40" width="6" height="320" rx="3" fill={`url(#${gradientId}-edge)`} opacity="0.6" />
      {/* pod insert */}
      <rect x="83" y="18" width="74" height="70" rx="14" fill="var(--color-surface-2)" stroke="var(--color-surface-border)" strokeWidth="1.5" />
      <rect x="95" y="30" width="50" height="34" rx="6" fill={accentSoft} opacity="0.5" />
      {/* mouthpiece */}
      <rect x="104" y="4" width="32" height="18" rx="7" fill="var(--color-surface-3)" />

      {hasScreen && (
        <g>
          <rect x="78" y="130" width="84" height="56" rx="8" fill="var(--color-surface-0)" stroke={accent} strokeOpacity="0.5" strokeWidth="1" />
          <rect x="86" y="140" width="45" height="6" rx="3" fill={accent} opacity="0.85" />
          <rect x="86" y="152" width="30" height="5" rx="2.5" fill="var(--color-foreground-dim)" />
          <rect x="86" y="163" width="60" height="5" rx="2.5" fill="var(--color-foreground-dim)" />
        </g>
      )}

      {hasLed && <circle cx="120" cy="150" r="5" fill={accent} />}

      {/* airflow slots */}
      <rect x="66" y="320" width="18" height="4" rx="2" fill="var(--color-surface-border)" />
      <rect x="66" y="328" width="18" height="4" rx="2" fill="var(--color-surface-border)" />
      <rect x="66" y="336" width="18" height="4" rx="2" fill="var(--color-surface-border)" />

      {/* brand accent seam */}
      <rect x="55" y="240" width="130" height="3" fill={accent} opacity="0.35" />
    </g>
  );
}

function DisposableBody({ gradientId, accent, hasLed }: { gradientId: string; accent: string; hasLed: boolean }) {
  return (
    <g>
      <rect x="78" y="30" width="84" height="340" rx="30" fill={`url(#${gradientId})`} stroke="var(--color-surface-border)" strokeWidth="1.5" />
      <rect x="78" y="30" width="5" height="340" rx="2.5" fill={`url(#${gradientId}-edge)`} opacity="0.6" />
      {/* mouthpiece */}
      <ellipse cx="120" cy="26" rx="20" ry="14" fill="var(--color-surface-3)" />
      {/* label band */}
      <rect x="78" y="150" width="84" height="60" fill={accent} opacity="0.14" />
      <rect x="90" y="168" width="60" height="6" rx="3" fill={accent} opacity="0.7" />
      <rect x="90" y="182" width="40" height="5" rx="2.5" fill="var(--color-foreground-dim)" />
      {hasLed && <circle cx="120" cy="345" r="6" fill={accent} />}
      {/* base */}
      <rect x="90" y="358" width="60" height="8" rx="4" fill="var(--color-surface-3)" />
    </g>
  );
}

function CartridgeBody({ gradientId, accent, accentSoft }: { gradientId: string; accent: string; accentSoft: string }) {
  return (
    <g>
      <rect x="90" y="120" width="60" height="180" rx="16" fill={`url(#${gradientId})`} stroke="var(--color-surface-border)" strokeWidth="1.5" />
      <rect x="100" y="140" width="40" height="110" rx="8" fill={accentSoft} opacity="0.55" />
      <rect x="100" y="140" width="40" height="30" rx="6" fill={accent} opacity="0.3" />
      <ellipse cx="120" cy="112" rx="16" ry="10" fill="var(--color-surface-3)" />
      <rect x="102" y="270" width="36" height="10" rx="5" fill="var(--color-surface-2)" />
    </g>
  );
}

function CoilBody({ gradientId, accent }: { gradientId: string; accent: string }) {
  return (
    <g>
      <circle cx="120" cy="200" r="90" fill={`url(#${gradientId})`} stroke="var(--color-surface-border)" strokeWidth="1.5" />
      <circle cx="120" cy="200" r="52" fill="none" stroke={accent} strokeOpacity="0.6" strokeWidth="6" strokeDasharray="10 10" />
      <circle cx="120" cy="200" r="18" fill="var(--color-surface-2)" />
    </g>
  );
}
