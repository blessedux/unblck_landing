import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/admin";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | UNBLCK",
  description: "Review applications and hub bookings",
};

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email!)) {
    redirect("/login");
  }

  return <AdminDashboard />;
}
