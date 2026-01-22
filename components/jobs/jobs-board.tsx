"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import * as React from "react";
import { cn } from "../../lib/utils";
import Link from "next/link";
import { LockOpen } from "lucide-react";

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

  postedAt: string | null;
  companyName: string | null;
  companyLogo: string | null;
  categorySlug: string | null;
  tags: string[] | null;
};

type JobsResponse = {
  total: number;
  jobs: Job[];
};

type Company = {
  id: number;
  slug: string;
  name: string;
  websiteUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  location: string | null;
  logoUrl: string | null;
  createdAt: string | null;
};

type CompaniesResponse = {
  total: number;
  companies: Company[];
};

const EMPLOYMENT_TYPES = [
  { value: "contract", label: "contract" },
  { value: "freelance", label: "freelance" },
  { value: "full_time", label: "full-time" },
  { value: "part_time", label: "part-time" },
  { value: "internship", label: "internship" },
];

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffMs / 604800000);
  const diffMonths = Math.floor(diffMs / 2592000000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `about ${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `about ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `about ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffWeeks < 4) return `about ${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  return `about ${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
}

function buildQueryString(params: URLSearchParams) {
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function JobsBoard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") ?? "";
  const activeCategories = searchParams.getAll("category");
  const remoteScope = searchParams.get("remote_scope") ?? "";
  const minSalary = searchParams.get("min_salary") ?? "";

  const [jobTypes, setJobTypes] = React.useState<string[]>(
    searchParams.getAll("job_type"),
  );
  const [optimised, setOptimised] = React.useState(
    searchParams.get("optimised") === "true",
  );
  const [viewMode, setViewMode] = React.useState<"jobs" | "companies">("jobs");

  React.useEffect(() => {
    setJobTypes(searchParams.getAll("job_type"));
    setOptimised(searchParams.get("optimised") === "true");
  }, [searchParams]);

  const jobsQuery = useQuery({
    queryKey: ["jobs", q, jobTypes, activeCategories, remoteScope, minSalary],
    queryFn: async (): Promise<JobsResponse> => {
      const params = new URLSearchParams();
      params.set("limit", "1000");
      if (q) params.set("q", q);
      activeCategories.forEach((c) => params.append("category", c));
      jobTypes.forEach((t) => params.append("job_type", t));
      if (remoteScope) params.set("remote_scope", remoteScope);
      if (minSalary) params.set("min_salary", minSalary);

      const res = await fetch(`/api/jobs${buildQueryString(params)}`);
      if (!res.ok) throw new Error("Failed to load jobs");
      return res.json();
    },
    enabled: viewMode === "jobs",
  });

  const companiesQuery = useQuery({
    queryKey: ["companies", q],
    queryFn: async (): Promise<CompaniesResponse> => {
      const params = new URLSearchParams();
      params.set("limit", "1000");
      if (q) params.set("q", q);

      const res = await fetch(`/api/companies${buildQueryString(params)}`);
      if (!res.ok) throw new Error("Failed to load companies");
      return res.json();
    },
    enabled: viewMode === "companies",
  });

  function toggleJobType(value: string) {
    setJobTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  return (
    <div className="grid gap-6 mt-20 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Sidebar */}
      <aside className="space-y-6 border border-[#3a3a3a] bg-[#2a2a2a] rounded-xl p-6 text-sm text-gray-300 shadow-sm h-fit">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3">
            Employment types
          </p>
          {EMPLOYMENT_TYPES.map((t) => (
            <label key={t.value} className="flex items-center gap-2 mb-2 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={jobTypes.includes(t.value)}
                onChange={() => toggleJobType(t.value)}
                className="h-4 w-4 border border-gray-600 rounded bg-[#1a1a1a] text-orange-500 focus:ring-orange-500"
              />
              <span className="capitalize">{t.label}</span>
            </label>
          ))}
        </div>

        <Link
          href="/join"
          className="block text-center rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
        >
          Join the community
        </Link>
      </aside>

      {/* Main */}
      <section className="space-y-4">
        <div className="flex items-center justify-between bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-4 shadow-sm">
          <div className="flex bg-[#1a1a1a] p-1 rounded-xl">
            {["jobs", "companies"].map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v as any)}
                className={cn(
                  "px-6 py-2 text-sm font-bold rounded-lg transition-colors",
                  viewMode === v ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white",
                )}
              >
                {v}
              </button>
            ))}
          </div>

          <p className="text-sm font-bold text-gray-400">
            {viewMode === "jobs"
              ? `${jobsQuery.data?.total ?? 0} jobs`
              : `${companiesQuery.data?.total ?? 0} companies`}
          </p>
        </div>

        {/* Jobs */}
        {viewMode === "jobs" &&
          jobsQuery.data?.jobs.map((job) => {
            const timeAgo = job.postedAt ? getTimeAgo(new Date(job.postedAt)) : null;

            return (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                className={cn(
                  "block border rounded-xl p-5 transition-all duration-200",
                  job.isFeatured
                    ? "bg-[#2a2a2a] border-orange-500/50 shadow-[0_0_20px_rgba(255,90,31,0.05)]"
                    : "bg-[#2a2a2a] border-[#3a3a3a] hover:bg-[#323232]",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Logo + Content */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Company Logo */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.companyName || "Company"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-lg">
                          {job.companyName?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-base font-semibold text-white truncate">
                          {job.title}
                        </h3>
                        {job.isFeatured && (
                          <span className="bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {job.companyName}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Remote Scope Badge */}
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="capitalize">
                            {job.remoteScope === "worldwide" ? "Worldwide" : job.remoteScope.replace("_", " ")}
                          </span>
                        </div>

                        {/* Tags */}
                        {job.tags && job.tags.length > 0 && (
                          <>
                            {job.tags.slice(0, 1).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-[#3a3a3a] text-gray-300 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Time Posted */}
                  {timeAgo && (
                    <div className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                      {timeAgo}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}

        {/* Companies */}
        {viewMode === "companies" &&
          companiesQuery.data?.companies.map((company) => (
            <div
              key={company.id}
              onClick={() => router.push(`/companies/${company.slug}`)}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-6 cursor-pointer text-white transition-all hover:bg-[#323232]"
            >
              <h3 className="text-xl font-bold">{company.name}</h3>
              {company.location && (
                <p className="text-sm text-gray-400">{company.location}</p>
              )}
            </div>
          ))}
      </section>
    </div>
  );
}
