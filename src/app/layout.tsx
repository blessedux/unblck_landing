import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageToggle } from "@/components/LanguageToggle";
import { AuthHashRedirect } from "@/components/AuthHashRedirect";
import { SiteNavbar } from "@/components/SiteNavbar";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { NewsletterPopup } from "@/components/NewsletterPopup";
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tellus Hub",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider>
          <AuthHashRedirect />
          <LanguageToggle />
          <SiteNavbar />
          {children}
          <NewsletterPopup />
        </LocaleProvider>
      </body>
    </html>
  );
}
