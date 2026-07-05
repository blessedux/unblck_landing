"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, type FormEvent } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/member`,
        },
      });

      if (signInError) {
        throw signInError;
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Check your email</h2>
        <p className="text-gray-400">
          We&apos;ve sent a magic link to <strong>{email}</strong>. Click it to log
          in.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-sm text-gray-400 hover:text-white transition"
        >
          Try a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-3 bg-white/5 border border-gray-800 text-white placeholder-gray-500 focus:border-white focus:outline-none disabled:opacity-50"
          placeholder="you@company.com"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black py-3 px-4 font-medium hover:bg-gray-200 transition disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send magic link"}
      </button>
    </form>
  );
}
