import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Santiago Tour - Tellus Hub",
  description: "Explore Santiago with our curated tour",
};

export default function TourPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">Santiago Tour</h1>
      <p className="text-gray-400 mb-8">
        Tour map and locations coming soon...
      </p>
    </div>
  );
}
