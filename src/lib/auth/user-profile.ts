import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { normalizeEmail } from "@/lib/forms/validate-email";

export type UserProfile = {
  auth_user_id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  privy_did: string | null;
  created_at: string;
  updated_at: string;
};

export type UpsertUserProfileInput = {
  authUserId: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  privyDid?: string | null;
  /** When false, leave existing non-null display_name / avatar_url alone. Default true for login defaults. */
  overwriteIdentityDefaults?: boolean;
};

function fallbackDisplayName(email: string, displayName?: string | null): string {
  const trimmed = displayName?.trim();
  if (trimmed) return trimmed;
  const local = email.split("@")[0]?.trim();
  return local || "User";
}

/** Service-role upsert used at sign-in so every auth user has a trackable row. */
export async function upsertUserProfile(
  input: UpsertUserProfileInput,
): Promise<UserProfile> {
  const supabase = createSupabaseAdmin();
  const email = normalizeEmail(input.email);
  const overwrite = input.overwriteIdentityDefaults !== false;

  const { data: existing } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("auth_user_id", input.authUserId)
    .maybeSingle();

  const displayName = overwrite
    ? fallbackDisplayName(email, input.displayName)
    : existing?.display_name ||
      fallbackDisplayName(email, input.displayName);

  const avatarUrl = overwrite
    ? (input.avatarUrl?.trim() || existing?.avatar_url || null)
    : existing?.avatar_url || input.avatarUrl?.trim() || null;

  // Prefer keeping a user-edited name: only overwrite when empty or when
  // explicitly refreshing defaults from Gmail on first login.
  const nextDisplayName =
    !overwrite && existing?.display_name?.trim()
      ? existing.display_name
      : displayName;

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      {
        auth_user_id: input.authUserId,
        email,
        display_name: nextDisplayName,
        avatar_url: avatarUrl,
        privy_did: input.privyDid ?? existing?.privy_did ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "auth_user_id" },
    )
    .select("*")
    .single();

  if (error || !data) {
    throw error ?? new Error("Could not upsert user profile");
  }

  return data as UserProfile;
}

export async function getUserProfileAdmin(
  authUserId: string,
): Promise<UserProfile | null> {
  const supabase = createSupabaseAdmin();
  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();
  return (data as UserProfile | null) ?? null;
}
