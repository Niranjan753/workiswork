import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JobsBoard } from "../../components/jobs/jobs-board";
import { JobsSearchBar } from "../../components/jobs/search-bar";
import { CategoryFilters } from "../../components/jobs/category-filters";
import { GridBackground } from "../../components/GridBackground";
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

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Clean Hero Section */}
      <section className="relative z-10 py-8 sm:py-16">
        <div className="mx-auto max-w-6xl px-2 sm:px-6 lg:px-8 relative z-10">
          <div className="text-left sm:text-center space-y-3 sm:space-y-4">
            <div className="relative z-10 flex justify-start sm:justify-center pt-4 sm:pt-12">
              <a
                href="https://t.me/workisworkxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs sm:text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-[#0088cc]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.192l-1.87 8.81c-.138.625-.497.778-.999.485l-2.755-2.03-1.33 1.277c-.146.146-.269.269-.553.269l.198-2.79 5.09-.46c.22-.02.22-.34.014-.46l-6.29-1.98c-.27-.085-.27-.27.04-.36l7.7-2.9c.32-.12.6.08.5.45z" />
                </svg>
                Join our Community on Telegram!
              </a>
            </div>
            <h1 className="text-4xl sm:text-6xl font-sans md:text-7xl font-bold tracking-tight text-foreground leading-none">
              The{" "}
              <span className="text-primary relative z-10">{"<quickest />"}</span>{" "}
              remote jobs and opportunities
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl sm:mx-auto font-medium leading-relaxed">
              There's no roadmap for making your own road. But here's some how-to's, helpful tips, and curated remote jobs to help you.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Start browsing below or grab the RSS.
            </p>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-8 pt-0 sm:px-6 lg:px-8 bg-background">
        <section className="mb-8 space-y-4">

          <div className="flex flex-col sm:flex-row sm:flex-nowrap items-center justify-center gap-3 pt-4">
            <Link
              href="/join"
              className="flex h-12 w-full sm:w-auto items-center justify-center rounded-md bg-primary px-8 text-lg font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Join
            </Link>
            <Suspense fallback={null}>
              <JobsSearchBar categories={categoryChips} />
            </Suspense>
          </div>


          <Suspense fallback={null}>
            <CategoryFilters categories={categoryChips} />
          </Suspense>
        </section>

        <Suspense fallback={null}>
          <JobsBoard />
        </Suspense>
      </main>
    </div>
  );
}
