import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/admin";
import { redirect } from "next/navigation";
import { EventSchedulingAdminView } from "@/components/EventSchedulingAdminView";

export const metadata: Metadata = {
  title: "Event Scheduling Requests | Admin",
  description: "Review after-hours Terraza event scheduling requests",
};

export default async function AdminEventRequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email || "")) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Event Scheduling Requests</h1>
            <p className="mt-2 text-gray-400">
              Review and approve after-hours Terraza event requests
            </p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            Back to Admin
          </Link>
        </div>

        <EventSchedulingAdminView />
      </div>
    </div>
  );
}
