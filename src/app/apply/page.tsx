import type { Metadata } from "next";
import { HubAccessApplicationForm } from "@/components/HubAccessApplicationForm";

export const metadata: Metadata = {
  title: "Request Access | Tellus Hub",
  description:
    "Request access to Tellus Blockchain Hub in Santiago de Chile.",
};

export default function ApplyPage() {
  return <HubAccessApplicationForm />;
}
