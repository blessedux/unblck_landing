import { createClient } from "@/lib/supabase/server";
import { getMemberApplication, getMemberProfile } from "@/lib/auth/member";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookingCalendar } from "@/components/BookingCalendar";
import { CoffeeBadge } from "@/components/CoffeeBadge";
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

  const application = await getMemberApplication(user.id);

  if (!application) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-4">No Application Found</h1>
          <p className="text-gray-400 mb-8">
            We couldn't find an application associated with your account.
          </p>
          <Link
            href="/apply"
            className="inline-block bg-white text-black px-6 py-3 font-medium hover:bg-gray-200 transition"
          >
            Apply to UNBLCK
          </Link>
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
            Thank you for applying to UNBLCK Hub! We're currently reviewing your
            application.
          </p>
          <p className="text-sm text-gray-500">
            Applied {new Date(application.created_at).toLocaleDateString()}
          </p>
          <div className="mt-8">
            <a
              href="/"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Back to home
            </a>
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
            Unfortunately, we're unable to offer you a spot at UNBLCK Hub at
            this time. We encourage you to keep building and stay connected with
            our community.
          </p>
          <div className="space-y-3">
            <a
              href="/"
              className="block text-sm text-gray-400 hover:text-white transition"
            >
              Back to home
            </a>
            <p className="text-sm text-gray-500">
              Join us at StellarBarrio events to connect with the community
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Approved status - show member home
  const profile = await getMemberProfile(user.id);

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-4">Profile Error</h1>
          <p className="text-gray-400">
            Your application was approved but we couldn't load your profile.
            Please contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Welcome to UNBLCK Hub</h1>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Home
          </Link>
        </div>

        <div className="mb-8 p-6 border border-gray-800 bg-white/5">
          <p className="text-sm text-gray-400">Member Status</p>
          <p className="mt-2 text-xl font-semibold">
            {profile.stellar_funded ? "Stellar Funded" : "Ambassador"}
          </p>
          {profile.passport_verified && (
            <p className="mt-2 text-sm text-green-500">
              ✓ Passport Verified
            </p>
          )}
        </div>

        <div className="mb-8">
          <CoffeeBadge />
        </div>

        <div className="mb-8">
          <BookingCalendar />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-2">Content Library</h2>
            <p className="text-gray-400 text-sm mb-4">
              Access resources, guides, and materials
            </p>
            <span className="text-xs text-gray-500">Coming soon</span>
          </div>

          <div className="border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-2">Schedule Meetings</h2>
            <p className="text-gray-400 text-sm mb-4">
              Book time with founders and investors
            </p>
            <span className="text-xs text-gray-500">Coming soon</span>
          </div>

          <div className="border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-2">Community</h2>
            <p className="text-gray-400 text-sm mb-4">
              Connect with other builders
            </p>
            <a
              href="/"
              className="text-sm text-white hover:underline"
            >
              View events →
            </a>
          </div>

          <div className="border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-2">Insta Awards</h2>
            <p className="text-gray-400 text-sm mb-4">
              Apply for non-dilutive funding
            </p>
            <a
              href="/insta-awards/apply"
              className="text-sm text-white hover:underline"
            >
              Learn more →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
