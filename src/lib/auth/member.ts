import { createClient } from "@/lib/supabase/server";

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
