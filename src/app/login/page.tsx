import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPageContent } from "@/components/LoginPageContent";
import { getAdminEmails } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Login | UNBLCK",
  description: "Access your UNBLCK Hub account",
};

export default function LoginPage() {
  const passwordLoginEmails = getAdminEmails();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-white text-gray-500">
          Loading…
        </div>
      }
    >
      <LoginPageContent passwordLoginEmails={passwordLoginEmails} />
    </Suspense>
  );
}
