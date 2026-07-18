import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMemberChannelLinks, revokeChannelLink } from "@/lib/channel-links";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const links = await getMemberChannelLinks(user.id);

    return NextResponse.json({ links });
  } catch (error) {
    console.error("Member channel-links GET error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { link_id: string };

    if (!body.link_id) {
      return NextResponse.json(
        { error: "Missing required field: link_id" },
        { status: 400 }
      );
    }

    const result = await revokeChannelLink(user.id, body.link_id);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Member channel-links DELETE error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
