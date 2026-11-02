"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/**
 * The place part of the address form (owner 03/11: "ช่องไว้สำหรับพิมพ์ค้นหา … กล่องของแต่ละหมวดหมู่ … ถ้าลูกค้าไม่กดค้นหาก็
 * Manual เองได้"):
 *   1. a search box — type a sub-district, district, province or postcode, pick a row of /api/address/search and the boxes
 *      below fill themselves;
 *   2. the postcode, as before (owner queue 02/11 item 4): five digits ask /api/address/postcode/<code>; one place = filled
 *      in, several = a list to pick from, none = refused (check it or message the shop on LINE);
 *   3. sub-district · district · province as plain boxes the customer may type in themselves.
 * The four boxes are the form fields (`postalCode`, `subdistrict`, `district`, `province`); the server re-checks them
 * (src/lib/commerce/addresses.ts: the code must be real and serve the province; the names are stored in the data's spelling
 * when they match it). Controlled inputs on purpose: a refused submit must not empty them (LESSONS พ45) — the starting
 * values come back from the action's answer. `onPlaceChange` hears the place once its province is one the code serves
 * (null until then) — the address step's map and summary follow it (look A, owner 03/11).
 */

export interface Place {
  subdistrict: string;
  district: string;
  province: string;
}

interface Hit extends Place {
  postalCode: string;
}

const INPUT = "w-full min-w-0 rounded-md border bg-surface-2 px-3 py-2 text-base text-foreground";
const LABEL = "flex min-w-0 flex-col gap-1.5 text-sm text-foreground-muted";
export const placeLabel = (p: Place) => `${p.subdistrict} · ${p.district} · ${p.province}`;
const samePlace = (a: Place, b: Place) => a.subdistrict === b.subdistrict && a.district === b.district && a.province === b.province;
// Same loose reading of a typed name as the server (thai-postcodes.ts): "จ.เชียงใหม่" / "กทม." still find their province.
const bare = (s: string) => s.trim().replace(/\s+/g, " ").replace(/^(ตำบล|แขวง|ต\.|อำเภอ|เขต|อ\.|จังหวัด|จ\.)\s*/, "");
const sameName = (typed: string, name: string) => bare(typed) === name || (name === "กรุงเทพมหานคร" && /^(กรุงเทพ|กทม\.?)$/.test(bare(typed)));
const EMPTY: Place = { subdistrict: "", district: "", province: "" };

export function PostcodePlaceFields({
  initial,
  postalError,
  onPlaceChange,
}: {
  initial: { postalCode?: string; subdistrict?: string; district?: string; province?: string };
  postalError?: string | null;
  onPlaceChange?: (place: Place | null) => void;
}) {
  const { dict } = useLocale();
  const t = dict.checkout;
  const listId = useId();
  const [code, setCode] = useState(initial.postalCode ?? "");
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [place, setPlace] = useState<Place>({ subdistrict: initial.subdistrict ?? "", district: initial.district ?? "", province: initial.province ?? "" });
  const [loading, setLoading] = useState(false);
  // The refusal under the code goes away once the code is edited (the parent remounts this per answer).
  const [codeEdited, setCodeEdited] = useState(false);
  const codeError = codeEdited ? null : postalError;
  const complete = /^[0-9]{5}$/.test(code);

  // Search box: what is typed, the rows it found, which row the arrow keys are on, and whether the list is open.
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const [searched, setSearched] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

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
        setPlace((cur) => {
          // A place this code serves stays (after a refused submit, or one picked in the search); one place = fill it in.
          const exact = j.places.find((p) => sameName(cur.subdistrict, p.subdistrict) && sameName(cur.district, p.district) && sameName(cur.province, p.province));
          if (exact) return exact;
          if (j.places.length === 1) return j.places[0];
          if (j.places.length === 0) return cur;
          // Several: what the customer typed stays while its province is one this code serves; a province of another code is
          // cleared so the boxes never show a place the code cannot reach. The province alone is filled when it is certain.
          const provinces = [...new Set(j.places.map((p) => p.province))];
          if (cur.province && provinces.some((pr) => sameName(cur.province, pr))) return cur;
          return { ...EMPTY, province: provinces.length === 1 ? provinces[0] : "" };
        });
      })
      .catch(() => live && setPlaces([]))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [code, complete]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/address/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : { places: [] }))
        .then((j: { places: Hit[] }) => {
          setHits(j.places);
          setActive(j.places.length ? 0 : -1);
          setSearched(true);
        })
        .catch(() => {});
    }, 220);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [query]);

  // Close the list on a tap outside it.
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const shown = complete ? places : null;
  // Loading only counts for a complete code: a code cut back to 4 digits mid-fetch must not leave "looking up…" behind.
  const looking = complete && loading;
  const notFound = shown !== null && shown.length === 0 && !looking;
  const pickedIndex = shown ? shown.findIndex((p) => samePlace(p, place)) : -1;
  const listShown = open && query.trim().length >= 2 && searched;

  // The place the map and summary show: the data's own row when the boxes match one, else the boxes as typed once their
  // province is one the code serves (spelled as the data spells it). `shown` and `place` are state, so this runs when they change.
  useEffect(() => {
    if (!shown?.length) return onPlaceChange?.(null);
    const exact = shown.find((p) => samePlace(p, place));
    if (exact) return onPlaceChange?.(exact);
    const province = shown.find((p) => sameName(place.province, p.province))?.province;
    onPlaceChange?.(province ? { ...place, province } : null);
  }, [shown, place, onPlaceChange]);

  const choose = (h: Hit) => {
    setCode(h.postalCode);
    setCodeEdited(true);
    setPlace({ subdistrict: h.subdistrict, district: h.district, province: h.province });
    setQuery(`${placeLabel(h)} ${h.postalCode}`);
    setOpen(false);
  };

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div ref={boxRef} className="relative">
        <label className={LABEL} htmlFor="addressSearch">
          {t.addressSearchLabel}
          <input
            id="addressSearch"
            type="search"
            role="combobox"
            autoComplete="off"
            enterKeyHint="search"
            aria-expanded={listShown}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={listShown && active >= 0 ? `${listId}-${active}` : undefined}
            aria-describedby="addressSearch-hint"
            placeholder={t.addressSearchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              if (e.target.value.trim().length < 2) {
                setHits([]);
                setSearched(false);
              }
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              // Esc closes the list only — a search box would otherwise empty itself too (checker #1169).
              if (e.key === "Escape") {
                e.preventDefault();
                setOpen(false);
                return;
              }
              if (!listShown || hits.length === 0) return;
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => (i + (e.key === "ArrowDown" ? 1 : hits.length - 1)) % hits.length);
              } else if (e.key === "Enter" && active >= 0) {
                // Enter picks the row instead of sending the whole form half filled.
                e.preventDefault();
                choose(hits[active]);
              }
            }}
            className={cn(INPUT, "border-surface-border")}
          />
          <span id="addressSearch-hint" className="text-xs text-foreground-dim">
            {t.addressSearchHint}
          </span>
        </label>
        {listShown && (
          <ul
            id={listId}
            role="listbox"
            aria-label={t.addressSearchLabel}
            className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-md border border-surface-border bg-surface-1 py-1 shadow-lg"
          >
            {hits.length === 0 ? (
              <li className="px-3 py-2 text-sm text-foreground-muted">{t.addressSearchEmpty}</li>
            ) : (
              hits.map((h, i) => (
                <li
                  key={`${h.postalCode}-${placeLabel(h)}`}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  // pointerdown, not click: the search box keeps focus, so the list does not close before the pick lands.
                  onPointerDown={(e) => {
                    e.preventDefault();
                    choose(h);
                  }}
                  onPointerEnter={() => setActive(i)}
                  className={cn("cursor-pointer px-3 py-2 text-sm text-foreground", i === active && "bg-surface-2")}
                >
                  <span className="font-medium">{h.subdistrict}</span>
                  <span className="text-foreground-muted">
                    {" · "}
                    {h.district} · {h.province} · {h.postalCode}
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <label className={LABEL} htmlFor="postalCode">
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
          onChange={(e) => {
            setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 5));
            setCodeEdited(true);
          }}
          aria-invalid={codeError ? true : undefined}
          aria-describedby={codeError ? "postalCode-error" : "postalCode-hint"}
          className={cn(INPUT, codeError ? "border-danger" : "border-surface-border")}
        />
        {codeError ? (
          <span id="postalCode-error" role="alert" className="text-sm text-danger">
            {codeError}
          </span>
        ) : (
          /* A code not found reads as a refusal (red, polite), not a grey hint (visitor 02/11: easy to miss on a computer). */
          <span id="postalCode-hint" role={notFound ? "alert" : undefined} className={notFound ? "text-sm text-danger" : "text-xs text-foreground-dim"}>
            {looking ? t.postcodeLoading : notFound ? t.postcodeNotFound : t.postcodeHint}
          </span>
        )}
      </label>

      {shown && shown.length > 1 && (
        <label className={LABEL} htmlFor="postcodePlace">
          {t.postcodePlaceLabel}
          <select
            id="postcodePlace"
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
        </label>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className={LABEL} htmlFor="subdistrict">
          {t.subdistrictLabel}
          <input id="subdistrict" name="subdistrict" required maxLength={60} autoComplete="off" value={place.subdistrict} onChange={(e) => setPlace((p) => ({ ...p, subdistrict: e.target.value }))} className={cn(INPUT, "border-surface-border")} />
        </label>
        <label className={LABEL} htmlFor="district">
          {t.districtLabel}
          <input id="district" name="district" required maxLength={60} autoComplete="off" value={place.district} onChange={(e) => setPlace((p) => ({ ...p, district: e.target.value }))} className={cn(INPUT, "border-surface-border")} />
        </label>
        <label className={cn(LABEL, "sm:col-span-2")} htmlFor="province">
          {t.provinceLabel}
          <input id="province" name="province" required maxLength={60} autoComplete="address-level1" value={place.province} onChange={(e) => setPlace((p) => ({ ...p, province: e.target.value }))} className={cn(INPUT, "border-surface-border")} />
        </label>
      </div>
    </div>
  );
}
