import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function validateReferralCode(code: string) {
  const normalized = code.trim().toUpperCase();

  if (!normalized) {
    return { valid: false as const, error: "Referral code is required." };
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("referral_codes")
    .select("code, expires_at, active")
    .eq("code", normalized)
    .maybeSingle();

  if (error) {
    console.error("Referral code lookup error:", error);
    return {
      valid: false as const,
      error: "Could not verify referral code. Try again.",
    };
  }

  if (!data || !data.active) {
    return {
      valid: false as const,
      error:
        "Invalid referral code. Attend a StellarBarrio event at UNBLCK STGO to get one.",
    };
  }

  if (new Date(data.expires_at) < new Date()) {
    return {
      valid: false as const,
      error:
        "This referral code has expired. Come to the next StellarBarrio event for a new code.",
    };
  }

  return { valid: true as const, code: normalized };
}
