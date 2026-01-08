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
  tags: string[] | null;
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
  const activeCategories = searchParams.getAll("category").filter(Boolean);
  const [location, setLocation] = React.useState(
    searchParams.get("location") ?? "",
  );
  const [jobTypes, setJobTypes] = React.useState<string[]>(
    searchParams.getAll("job_type"),
  );
  const [optimised, setOptimised] = React.useState(false);

  const queryKey = React.useMemo(
    () => ["jobs", { q, location, jobTypes, activeCategories }],
    [q, location, jobTypes, activeCategories],
  );

  const fetchJobs = React.useCallback(
    async ({ pageParam = 1 }): Promise<JobsResponse> => {
      const params = new URLSearchParams();
      params.set("page", String(pageParam));
      params.set("limit", "20");
      if (q) params.set("q", q);
      if (location) params.set("location", location);
      activeCategories.forEach((cat) => params.append("category", cat));
      jobTypes.forEach((jt) => params.append("job_type", jt));

      const res = await fetch(`/api/jobs${buildQueryString(params)}`);
      if (!res.ok) {
        throw new Error("Failed to load jobs");
      }
      return res.json();
    },
    [q, location, jobTypes, activeCategories],
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

  async function handleOptimise() {
    try {
      const res = await fetch("/api/user/preferences");
      if (!res.ok) return;
      const json = await res.json();
      const prefs = json.preferences as
        | { answersByQuestionId?: Record<string, string[]> }
        | null;
      if (!prefs || !prefs.answersByQuestionId) return;

      const answers = prefs.answersByQuestionId;
      const roleAnswers = answers["1"] ?? [];
      const skillAnswers = answers["2"] ?? [];

      const qString = [...roleAnswers, ...skillAnswers].join(" ").trim();
      if (!qString) return;

      const params = new URLSearchParams();
      params.set("q", qString);

      router.push(`/jobs${buildQueryString(params)}`);
      setOptimised(true);
    } catch {
      // Fail silently – optimisation is a progressive enhancement
    }
  }

  return (
    <div className="grid gap-6 mt-20 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Filters */}
      <aside className="space-y-6 border-2 border-black bg-white p-4 text-sm text-black">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-yellow-900">
            I want to work remotely from...
          </p>
          <div className="space-y-1">
            {COUNTRIES.map((country) => (
              <label key={country} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="country"
                  value={country}
                  checked={location === country}
                  onChange={(e) =>
                    setLocation(e.target.checked ? country : "")
                  }
                  className="h-3 w-3 accent-yellow-500"
                />
                <span className="text-xs">{country}</span>
              </label>
            ))}
            <button
              type="button"
              className="mt-1 text-[11px] font-medium text-yellow-700 cursor-pointer underline"
              onClick={() => setLocation("")}
            >
              Clear location
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-yellow-900">
            Employment types
          </p>
          <div className="space-y-1">
            {EMPLOYMENT_TYPES.map((type) => (
              <label key={type.value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  value={type.value}
                  checked={jobTypes.includes(type.value)}
                  onChange={() => toggleJobType(type.value)}
                  className="h-3 w-3 accent-yellow-500"
                />
                <span className="text-xs capitalize">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/join"
            className="block w-full text-center border-2 border-black bg-yellow-400 px-4 py-2 text-sm font-bold text-black shadow-md hover:bg-yellow-500 transition-colors"
          >
            Join
          </Link>
        </div>
      </aside>

      {/* Main list */}
      <section className="space-y-3">
        {/* Top bar - Gumroad style */}
        <div className="flex flex-col gap-4 bg-white border-2 border-black p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/pricing"
              className="px-4 py-2 bg-black text-white text-sm font-bold hover:bg-gray-900 transition-colors"
            >
              Unlock All Jobs
            </Link>
            <Link
              href="/alerts"
              className="px-4 py-2 border-2 border-black text-black text-sm font-bold hover:bg-black hover:text-white transition-colors"
            >
              Create Job Alert
            </Link>
            <button
              type="button"
              onClick={handleOptimise}
              disabled={optimised}
              className={cn(
                "px-4 py-2 border-2 border-black cursor-pointer text-sm font-bold transition-colors",
                optimised
                  ? "bg-yellow-400 text-black"
                  : "text-black hover:bg-black hover:text-white",
              )}
            >
              {optimised ? "Optimised" : "Optimise"}
            </button>
          </div>
          <p className="text-sm font-medium text-black/60">
            {total.toLocaleString()} matching jobs
          </p>
        </div>

        {/* Jobs list - Gumroad style */}
        <div className="space-y-4">
          {isLoading && <p className="px-3 py-4 text-sm font-medium">Loading jobs…</p>}
          {isError && (
            <p className="px-3 py-4 text-sm font-medium text-red-600">
              Failed to load jobs. Please try again.
            </p>
          )}
          {!isLoading && jobs.length === 0 && (
            <p className="px-3 py-4 text-sm font-medium text-black/40">
              No jobs match your filters yet.
            </p>
          )}

          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.slug}`}
              className={cn(
                "block bg-white border-2 border-black p-6 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1",
                job.isFeatured && "bg-gray-50"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <h3 className="text-lg font-black text-black leading-tight">
                    {job.title}
                  </h3>
                  <p className="text-sm font-medium text-black/70">
                    {job.companyName ?? "Remote company"} • {job.location ?? "Remote"}
                  </p>
                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {job.tags.slice(0, 6).map((tag) => (
                        <span
                          key={tag}
                          className="border-2 border-black bg-yellow-400 px-2 py-1 text-[11px] font-bold text-black shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-black/50">
                      {job.jobType.replace("_", " ")}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-black/50">
                      {job.remoteScope}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="inline-block px-4 py-2 bg-black text-white text-sm font-bold hover:bg-gray-900 transition-colors">
                    View job →
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {hasNextPage && (
            <div className="flex justify-center pt-6">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-3 border-2 border-black text-black text-sm font-bold hover:bg-black hover:text-white cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFetchingNextPage ? "Loading more…" : "Load more jobs"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

