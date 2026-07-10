import { ensureMagicLinkRedirect } from "@/lib/site-url";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function generateMagicLinkUrl(
  email: string,
  redirectTo: string,
): Promise<string> {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (error) {
    throw error;
  }

  const magicLink = ensureMagicLinkRedirect(
    data.properties?.action_link ?? "",
    redirectTo,
  );

  if (!magicLink) {
    throw new Error("No action link returned from Supabase");
  }

  return magicLink;
}
