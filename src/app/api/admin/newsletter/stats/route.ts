import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/admin";
import { getSubscriberCount } from "@/lib/newsletter/buttondown";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email!)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await getSubscriberCount();

    return NextResponse.json({
      count: result.count,
      ...(result.error ? { error: result.error } : {}),
    });
  } catch (error) {
    console.error("Newsletter stats API error:", error);
    return NextResponse.json(
      { count: 0, error: "Server configuration error" },
      { status: 500 },
    );
  }
}
