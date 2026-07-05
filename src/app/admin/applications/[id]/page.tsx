import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ApplicationDetail } from "@/components/ApplicationDetail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Detail | UNBLCK Admin",
};

type Application = {
  id: string;
  full_name: string;
  email: string;
  project_name: string;
  project_link: string | null;
  build_description: string;
  location: string;
  stage: string;
  motivation: string;
  passport_address: string;
  status: string;
  reviewer_notes: string | null;
  passport_verified: boolean;
  stellar_funded: boolean;
  created_at: string;
};

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email!)) {
    redirect("/login");
  }

  // Use admin client to bypass RLS
  const adminSupabase = createSupabaseAdmin();
  const { data: application } = await adminSupabase
    .from("unblck_applications")
    .select("*")
    .eq("id", id)
    .single<Application>();

  if (!application) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← Back to applications
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">{application.full_name}</h1>
          <p className="text-gray-400 mt-2">
            Applied {new Date(application.created_at).toLocaleDateString()}
          </p>
        </div>

        <ApplicationDetail application={application} />
      </div>
    </div>
  );
}
