import type { SupabaseClient } from "@supabase/supabase-js";

export type ApplicationType = "hub_access" | "accelerator";

/** Returns true if this email already has an application of the given type. */
export async function hasExistingApplication(
  supabase: SupabaseClient,
  email: string,
  applicationType: ApplicationType,
) {
  const { data } = await supabase
    .from("unblck_applications")
    .select("id")
    .eq("email", email)
    .eq("application_type", applicationType)
    .limit(1);

  return Boolean(data?.[0]);
}
