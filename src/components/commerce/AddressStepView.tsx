"use client";

import { useActionState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { PostcodePlaceFields } from "@/components/commerce/PostcodePlaceFields";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { addAddressAction, selectAddressAction, type AddressFormState } from "@/app/checkout/actions";
import type { AddressRecord } from "@/lib/commerce/addresses";

// Kept here, not in actions.ts: a "use server" file may only export async functions (see checkout/actions.ts).
const initialAddressState: AddressFormState = { errorKey: null, values: {} };

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  pattern,
  inputMode,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  pattern?: string;
  inputMode?: "text" | "tel" | "numeric";
  autoComplete?: string;
  /** The refusal that belongs to this field (owner 02/11): shown right under it, and the field is marked for screen readers. */
  error?: string | null;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-foreground-muted" htmlFor={name}>
      {label}
      <input
        id={name}
        name={name}
        type={type}
        pattern={pattern}
        inputMode={inputMode}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn("rounded-md border bg-surface-2 px-3 py-2 text-base text-foreground", error ? "border-danger" : "border-surface-border")}
      />
      {error && (
        <span id={`${name}-error`} role="alert" className="text-sm text-danger">
          {error}
        </span>
      )}
    </label>
  );
}

/** Which field each refusal belongs to; "missing" stays the line above the button (any field can be the empty one). */
const ERROR_FIELD: Partial<Record<NonNullable<AddressFormState["errorKey"]>, string>> = {
  addressErrorPhone: "phone",
  addressErrorHouseNumber: "line1",
  addressErrorPostal: "postalCode",
};

/**
 * Address step. Cart-ready round 24/10: a refused address comes back as a Thai line (was an English sentence in the URL)
 * and keeps everything the customer typed — the fields read their values back from the action's answer, so React's reset
 * after the action restores them instead of emptying the form (LESSONS พ45). The contact number starts as the phone used
 * at checkout (most customers receive their own parcel); browsers can fill the rest (autocomplete hints).
 */
export function AddressStepView({
  addresses,
  addressMissing,
  defaultPhone,
}: {
  addresses: AddressRecord[];
  addressMissing: boolean;
  defaultPhone: string;
}) {
  const { dict } = useLocale();
  const [state, formAction, pending] = useActionState(addAddressAction, initialAddressState);
  const v = state.values;
  const error = state.errorKey ? dict.checkout[state.errorKey] : addressMissing ? dict.checkout.placeErrorAddress : null;
  const errorField = state.errorKey ? ERROR_FIELD[state.errorKey] : undefined;
  const fieldError = (name: string) => (errorField === name ? error : null);

  return (
    <>
      <PageHeader eyebrow={dict.checkout.addressEyebrow} title={dict.checkout.addressTitle} />
      <Container className="flex max-w-xl flex-col gap-8 py-12 lg:py-16">
        {addresses.length > 0 && (
          <div className="flex flex-col gap-3">
            <span className="label-mono text-xs text-foreground-dim">{dict.checkout.savedAddressesTitle}</span>
            {addresses.map((a) => (
              <form
                key={a.id}
                action={selectAddressAction}
                className="flex flex-col items-start gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <input type="hidden" name="addressId" value={a.id} />
                <div className="text-sm text-foreground">
                  <p className="font-medium">
                    {a.recipientName} · {a.phone}
                  </p>
                  <p className="text-foreground-muted">
                    {a.line1}, {a.subdistrict}, {a.district}, {a.province} {a.postalCode}
                  </p>
                </div>
                <Button type="submit" variant="secondary" className="shrink-0 px-4 py-2 text-sm">
                  {dict.checkout.useThisAddressCta}
                </Button>
              </form>
            ))}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-6">
          <span className="label-mono text-xs text-foreground-dim">{dict.checkout.addNewAddressTitle}</span>
          <Field label={dict.checkout.recipientNameLabel} name="recipientName" autoComplete="name" defaultValue={v.recipientName} />
          <Field
            label={dict.checkout.phoneFieldLabel}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            defaultValue={v.phone ?? defaultPhone}
            error={fieldError("phone")}
          />
          <PostcodePlaceFields
            initial={{ postalCode: v.postalCode, subdistrict: v.subdistrict, district: v.district, province: v.province }}
            postalError={fieldError("postalCode")}
          />
          <Field label={dict.checkout.line1Label} name="line1" autoComplete="address-line1" defaultValue={v.line1} error={fieldError("line1")} />
          {error && !errorField && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pending} className="mt-2 w-full justify-center">
            {dict.checkout.saveAddressCta}
          </Button>
        </form>
      </Container>
    </>
  );
}
