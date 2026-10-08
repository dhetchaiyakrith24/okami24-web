/** What the slip-check route answers and the staff page renders (shared by server and browser). */

import type { ReceiverStatus } from "@/lib/staff/receiver-match";

export interface QuotaView {
  used: number;
  max: number | null;
  remaining: number | null;
  planName: string | null;
  expiresAt: string | null;
}

export interface PartyView {
  name: string | null;
  bank: string | null;
  account: string | null;
}

export type SlipCheckResponse =
  | {
      ok: true;
      /** "api" = EasySlip answered just now · "image-cache" = this exact file was checked before and its receiver
       *  was the shop's, answered from our log without calling EasySlip (the receiver shown is then the shop's own
       *  account; the sender's name is not kept). Any other earlier verdict asks EasySlip again — a slip it has
       *  already verified costs no quota (/en/v2/verify/bank/ "Duplicate Handling"). */
      source: "api" | "image-cache";
      slip: {
        transRef: string;
        amount: number;
        transferredAt: string;
        receiverStatus: ReceiverStatus;
        receiver: PartyView | null;
        sender: PartyView | null;
      };
      /** null = first time this transfer is seen. "log" = in our log since `firstCheckedAt` · "easyslip" = EasySlip says it was
       *  verified before (e.g. from its own dashboard), not in our log. */
      duplicate:
        | null
        | { by: "log"; firstCheckedAt: string; previousChecks: number }
        | { by: "easyslip" };
      amountCheck: null | { expected: number; matches: boolean };
      quota: QuotaView | null;
    }
  | { ok: false; error: string; retryAfterSeconds?: number };
