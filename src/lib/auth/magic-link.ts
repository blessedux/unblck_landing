import type { User } from "@supabase/supabase-js";
import { sendMagicLinkEmail } from "@/lib/email/send-magic-link";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

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

  const magicLink = data.properties?.action_link;
  if (!magicLink) {
    throw new Error("No action link returned from Supabase");
  }

  await sendMagicLinkEmail({ to: email, magicLink });

  return data.user;
}
