import type { Metadata } from "next";
import { UnblckApplicationForm } from "@/components/UnblckApplicationForm";

export const metadata: Metadata = {
  title: "Apply | UNBLCK",
  description:
    "Apply to join UNBLCK — Santiago's private founder hub for blockchain and AI builders.",
};

export default function ApplyPage() {
  return <UnblckApplicationForm />;
}
