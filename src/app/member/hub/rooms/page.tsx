import { Metadata } from "next";
import { RoomsPageContent } from "@/components/RoomsPageContent";

export const metadata: Metadata = {
  title: "Reservar sala | Tellus Hub",
  description:
    "Reserva un espacio de trabajo en Tellus Blockchain Hub STGO",
};

export default function RoomsPage() {
  return <RoomsPageContent />;
}
