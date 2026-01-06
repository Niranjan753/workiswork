import type { Metadata } from "next";
import { db } from "../../db";
import { categories } from "../../db/schema";
import { AdminJobForm } from "../../components/admin/job-form";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin – Create Remote Jobs | WorkIsWork",
  description: "Curate and publish remote jobs to the WorkIsWork board.",
};

async function getCategories() {
  const rows = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
    })
    .from(categories);
  return rows;
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions as any);
  const cats = await getCategories();

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <header className="border-b border-zinc-200 bg-white/80">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link href="/jobs" className="text-sm font-semibold">
              ← Back to jobs
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-orange-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-zinc-900">
              Company login required
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Log in to continue to company onboarding and job posting.
            </p>
            <form
              action="/api/auth/signin/credentials"
              method="post"
              className="mt-6 space-y-3"
            >
              <input
                type="hidden"
                name="callbackUrl"
                value="/admin"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-medium">Name</label>
                  <input
                    name="name"
                    required
                    className="h-10 w-full rounded-full border border-zinc-200 px-3 text-sm"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-xs font-medium">Company email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="h-10 w-full rounded-full border border-zinc-200 px-3 text-sm"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Continue
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/jobs" className="text-sm font-semibold">
            ← Back to jobs
          </Link>
          <span className="text-xs text-zinc-500">
            Simple admin – add jobs directly to the board
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <AdminJobForm categories={cats} />
      </main>
    </div>
  );
}


