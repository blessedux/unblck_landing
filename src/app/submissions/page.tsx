import type { Metadata } from "next";
import { SubmissionsDashboard } from "@/components/SubmissionsDashboard";

export const metadata: Metadata = {
  title: "Your submissions | UNBLCK",
  description: "Track your UNBLCK accelerator and hub applications.",
};

export default function SubmissionsPage() {
  return <SubmissionsDashboard />;
}
