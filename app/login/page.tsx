import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "../../components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in – WorkIsWork",
  description: "Sign in to save jobs and manage your alerts.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fde9d7] text-zinc-900">
      <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-12 pt-16 sm:px-6">
        <Link href="/jobs" className="text-xs font-semibold text-zinc-700">
          ← Back to jobs
        </Link>

        <div>
          <h1 className="mt-2 text-xl font-semibold text-zinc-900">
            Log in to WorkIsWork
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Use the same login for{" "}
            <span className="font-medium">job alerts, saved jobs</span>, and
            employer posting.
          </p>
        </div>

        <Suspense fallback={<div className="text-sm text-zinc-600">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}

