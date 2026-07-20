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
 * Service-role variant of getMemberProfile for server-to-server contexts that
 * have no Supabase session cookie (e.g. the Agent Hub Check-in API, which
 * authenticates with AGENT_API_KEY, not a member session).
 *
 * getMemberProfile() above uses the cookie-scoped SSR client, so RLS on
 * member_profiles evaluates auth.uid() as null and returns no rows when there
 * is no session — making every agent hub-checkin request 404 even for valid
 * members. This variant uses the admin (service-role) client, consistent with
 * the rest of the agent path (resolveChannelMember, schedule, bookings all use
 * createSupabaseAdmin).
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
