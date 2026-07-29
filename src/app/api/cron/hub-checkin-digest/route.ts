import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { runHubCheckinDigestJob } from "@/lib/email/hub-checkin-digest-job";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const result = await runHubCheckinDigestJob(request, {
      supabase: createSupabaseAdmin(),
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      ok: true,
      hubDate: result.hubDate,
      outcome: result.outcome,
      memberCount: result.memberCount,
    });
  } catch (error) {
    console.error("Hub Check-in digest cron error:", error);
    return NextResponse.json(
      { error: "Hub Check-in digest failed" },
      { status: 500 },
    );
  }
}
