import { Metadata } from "next";
import { SantiagoTour } from "@/components/SantiagoTour";

export const metadata: Metadata = {
  title: "Santiago Tour - Tellus Hub",
  description: "Explore Santiago with our curated tour",
};

export default function TourPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-black mb-6">Santiago Tour</h1>
      <p className="text-black/60 mb-8">
        Discover curated locations around Santiago. Scan QR codes at each spot to collect NFTs, USDC, and special discounts.
      </p>
      <SantiagoTour />
    </div>
  );
}
