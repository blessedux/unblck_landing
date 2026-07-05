import { createClient } from "@/lib/supabase/server";
import { getMemberApplication, getMemberProfile } from "@/lib/auth/member";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

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

  // Check for member profile first (approved members)
  const profile = await getMemberProfile(user.id);

  if (profile) {
    // User is an approved member, redirect to hub app
    redirect("/member/hub");
  }

  // No member profile, check for application status
  const application = await getMemberApplication(user.id);

  if (!application) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-4">No Application Found</h1>
          <p className="text-gray-400 mb-8">
            We couldn&apos;t find an application associated with your account.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/apply"
              className="inline-block bg-white text-black px-6 py-3 font-medium hover:bg-gray-200 transition rounded-full"
            >
              Request Hub Access
            </Link>
            <Link
              href="/accelerator/apply"
              className="inline-block border border-white/20 text-white px-6 py-3 font-medium hover:bg-white/10 transition rounded-full"
            >
              Apply to Accelerator
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Pending status
  if (application.status === "pending") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="mb-6 inline-block h-16 w-16 animate-pulse rounded-full bg-yellow-500/20"></div>
          <h1 className="text-3xl font-bold mb-4">Application Under Review</h1>
          <p className="text-gray-400 mb-2">
            Thank you for applying to UNBLCK Hub! We&apos;re currently reviewing your
            application.
          </p>
          <p className="text-sm text-gray-500">
            Applied {new Date(application.created_at).toLocaleDateString()}
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Rejected status
  if (application.status === "rejected") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-4">Application Not Approved</h1>
          <p className="text-gray-400 mb-8">
            Unfortunately, we&apos;re unable to offer you a spot at UNBLCK Hub at
            this time. We encourage you to keep building and stay connected with
            our community.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block text-sm text-gray-400 hover:text-white transition"
            >
              Back to home
            </Link>
            <p className="text-sm text-gray-500">
              Join us at StellarBarrio events to connect with the community
            </p>
          </div>
        </div>
      </div>
    );
  }
}
