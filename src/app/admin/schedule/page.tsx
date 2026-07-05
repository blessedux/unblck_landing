import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ScheduleManager } from "@/components/ScheduleManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hub Schedule | UNBLCK Admin",
  description: "Configure weekly hub availability",
};

export default async function AdminSchedulePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email!)) {
    redirect("/login");
  }

  // Get current week schedule
  const today = new Date();
  const { data: schedule } = await supabase
    .from("hub_schedule")
    .select("*")
    .single();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Hub Schedule</h1>
          <Link
            href="/admin"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← Back to admin
          </Link>
        </div>

        <p className="text-gray-400 mb-8">
          Configure which days the hub is open for bookings. Changes apply to
          the selected week.
        </p>

        <ScheduleManager initialSchedule={schedule} />
      </div>
    </div>
  );
}
