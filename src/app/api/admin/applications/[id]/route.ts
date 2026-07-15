import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";
import { ensureAuthUserForEmail } from "@/lib/auth/magic-link";
import { generateMagicLinkUrl } from "@/lib/auth/generate-magic-link-url";
import { sendAcceleratorApprovalEmail } from "@/lib/email/send-accelerator-approval-email";
import { sendHubWelcomeEmail } from "@/lib/email/send-hub-welcome-email";
import { sendRevocationEmail } from "@/lib/email/send-revocation-email";
import { getSiteUrl, memberAuthCallbackUrl } from "@/lib/site-url";
import {
  isValidStatusTransition,
  revokeMemberAccess,
} from "@/lib/admin/revoke-member-access";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email!)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      status?: string;
      reviewer_notes?: string;
      passport_verified?: boolean;
      stellar_funded?: boolean;
    };

    const adminSupabase = createSupabaseAdmin();

    const { data: application } = await adminSupabase
      .from("unblck_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (
      body.status &&
      body.status !== application.status &&
      !isValidStatusTransition(application.status, body.status)
    ) {
      return NextResponse.json(
        { error: "Invalid status transition" },
        { status: 400 }
      );
    }

    const justRevoked =
      body.status === "rejected" && application.status === "approved";
    const justApproved =
      body.status === "approved" && application.status !== "approved";

    if (justRevoked && application.auth_user_id) {
      try {
        await revokeMemberAccess(adminSupabase, application.auth_user_id);
      } catch (revokeError) {
        console.error("Member revocation error:", revokeError);
        return NextResponse.json(
          { error: "Could not revoke member access" },
          { status: 500 }
        );
      }
    }

    const updatePayload: Record<string, unknown> = {};
    if (body.status !== undefined) updatePayload.status = body.status;
    if (body.reviewer_notes !== undefined) {
      updatePayload.reviewer_notes = body.reviewer_notes;
    }
    if (body.passport_verified !== undefined) {
      updatePayload.passport_verified = body.passport_verified;
    }
    if (body.stellar_funded !== undefined) {
      updatePayload.stellar_funded = body.stellar_funded;
    }

    const { error: updateError } = await adminSupabase
      .from("unblck_applications")
      .update(updatePayload)
      .eq("id", id);

    if (updateError) {
      console.error("Application update error:", updateError);
      return NextResponse.json(
        { error: "Could not update application" },
        { status: 500 }
      );
    }

    if (body.status === "approved" && application.application_type === "hub_access") {
      let authUserId = application.auth_user_id;

      if (!authUserId && application.email) {
        try {
          const { user: authUser } = await ensureAuthUserForEmail(
            application.email,
          );
          authUserId = authUser.id;
          await adminSupabase
            .from("unblck_applications")
            .update({ auth_user_id: authUserId })
            .eq("id", id);
        } catch (authError) {
          console.error("Auth user creation on approval error:", authError);
          return NextResponse.json(
            { error: "Could not create member account" },
            { status: 500 },
          );
        }
      }

      if (authUserId) {
        const { error: profileError } = await adminSupabase
          .from("member_profiles")
          .upsert(
            {
              auth_user_id: authUserId,
              application_id: application.id,
              email: application.email,
              stellar_funded: body.stellar_funded ?? application.stellar_funded,
              passport_verified:
                body.passport_verified ?? application.passport_verified,
            },
            { onConflict: "auth_user_id" },
          );

        if (profileError) {
          console.error("Member profile upsert error:", profileError);
          return NextResponse.json(
            { error: "Could not create member profile" },
            { status: 500 },
          );
        }
      }
    }

    const siteUrl = getSiteUrl(request);

    if (justApproved && application.email) {
      try {
        if (application.application_type === "hub_access") {
          const magicLink = await generateMagicLinkUrl(
            application.email,
            memberAuthCallbackUrl(request),
          );
          await sendHubWelcomeEmail({
            to: application.email,
            fullName: application.full_name,
            magicLink,
          });
        } else if (application.application_type === "accelerator") {
          await sendAcceleratorApprovalEmail({
            to: application.email,
            fullName: application.full_name,
          });
        }
      } catch (emailError) {
        console.error("Approval email error:", emailError);
      }
    }

    if (justRevoked && application.email) {
      try {
        await sendRevocationEmail({
          to: application.email,
          fullName: application.full_name,
          reapplyUrl: `${siteUrl}/apply/hub`,
        });
      } catch (emailError) {
        console.error("Revocation email error:", emailError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
