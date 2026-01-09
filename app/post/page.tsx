import type { Metadata } from "next";
import { db } from "../../db";
import { categories } from "../../db/schema";
import { inArray } from "drizzle-orm";
import { AdminJobForm } from "../../components/admin/job-form";
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

// Use the same categories as the jobs page
const categoryChips: { label: string; slug: string }[] = [
  { label: "Software Development", slug: "software-development" },
  { label: "Customer Service", slug: "customer-support" },
  { label: "Design", slug: "design" },
  { label: "Marketing", slug: "marketing" },
  { label: "Sales / Business", slug: "sales" },
  { label: "Product", slug: "product" },
  { label: "Project Management", slug: "project" },
  { label: "AI / ML", slug: "ai-ml" },
  { label: "Data Analysis", slug: "data-analysis" },
  { label: "Devops / Sysadmin", slug: "devops" },
  { label: "Finance", slug: "finance" },
  { label: "Human Resources", slug: "human-resources" },
  { label: "QA", slug: "qa" },
  { label: "Writing", slug: "writing" },
  { label: "Legal", slug: "legal" },
  { label: "Medical", slug: "medical" },
  { label: "Education", slug: "education" },
  { label: "All Others", slug: "all-others" },
];

async function getCategories() {
  // Get categories from database that match the slugs from categoryChips
  const slugs = categoryChips.map(c => c.slug);
  const rows = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
    })
    .from(categories)
    .where(inArray(categories.slug, slugs));
    
  // Map categoryChips to database categories, creating a merged list
  const mergedCategories = categoryChips.map(chip => {
    const dbCategory = rows.find(c => c.slug === chip.slug);
    return {
      id: dbCategory?.id || 0,
      slug: chip.slug,
      name: chip.label, // Use the label from categoryChips
    };
  });
  
  return mergedCategories;
}

// Notice removed per instructions (was RemotiveDistributionNotice)

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
        {/* RemotiveDistributionNotice removed */}
        <AdminJobForm categories={cats} />
      </main>
    </div>
  );
}

