"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { addAddressAction, selectAddressAction } from "@/app/checkout/actions";
import type { AddressRecord } from "@/lib/commerce/addresses";

function Field({
  label,
  name,
  type = "text",
  pattern,
}: {
  label: string;
  name: string;
  type?: string;
  pattern?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-foreground-muted" htmlFor={name}>
      {label}
      <input
        id={name}
        name={name}
        type={type}
        pattern={pattern}
        required
        className="rounded-md border border-surface-border bg-surface-2 px-3 py-2 text-base text-foreground"
      />
    </label>
  );
}

export function AddressStepView({ addresses, error }: { addresses: AddressRecord[]; error?: string }) {
  const { dict } = useLocale();

  return (
    <>
      <PageHeader eyebrow={dict.checkout.addressEyebrow} title={dict.checkout.addressTitle} />
      <Container className="flex max-w-xl flex-col gap-8 py-12 lg:py-16">
        {error && <p className="text-sm text-ember">{error}</p>}

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
                <Button type="submit" variant="secondary" className="shrink-0 px-4 py-2 text-xs">
                  {dict.checkout.useThisAddressCta}
                </Button>
              </form>
            ))}
          </div>
        )}

        <form action={addAddressAction} className="flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-6">
          <span className="label-mono text-xs text-foreground-dim">{dict.checkout.addNewAddressTitle}</span>
          <Field label={dict.checkout.recipientNameLabel} name="recipientName" />
          <Field label={dict.checkout.phoneFieldLabel} name="phone" type="tel" />
          <Field label={dict.checkout.line1Label} name="line1" />
          <div className="grid grid-cols-2 gap-3">
            <Field label={dict.checkout.subdistrictLabel} name="subdistrict" />
            <Field label={dict.checkout.districtLabel} name="district" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={dict.checkout.provinceLabel} name="province" />
            <Field label={dict.checkout.postalCodeLabel} name="postalCode" pattern="[0-9]{5}" />
          </div>
          <Button type="submit" className="mt-2 w-full justify-center">
            {dict.checkout.saveAddressCta}
          </Button>
        </form>
      </Container>
    </>
  );
}
