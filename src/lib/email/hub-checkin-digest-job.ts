import type { SupabaseClient } from "@supabase/supabase-js";
import { formatHubDate } from "@/lib/dates";
import { getSiteUrl } from "@/lib/site-url";
import {
  sendHubCheckinDigest,
  type HubCheckinDigestMember,
} from "@/lib/email/send-hub-checkin-digest";

export type HubCheckinDigestJobDeps = {
  supabase: SupabaseClient;
  now?: Date;
  siteUrl?: string;
  sendDigest?: typeof sendHubCheckinDigest;
};

export type HubCheckinDigestJobResult =
  | { ok: false; status: 401; error: "unauthorized" }
  | {
      ok: true;
      status: 200;
      hubDate: string;
      outcome: "already_sent" | "empty" | "sent" | "no_recipients";
      memberCount: number;
    };

type BookingRow = {
  member_profiles:
    | {
        email: string | null;
        unblck_applications:
          | { full_name: string | null }
          | { full_name: string | null }[]
          | null;
      }
    | {
        email: string | null;
        unblck_applications:
          | { full_name: string | null }
          | { full_name: string | null }[]
          | null;
      }[]
    | null;
};

function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function isAuthorizedCronRequest(
  request: Request,
  cronSecret = process.env.CRON_SECRET,
): boolean {
  const expected = cronSecret?.trim();
  if (!expected) return false;
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;
  return header.slice("Bearer ".length) === expected;
}

export async function claimHubCheckinDigest(
  supabase: SupabaseClient,
  hubDate: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("hub_checkin_digest_sent")
    .insert({ hub_date: hubDate });

  if (!error) return true;
  if (error.code === "23505") return false;
  throw new Error(`Failed to claim digest marker: ${error.message}`);
}

export async function releaseHubCheckinDigestClaim(
  supabase: SupabaseClient,
  hubDate: string,
): Promise<void> {
  const { error } = await supabase
    .from("hub_checkin_digest_sent")
    .delete()
    .eq("hub_date", hubDate);
  if (error) {
    console.error("Failed to release digest claim:", error);
  }
}

export async function listHubCheckinsForDate(
  supabase: SupabaseClient,
  hubDate: string,
): Promise<HubCheckinDigestMember[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      member_profiles!inner (
        email,
        unblck_applications (
          full_name
        )
      )
    `,
    )
    .eq("booking_date", hubDate)
    .order("booking_date", { ascending: true });

  if (error) {
    throw new Error(`Failed to list Hub Check-ins: ${error.message}`);
  }

  const members: HubCheckinDigestMember[] = [];
  for (const row of (data ?? []) as BookingRow[]) {
    const profile = unwrapOne(row.member_profiles);
    if (!profile?.email) continue;
    const application = unwrapOne(profile.unblck_applications);
    members.push({
      email: profile.email,
      fullName: application?.full_name?.trim() || profile.email.split("@")[0],
    });
  }

  members.sort((a, b) => a.fullName.localeCompare(b.fullName));
  return members;
}

export async function runHubCheckinDigestJob(
  request: Request,
  deps: HubCheckinDigestJobDeps,
): Promise<HubCheckinDigestJobResult> {
  if (!isAuthorizedCronRequest(request)) {
    return { ok: false, status: 401, error: "unauthorized" };
  }

  const now = deps.now ?? new Date();
  const hubDate = formatHubDate(now);
  const siteUrl = deps.siteUrl ?? getSiteUrl(request);
  const sendDigest = deps.sendDigest ?? sendHubCheckinDigest;

  const claimed = await claimHubCheckinDigest(deps.supabase, hubDate);
  if (!claimed) {
    return {
      ok: true,
      status: 200,
      hubDate,
      outcome: "already_sent",
      memberCount: 0,
    };
  }

  try {
    const members = await listHubCheckinsForDate(deps.supabase, hubDate);
    if (members.length === 0) {
      return {
        ok: true,
        status: 200,
        hubDate,
        outcome: "empty",
        memberCount: 0,
      };
    }

    const result = await sendDigest({ hubDate, members, siteUrl });
    if (!result.sent) {
      return {
        ok: true,
        status: 200,
        hubDate,
        outcome: result.reason === "empty" ? "empty" : "no_recipients",
        memberCount: members.length,
      };
    }

    return {
      ok: true,
      status: 200,
      hubDate,
      outcome: "sent",
      memberCount: members.length,
    };
  } catch (error) {
    await releaseHubCheckinDigestClaim(deps.supabase, hubDate);
    throw error;
  }
}
