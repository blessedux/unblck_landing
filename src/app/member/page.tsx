import { createClient } from "@/lib/supabase/server";
import { getMemberApplication, getMemberProfile } from "@/lib/auth/member";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { MemberStatusContent } from "@/components/MemberStatusContent";

export const metadata: Metadata = {
  title: "Member Area | UNBLCK",
  description: "Your UNBLCK Hub dashboard",
};

export default async function MemberPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getMemberProfile(user.id);

  if (profile) {
    redirect("/member/hub");
  }

  const application = await getMemberApplication(user.id);

  if (!application) {
    return <MemberStatusContent view={{ type: "no_application" }} />;
  }

  if (application.status === "pending") {
    return (
      <MemberStatusContent
        view={{ type: "pending", appliedAt: application.created_at }}
      />
    );
  }

  if (application.status === "rejected") {
    return <MemberStatusContent view={{ type: "rejected" }} />;
  }
}
