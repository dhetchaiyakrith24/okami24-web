"use client";

import { useEffect, useState } from "react";

/** The team shares one password, so a form that records WHO did something asks for a name and remembers the last one typed
 *  on this phone (LINE_ORDERS_GAPS.md #14, short-term fix). One key for every such form: the LINE order form used it first. */
const NAME_KEY = "okami24-line-order-keyed-by";

export function useStaffName(): [string, (v: string) => void] {
  const [name, setName] = useState("");
  // The last name typed on this phone, after hydration (the server has no storage to render it from).
  useEffect(() => {
    let saved = "";
    try {
      saved = window.localStorage.getItem(NAME_KEY) ?? "";
    } catch {
      /* blocked storage: the name is typed again */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one read of browser storage after mount
    setName((now) => now || saved);
  }, []);
  return [name, setName];
}

export function rememberStaffName(name: string): void {
  try {
    window.localStorage.setItem(NAME_KEY, name.trim());
  } catch {
    /* a blocked storage only means the name is typed again next time */
  }
}
