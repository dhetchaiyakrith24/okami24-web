-- Architecture review hardening (2026-09-02) — OTP auth review, §5 of the challenge. The original
-- code_hash was a bare sha256(code) with no per-row salt: fine against online brute force (already
-- mitigated by rate-limiting + 5-minute expiry + a 5-attempt cap), but weaker than necessary
-- against an attacker who somehow reads the otp_challenges table directly, since sha256 of a
-- 6-digit code is a small (1,000,000-entry) precomputable space. Adding a random per-challenge
-- salt makes precomputation useless without changing the online-brute-force threat model at all
-- (which was already the real defense) — see src/lib/commerce/auth.ts.
ALTER TABLE otp_challenges ADD COLUMN salt TEXT NOT NULL DEFAULT '';
