import Link from "next/link";

import { db } from "../db";
import { categories, companies, jobs } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

async function getFeatured() {
  const featured = await db
    .select({
      id: jobs.id,
      slug: jobs.slug,
      title: jobs.title,
      location: jobs.location,
      postedAt: jobs.postedAt,
      companyName: companies.name,
      companyLogo: companies.logoUrl,
    })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(jobs.isFeatured, true))
    .orderBy(desc(jobs.postedAt))
    .limit(12);

  const allCategories = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      description: categories.description,
    })
    .from(categories)
    .orderBy(categories.name);

  return { featured, allCategories };
}

export default async function Home() {
  const { featured, allCategories } = await getFeatured();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/40">
              W
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                WorkIsWork
              </span>
              <span className="text-xs text-zinc-400">
                Remote jobs, curated daily.
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 text-sm text-zinc-300">
            <Link href="/jobs" className="hover:text-white">
              Jobs
            </Link>
            <Link href="/categories" className="hover:text-white">
              Categories
            </Link>
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>
            <Link href="/alerts" className="hover:text-white">
              Alerts
            </Link>
            <Link href="/admin" className="hover:text-white">
              Admin
            </Link>
          </nav>
        </header>

        <main className="mt-12 grid flex-1 gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <section className="space-y-10">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-1 rounded-full bg-emerald-400/5 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/30">
                100+ hand-picked remote jobs from the last 60 days.
              </p>
              <h1 className="max-w-xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Find your next <span className="text-emerald-300">remote</span>{" "}
                job. No noise.
              </h1>
              <p className="max-w-xl text-sm text-zinc-300 sm:text-base">
                WorkIsWork curates the best remote roles from across the web and
                delivers them in a fast, focused experience inspired by
                Remotive.
              </p>
              <SearchBar />
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span className="font-medium text-zinc-300">
                  Popular categories:
                </span>
                {allCategories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/jobs?category=${cat.slug}`}
                    className="rounded-full bg-zinc-900 px-3 py-1 hover:bg-zinc-800"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-zinc-200">
                  Featured remote roles
                </h2>
                <Link
                  href="/jobs?sort=date"
                  className="text-xs font-medium text-zinc-400 hover:text-white"
                >
                  View all jobs
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {featured.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.slug}`}
                    className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 transition hover:border-emerald-500/60 hover:bg-zinc-900"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-zinc-50 group-hover:text-emerald-200">
                          {job.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-zinc-400">
                          {job.companyName} • {job.location}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-400/40">
                        Featured
                      </span>
                    </div>
                  </Link>
                ))}
                {featured.length === 0 && (
                  <p className="text-sm text-zinc-400">
                    No featured jobs yet. Seed the database to get started.
                  </p>
                )}
              </div>
            </section>
          </section>

          <aside className="space-y-6 rounded-3xl border border-zinc-800/80 bg-zinc-900/70 p-6">
            <h2 className="text-sm font-semibold text-zinc-100">
              Weekly remote digest
            </h2>
            <p className="text-sm text-zinc-400">
              Get the best new remote jobs in your inbox every week. No spam,
              just signal.
            </p>
            <form className="space-y-3">
              <Input placeholder="you@example.com" type="email" />
              <Button type="submit" className="w-full">
                Subscribe for $9/mo
              </Button>
              <p className="text-[11px] text-zinc-500">
                Includes premium feeds and our remote career accelerator.
              </p>
            </form>
          </aside>
        </main>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <form
      action="/jobs"
      className="flex w-full flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 shadow-lg shadow-black/40 sm:flex-row sm:items-center sm:px-5 sm:py-4"
    >
      <Input
        name="q"
        placeholder="Search remote jobs (e.g. senior react, product designer)..."
        className="flex-1 border-none bg-transparent text-sm sm:text-base"
      />
      <div className="flex gap-2">
        <Button type="submit" className="w-full sm:w-auto">
          Search jobs
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="hidden border border-zinc-800/80 bg-zinc-950/60 text-xs text-zinc-200 hover:bg-zinc-900 sm:inline-flex"
        >
          Advanced filters
        </Button>
      </div>
    </form>
  );
}

