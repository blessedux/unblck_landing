import type { Metadata } from "next";
import { FoundersSchoolPage } from "@/components/FoundersSchoolPage";

export const metadata: Metadata = {
  title: "Founder school | UNBLCK",
  description:
    "YC playlists, founder reads, and Tellus hub resources for UNBLCK applicants.",
};

export default function FoundersPage() {
  return <FoundersSchoolPage />;
}
