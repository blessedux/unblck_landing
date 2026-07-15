import type { User } from "@supabase/supabase-js";
import { sendMagicLinkEmail } from "@/lib/email/send-magic-link";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { ensureMagicLinkRedirect } from "@/lib/site-url";

export type EnsuredAuthUser = {
  user: User;
  /** True when this call created the auth user (safe to delete on rollback). */
  created: boolean;
};

export async function ensureAuthUserForEmail(
  email: string,
): Promise<EnsuredAuthUser> {
  const supabase = createSupabaseAdmin();

  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });

  if (!createError && created.user) {
    return { user: created.user, created: true };
  }

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: "https://unblck.cl/auth/callback" },
  });

  if (error || !data.user) {
    throw createError ?? error ?? new Error("Could not ensure auth user");
  }

  return { user: data.user, created: false };
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
