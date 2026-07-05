import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteNavbar } from "@/components/SiteNavbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UNBLCK | Accelerator in Santiago",
  description:
    "An accelerator for AI and blockchain founders in Santiago. We turn builders into unicorn riders.",
  openGraph: {
    title: "UNBLCK | Accelerator in Santiago",
    description:
      "An accelerator for AI and blockchain founders. Workspace, mentorship, and funding to go from builder to unicorn rider.",
    type: "website",
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tellus Hub",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteNavbar />
        {children}
      </body>
    </html>
  );
}
