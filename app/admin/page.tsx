import type { Metadata } from "next";
import { db } from "../../db";
import { categories, users } from "../../db/schema";
import { AdminJobForm } from "../../components/admin/job-form";
import { Footer } from "../../components/Footer";
import { getServerSession } from "../../lib/auth-server";
import { eq } from "drizzle-orm";
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
  const session = await getServerSession();
  const cats = await getCategories();

  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
        <header className="border-b border-zinc-200 bg-white/80">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link href="/jobs" className="text-sm font-semibold">
              ← Back to jobs
            </Link>
          </div>
        </header>
        <main className="flex-1 mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-orange-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-zinc-900">
              Company login required
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Log in to continue to company onboarding and job posting.
            </p>
            <div className="mt-6">
              <Link
                href="/login?callbackUrl=/admin&role=employer"
                className="block w-full rounded-full bg-orange-500 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-orange-600"
              >
                Log in as Employer
              </Link>
            </div>
          </div>
        </main>
        <Footer variant="light" />
      </div>
    );
  }

  // Check if user is an employer
  const userRow = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((rows) => rows[0]);

  if (!userRow || userRow.role !== "employer") {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
        <header className="border-b border-zinc-200 bg-white/80">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link href="/jobs" className="text-sm font-semibold">
              ← Back to jobs
            </Link>
          </div>
        </header>
        <main className="flex-1 mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-orange-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-zinc-900">
              Employer access required
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              You need to be logged in as an employer to access this page.
            </p>
            <div className="mt-6">
              <Link
                href="/login?callbackUrl=/admin&role=employer"
                className="block w-full rounded-full bg-orange-500 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-orange-600"
              >
                Log in as Employer
              </Link>
            </div>
          </div>
        </main>
        <Footer variant="light" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
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

      <main className="flex-1 mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <AdminJobForm categories={cats} />
      </main>

      <Footer variant="light" />
    </div>
  );
}


