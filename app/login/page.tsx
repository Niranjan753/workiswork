import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in – WorkIsWork",
  description: "Sign in to manage your saved jobs and alerts.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fde9d7] text-zinc-900">
      <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-12 pt-16 sm:px-6">
        <h1 className="text-xl font-semibold text-zinc-900">Log in</h1>
        <p className="text-sm text-zinc-600">
          Authentication for saved jobs and alerts is coming soon.
        </p>
      </main>
    </div>
  );
}


