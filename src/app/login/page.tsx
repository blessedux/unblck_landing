import type { Metadata } from "next";
import { LoginPageContent } from "@/components/LoginPageContent";
import { getAdminEmails } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Login | UNBLCK",
  description: "Access your UNBLCK Hub account",
};

export default function LoginPage() {
  const passwordLoginEmails = getAdminEmails();

  return <LoginPageContent passwordLoginEmails={passwordLoginEmails} />;
}
