"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import Link from "next/link";

type Job = {
  id: number;
  slug: string;
  title: string;
  location: string | null;
  salaryMin: string | null;
  salaryMax: string | null;
  salaryCurrency: string | null;
  jobType: string;
  remoteScope: string;
  isFeatured: boolean;
  isPremium: boolean;
  postedAt: string | null;
  companyName: string | null;
  companyLogo: string | null;
  categorySlug: string | null;
};

type JobsResponse = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  jobs: Job[];
};

const COUNTRIES = ["USA", "UK", "Germany", "France", "Canada", "Spain"];

const EMPLOYMENT_TYPES: { value: string; label: string }[] = [
  { value: "contract", label: "contract" },
  { value: "freelance", label: "freelance" },
  { value: "full_time", label: "full-time" },
  { value: "part_time", label: "part-time" },
  { value: "internship", label: "internship" },
];

function buildQueryString(params: URLSearchParams) {
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function JobsBoard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") ?? "";
  const activeCategory = searchParams.get("category") ?? "";
  const [location, setLocation] = React.useState(
    searchParams.get("location") ?? "",
  );
  const [jobTypes, setJobTypes] = React.useState<string[]>(
    searchParams.getAll("job_type"),
  );

  const queryKey = React.useMemo(
    () => ["jobs", { q, location, jobTypes, activeCategory }],
    [q, location, jobTypes, activeCategory],
  );

  const fetchJobs = React.useCallback(
    async ({ pageParam = 1 }): Promise<JobsResponse> => {
      const params = new URLSearchParams();
      params.set("page", String(pageParam));
      params.set("limit", "20");
      if (q) params.set("q", q);
      if (location) params.set("location", location);
      if (activeCategory) params.set("category", activeCategory);
      jobTypes.forEach((jt) => params.append("job_type", jt));

      const res = await fetch(`/api/jobs${buildQueryString(params)}`);
      if (!res.ok) {
        throw new Error("Failed to load jobs");
      }
      return res.json();
    },
    [q, location, jobTypes, activeCategory],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey,
    queryFn: fetchJobs,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  const total = data?.pages?.[0]?.total ?? 0;
  const jobs = data?.pages.flatMap((p) => p.jobs) ?? [];

  function toggleJobType(value: string) {
    setJobTypes((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Filters */}
      <aside className="space-y-6 rounded-xl border border-orange-200/60 bg-orange-50/80 p-4 text-sm text-zinc-800">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-900">
            I want to work remotely from...
          </p>
          <div className="space-y-1">
            {COUNTRIES.map((country) => (
              <label key={country} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="country"
                  value={country}
                  checked={location === country}
                  onChange={(e) =>
                    setLocation(e.target.checked ? country : "")
                  }
                  className="h-3 w-3 accent-orange-500"
                />
                <span className="text-xs">{country}</span>
              </label>
            ))}
            <button
              type="button"
              className="mt-1 text-[11px] font-medium text-orange-700 underline"
              onClick={() => setLocation("")}
            >
              Clear location
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-900">
            Employment types
          </p>
          <div className="space-y-1">
            {EMPLOYMENT_TYPES.map((type) => (
              <label key={type.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={type.value}
                  checked={jobTypes.includes(type.value)}
                  onChange={() => toggleJobType(type.value)}
                  className="h-3 w-3 accent-orange-500"
                />
                <span className="text-xs capitalize">{type.label}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main list */}
      <section className="space-y-3">
        {/* Top bar */}
        <div className="flex flex-col gap-3 rounded-xl border border-orange-200/80 bg-white/90 p-3 text-xs text-zinc-800 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="rounded-lg bg-orange-500 px-3 py-1 text-xs font-semibold text-white hover:bg-orange-600"
            >
              Unlock All Jobs
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg border-orange-300 px-3 py-1 text-xs font-semibold text-orange-700 hover:bg-orange-50"
              asChild
            >
              <Link href="/alerts">Create Custom Job Alert</Link>
            </Button>
          </div>
          <p className="text-[11px] text-zinc-500">
            {total.toLocaleString()} matching jobs
          </p>
        </div>

        {/* Jobs list */}
        <div className="space-y-2 rounded-xl border border-orange-200/80 bg-white/90 p-2">
          {isLoading && <p className="px-3 py-4 text-xs">Loading jobs…</p>}
          {isError && (
            <p className="px-3 py-4 text-xs text-red-500">
              Failed to load jobs. Please try again.
            </p>
          )}
          {!isLoading && jobs.length === 0 && (
            <p className="px-3 py-4 text-xs text-zinc-500">
              No jobs match your filters yet.
            </p>
          )}

          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.slug}`}
              className={cn(
                "block rounded-lg border px-3 py-3 text-xs transition",
                job.isFeatured
                  ? "border-orange-300 bg-orange-50/80"
                  : "border-zinc-200 bg-white hover:bg-orange-50/60",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0 space-y-1">
                  <p className="truncate text-[13px] font-semibold text-zinc-900">
                    {job.title}
                  </p>
                  <p className="truncate text-[11px] text-zinc-600">
                    {job.companyName ?? "Remote company"} •{" "}
                    {job.location ?? "Remote"}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {job.jobType.replace("_", " ")} • {job.remoteScope}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="rounded-full bg-orange-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-orange-600"
                >
                  View job
                </Button>
              </div>
            </Link>
          ))}

          {hasNextPage && (
            <div className="flex justify-center border-t border-orange-100 pt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-full border-orange-300 cursor-pointer px-4 py-1 text-xs font-semibold text-orange-700 hover:bg-orange-50"
              >
                {isFetchingNextPage ? "Loading more…" : "Load more jobs"}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


