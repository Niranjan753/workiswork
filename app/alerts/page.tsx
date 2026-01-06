import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "../../lib/auth-server";
import { AlertsForm } from "../../components/alerts/alerts-form";

export const metadata: Metadata = {
  title: "Job Alerts – WorkIsWork",
  description:
    "Create custom remote job alerts and get new matching roles emailed to you.",
};

export default async function AlertsPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/alerts");
  }

  // Check if user is a regular user (not employer)
  const userRow = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((rows) => rows[0]);

  if (!userRow || userRow.role === "employer") {
    return (
      <div className="min-h-screen bg-[#fde9d7] text-zinc-900">
        <main className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-orange-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-zinc-900">
              Job Seeker access required
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              This page is only available for job seekers. Employers can post jobs from the admin page.
            </p>
            <div className="mt-6">
              <Link
                href="/admin"
                className="block w-full rounded-full bg-orange-500 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-orange-600"
              >
                Go to Employer Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fde9d7] text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <section className="mb-6 space-y-3 text-center">
          <h1 className="cooper-heading text-balance text-3xl font-bold tracking-tight text-zinc-900 sm:text-[32px]">
            Never miss a great remote job
          </h1>
          <p className="text-xs text-zinc-600 sm:text-sm">
            Pick the skills you care about and we&apos;ll send you curated
            roles when they go live.
          </p>
        </section>

        <AlertsForm />
      </main>
    </div>
  );
}


