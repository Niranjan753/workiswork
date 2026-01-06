import type { Metadata } from "next";
import Link from "next/link";

import { JobsBoard } from "../../components/jobs/jobs-board";

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
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-base font-bold text-white">
              R
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Remotive-ish
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
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Find your dream remote job without the hassle
          </h1>
          <p className="text-xs text-zinc-600 sm:text-sm">
            Browse fully remote jobs from vetted companies and get more
            interviews.
          </p>
        </section>

        <JobsBoard />
      </main>
    </div>
  );
}


