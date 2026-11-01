"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/**
 * Postcode first, then the place (owner queue 02/11 item 4: "ให้รหัสไปรษณีย์อยู่ต้นๆ ใส่แล้วขึ้นจังหวัดเลย"). Five digits ask
 * /api/address/postcode/<code> for the sub-districts it serves: one = filled in, several = a list to pick from (nothing is
 * guessed), none = the customer may type the place by hand. The three place values travel as the same form fields as before
 * (`subdistrict`, `district`, `province`) and the address action re-checks them against the code on the server.
 * Controlled inputs on purpose: a refused submit must not empty them (LESSONS พ45) — the starting values come back from
 * the action's answer.
 */

interface Place {
  subdistrict: string;
  district: string;
  province: string;
}

const INPUT = "rounded-md border bg-surface-2 px-3 py-2 text-base text-foreground";
const placeLabel = (p: Place) => `${p.subdistrict} · ${p.district} · ${p.province}`;
const samePlace = (a: Place, b: Place) => a.subdistrict === b.subdistrict && a.district === b.district && a.province === b.province;

export function PostcodePlaceFields({
  initial,
  postalError,
}: {
  initial: { postalCode?: string; subdistrict?: string; district?: string; province?: string };
  postalError?: string | null;
}) {
  const { dict } = useLocale();
  const t = dict.checkout;
  const [code, setCode] = useState(initial.postalCode ?? "");
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [place, setPlace] = useState<Place>({ subdistrict: initial.subdistrict ?? "", district: initial.district ?? "", province: initial.province ?? "" });
  const [loading, setLoading] = useState(false);
  const complete = /^[0-9]{5}$/.test(code);

  useEffect(() => {
    if (!complete) return;
    let live = true;
    // Loading on: a fetch is about to start for this code (an external system — the effect's job).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch(`/api/address/postcode/${code}`)
      .then((r) => (r.ok ? r.json() : { places: [] }))
      .then((j: { places: Place[] }) => {
        if (!live) return;
        setPlaces(j.places);
        // Keep a place that belongs to this code (after a refused submit); one place = fill it in; else wait for a pick.
        setPlace((cur) => (j.places.some((p) => samePlace(p, cur)) ? cur : j.places.length === 1 ? j.places[0] : j.places.length > 1 ? { subdistrict: "", district: "", province: "" } : cur));
      })
      .catch(() => live && setPlaces([]))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [code, complete]);

  const shown = complete ? places : null;
  const manual = shown !== null && shown.length === 0 && !loading;
  const pickedIndex = shown ? shown.findIndex((p) => samePlace(p, place)) : -1;

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5 text-sm text-foreground-muted" htmlFor="postalCode">
        {t.postalCodeLabel}
        <input
          id="postalCode"
          name="postalCode"
          inputMode="numeric"
          autoComplete="postal-code"
          pattern="[0-9]{5}"
          maxLength={5}
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
          aria-invalid={postalError ? true : undefined}
          aria-describedby={postalError ? "postalCode-error" : "postalCode-hint"}
          className={cn(INPUT, postalError ? "border-danger" : "border-surface-border")}
        />
        {postalError ? (
          <span id="postalCode-error" role="alert" className="text-sm text-danger">
            {postalError}
          </span>
        ) : (
          <span id="postalCode-hint" className="text-xs text-foreground-dim">
            {loading ? t.postcodeLoading : manual ? t.postcodeNotFound : t.postcodeHint}
          </span>
        )}
      </label>

      {shown && shown.length > 0 && (
        <label className="flex flex-col gap-1.5 text-sm text-foreground-muted" htmlFor="postcodePlace">
          {t.postcodePlaceLabel}
          <select
            id="postcodePlace"
            required
            value={pickedIndex >= 0 ? String(pickedIndex) : ""}
            onChange={(e) => {
              const p = shown[Number(e.target.value)];
              if (p) setPlace(p);
            }}
            className={cn(INPUT, "border-surface-border")}
          >
            {pickedIndex < 0 && (
              <option value="" disabled>
                {t.postcodePickPrompt}
              </option>
            )}
            {shown.map((p, i) => (
              <option key={placeLabel(p)} value={i}>
                {placeLabel(p)}
              </option>
            ))}
          </select>
          <input type="hidden" name="subdistrict" value={place.subdistrict} />
          <input type="hidden" name="district" value={place.district} />
          <input type="hidden" name="province" value={place.province} />
        </label>
      )}

      {/* A code the data does not list: the three fields are typed by hand (the server checks the province against the
          code's first two digits). Until the code has 5 digits nothing shows — the postcode comes first. */}
      {manual && (
        <div className="grid grid-cols-2 gap-3">
          {(["subdistrict", "district", "province"] as const).map((name) => (
            <label key={name} className={cn("flex flex-col gap-1.5 text-sm text-foreground-muted", name === "province" && "col-span-2")} htmlFor={name}>
              {name === "subdistrict" ? t.subdistrictLabel : name === "district" ? t.districtLabel : t.provinceLabel}
              <input
                id={name}
                name={name}
                required
                autoComplete={name === "district" ? "address-level2" : name === "province" ? "address-level1" : undefined}
                value={place[name]}
                onChange={(e) => setPlace((cur) => ({ ...cur, [name]: e.target.value }))}
                className={cn(INPUT, "border-surface-border")}
              />
            </label>
          ))}
        </div>
      )}
      {/* Waiting for the code: the place travels empty, so a submit now is refused as "missing" on the server. */}
      {!manual && !(shown && shown.length > 0) && (
        <>
          <input type="hidden" name="subdistrict" value={place.subdistrict} />
          <input type="hidden" name="district" value={place.district} />
          <input type="hidden" name="province" value={place.province} />
        </>
      )}
    </div>
  );
}
