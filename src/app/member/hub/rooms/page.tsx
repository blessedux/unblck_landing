import { Metadata } from "next";
import { RoomBooking } from "@/components/RoomBooking";

export const metadata: Metadata = {
  title: "Book a Room - Tellus Hub",
  description: "Reserve a workspace at Tellus Blockchain Hub STGO",
};

export default function RoomsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">Book a Room</h1>
      <p className="text-gray-400 mb-8">
        Reserve meeting rooms, phone booths, and our podcast studio.
      </p>
      <RoomBooking />
    </div>
  );
}
