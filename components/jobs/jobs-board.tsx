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
  isPremium: boolean;
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

const COUNTRIES = ["USA", "UK", "Germany", "France", "Canada", "Spain"];

const EMPLOYMENT_TYPES = [
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
  const activeCategories = searchParams.getAll("category");
  const remoteScope = searchParams.get("remote_scope") ?? "";
  const minSalary = searchParams.get("min_salary") ?? "";

  const [location, setLocation] = React.useState(searchParams.get("location") ?? "");
  const [jobTypes, setJobTypes] = React.useState<string[]>(
    searchParams.getAll("job_type"),
  );
  const [optimised, setOptimised] = React.useState(
    searchParams.get("optimised") === "true",
  );
  const [viewMode, setViewMode] = React.useState<"jobs" | "companies">("jobs");

  React.useEffect(() => {
    setLocation(searchParams.get("location") ?? "");
    setJobTypes(searchParams.getAll("job_type"));
    setOptimised(searchParams.get("optimised") === "true");
  }, [searchParams]);

  const jobsQuery = useQuery({
    queryKey: ["jobs", q, location, jobTypes, activeCategories, remoteScope, minSalary],
    queryFn: async (): Promise<JobsResponse> => {
      const params = new URLSearchParams();
      params.set("limit", "1000");
      if (q) params.set("q", q);
      if (location) params.set("location", location);
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
    queryKey: ["companies", q, location],
    queryFn: async (): Promise<CompaniesResponse> => {
      const params = new URLSearchParams();
      params.set("limit", "1000");
      if (q) params.set("q", q);
      if (location) params.set("location", location);

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
      <aside className="space-y-6 border border-gray-200 bg-white rounded-2xl p-6 text-sm text-gray-600 shadow-sm h-fit">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">
            I want to work remotely from...
          </p>
          {COUNTRIES.map((country) => (
            <label key={country} className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="radio"
                checked={location === country}
                onChange={() => setLocation(country)}
              />
              <span>{country}</span>
            </label>
          ))}
          <button onClick={() => setLocation("")} className="text-xs font-bold text-blue-600 mt-2">
            Clear location
          </button>
        </div>

        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">
            Employment types
          </p>
          {EMPLOYMENT_TYPES.map((t) => (
            <label key={t.value} className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={jobTypes.includes(t.value)}
                onChange={() => toggleJobType(t.value)}
              />
              <span className="capitalize">{t.label}</span>
            </label>
          ))}
        </div>

        <Link
          href="/join"
          className="block text-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
        >
          Join the community
        </Link>
      </aside>

      {/* Main */}
      <section className="space-y-4">
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {["jobs", "companies"].map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v as any)}
                className={cn(
                  "px-6 py-2 text-sm font-bold rounded-lg",
                  viewMode === v ? "bg-white text-blue-600" : "text-gray-500",
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
          jobsQuery.data?.jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.slug}`}
              className={cn(
                "block border rounded-3xl text-black p-6",
                job.isFeatured
                  ? "bg-[#E1FF00] border-[#E1FF00]"
                  : "bg-white border-gray-100 text-black hover:bg-gray-50",
              )}
            >
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.companyName}</p>
            </Link>
          ))}

        {/* Companies */}
        {viewMode === "companies" &&
          companiesQuery.data?.companies.map((company) => (
            <div
              key={company.id}
              onClick={() => router.push(`/companies/${company.slug}`)}
              className="bg-white border border-gray-100 rounded-3xl p-6 cursor-pointer text-black transition-colors hover:bg-gray-50"
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
