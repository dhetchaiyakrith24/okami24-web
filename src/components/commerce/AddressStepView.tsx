"use client";

import { useActionState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
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
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  pattern?: string;
  inputMode?: "text" | "tel" | "numeric";
  autoComplete?: string;
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
        className="rounded-md border border-surface-border bg-surface-2 px-3 py-2 text-base text-foreground"
      />
    </label>
  );
}

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
          />
          <Field label={dict.checkout.line1Label} name="line1" autoComplete="address-line1" defaultValue={v.line1} />
          <div className="grid grid-cols-2 gap-3">
            <Field label={dict.checkout.subdistrictLabel} name="subdistrict" defaultValue={v.subdistrict} />
            <Field label={dict.checkout.districtLabel} name="district" autoComplete="address-level2" defaultValue={v.district} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={dict.checkout.provinceLabel} name="province" autoComplete="address-level1" defaultValue={v.province} />
            <Field
              label={dict.checkout.postalCodeLabel}
              name="postalCode"
              pattern="[0-9]{5}"
              inputMode="numeric"
              autoComplete="postal-code"
              defaultValue={v.postalCode}
            />
          </div>
          {error && (
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
