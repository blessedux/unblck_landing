import type { Metadata } from "next";
import { UnblckApplicationForm } from "@/components/UnblckApplicationForm";

export const metadata: Metadata = {
  title: "Apply | UNBLCK",
  description:
    "Apply to join UNBLCK — Santiago's accelerator for AI and blockchain founders.",
};

export default function ApplyPage() {
  return <UnblckApplicationForm />;
}
