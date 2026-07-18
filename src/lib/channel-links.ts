import { createSupabaseAdmin } from "@/lib/supabase/admin";

export type Channel = "telegram" | "whatsapp";

export async function resolveChannelMember(
  channel: Channel,
  channelUserId: string
): Promise<string | null> {
  const adminSupabase = createSupabaseAdmin();

  const { data: link } = await adminSupabase
    .from("channel_links")
    .select("member_id")
    .eq("channel", channel)
    .eq("channel_user_id", channelUserId)
    .is("revoked_at", null)
    .maybeSingle();

  return link?.member_id || null;
}

export async function generateLinkCode(memberId: string): Promise<string> {
  const code = generateRandomCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const adminSupabase = createSupabaseAdmin();
  await adminSupabase.from("channel_link_codes").insert({
    code,
    member_id: memberId,
    expires_at: expiresAt.toISOString(),
  });

  return code;
}

export async function linkChannel(
  channel: Channel,
  channelUserId: string,
  code: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const adminSupabase = createSupabaseAdmin();

  const { data: linkCode } = await adminSupabase
    .from("channel_link_codes")
    .select("member_id, expires_at, used_at")
    .eq("code", code)
    .maybeSingle();

  if (!linkCode) {
    return { ok: false, error: "Invalid link code" };
  }

  if (linkCode.used_at) {
    return { ok: false, error: "Link code already used" };
  }

  if (new Date(linkCode.expires_at) < new Date()) {
    return { ok: false, error: "Link code expired" };
  }

  await adminSupabase
    .from("channel_link_codes")
    .update({ used_at: new Date().toISOString() })
    .eq("code", code);

  const { error } = await adminSupabase.from("channel_links").upsert(
    {
      channel,
      channel_user_id: channelUserId,
      member_id: linkCode.member_id,
      linked_at: new Date().toISOString(),
      revoked_at: null,
    },
    {
      onConflict: "channel,channel_user_id,member_id",
    }
  );

  if (error) {
    console.error("Channel link upsert error:", error);
    return { ok: false, error: "Could not link channel" };
  }

  return { ok: true };
}

export async function unlinkChannel(
  channel: Channel,
  channelUserId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const adminSupabase = createSupabaseAdmin();

  const { error } = await adminSupabase
    .from("channel_links")
    .update({ revoked_at: new Date().toISOString() })
    .eq("channel", channel)
    .eq("channel_user_id", channelUserId)
    .is("revoked_at", null);

  if (error) {
    console.error("Channel unlink error:", error);
    return { ok: false, error: "Could not unlink channel" };
  }

  return { ok: true };
}

export async function getMemberChannelLinks(memberId: string) {
  const adminSupabase = createSupabaseAdmin();

  const { data: links } = await adminSupabase
    .from("channel_links")
    .select("id, channel, channel_user_id, linked_at")
    .eq("member_id", memberId)
    .is("revoked_at", null)
    .order("linked_at", { ascending: false });

  return links || [];
}

export async function revokeChannelLink(
  memberId: string,
  linkId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const adminSupabase = createSupabaseAdmin();

  const { error } = await adminSupabase
    .from("channel_links")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", linkId)
    .eq("member_id", memberId)
    .is("revoked_at", null);

  if (error) {
    console.error("Channel revoke error:", error);
    return { ok: false, error: "Could not revoke link" };
  }

  return { ok: true };
}

function generateRandomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
