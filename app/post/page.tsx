import type { Metadata } from "next";
import { db } from "../../db";
import { categories } from "../../db/schema";
import { AdminJobForm } from "../../components/admin/job-form";
import { Footer } from "../../components/Footer";
import { GridBackground } from "../../components/GridBackground";
import Link from "next/link";
import { getSiteUrl, getOgImageUrl } from "../../lib/site-url";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Post a Job – WorkIsWork",
  description: "Post your remote job to the WorkIsWork board.",
  openGraph: {
    type: "website",
    url: `${siteUrl}/post`,
    title: "Post a Job – WorkIsWork",
    description: "Post your remote job to the WorkIsWork board.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "WorkIsWork Post a Job",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Post a Job – WorkIsWork",
    description: "Post your remote job to the WorkIsWork board.",
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

export default async function PostJobPage() {
  const cats = await getCategories();

  return (
    <div className="relative flex min-h-screen flex-col bg-white text-black overflow-hidden">
      <GridBackground />
      <header className="relative z-10 border-b-2 border-black bg-yellow-400">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/jobs" className="text-sm font-bold text-black hover:underline">
            ← Back to jobs
          </Link>
        </div>
      </header>

      {/* Main Content - White */}
      <main className="relative z-10 flex-1 mx-auto max-w-5xl px-4 py-8 sm:px-6 bg-white">
        <AdminJobForm categories={cats} />
      </main>
    </div>
  );
}

