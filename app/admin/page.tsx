import type { Metadata } from "next";
import { db } from "../../db";
import { categories, users } from "../../db/schema";
import { AdminJobForm } from "../../components/admin/job-form";
import { Footer } from "../../components/Footer";
import { GridBackground } from "../../components/GridBackground";
import { getServerSession } from "../../lib/auth-server";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { getSiteUrl, getOgImageUrl } from "../../lib/site-url";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Admin – Create Remote Jobs | WorkIsWork",
  description: "Curate and publish remote jobs to the WorkIsWork board.",
  openGraph: {
    type: "website",
    url: `${siteUrl}/admin`,
    title: "Admin – Create Remote Jobs | WorkIsWork",
    description: "Curate and publish remote jobs to the WorkIsWork board.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "WorkIsWork Admin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admin – Create Remote Jobs | WorkIsWork",
    description: "Curate and publish remote jobs to the WorkIsWork board.",
    images: [ogImage],
  },
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
      <div className="relative flex min-h-screen flex-col bg-white text-black overflow-hidden">
        <GridBackground />
        <header className="border-b-2 border-black bg-yellow-400">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link href="/jobs" className="text-sm font-bold text-black hover:underline">
              ← Back to jobs
            </Link>
          </div>
        </header>
        <main className="flex-1 mx-auto max-w-5xl px-4 py-16 sm:px-6 bg-white">
          <div className="rounded-2xl border-2 border-black bg-white p-8 text-center shadow-lg">
            <h1 className="text-xl font-bold text-black">
              Company login required
            </h1>
            <p className="mt-2 text-sm text-black/80 font-medium">
              Log in to continue to company onboarding and job posting.
            </p>
            <div className="mt-6">
              <Link
                href="/login?callbackUrl=/admin&role=employer"
                className="block w-full rounded-full bg-black px-4 py-2 text-center text-sm font-bold text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all shadow-md"
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
      <div className="relative flex min-h-screen flex-col bg-white text-black overflow-hidden">
        <GridBackground />
        <header className="border-b-2 border-black bg-yellow-400">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link href="/jobs" className="text-sm font-bold text-black hover:underline">
              ← Back to jobs
            </Link>
          </div>
        </header>
        <main className="flex-1 mx-auto max-w-5xl px-4 py-16 sm:px-6 bg-white">
          <div className="rounded-2xl border-2 border-black bg-white p-8 text-center shadow-lg">
            <h1 className="text-xl font-bold text-black">
              Employer access required
            </h1>
            <p className="mt-2 text-sm text-black/80 font-medium">
              You need to be logged in as an employer to access this page.
            </p>
            <div className="mt-6">
              <Link
                href="/login?callbackUrl=/admin&role=employer"
                className="block w-full rounded-full bg-black px-4 py-2 text-center text-sm font-bold text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all shadow-md"
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
    <div className="relative flex min-h-screen flex-col bg-white text-black overflow-hidden">
      <GridBackground />
      <header className="border-b-2 border-black bg-yellow-400">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/jobs" className="text-sm font-bold text-black hover:underline">
            ← Back to jobs
          </Link>
          <span className="text-xs text-black/80 font-medium">
            Simple admin – add jobs directly to the board
          </span>
        </div>
      </header>

      {/* Main Content - White */}
      <main className="flex-1 mx-auto max-w-5xl px-4 py-8 sm:px-6 bg-white">
        <div className="mb-6">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-black px-4 py-2 text-sm font-bold text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all shadow-lg"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            View All Users & Emails
          </Link>
        </div>
        <AdminJobForm categories={cats} />
      </main>
    </div>
  );
}


