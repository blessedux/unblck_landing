import type { Metadata } from "next";
import { AcceleratorApplicationForm } from "@/components/AcceleratorApplicationForm";

export const metadata: Metadata = {
  title: "Apply | UNBLCK Accelerator",
  description:
    "Apply to join UNBLCK — Santiago's accelerator for AI and blockchain founders.",
};

export default function AcceleratorApplyPage() {
  return <AcceleratorApplicationForm />;
}
