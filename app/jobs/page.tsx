import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { JobsBoard } from "../../components/jobs/jobs-board";
import { JobsSearchBar } from "../../components/jobs/search-bar";

export const metadata: Metadata = {
  title: "Remote Jobs Board – WorkIsWork",
  description:
    "Browse curated remote jobs across development, design, marketing, and more. Inspired by Remotive, built with Next.js.",
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
    <div className="min-h-screen bg-[#fde9d7] text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <section className="mb-6 space-y-3 text-center">
          <h1 className="cooper-heading text-balance text-3xl font-bold tracking-tight text-zinc-900 sm:text-[40px]">
            Find your dream remote job without the hassle
          </h1>
          <p className="text-xs text-zinc-600 sm:text-sm">
            Browse fully remote jobs from vetted companies and get more
            interviews.
          </p>
          {/* Centered search bar like Remotive */}
          <Suspense fallback={null}>
            <JobsSearchBar categories={categoryChips} />
          </Suspense>

          {/* Category pills row */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px]">
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
                  className={`rounded-full px-3 py-1 shadow-sm ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "bg-white text-zinc-700"
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


