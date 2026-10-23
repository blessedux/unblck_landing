import type { Metadata } from "next";
import { HoldingScreen } from "@/components/HoldingScreen";

export const metadata: Metadata = {
  title: "UNBLCK",
  description:
    "A private accelerator in Santiago for founders building with AI and blockchain. The next batch opens in December 2026.",
  openGraph: {
    title: "UNBLCK",
    description:
      "A private accelerator in Santiago for founders building with AI and blockchain. The next batch opens in December 2026.",
  },
};

export default function Home() {
  return <HoldingScreen />;
}
