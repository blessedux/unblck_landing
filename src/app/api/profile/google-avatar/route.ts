import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchGoogleUserInfo } from "@/lib/auth/google-profile";
import { upsertUserProfile } from "@/lib/auth/user-profile";
import { normalizeEmail } from "@/lib/forms/validate-email";

/**
 * Accepts a Google OAuth access token (from Privy useOAuthTokens) and writes
 * name/picture into user_profiles. Runs server-side so userinfo isn't blocked
 * by client adblockers / CORS quirks.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { accessToken?: string };
    const accessToken =
      typeof body.accessToken === "string" ? body.accessToken.trim() : "";
    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing Google access token" },
        { status: 400 },
      );
    }

    const info = await fetchGoogleUserInfo(accessToken);
    if (!info?.picture && !info?.name) {
      return NextResponse.json(
        { error: "Google did not return a profile photo" },
        { status: 422 },
      );
    }

    const profile = await upsertUserProfile({
      authUserId: user.id,
      email: normalizeEmail(user.email),
      displayName: info.name ?? null,
      avatarUrl: info.picture ?? null,
      overwriteIdentityDefaults: false,
    });

    return NextResponse.json({
      email: profile.email,
      displayName: profile.display_name,
      avatarUrl: profile.avatar_url,
    });
  } catch (error) {
    console.error("Google avatar enrich error:", error);
    return NextResponse.json(
      { error: "Could not save Google avatar" },
      { status: 500 },
    );
  }
}
