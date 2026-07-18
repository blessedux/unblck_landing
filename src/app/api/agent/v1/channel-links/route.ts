import { NextResponse } from "next/server";
import { requireAgentAuth } from "@/lib/auth/agent";
import { linkChannel, unlinkChannel, type Channel } from "@/lib/channel-links";

export async function POST(request: Request) {
  try {
    const authResult = requireAgentAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = (await request.json()) as {
      channel: Channel;
      channel_user_id: string;
      code: string;
    };

    if (!body.channel || !body.channel_user_id || !body.code) {
      return NextResponse.json(
        { error: "Missing required fields: channel, channel_user_id, code" },
        { status: 400 }
      );
    }

    if (body.channel !== "telegram" && body.channel !== "whatsapp") {
      return NextResponse.json(
        { error: "Invalid channel. Must be 'telegram' or 'whatsapp'" },
        { status: 400 }
      );
    }

    const result = await linkChannel(
      body.channel,
      body.channel_user_id,
      body.code
    );

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Agent channel-links POST error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const authResult = requireAgentAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = (await request.json()) as {
      channel: Channel;
      channel_user_id: string;
    };

    if (!body.channel || !body.channel_user_id) {
      return NextResponse.json(
        { error: "Missing required fields: channel, channel_user_id" },
        { status: 400 }
      );
    }

    const result = await unlinkChannel(body.channel, body.channel_user_id);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Agent channel-links DELETE error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
