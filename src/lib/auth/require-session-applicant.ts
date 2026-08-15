import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeEmail } from "@/lib/forms/validate-email";

export type SessionApplicant = {
  id: string;
  email: string;
};

/**
 * Resolve the signed-in applicant for apply APIs.
 * Email on the request body is ignored — identity comes from the session.
 */
export async function requireSessionApplicant(): Promise<
  SessionApplicant | { error: NextResponse }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      error: NextResponse.json(
        { error: "Sign in required before submitting an application." },
        { status: 401 },
      ),
    };
  }

  return {
    id: user.id,
    email: normalizeEmail(user.email),
  };
}
