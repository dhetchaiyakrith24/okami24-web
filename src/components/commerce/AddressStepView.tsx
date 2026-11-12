"use client";

import { useActionState, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { PostcodePlaceFields, type Place } from "@/components/commerce/PostcodePlaceFields";
import { CheckoutSteps } from "@/components/commerce/CheckoutSteps";
import { NotMeButton } from "@/components/commerce/NotMeButton";
import { AddressSummaryCard, CartFold, PlaceWithMap } from "@/components/commerce/AddressOrderSummary";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { addAddressAction, deleteAddressAction, selectAddressAction, type AddressFormState } from "@/app/checkout/actions";
import type { AddressRecord } from "@/lib/commerce/addresses";
import type { CartView as CartViewData } from "@/lib/commerce/cart";

// Kept here, not in actions.ts: a "use server" file may only export async functions (see checkout/actions.ts).
const initialAddressState: AddressFormState = { errorKey: null, values: {} };
/** The phone box's length cap (T2-21: it took 20 characters). */
const PHONE_MAX = 12;

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  pattern,
  inputMode,
  autoComplete,
  maxLength,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  pattern?: string;
  inputMode?: "text" | "tel" | "numeric";
  autoComplete?: string;
  maxLength?: number;
  /** The refusal that belongs to this field (owner 02/11): shown right under it, and the field is marked for screen readers.
   *  It goes away once the customer edits the field (checker 02/11: a fixed field stayed red until the next save). */
  error?: string | null;
}) {
  const [edited, setEdited] = useState(false);
  const shown = edited ? null : error;
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
        maxLength={maxLength}
        defaultValue={defaultValue}
        required
        onChange={() => setEdited(true)}
        aria-invalid={shown ? true : undefined}
        aria-describedby={shown ? `${name}-error` : undefined}
        className={cn("rounded-md border bg-surface-2 px-3 py-2 text-base text-foreground", shown ? "border-danger" : "border-surface-border")}
      />
      {shown && (
        <span id={`${name}-error`} role="alert" className="text-sm text-danger">
          {shown}
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
 *
 * Look A (owner picked 03/11, "keep every function, re-layout + map"): the step bar on top; on computers the form takes
 * 7/12 and a sticky card the other 5/12 (map with the pin on the picked province + the cart's amounts); on phones the
 * cart folds into one line above the form and a small map sits beside the picked place. Forms, fields, actions and what is
 * sent are the same as before.
 */
export function AddressStepView({
  addresses,
  addressMissing,
  defaultPhone,
  cart,
}: {
  addresses: AddressRecord[];
  addressMissing: boolean;
  defaultPhone: string;
  cart: CartViewData;
}) {
  const { dict } = useLocale();
  const [state, formAction, pending] = useActionState(addAddressAction, initialAddressState);
  const [place, setPlace] = useState<Place | null>(null);
  // Edit / delete a saved address (owner 03/11): "แก้ไข" loads it into the form below (same fields, same checks), "ลบ" asks once.
  const [editing, setEditing] = useState<AddressRecord | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const editId = editing?.id ?? 0;
  // A refusal's values belong to the form that was sent (new or the one being edited); switching form starts from its own.
  const refusedHere = (state.editId ?? 0) === editId && state.attempt !== undefined;
  const v: AddressFormState["values"] = refusedHere ? state.values : editing ?? {};
  const shownState = refusedHere ? state : initialAddressState;
  const error = shownState.errorKey ? dict.checkout[shownState.errorKey] : addressMissing ? dict.checkout.placeErrorAddress : null;
  const startEdit = (a: AddressRecord) => {
    setEditing(a);
    setConfirmDelete(null);
    requestAnimationFrame(() => document.getElementById("address-form")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const errorField = shownState.errorKey ? ERROR_FIELD[shownState.errorKey] : undefined;
  const formKey = `${editId}-${shownState.attempt ?? 0}`;
  const fieldError = (name: string) => (errorField === name ? error : null);

  return (
    <>
      <PageHeader eyebrow={dict.checkout.addressEyebrow} title={dict.checkout.addressTitle} />
      <Container className="flex max-w-xl flex-col gap-6 py-12 lg:max-w-6xl lg:py-16">
        <CheckoutSteps current={2} />
        {/* grid-cols-1 + min-w-0: a grid track otherwise grows to the widest child, and a long sub-district name in the
            select pushed the whole form past a 390 screen (checker 03/11). */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="flex min-w-0 flex-col gap-8 lg:col-span-7">
            <CartFold cart={cart} className="lg:hidden" />

            {addresses.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="label-mono text-xs text-foreground-dim">{dict.checkout.savedAddressesTitle}</span>
                {addresses.map((a) => (
                  <div
                    key={a.id}
                    className={cn(
                      "flex flex-col gap-3 rounded-xl border bg-surface-1 p-4",
                      editId === a.id ? "border-ember" : "border-surface-border-soft"
                    )}
                  >
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 text-sm text-foreground">
                        <p className="font-medium">
                          {a.recipientName} · {a.phone}
                        </p>
                        <p className="text-foreground-muted">
                          {a.line1}, {a.subdistrict}, {a.district}, {a.province} {a.postalCode}
                        </p>
                      </div>
                      <form action={selectAddressAction} className="shrink-0">
                        <input type="hidden" name="addressId" value={a.id} />
                        <Button type="submit" variant="secondary" className="px-4 py-2 text-sm">
                          {dict.checkout.useThisAddressCta}
                        </Button>
                      </form>
                    </div>
                    {confirmDelete === a.id ? (
                      <form action={deleteAddressAction} className="flex flex-wrap items-center gap-3 border-t border-surface-border-soft pt-3 text-sm">
                        <input type="hidden" name="addressId" value={a.id} />
                        <span className="text-foreground">{dict.checkout.deleteAddressConfirm}</span>
                        <span className="flex gap-2">
                          <Button type="submit" variant="secondary" className="px-3 py-1.5 text-sm text-danger">
                            {dict.checkout.deleteAddressYes}
                          </Button>
                          <Button type="button" variant="ghost" className="px-3 py-1.5 text-sm" onClick={() => setConfirmDelete(null)}>
                            {dict.checkout.cancelEditCta}
                          </Button>
                        </span>
                      </form>
                    ) : (
                      <div className="flex gap-4 border-t border-surface-border-soft pt-3 text-sm">
                        <button type="button" className="min-h-10 px-1 py-2 text-foreground-muted underline-offset-4 hover:text-foreground hover:underline" onClick={() => startEdit(a)}>
                          {dict.checkout.editAddressCta}
                        </button>
                        <button type="button" className="min-h-10 px-1 py-2 text-foreground-muted underline-offset-4 hover:text-danger hover:underline" onClick={() => setConfirmDelete(a.id)}>
                          {dict.checkout.deleteAddressCta}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {/* The saved list is the remembered buyer's (T2-06): someone else on this phone starts over with their number. */}
                <NotMeButton className="-mt-1" />
              </div>
            )}

            {/* key = which address + attempt: picking "แก้ไข" or getting an answer from the action remounts the fields, so they
                start from that address / show the new refusal even on an edited field. */}
            <form
              id="address-form"
              key={formKey}
              action={formAction}
              className={cn("flex scroll-mt-24 flex-col gap-3 rounded-xl border bg-surface-1 p-6", editing ? "border-ember" : "border-surface-border-soft")}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="label-mono text-xs text-foreground-dim">{editing ? dict.checkout.editAddressTitle : dict.checkout.addNewAddressTitle}</span>
                {editing && (
                  <button type="button" className="py-1 text-sm text-foreground-muted underline-offset-4 hover:text-foreground hover:underline" onClick={() => setEditing(null)}>
                    {dict.checkout.cancelEditCta}
                  </button>
                )}
              </div>
              {editing && <input type="hidden" name="editId" value={editing.id} />}
              <Field label={dict.checkout.recipientNameLabel} name="recipientName" autoComplete="name" defaultValue={v.recipientName} />
              <Field
                key={`phone-${formKey}`}
                label={dict.checkout.phoneFieldLabel}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                // T2-21: 10 digits + two dashes at most ("081-234-5678"); the server checks the digits (addresses.ts).
                maxLength={PHONE_MAX}
                defaultValue={v.phone ?? defaultPhone}
                error={fieldError("phone")}
              />
              {/* React resets the form after every submit; for these controlled fields that left the list showing its first
                  sub-district while the form still held the picked one (found 02/11). Each answer of the action carries a new
                  `attempt`, so they remount from it and what is shown is what is sent. */}
              <PostcodePlaceFields
                key={formKey}
                initial={{ postalCode: v.postalCode, subdistrict: v.subdistrict, district: v.district, province: v.province }}
                postalError={fieldError("postalCode")}
                onPlaceChange={setPlace}
              />
              {place && (
                <div className="lg:hidden">
                  <PlaceWithMap place={place} />
                </div>
              )}
              <Field key={`line1-${formKey}`} label={dict.checkout.line1Label} name="line1" autoComplete="address-line1" defaultValue={v.line1} error={fieldError("line1")} />
              {error && !errorField && (
                <p role="alert" className="text-sm text-danger">
                  {error}
                </p>
              )}
              <Button type="submit" disabled={pending} className="mt-2 w-full justify-center">
                {dict.checkout.saveAddressCta}
              </Button>
            </form>
          </div>

          {/* Stretched to the row so the card inside can stay sticky while the form scrolls past. */}
          <div className="hidden min-w-0 lg:col-span-5 lg:block lg:self-stretch">
            <AddressSummaryCard cart={cart} place={place} />
          </div>
        </div>
      </Container>
    </>
  );
}
