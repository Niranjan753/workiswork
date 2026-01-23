"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import * as React from "react";
import { cn } from "../../lib/utils";
import Link from "next/link";
import { ChevronRight, LockOpen, Loader2 } from "lucide-react";

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

const JOB_ROLES = [
  "Developer", "Engineer", "Frontend", "Backend", "Fullstack", "Design", "Data", "Research",
  "Finance", "Marketing", "Senior", "Sales", "Customer Service", "Customer Support", "Admin",
  "Copywriter", "Technical Writer", "Software Engineer", "AI", "Graphic Design",
  "Quality Assurance", "DevOps", "Security", "Security Engineer", "Project Manager",
  "Product Manager", "Product Designer", "Executive Assistant", "Customer Success", "HR",
  "Recruiter", "Operations", "Manager", "Mobile", "Legal", "Analyst", "Accounting",
  "Support", "Management", "Business Development", "Assistant", "Web3"
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
  const [categories, setCategories] = React.useState<string[]>(
    searchParams.getAll("category"),
  );
  const [optimised, setOptimised] = React.useState(
    searchParams.get("optimised") === "true",
  );
  const [viewMode, setViewMode] = React.useState<"jobs" | "companies">("jobs");

  React.useEffect(() => {
    setJobTypes(searchParams.getAll("job_type"));
    setCategories(searchParams.getAll("category"));
    setOptimised(searchParams.get("optimised") === "true");
  }, [searchParams]);

  const jobsQuery = useQuery({
    queryKey: ["jobs", q, jobTypes, categories, remoteScope, minSalary],
    queryFn: async (): Promise<JobsResponse> => {
      const params = new URLSearchParams();
      params.set("limit", "1000");
      if (q) params.set("q", q);
      categories.forEach((c) => params.append("category", c));
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

  function toggleCategory(value: string) {
    setCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      {/* Sidebar - Brute Style */}
      <aside className="space-y-6 h-fit">
        <div className="bg-white border-2 border-black p-5 sm:p-6 rounded-none shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-5 border-b-2 border-black pb-3 flex items-center justify-between">
            Filters
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-none shadow-[1.5px_1.5px_0px_black]" />
          </h3>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Employment Type</p>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {EMPLOYMENT_TYPES.map((t) => (
                  <label key={t.value} className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative flex items-center shrink-0">
                      <input
                        type="checkbox"
                        checked={jobTypes.includes(t.value)}
                        onChange={() => toggleJobType(t.value)}
                        className="peer appearance-none h-4 w-4 border-2 border-black rounded-none checked:bg-black transition-all cursor-pointer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 text-white font-black text-[8px]">
                        ✓
                      </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-tight text-gray-400 group-hover:text-black transition-colors truncate">
                      {t.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t-2 border-black/5">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Roles</p>
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2.5 custom-scrollbar">
                {JOB_ROLES.map((role) => (
                  <label key={role} className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative flex items-center shrink-0">
                      <input
                        type="checkbox"
                        checked={categories.includes(role.toLowerCase())}
                        onChange={() => toggleCategory(role.toLowerCase())}
                        className="peer appearance-none h-4 w-4 border-2 border-black rounded-none checked:bg-black transition-all cursor-pointer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 text-white font-black text-[8px]">
                        ✓
                      </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-tight text-gray-400 group-hover:text-black transition-colors truncate">
                      {role}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-black">
            <Link
              href="/post"
              className="group relative block w-full bg-black text-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Post Job
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-orange-500 border-2 border-black p-6 rounded-none shadow-[3px_3px_0px_black] text-white">
          <h4 className="text-lg font-black uppercase italic tracking-tighter leading-none mb-3">
            Get the best talent <br /> direct to your inbox
          </h4>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/80 mb-5">
            Join 5,000+ companies hiring through Workiswork.
          </p>
          <button className="w-full bg-black text-white py-3.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
            Unlock Talent
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-baseline justify-between gap-3 border-b-2 border-black pb-3">
          <div className="flex gap-6">
            {["jobs", "companies"].map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v as any)}
                className={cn(
                  "relative text-[10px] font-black uppercase tracking-[0.3em] transition-all pb-1",
                  viewMode === v
                    ? "text-white after:absolute after:bottom-[-6px] after:left-0 after:right-0 after:h-[2px] after:bg-orange-500"
                    : "text-gray-400 hover:text-white/40 cursor-pointer"
                )}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
            {jobsQuery.isLoading || companiesQuery.isLoading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                Updating...
              </span>
            ) : (
              viewMode === "jobs"
                ? `${jobsQuery.data?.total ?? 0} OPPORTUNITIES`
                : `${companiesQuery.data?.total ?? 0} ENTITIES`
            )}
          </div>
        </div>

        {/* List View */}
        <div className="space-y-2">
          {(jobsQuery.isLoading || companiesQuery.isLoading) && (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white border-2 border-black p-6 animate-pulse">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-gray-100" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-3.5 bg-gray-100 w-1/3" />
                      <div className="h-2.5 bg-gray-100 w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === "jobs" && !jobsQuery.isLoading &&
            jobsQuery.data?.jobs.map((job) => {
              const timeAgo = job.postedAt ? getTimeAgo(new Date(job.postedAt)) : null;

              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug}`}
                  className={cn(
                    "group relative flex flex-col md:flex-row md:items-center justify-between p-5 sm:p-7 transition-all duration-300 gap-5 border-2 border-black rounded-none shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1",
                    job.isFeatured
                      ? "bg-orange-50 border-orange-500 shadow-[3px_3px_0px_#f97316]"
                      : "bg-white"
                  )}
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 border-2 border-black rounded-none flex items-center justify-center text-lg font-black text-black shrink-0 transition-all">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.companyName || ""}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        job.companyName?.charAt(0)
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        {job.isFeatured && (
                          <span className="text-[7px] font-black text-white bg-orange-500 px-1.5 py-0.5 uppercase tracking-[0.2em] leading-none shrink-0">
                            PRIME ROLE
                          </span>
                        )}
                        <span className="text-[8px] font-black text-black/40 uppercase tracking-[0.2em] leading-none">
                          {job.jobType.replace("_", " ")}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-2xl font-black text-black tracking-tighter uppercase italic leading-[1.1] mb-1.5 group-hover:text-orange-500 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2.5 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                        <span className="text-black">{job.companyName}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{job.location || "Remote"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-3 shrink-0 border-t md:border-t-0 md:border-l border-black/5 pt-3 md:pt-0 md:pl-6">
                    {job.salaryMin && (
                      <div className="text-xs sm:text-base font-black text-black uppercase tracking-tighter">
                        ${parseInt(job.salaryMin) / 1000}K+ <span className="text-[9px] text-gray-400">/ YEAR</span>
                      </div>
                    )}
                    <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">
                      {timeAgo}
                    </div>
                  </div>
                </Link>
              );
            })}

          {viewMode === "companies" && !companiesQuery.isLoading &&
            companiesQuery.data?.companies.map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="group relative flex items-center justify-between p-6 sm:p-8 transition-all duration-300 gap-5 bg-white border-2 border-black rounded-none shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-gray-50 border-2 border-black rounded-none flex items-center justify-center text-2xl font-black text-black transition-all">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} className="w-full h-full object-cover" />
                    ) : company.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-3xl font-black text-black tracking-tighter uppercase italic leading-none mb-1.5">{company.name}</h3>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em]">{company.location || "Global"}</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-black group-hover:text-orange-500 group-hover:translate-x-2 transition-all" />
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
