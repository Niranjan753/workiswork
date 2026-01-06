import type { Metadata } from "next";
import Link from "next/link";

import { JobsBoard } from "../../components/jobs/jobs-board";
import { Logo } from "../../components/Logo";

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
  return (
    <div className="min-h-screen bg-[#fde9d7] text-zinc-900">
      <header className="border-b border-orange-200 bg-[#fde9d7]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500">
              <Logo width={40} height={24} />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              WorkIsWork
            </span>
          </Link>
          <nav className="flex items-center gap-3 text-xs font-medium text-zinc-800">
            <Link href="/jobs" className="rounded-full bg-white px-3 py-1">
              Remote Jobs
            </Link>
            <Link href="/blog" className="px-3 py-1">
              Blog
            </Link>
            <Link href="/alerts" className="px-3 py-1">
              Job Alerts
            </Link>
            <Link href="/admin" className="px-3 py-1">
              For Employers
            </Link>
          </nav>
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/pricing"
              className="rounded-full border border-orange-400 bg-white px-3 py-1 font-semibold text-orange-700"
            >
              Unlock All Jobs
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-zinc-300 bg-white px-3 py-1 font-semibold"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <section className="mb-6 space-y-3 text-center">
          <h1 className="cooper-heading text-balance text-3xl font-[700] tracking-tight text-zinc-900 sm:text-[40px]">
            Find your dream remote job without the hassle
          </h1>
          <p className="text-xs text-zinc-600 sm:text-sm">
            Browse fully remote jobs from vetted companies and get more
            interviews.
          </p>
          {/* Centered search bar like Remotive */}
          <form
            action="/jobs"
            method="get"
            className="mx-auto mt-4 flex max-w-3xl items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 shadow-sm"
          >
            <input
              type="text"
              name="q"
              placeholder="Search Job Title or Company name..."
              className="h-10 flex-1 rounded-full border-none bg-transparent text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
              defaultValue={searchParams?.q || ""}
            />
            <button
              type="submit"
              className="h-8 rounded-full bg-orange-500 px-4 text-xs font-semibold text-white hover:bg-orange-600"
            >
              Search
            </button>
          </form>

          {/* Category pills row */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px]">
            {[
              "Software Development",
              "Customer Service",
              "Design",
              "Marketing",
              "Sales / Business",
              "Product",
              "Project Management",
              "AI / ML",
              "Data Analysis",
              "Devops / Sysadmin",
              "Finance",
              "Human Resources",
              "QA",
              "Writing",
              "Legal",
              "Medical",
              "Education",
              "All Others",
            ].map((label) => (
              <span
                key={label}
                className="rounded-full bg-white px-3 py-1 text-zinc-700 shadow-sm"
              >
                {label}
              </span>
            ))}
          </div>
        </section>

        <JobsBoard />
      </main>
    </div>
  );
}


