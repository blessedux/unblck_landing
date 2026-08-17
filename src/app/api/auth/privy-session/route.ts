import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateSessionTokenHashForEmail } from "@/lib/auth/magic-link";
import {
  displayNameFromPrivyUser,
  emailFromPrivyUser,
  getPrivyServerClient,
} from "@/lib/auth/privy-server";
import { upsertUserProfile } from "@/lib/auth/user-profile";

export async function POST(request: Request) {
  try {
    const headerToken = request.headers.get("privy-id-token")?.trim() ?? "";
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("privy-id-token")?.value?.trim() ?? "";
    const idToken = headerToken || cookieToken;

    if (!idToken) {
      return NextResponse.json(
        {
          error:
            "Missing Privy identity token. Enable identity tokens in the Privy dashboard, then try Gmail again.",
        },
        { status: 401 },
      );
    }

    let body: { displayName?: string | null; avatarUrl?: string | null } = {};
    try {
      body = (await request.json()) as typeof body;
    } catch {
      body = {};
    }

    const clientAvatar =
      typeof body.avatarUrl === "string" && /^https:\/\//i.test(body.avatarUrl.trim())
        ? body.avatarUrl.trim()
        : null;
    const clientDisplayName =
      typeof body.displayName === "string" && body.displayName.trim()
        ? body.displayName.trim()
        : null;

    const privy = getPrivyServerClient();
    // Verifies the JWT locally via the app verification key — does not call /users.
    const user = await privy.getUser({ idToken });
    const email = emailFromPrivyUser(user);
    if (!email) {
      return NextResponse.json(
        { error: "Gmail did not return an email address." },
        { status: 400 },
      );
    }

    const { tokenHash, userId } = await generateSessionTokenHashForEmail(email);
    await upsertUserProfile({
      authUserId: userId,
      email,
      displayName: clientDisplayName || displayNameFromPrivyUser(user),
      avatarUrl: clientAvatar,
      privyDid: user.id,
      // Seed name/avatar on first login; keep later edits unless empty.
      overwriteIdentityDefaults: false,
    });

    return NextResponse.json({ tokenHash });
  } catch (error) {
    console.error("Privy session API error:", error);
    const message =
      error instanceof Error ? error.message : "Could not complete Gmail sign-in.";
    const looksLikeMissingIdentity =
      /identity token|id.?token|unable to parse/i.test(message);
    return NextResponse.json(
      {
        error: looksLikeMissingIdentity
          ? "Enable “Return user data in an identity token” in the Privy dashboard (Authentication → Advanced), then try again."
          : "Could not complete Gmail sign-in. Please try again.",
      },
      { status: 500 },
    );
  }
}
