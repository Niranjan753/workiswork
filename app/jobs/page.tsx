import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JobsBoard } from "../../components/jobs/jobs-board";
import { JobsSearchBar } from "../../components/jobs/search-bar";
import { getSiteUrl, getOgImageUrl } from "../../lib/site-url";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Remote Jobs Board – WorkIsWork",
  description: "Discover curated remote jobs in software development, design, marketing, and more. Built for remote-first teams and talent",
  openGraph: {
    type: "website",
    url: `${siteUrl}/jobs`,
    title: "Remote Jobs Board – WorkIsWork",
    description: "Discover curated remote jobs in software development, design, marketing, and more. Built for remote-first teams and talent",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "WorkIsWork - Remote Jobs Board",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote Jobs Board – WorkIsWork",
    description: "Discover curated remote jobs in software development, design, marketing, and more. Built for remote-first teams and talent",
    images: [ogImage],
  },
};

export default function JobsPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
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

  const activeCategory = (searchParams as any)?.category || "";
  const q = searchParams?.q || "";

  return (
    <div className="min-h-screen bg-yellow-400 text-black">
      {/* Gumroad-style Hero Section */}
      <section className="relative bg-yellow-400 py-12 sm:py-16 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-black leading-none">
              The latest remote jobs and opportunities
            </h1>
            <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto font-medium leading-relaxed">
              There's no roadmap for making your own road. But here's some how-to's, helpful tips, and curated remote jobs to help you.
            </p>
            <p className="text-sm text-black/70 font-medium">
              Start browsing below or grab the RSS.
            </p>
          </div>
        </div>
        {/* Speech bubbles removed as requested */}
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-8 pt-0 sm:px-6 lg:px-8">
        <section className="mb-4 space-y-4">
          {/* Centered search bar */}
          <div className="flex justify-center pt-2">
            <Suspense fallback={null}>
              <JobsSearchBar categories={categoryChips} />
            </Suspense>
          </div>

          {/* Category pills row - Gumroad style */}
          <div className="flex flex-wrap justify-center gap-2">
            {categoryChips.map(({ label, slug }) => {
              const params = new URLSearchParams();
              if (q) params.set("q", q);
              if (slug !== "all-others") params.set("category", slug);

              const href = `/jobs${params.toString() ? `?${params.toString()}` : ""}`;
              const isActive = activeCategory === slug;

              return (
                <Link
                  key={slug}
                  href={href}
                  className={`px-4 py-2 text-sm font-bold transition-all border-2 border-black ${
                    isActive
                      ? "bg-black text-yellow-400"
                      : "bg-white text-black hover:bg-yellow-100"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </section>

        <Suspense fallback={null}>
          <JobsBoard />
        </Suspense>
      </main>
    </div>
  );
}

