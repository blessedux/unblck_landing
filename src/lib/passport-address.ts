/**
 * Validates a Stellar Ed25519 public key (Passport address)
 * 
 * Rules:
 * - Must start with 'G'
 * - Must be exactly 56 characters
 * - Must contain only valid base32 characters (A-Z, 2-7)
 * - No network validation (pure format check)
 */
export function isValidPassportAddress(address: string): boolean {
  if (!address || typeof address !== "string") {
    return false;
  }

  if (!address.startsWith("G")) {
    return false;
  }

  if (address.length !== 56) {
    return false;
  }

  const base32Regex = /^[A-Z2-7]+$/;
  return base32Regex.test(address);
}

export function validatePassportAddress(
  address: string
): { valid: boolean; error?: string } {
  if (!address || typeof address !== "string") {
    return { valid: false, error: "Address is required" };
  }

  if (!address.startsWith("G")) {
    return {
      valid: false,
      error: "Stellar address must start with 'G'",
    };
  }

  if (address.length !== 56) {
    return {
      valid: false,
      error: `Stellar address must be 56 characters (got ${address.length})`,
    };
  }

  const base32Regex = /^[A-Z2-7]+$/;
  if (!base32Regex.test(address)) {
    return {
      valid: false,
      error: "Stellar address contains invalid characters",
    };
  }

  return { valid: true };
}
