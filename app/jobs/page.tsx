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

export default function JobsPage() {
  const categoryChips: { label: string; slug: string }[] = [
    { label: "All Jobs", slug: "" },
    { label: "Frontend Developer", slug: "frontend" },
    { label: "Backend Developer", slug: "backend" },
    { label: "Full Stack Developer", slug: "full-stack" },
    { label: "Blockchain Developer", slug: "blockchain" },
    { label: "Smart Contract Developer", slug: "smart-contract" },
    { label: "Designer", slug: "design" },
    { label: "Sales & Marketing", slug: "sales" },
    { label: "Product Manager", slug: "product" },
    { label: "Customer Support", slug: "customer-support" },
    { label: "InfoSec Engineer", slug: "infosec" },
    { label: "Management & Finance", slug: "finance" },
    { label: "No-Code Developer", slug: "no-code" },
    { label: "DevOps Engineer", slug: "devops" },
    { label: "Community Manager", slug: "community-manager" },
    { label: "Writer", slug: "writing" },
    { label: "Non-Tech", slug: "non-tech" },
  ];

  return (
    <div className="relative min-h-screen bg-white text-zinc-900 selection:bg-white">

      <section className="relative z-10 pt-12 pb-12 sm:pt-12 sm:pb-12 text-center px-4 bg-white">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(100,92,255,0.05)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="mx-auto max-w-5xl space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 leading-[1.1]">
            The best remote Job Board
          </h1>

          <p className="text-base sm:text-lg text-zinc-500 max-w-3xl mx-auto leading-relaxed font-medium">
            Browse 110,000+ fully remote jobs from vetted companies and get more jobs interviews.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            <Link
              href="/hire"
              className="px-8 py-3 rounded-full bg-zinc-100 text-sm font-bold text-zinc-900 hover:bg-zinc-200 transition-all border border-zinc-200"
            >
              Hire Remote Talent
            </Link>
            <Link
              href="#jobs"
              className="px-8 py-3 rounded-full bg-zinc-950 text-sm font-bold text-white hover:bg-zinc-800 transition-all shadow-lg"
            >
              View all 110,000+ jobs
            </Link>
            <Link
              href="/join"
              className="px-8 py-3 rounded-full bg-primary text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(100,92,255,0.2)]"
            >
              Join for Free
            </Link>
          </div>
        </div>
      </section>


      <main className="mx-auto max-w-7xl px-4 pb-24 space-y-20">

        <div className="relative mx-auto max-w-6xl rounded-[2.5rem] bg-primary px-6 py-10 sm:px-12 sm:py-12 overflow-hidden shadow-[0_16px_60px_-20px_rgba(100,92,255,0.35)]">

          <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,white_20px,white_21px)]" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-5">

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Find a high paying remote job
              </h2>
              <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto font-medium">
                Enjoy remote work, better work-life balance, and top salaries from top companies.
              </p>
            </div>

            <form className="w-full max-w-md flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 px-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all font-medium"
              />
              <button
                type="submit"
                className="h-12 px-6 bg-white text-zinc-950 font-semibold rounded-xl hover:bg-zinc-100 active:scale-[0.97] transition-all shadow-lg whitespace-nowrap"
              >
                Subscribe →
              </button>
            </form>

          </div>
        </div>

        {/* Job Board Section */}
        <section id="jobs" className="space-y-16 pt-8">

          <div className="space-y-12">
            <div className="w-full max-w-4xl mx-auto px-4">
              <Suspense fallback={null}>
                <JobsSearchBar categories={categoryChips} />
              </Suspense>
            </div>

            <div className="flex flex-col items-center gap-8">
              <Suspense fallback={null}>
                <CategoryFilters categories={categoryChips} />
              </Suspense>
            </div>
          </div>

          <Suspense fallback={null}>
            <JobsBoard />
          </Suspense>

        </section>
      </main>


    </div>
  );
}
