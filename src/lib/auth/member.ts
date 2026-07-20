import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export type MemberStatus = "pending" | "approved" | "rejected" | null;

export async function getMemberApplication(userId: string) {
  const supabase = await createClient();

  // Member area is hub-centric — prefer hub_access when both exist.
  const { data: hubApp } = await supabase
    .from("unblck_applications")
    .select("id, status, created_at, application_type")
    .eq("auth_user_id", userId)
    .eq("application_type", "hub_access")
    .maybeSingle();

  if (hubApp) return hubApp;

  const { data: apps } = await supabase
    .from("unblck_applications")
    .select("id, status, created_at, application_type")
    .eq("auth_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  return apps?.[0] ?? null;
}

export async function getMemberProfile(userId: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("member_profiles")
    .select("*")
    .eq("auth_user_id", userId)
    .maybeSingle();

  return profile;
}

/**
 * Service-role variant for server-to-server contexts with no Supabase session
 * (e.g. Agent Hub Check-in API via AGENT_API_KEY). Cookie-scoped
 * getMemberProfile() sees auth.uid() as null under RLS and returns no row.
 */
export async function getMemberProfileAdmin(userId: string) {
  const supabase = createSupabaseAdmin();

  const { data: profile } = await supabase
    .from("member_profiles")
    .select("*")
    .eq("auth_user_id", userId)
    .maybeSingle();

  return profile;
}
