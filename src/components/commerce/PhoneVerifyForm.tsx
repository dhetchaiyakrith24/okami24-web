"use client";

import { useActionState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { otpStepAction, type OtpFormState } from "@/app/checkout/actions";
import type { Dictionary } from "@/i18n/dictionaries";

// Defined here, not in actions.ts: a "use server" file may only export async functions — a plain
// object export like this one is invalid there and resolves to something other than the object on
// the client (see actions.ts's comment on the bug this caused).
const initialOtpState: OtpFormState = { step: "phone", phone: "", errorKey: null };

function errorText(dict: Dictionary, key: string | null): string | null {
  if (!key) return null;
  return dict.checkout[key as keyof Dictionary["checkout"]] ?? null;
}

export function PhoneVerifyForm() {
  const { dict } = useLocale();
  const [state, formAction, pending] = useActionState(otpStepAction, initialOtpState);

  return (
    <>
      <PageHeader eyebrow={dict.checkout.phoneEyebrow} title={dict.checkout.phoneTitle} />
      <Container className="flex max-w-md flex-col gap-4 py-12 lg:py-16">
        {state.step === "phone" ? (
          <form action={formAction} className="flex flex-col gap-3">
            <input type="hidden" name="intent" value="request" />
            <label className="flex flex-col gap-1.5 text-sm text-foreground-muted" htmlFor="phone">
              {dict.checkout.phoneLabel}
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder={dict.checkout.phonePlaceholder}
                defaultValue={state.phone}
                required
                className="rounded-md border border-surface-border bg-surface-2 px-3 py-2 text-base text-foreground"
              />
            </label>
            {errorText(dict, state.errorKey) && <p className="text-sm text-ember">{errorText(dict, state.errorKey)}</p>}
            <Button type="submit" className="mt-2 w-full justify-center">
              {pending ? "…" : dict.checkout.sendCodeCta}
            </Button>
          </form>
        ) : (
          <>
            <form action={formAction} className="flex flex-col gap-3">
              <input type="hidden" name="intent" value="verify" />
              <input type="hidden" name="phone" value={state.phone} />
              <p className="text-sm text-foreground-muted">{state.phone}</p>
              <label className="flex flex-col gap-1.5 text-sm text-foreground-muted" htmlFor="code">
                {dict.checkout.codeLabel}
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder={dict.checkout.codePlaceholder}
                  required
                  autoFocus
                  className="rounded-md border border-surface-border bg-surface-2 px-3 py-2 text-base tracking-[0.4em] text-foreground"
                />
              </label>
              {errorText(dict, state.errorKey) && <p className="text-sm text-ember">{errorText(dict, state.errorKey)}</p>}
              <Button type="submit" className="mt-2 w-full justify-center">
                {pending ? "…" : dict.checkout.verifyCta}
              </Button>
            </form>
            <form action={formAction}>
              <input type="hidden" name="intent" value="change-number" />
              <Button type="submit" variant="ghost" className="w-full justify-center">
                {dict.checkout.resendCta}
              </Button>
            </form>
          </>
        )}
      </Container>
    </>
  );
}
