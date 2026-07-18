import { NextResponse } from "next/server";
import { requireAgentAuth } from "@/lib/auth/agent";
import {
  resolveChannelMember,
  type Channel,
} from "@/lib/channel-links";
import { cancelHubCheckIn } from "@/lib/hub-checkins";

function extractChannelIdentity(request: Request): {
  channel: Channel;
  channelUserId: string;
} | NextResponse {
  const channel = request.headers.get("X-Channel");
  const channelUserId = request.headers.get("X-Channel-User-Id");

  if (!channel || !channelUserId) {
    return NextResponse.json(
      {
        error: "Missing required headers: X-Channel, X-Channel-User-Id",
        code: "missing_identity",
      },
      { status: 400 }
    );
  }

  if (channel !== "telegram" && channel !== "whatsapp") {
    return NextResponse.json(
      { error: "Invalid channel. Must be 'telegram' or 'whatsapp'" },
      { status: 400 }
    );
  }

  return { channel: channel as Channel, channelUserId };
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params;

    const authResult = requireAgentAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const identityResult = extractChannelIdentity(request);
    if (identityResult instanceof NextResponse) {
      return identityResult;
    }

    const { channel, channelUserId } = identityResult;

    const memberId = await resolveChannelMember(channel, channelUserId);

    if (!memberId) {
      return NextResponse.json(
        {
          error: "Channel identity not linked to any member account",
          code: "link_required",
        },
        { status: 403 }
      );
    }

    const result = await cancelHubCheckIn(memberId, date);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Agent hub-checkins DELETE error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
