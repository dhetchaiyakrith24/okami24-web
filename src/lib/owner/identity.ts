/**
 * Is this Google sign-in the shop's owner? Pure, so the contract test runs it under plain tsx. Google's own "verified" flag is
 * required: an address nobody proved they own is not the owner, even if it reads the same.
 */
export interface OwnerClaims {
  email: string | null;
  emailVerified: boolean;
}

const normal = (email: string) => email.trim().toLowerCase();

export function isOwnerIdentity(claims: OwnerClaims, ownerEmail: string | null): boolean {
  if (!ownerEmail || !claims.email || !claims.emailVerified) return false;
  return normal(claims.email) === normal(ownerEmail);
}
