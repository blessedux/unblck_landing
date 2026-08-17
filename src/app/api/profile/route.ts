import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { upsertUserProfile } from "@/lib/auth/user-profile";
import { normalizeEmail } from "@/lib/forms/validate-email";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("auth_user_id, email, display_name, avatar_url, privy_did")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (profile) {
      return NextResponse.json({
        email: profile.email,
        displayName: profile.display_name,
        avatarUrl: profile.avatar_url,
      });
    }

    // Backfill if the user signed in before user_profiles existed.
    const created = await upsertUserProfile({
      authUserId: user.id,
      email: normalizeEmail(user.email),
      overwriteIdentityDefaults: true,
    });

    return NextResponse.json({
      email: created.email,
      displayName: created.display_name,
      avatarUrl: created.avatar_url,
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Could not load profile" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      displayName?: string;
      avatarUrl?: string | null;
    };

    const displayName =
      typeof body.displayName === "string" ? body.displayName.trim() : undefined;
    const avatarUrl =
      body.avatarUrl === null
        ? null
        : typeof body.avatarUrl === "string"
          ? body.avatarUrl.trim()
          : undefined;

    if (displayName !== undefined && displayName.length < 1) {
      return NextResponse.json(
        { error: "Display name is required." },
        { status: 400 },
      );
    }

    if (displayName !== undefined && displayName.length > 80) {
      return NextResponse.json(
        { error: "Display name is too long." },
        { status: 400 },
      );
    }

    if (
      avatarUrl !== undefined &&
      avatarUrl !== null &&
      !/^https:\/\//i.test(avatarUrl)
    ) {
      return NextResponse.json(
        { error: "Avatar URL must be https." },
        { status: 400 },
      );
    }

    // Ensure row exists, then update with the user's session (RLS).
    await upsertUserProfile({
      authUserId: user.id,
      email: normalizeEmail(user.email),
      overwriteIdentityDefaults: false,
    });

    const updates: Record<string, string | null> = {
      updated_at: new Date().toISOString(),
    };
    if (displayName !== undefined) updates.display_name = displayName;
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("auth_user_id", user.id)
      .select("email, display_name, avatar_url")
      .single();

    if (error || !data) {
      // Fallback: service role if RLS update races a missing row.
      const admin = createSupabaseAdmin();
      const { data: adminData, error: adminError } = await admin
        .from("user_profiles")
        .update(updates)
        .eq("auth_user_id", user.id)
        .select("email, display_name, avatar_url")
        .single();
      if (adminError || !adminData) {
        console.error("Profile PATCH error:", error ?? adminError);
        return NextResponse.json(
          { error: "Could not update profile" },
          { status: 500 },
        );
      }
      return NextResponse.json({
        email: adminData.email,
        displayName: adminData.display_name,
        avatarUrl: adminData.avatar_url,
      });
    }

    return NextResponse.json({
      email: data.email,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
    });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { error: "Could not update profile" },
      { status: 500 },
    );
  }
}
