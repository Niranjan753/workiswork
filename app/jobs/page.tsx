import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JobsBoard } from "../../components/jobs/jobs-board";
import { JobsSearchBar } from "../../components/jobs/search-bar";
import { CategoryFilters } from "../../components/jobs/category-filters";
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
      {/* Refined Hero Section with Original Content */}
      <section className="relative z-10 pt-4 pb-8 sm:pt-6 sm:pb-16 overflow-hidden">
        {/* Subtle Grid Background for Hero */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Telegram Pill */}
          <div className="flex justify-center">
            <a
              href="https://t.me/workisworkxyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 transition-all font-sans"
            >
              <svg
                className="w-4 h-4 text-[#0088cc]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.192l-1.87 8.81c-.138.625-.497.778-.999.485l-2.755-2.03-1.33 1.277c-.146.146-.269.269-.553.269l.198-2.79 5.09-.46c.22-.02.22-.34.014-.46l-6.29-1.98c-.27-.085-.27-.27.04-.36l7.7-2.9c.32-.12.6.08.5.45z" />
              </svg>
              Join our Community on Telegram!
            </a>
          </div>

          {/* Headline - Smaller as requested */}
          <h1 className="text-8xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] max-w-8xl mx-auto font-sans">
            The <span className="text-primary">quickest</span> remote jobs and opportunities
          </h1>

          {/* Subheader - Original Content */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed font-sans">
            There&apos;s no roadmap for making your own road. But here&apos;s some how-to&apos;s, helpful tips, and curated remote jobs to help you.
          </p>

          {/* Social Proof (kept for design, updated text) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=WIW-${i}`}
                    alt={`User ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-foreground font-sans">
              <span>Trusted by talented remotes worldwide</span>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-8 pt-0 sm:px-6 lg:px-8 bg-background">
        <section className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:flex-nowrap items-center justify-center gap-3 pt-0">
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
