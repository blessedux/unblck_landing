import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";
import { getAdminEmails } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Login | UNBLCK",
  description: "Access your UNBLCK Hub account",
};

export default function LoginPage() {
  const passwordLoginEmails = getAdminEmails();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-gray-400 mb-8">
          Members use a magic link. Admins sign in with password.
        </p>

        <LoginForm passwordLoginEmails={passwordLoginEmails} />

        <p className="mt-6 text-sm text-gray-400 text-center">
          Don&apos;t have an account?{" "}
          <a href="/apply" className="text-white hover:underline">
            Apply here
          </a>
        </p>
      </div>
    </div>
  );
}
