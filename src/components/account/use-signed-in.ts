"use client";

import { useEffect, useState } from "react";

/**
 * Is this browser signed in as a member? Pages are prerendered and the layout never reads cookies, so the answer comes
 * after load from /api/account/status — asked ONCE per page view however many parts want it (the header, the catalog's
 * "สินค้าพร้อมส่ง" button). Until it answers, or if it fails: not signed in.
 */
let asked: Promise<boolean> | null = null;

function ask(): Promise<boolean> {
  asked ??= fetch("/api/account/status", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d: { signedIn?: boolean } | null) => d?.signedIn === true)
    .catch(() => false);
  return asked;
}

export function useSignedIn(): boolean {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    let alive = true;
    void ask().then((v) => {
      if (alive && v) setSignedIn(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  return signedIn;
}
