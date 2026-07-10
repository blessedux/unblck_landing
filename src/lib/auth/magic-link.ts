import type { User } from "@supabase/supabase-js";
import { sendMagicLinkEmail } from "@/lib/email/send-magic-link";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { ensureMagicLinkRedirect } from "@/lib/site-url";

export async function ensureAuthUserForEmail(email: string): Promise<User> {
  const supabase = createSupabaseAdmin();

  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });

  if (!createError && created.user) {
    return created.user;
  }

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: "https://unblck.cl/auth/callback" },
  });

  if (error || !data.user) {
    throw createError ?? error ?? new Error("Could not ensure auth user");
  }

  return data.user;
}

export async function generateAndSendMagicLink(
  email: string,
  redirectTo: string,
): Promise<User> {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (error || !data.user) {
    throw error ?? new Error("Could not generate magic link");
  }

  const magicLink = ensureMagicLinkRedirect(
    data.properties?.action_link ?? "",
    redirectTo,
  );
  if (!magicLink) {
    throw new Error("No action link returned from Supabase");
  }

  await sendMagicLinkEmail({ to: email, magicLink });

  return data.user;
}
