"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError("That email and password did not work.");
        return;
      }

      router.replace(nextPath.startsWith("/") ? nextPath : "/admin");
      router.refresh();
    } catch {
      setError("Admin login is not configured yet.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto grid max-w-md gap-5 rounded-[1.5rem] border border-espresso/10 bg-white p-6 shadow-soft">
      <div className="inline-flex size-12 items-center justify-center rounded-full bg-gold/15 text-rust">
        <LockKeyhole aria-hidden size={22} />
      </div>
      <div>
        <h2 className="font-serif text-3xl text-espresso">Admin login</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-espresso/68">Sign in with the Supabase admin account before editing the site.</p>
      </div>

      <label className="grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-rust">Email</span>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
          required
          className="min-h-12 rounded-[1rem] border border-espresso/12 bg-cream/30 px-4 text-sm font-bold text-espresso outline-none transition focus:border-gold focus:bg-white"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-rust">Password</span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
          required
          className="min-h-12 rounded-[1rem] border border-espresso/12 bg-cream/30 px-4 text-sm font-bold text-espresso outline-none transition focus:border-gold focus:bg-white"
        />
      </label>

      {error ? (
        <p className="rounded-[1rem] border border-rust/20 bg-rust/8 px-4 py-3 text-sm font-bold text-rust" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-6 text-sm font-black text-espresso shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
