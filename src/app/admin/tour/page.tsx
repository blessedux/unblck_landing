import { Metadata } from "next";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TourLocationManager } from "@/components/TourLocationManager";

export const metadata: Metadata = {
  title: "Tour Location Management | Admin",
  description: "Manage Santiago tour locations",
};

export default async function AdminTourPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email || "")) {
    redirect("/login");
  }

  const adminSupabase = createSupabaseAdmin();

  const { data: locations } = await adminSupabase
    .from("tour_locations")
    .select("*")
    .order("order_index");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tour Location Management</h1>
            <p className="text-gray-400 mt-2">
              Manage Santiago tour locations and rewards
            </p>
          </div>
          <a
            href="/admin"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Back to Admin
          </a>
        </div>

        <TourLocationManager initialLocations={locations || []} />
      </div>
    </div>
  );
}
