import type { Metadata } from "next";
import { InstaAwardsApplicationForm } from "@/components/InstaAwardsApplicationForm";

export const metadata: Metadata = {
  title: "Insta Awards | UNBLCK",
  description:
    "Apply to the Insta Awards Fund — a $5,000 non-dilutive grant for Stellar builders. Referral code required.",
};

export default function InstaAwardsApplyPage() {
  return <InstaAwardsApplicationForm />;
}
