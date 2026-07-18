import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateLinkCode } from "@/lib/channel-links";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const code = await generateLinkCode(user.id);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    return NextResponse.json({
      code,
      expires_at: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Member channel-links code POST error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
