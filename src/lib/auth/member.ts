import { createClient } from "@/lib/supabase/server";

export type MemberStatus = "pending" | "approved" | "rejected" | null;

export async function getMemberApplication(userId: string) {
  const supabase = await createClient();

  const { data: application } = await supabase
    .from("unblck_applications")
    .select("id, status, created_at")
    .eq("auth_user_id", userId)
    .single();

  return application;
}

export async function getMemberProfile(userId: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("member_profiles")
    .select("*")
    .eq("auth_user_id", userId)
    .single();

  return profile;
}
