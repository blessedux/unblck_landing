"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, type FormEvent } from "react";
import { useLocale } from "@/contexts/LocaleContext";

type LoginFormProps = {
  passwordLoginEmails?: string[];
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

export function LoginForm({ passwordLoginEmails = [] }: LoginFormProps) {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const wantsPassword = usesPasswordLogin(email, passwordLoginEmails);

      if (wantsPassword || (showPassword && password)) {
        if (!password) {
          setError(t.login.passwordRequired);
          return;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        const isAdmin = passwordLoginEmails.includes(email.trim().toLowerCase());
        window.location.href = isAdmin ? "/admin" : "/member";
        return;
      }

      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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

  if (sent) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{t.login.checkEmailTitle}</h2>
        <p className="text-gray-400">
          {t.login.checkEmailBody.split("{email}").map((part, index, parts) => (
            <span key={index}>
              {part}
              {index < parts.length - 1 && <strong>{email}</strong>}
            </span>
          ))}
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-sm text-gray-400 hover:text-white transition"
        >
          {t.login.tryDifferentEmail}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          {t.login.emailLabel}
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            const value = e.target.value;
            setEmail(value);
            setShowPassword(usesPasswordLogin(value, passwordLoginEmails));
          }}
          required
          disabled={loading}
          className="w-full px-4 py-3 bg-white/5 border border-gray-800 text-white placeholder-gray-500 focus:border-white focus:outline-none disabled:opacity-50"
          placeholder={t.login.emailPlaceholder}
        />
      </div>

      {showPassword && (
        <div className="animate-fade-in">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            {t.login.passwordLabel}
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={showPassword}
            disabled={loading}
            className="w-full px-4 py-3 bg-white/5 border border-gray-800 text-white placeholder-gray-500 focus:border-white focus:outline-none disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-white text-black py-3 px-4 font-medium hover:bg-gray-200 transition disabled:opacity-50"
      >
        {loading
          ? t.login.processing
          : usesPasswordLogin(email, passwordLoginEmails) || showPassword
            ? t.login.loginWithPassword
            : t.login.sendMagicLink}
      </button>

      {!showPassword && !usesPasswordLogin(email, passwordLoginEmails) && (
        <button
          type="button"
          onClick={() => setShowPassword(true)}
          className="w-full text-xs text-gray-500 hover:text-gray-300 transition text-center"
        >
          {t.login.loginWithPasswordInstead}
        </button>
      )}
    </form>
  );
}
