"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "../../lib/auth-client";

type Role = "user" | "employer";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/alerts";

  const [isSignUp, setIsSignUp] = React.useState(false);
  const [role, setRole] = React.useState<Role>("user");
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name: name || (role === "employer" ? "Employer" : "Job Seeker"),
          callbackURL: callbackUrl,
        });

        if (signUpError) {
          setError(signUpError.message || "Failed to sign up");
          return;
        }

        if (data?.user) {
          // Update role after signup
          if (role === "employer") {
            await fetch("/api/user/role", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role: "employer" }),
            }).catch(() => {}); // Fail silently
          }
          router.push(callbackUrl);
        }
      } else {
        const { data, error: signInError } = await authClient.signIn.email({
          email,
          password,
          callbackURL: callbackUrl,
        });

        if (signInError) {
          setError(signInError.message || "Failed to sign in");
          return;
        }

        if (data) {
          router.push(callbackUrl);
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-4 rounded-2xl border border-orange-200 bg-white p-6 shadow-sm"
    >
      {isSignUp && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-800">
            I am a...
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 rounded-full cursor-pointer border px-4 py-2 text-xs font-semibold transition-colors ${
                role === "user"
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`flex-1 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                role === "employer"
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              Employer
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-800">Name</label>
          <input
            type="text"
            required={isSignUp}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="h-10 w-full rounded-full border border-zinc-200 px-3 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-800">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-10 w-full rounded-full border border-zinc-200 px-3 text-sm"
          />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-medium text-zinc-800">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSignUp ? "At least 8 characters" : "Your password"}
            minLength={isSignUp ? 8 : undefined}
            className="h-10 w-full rounded-full border border-zinc-200 px-3 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
      >
        {submitting
          ? isSignUp
            ? "Signing up…"
            : "Signing in…"
          : isSignUp
            ? "Sign up"
            : "Sign in"}
      </button>

      {error && (
        <p className="text-xs text-red-500">
          Error: {error}. Try again or use a different email.
        </p>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-zinc-600">
        <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
          className="font-semibold text-orange-600 hover:text-orange-700"
        >
          {isSignUp ? "Sign in" : "Sign up"}
        </button>
      </div>
    </form>
  );
}
