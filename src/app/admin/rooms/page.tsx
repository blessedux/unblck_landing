import { Metadata } from "next";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminRoomsPageContent } from "@/components/AdminRoomsPageContent";

export const metadata: Metadata = {
  title: "Gestión de salas | Admin",
  description: "Administrar salas del hub",
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

  return <AdminRoomsPageContent initialRooms={rooms || []} />;
}
