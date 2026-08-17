import type { Metadata } from "next";
import { ProfileEditor } from "@/components/ProfileEditor";

export const metadata: Metadata = {
  title: "Profile | UNBLCK",
  description: "Edit your UNBLCK profile",
};

export default function ProfilePage() {
  return <ProfileEditor />;
}
