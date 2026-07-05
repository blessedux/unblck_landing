import { Metadata } from "next";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RoomManager } from "@/components/RoomManager";

export const metadata: Metadata = {
  title: "Room Management | Admin",
  description: "Manage hub rooms",
};

export default async function AdminRoomsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email || "")) {
    redirect("/login");
  }

  const adminSupabase = createSupabaseAdmin();

  const { data: rooms } = await adminSupabase
    .from("hub_rooms")
    .select("*")
    .order("name");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Room Management</h1>
            <p className="text-gray-400 mt-2">
              Manage hub rooms and their availability
            </p>
          </div>
          <a
            href="/admin"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Back to Admin
          </a>
        </div>

        <RoomManager initialRooms={rooms || []} />
      </div>
    </div>
  );
}
