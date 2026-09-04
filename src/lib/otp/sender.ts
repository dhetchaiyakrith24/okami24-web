import "server-only";

/**
 * OTP delivery boundary. docs/BUSINESS_SOURCE_OF_TRUTH.md §19 lists "final authentication
 * implementation" as an explicit unknown, and no SMS provider/credentials exist anywhere in this
 * repo or its env — so, exactly like src/lib/shipnity/adapter.ts, this is an interface with one
 * honest stub implementation, not a pretend integration. Swap `otpSender` below for a real
 * provider (Thai SMS gateway, LINE Notify, etc.) once the owner picks one — nothing else in the
 * OTP flow (src/lib/commerce/auth.ts) needs to change.
 */
export interface OtpSender {
  send(phone: string, code: string): Promise<void>;
}

/**
 * DEV/FOUNDATION STUB — logs to the server console only. Never returns the code to the client,
 * even in development, so no caller can develop a habit that would leak a real code in
 * production. To test the OTP flow locally, read the code from the terminal running `next dev`.
 */
class ConsoleOtpSender implements OtpSender {
  async send(phone: string, code: string): Promise<void> {
    console.log(`[otp:stub] would SMS ${phone}: your OKami24 code is ${code} (no real SMS provider configured yet)`);
  }
}

export const otpSender: OtpSender = new ConsoleOtpSender();
