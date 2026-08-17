"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { AcceleratorProfileCardSkeleton } from "@/components/AcceleratorProfileHandoff";
import { AuthScreenShell } from "@/components/AuthScreenShell";
import { PrivyGoogleButton } from "@/components/PrivyGoogleButton";
import { createClient } from "@/lib/supabase/client";
import { isApplyNextPath } from "@/lib/auth/safe-next-path";
import { isPrivyConfigured } from "@/lib/auth/privy-public";
import { startViewTransition } from "@/lib/nav/start-view-transition";
import { useLocale } from "@/contexts/LocaleContext";

export type SignInPageProps = {
  passwordLoginEmails?: string[];
  /** Where to send the user after a successful password login or magic-link callback. */
  nextPath?: string;
  /** Link for applicants who need an account (shown on member login). */
  signupHref?: string;
};

function usesPasswordLogin(
  email: string,
  passwordLoginEmails: string[],
): boolean {
  const normalized = email.trim().toLowerCase();
  return (
    passwordLoginEmails.includes(normalized) ||
    normalized.endsWith("@test.unblck.dev")
  );
}

export function LoginPage({
  passwordLoginEmails = [],
  nextPath = "/member",
  signupHref = "/apply",
}: SignInPageProps) {
  const router = useRouter();
  const { t } = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthBusy, setOauthBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const isApplyFlow = isApplyNextPath(nextPath);
  const wantsPasswordField =
    showPassword || usesPasswordLogin(formData.email, passwordLoginEmails);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "email" && typeof value === "string") {
        if (usesPasswordLogin(value, passwordLoginEmails)) {
          setShowPassword(true);
        }
      }
      return next;
    });
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const email = formData.email.trim();
      const wantsPassword =
        usesPasswordLogin(email, passwordLoginEmails) ||
        (showPassword && Boolean(formData.password));

      if (wantsPassword) {
        if (!formData.password) {
          setError(t.login.passwordRequired);
          return;
        }

        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: formData.password,
        });

        if (signInError) throw signInError;

        const isAdmin = passwordLoginEmails.includes(email.toLowerCase());
        window.location.href = isAdmin ? "/admin" : nextPath;
        return;
      }

      const endpoint = isApplyFlow
        ? "/api/auth/apply-link"
        : "/api/auth/magic-link";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isApplyFlow ? { email, next: nextPath } : { email },
        ),
      });

      const json = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(json.error || t.login.magicLinkFailed);
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.login.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    startViewTransition(() => {
      router.push("/");
    });
  };

  const showApplyHandoff = oauthBusy && isApplyFlow;

  return (
    <>
      {showApplyHandoff && <AcceleratorProfileCardSkeleton />}
      <div className={showApplyHandoff ? "hidden" : undefined}>
    <AuthScreenShell onBack={goHome}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gray-400">
              UNBLCK
            </p>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {isApplyFlow ? t.login.applyWelcome : t.login.welcome}
            </h1>
            <p className="text-gray-600">
              {isApplyFlow ? (
                t.login.applySubtitle
              ) : (
                <>
                  {t.login.noAccount}{" "}
                  <Link
                    href={signupHref}
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    {t.login.applyHere}
                  </Link>
                </>
              )}
            </p>
          </div>

          <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                {t.login.checkEmailTitle}
              </h2>
              <p className="text-gray-600">
                {t.login.checkEmailBody
                  .split("{email}")
                  .map((part, index, parts) => (
                    <span key={index}>
                      {part}
                      {index < parts.length - 1 && (
                        <strong>{formData.email.trim()}</strong>
                      )}
                    </span>
                  ))}
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 text-sm text-gray-500 transition hover:text-gray-800"
              >
                {t.login.tryDifferentEmail}
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {isApplyFlow && isPrivyConfigured() && (
                <>
                  <PrivyGoogleButton onBusyChange={setOauthBusy} />
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      {t.login.orContinueWithEmail}
                    </span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                </>
              )}
              <div>
                <label
                  htmlFor="sign-in-email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t.login.emailLabel}
                </label>
                <input
                  id="sign-in-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t.login.emailPlaceholder}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {wantsPasswordField && (
                <div>
                  <label
                    htmlFor="sign-in-password"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t.login.passwordLabel}
                  </label>
                  <div className="relative">
                    <input
                      id="sign-in-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      required={wantsPasswordField}
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <span>{t.login.rememberMe}</span>
                </label>
                {!wantsPasswordField && !isApplyFlow && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(true)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {t.login.loginWithPasswordInstead}
                  </button>
                )}
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
              >
                {loading
                  ? t.login.processing
                  : wantsPasswordField
                    ? t.login.loginWithPassword
                    : isApplyFlow
                      ? t.login.continueWithEmail
                      : t.login.sendMagicLink}
              </button>
            </motion.form>
          )}
          </AnimatePresence>
      </motion.div>
    </AuthScreenShell>
      </div>
    </>
  );
}
