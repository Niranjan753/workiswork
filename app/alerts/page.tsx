import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "../../lib/auth-server";
import { AlertsForm } from "../../components/alerts/alerts-form";
import { GridBackground } from "../../components/GridBackground";
import { getSiteUrl, getOgImageUrl } from "../../lib/site-url";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Job Alerts – WorkIsWork",
  description: "Create custom remote job alerts and get new matching roles emailed to you.",
  openGraph: {
    type: "website",
    url: `${siteUrl}/alerts`,
    title: "Job Alerts – WorkIsWork",
    description: "Create custom remote job alerts and get new matching roles emailed to you.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "WorkIsWork Job Alerts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Alerts – WorkIsWork",
    description: "Create custom remote job alerts and get new matching roles emailed to you.",
    images: [ogImage],
  },
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
      <div className="relative min-h-screen bg-yellow-400 text-black overflow-hidden">
        <GridBackground />
        <main className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border-2 border-black bg-yellow-500 p-8 text-center shadow-lg">
            <h1 className="text-xl font-bold text-black">
              Job Seeker access required
            </h1>
            <p className="mt-2 text-sm text-black/80 font-medium">
              This page is only available for job seekers. Employers can post jobs from the admin page.
            </p>
            <div className="mt-6">
              <Link
                href="/admin"
                className="block w-full rounded-full bg-black px-4 py-2 text-center text-sm font-bold text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all shadow-md"
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
    <div className="relative min-h-screen bg-white text-black overflow-hidden">
      <GridBackground />
      {/* Hero Section - Yellow */}
      <section className="relative z-10 bg-yellow-400 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-black leading-none mb-6">
            Never miss a great remote job
          </h1>
          <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto font-medium">
            Pick the skills you care about and we&apos;ll send you curated roles when they go live.
          </p>
        </div>
        </section>

      {/* Main Content - White */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 bg-white">
        <AlertsForm />
      </main>
    </div>
  );
}


