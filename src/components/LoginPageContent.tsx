"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { LoginPage } from "@/components/ui/sign-in-page";
import { sanitizeNextPath } from "@/lib/auth/safe-next-path";
import { useLocale } from "@/contexts/LocaleContext";

type LoginPageContentProps = {
  passwordLoginEmails: string[];
};

export function LoginPageContent({
  passwordLoginEmails,
}: LoginPageContentProps) {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const nextPath = sanitizeNextPath(searchParams.get("next"), "/member");

  useEffect(() => {
    document.title = t.login.pageTitle;
  }, [t.login.pageTitle]);

  return (
    <LoginPage
      passwordLoginEmails={passwordLoginEmails}
      nextPath={nextPath}
      signupHref="/apply"
    />
  );
}
