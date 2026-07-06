"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { useLocale } from "@/contexts/LocaleContext";

type LoginPageContentProps = {
  passwordLoginEmails: string[];
};

export function LoginPageContent({
  passwordLoginEmails,
}: LoginPageContentProps) {
  const { t } = useLocale();

  useEffect(() => {
    document.title = t.login.pageTitle;
  }, [t.login.pageTitle]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">{t.login.welcome}</h1>
        <p className="text-gray-400 mb-8">{t.login.subtitle}</p>

        <LoginForm passwordLoginEmails={passwordLoginEmails} />

        <p className="mt-6 text-sm text-gray-400 text-center">
          {t.login.noAccount}{" "}
          <Link href="/apply" className="text-white hover:underline">
            {t.login.applyHere}
          </Link>
        </p>
      </div>
    </div>
  );
}
