"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import * as React from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import Link from "next/link";
import { LockOpen } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

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
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  companies: Company[];
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
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const isDashboard = pathname.startsWith("/dashboard");

  const q = searchParams.get("q") ?? "";
  const activeCategories = searchParams.getAll("category").filter(Boolean);
  const remoteScope = searchParams.get("remote_scope") ?? "";
  const minSalary = searchParams.get("min_salary") ?? "";
  const isOptimisedFromUrl = searchParams.get("optimised") === "true";

  const [location, setLocation] = React.useState(
    searchParams.get("location") ?? "",
  );
  const [jobTypes, setJobTypes] = React.useState<string[]>(
    searchParams.getAll("job_type"),
  );
  const [optimised, setOptimised] = React.useState(isOptimisedFromUrl);
  const [showJoinDialog, setShowJoinDialog] = React.useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = React.useState(false);
  const [showAlertDialog, setShowAlertDialog] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"jobs" | "companies">("jobs");

  React.useEffect(() => {
    const newLocation = searchParams.get("location") ?? "";
    const newJobTypes = searchParams.getAll("job_type");
    const newOptimised = searchParams.get("optimised") === "true";

    setLocation(newLocation);
    setJobTypes(newJobTypes);
    setOptimised(newOptimised);
  }, [searchParams]);


  // Jobs query with pagination
  const jobsPage = Number(searchParams.get("jobsPage") || "1");
  const queryKey = React.useMemo(
    () => ["jobs", { q, location, jobTypes, activeCategories, remoteScope, minSalary, optimised: isOptimisedFromUrl, page: jobsPage }],
    [q, location, jobTypes, activeCategories, remoteScope, minSalary, isOptimisedFromUrl, jobsPage],
  );

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: async (): Promise<JobsResponse> => {
      const params = new URLSearchParams();
      params.set("page", String(jobsPage));
      params.set("limit", "20");
      if (q) params.set("q", q);
      if (location) params.set("location", location);
      activeCategories.forEach((cat) => params.append("category", cat));
      jobTypes.forEach((jt) => params.append("job_type", jt));
      if (remoteScope) params.set("remote_scope", remoteScope);
      if (minSalary) params.set("min_salary", minSalary);

      const res = await fetch(`/api/jobs${buildQueryString(params)}`);
      if (!res.ok) {
        throw new Error("Failed to load jobs");
      }
      return res.json();
    },
    enabled: viewMode === "jobs",
    staleTime: 0,
    refetchOnMount: true,
  });

  const total = data?.total ?? 0;
  const jobs = data?.jobs ?? [];
  const jobsTotalPages = data?.totalPages ?? 1;

  // Companies query with pagination
  const companiesPage = Number(searchParams.get("companiesPage") || "1");
  const companiesQueryKey = React.useMemo(
    () => ["companies", { q, location, page: companiesPage }],
    [q, location, companiesPage],
  );

  const {
    data: companiesData,
    isLoading: isLoadingCompanies,
    isError: isCompaniesError,
  } = useQuery({
    queryKey: companiesQueryKey,
    queryFn: async (): Promise<CompaniesResponse> => {
      const params = new URLSearchParams();
      params.set("page", String(companiesPage));
      params.set("limit", "20");
      if (q) params.set("q", q);
      if (location) params.set("location", location);

      const res = await fetch(`/api/companies${buildQueryString(params)}`);
      if (!res.ok) {
        throw new Error("Failed to load companies");
      }
      return res.json();
    },
    enabled: viewMode === "companies",
    staleTime: 0,
    refetchOnMount: true,
  });

  const totalCompanies = companiesData?.total ?? 0;
  const companies = companiesData?.companies ?? [];
  const companiesTotalPages = companiesData?.totalPages ?? 1;

  function toggleJobType(value: string) {
    setJobTypes((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    );
  }

  async function handleOptimise() {
    if (!session?.user) {
      setShowJoinDialog(true);
      return;
    }

    if (optimised) {
      router.replace(isDashboard ? "/dashboard/jobs" : "/jobs");
      return;
    }

    try {
      const res = await fetch("/api/user/preferences");
      if (!res.ok) return;
      const json = await res.json();
      const prefs = json.preferences as
        | { answersByQuestionId?: Record<string, string[]>; selectedCategory?: string }
        | null;
      if (!prefs || !prefs.answersByQuestionId) return;

      const answers = prefs.answersByQuestionId;
      const categoryAnswers = answers["0"] ?? [];
      const roleAnswers = answers["1"] ?? [];
      const skillAnswers = answers["2"] ?? [];
      const jobTypeAnswers = answers["3"] ?? [];
      const remoteScopeAnswers = answers["4"] ?? [];
      const salaryAnswers = answers["5"] ?? [];
      const locationAnswers = answers["6"] ?? [];

      const categoryLabel = prefs.selectedCategory || categoryAnswers[0];

      const categorySlugMap: Record<string, string> = {
        "Software Development": "software-development",
        "Customer Service": "customer-support",
        "Design": "design",
        "Marketing": "marketing",
        "Sales / Business": "sales",
        "Product": "product",
        "Project Management": "project",
        "AI / ML": "ai-ml",
        "Data Analysis": "data-analysis",
        "Devops / Sysadmin": "devops",
        "Finance": "finance",
        "Human Resources": "human-resources",
        "QA": "qa",
        "Writing": "writing",
        "Legal": "legal",
        "Medical": "medical",
        "Education": "education",
        "All Others": "all-others",
      };

      const jobTypeMap: Record<string, string> = {
        "Full-time": "full_time",
        "Part-time": "part_time",
        "Freelance": "freelance",
        "Contract": "contract",
        "Internship": "internship",
      };

      const remoteScopeMap: Record<string, string> = {
        "Worldwide / Any": "worldwide",
        "North America (US, Canada, Mexico)": "north_america",
        "Europe": "europe",
        "Latin America": "latam",
        "Asia-Pacific": "asia",
      };

      const params = new URLSearchParams();
      params.set("optimised", "true");

      if (categoryLabel && categorySlugMap[categoryLabel]) {
        params.append("category", categorySlugMap[categoryLabel]);
      }

      const searchTerms = [...roleAnswers, ...skillAnswers].join(" ").trim();
      if (searchTerms) {
        params.set("q", searchTerms);
      }

      if (jobTypeAnswers.length > 0) {
        const jobTypes = jobTypeAnswers
          .map((jt) => jobTypeMap[jt])
          .filter(Boolean);
        if (jobTypes.length > 0) {
          jobTypes.forEach((jt) => params.append("job_type", jt));
        }
      }

      if (remoteScopeAnswers.length > 0) {
        const remoteScope = remoteScopeMap[remoteScopeAnswers[0]];
        if (remoteScope) {
          params.set("remote_scope", remoteScope);
        }
      }

      if (locationAnswers.length > 0) {
        const location = locationAnswers[0];
        if (location && location !== "Other / Not Listed") {
          params.set("location", location);
        }
      }

      if (salaryAnswers.length > 0) {
        const salaryRange = salaryAnswers[0];
        if (salaryRange && salaryRange !== "Flexible / Open" && salaryRange !== "Prefer not to say") {
          const salaryMap: Record<string, number> = {
            "$50k–$70k": 50000,
            "$70k–$90k": 70000,
            "$90k–$110k": 90000,
            "$110k–$130k": 110000,
            "$130k–$150k": 130000,
            "$150k+": 150000,
          };
          const minSalary = salaryMap[salaryRange];
          if (minSalary) {
            params.set("min_salary", String(minSalary));
          }
        }
      }

      if (params.toString()) {
        router.replace(`${isDashboard ? "/dashboard/jobs" : "/jobs"}${buildQueryString(params)}`);
      }
    } catch (error) {
      console.error("[Optimise] Error:", error);
    }
  }

  return (
    <div className="grid gap-6 mt-20 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Filters Sidebar */}
      <aside className="space-y-6 border border-gray-200 bg-white rounded-2xl p-6 text-sm text-gray-600 shadow-sm h-fit">
        <div className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
            I want to work remotely from...
          </p>
          <div className="space-y-2">
            {COUNTRIES.map((country) => (
              <label key={country} className="flex cursor-pointer items-center gap-2 group">
                <input
                  type="radio"
                  name="country"
                  value={country}
                  checked={location === country}
                  onChange={(e) =>
                    setLocation(e.target.checked ? country : "")
                  }
                  className="h-4 w-4 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">{country}</span>
              </label>
            ))}
            <button
              type="button"
              className="mt-2 text-xs font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
              onClick={() => setLocation("")}
            >
              Clear location
            </button>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
            Employment types
          </p>
          <div className="space-y-2">
            {EMPLOYMENT_TYPES.map((type) => (
              <label key={type.value} className="flex cursor-pointer items-center gap-2 group">
                <input
                  type="checkbox"
                  value={type.value}
                  checked={jobTypes.includes(type.value)}
                  onChange={() => toggleJobType(type.value)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-600 capitalize group-hover:text-blue-600 transition-colors">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Link
            href={isDashboard ? "/dashboard/join" : "/join"}
            className="block w-full text-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            Join the community
          </Link>
        </div>
      </aside>


      <section className="space-y-4">
        <div className="flex flex-col gap-4 bg-white border border-gray-200 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("jobs")}
                className={cn(
                  "px-6 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer",
                  viewMode === "jobs"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                Jobs
              </button>
              <button
                type="button"
                onClick={() => setViewMode("companies")}
                className={cn(
                  "px-6 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer",
                  viewMode === "companies"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                Companies
              </button>
            </div>

            {viewMode === "jobs" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (!session?.user) {
                      setShowUnlockDialog(true);
                    } else {
                      router.push("/dashboard/membership");
                    }
                  }}
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <LockOpen className="w-4 h-4" />
                  Unlock All Jobs
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!session?.user) {
                      setShowAlertDialog(true);
                    } else {
                      router.push("/dashboard/alerts");
                    }
                  }}
                  className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-all shadow-sm"
                >
                  Create Job Alert
                </button>

                <button
                  type="button"
                  onClick={handleOptimise}
                  className={cn(
                    "px-5 py-2.5 border rounded-xl cursor-pointer text-sm font-bold transition-all shadow-sm",
                    optimised
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600",
                  )}
                >
                  {optimised ? "Optimised ✓" : "Optimise"}
                </button>
              </>
            )}
          </div>
          <p className="text-sm font-bold text-gray-400 tabular-nums">
            {viewMode === "jobs"
              ? `${total.toLocaleString()} matching jobs`
              : `${totalCompanies.toLocaleString()} companies`
            }
          </p>
        </div>

        {/* Jobs list - Standard Style */}
        {viewMode === "jobs" && (
          <>
            <div className="space-y-4">
              {isLoading && <p className="px-3 py-4 text-sm font-medium text-zinc-500">Loading jobs…</p>}
              {isError && (
                <p className="px-3 py-4 text-sm font-medium text-red-400">
                  Failed to load jobs. Please try again.
                </p>
              )}
              {!isLoading && jobs.length === 0 && (
                <p className="px-3 py-4 text-sm font-medium text-zinc-500">
                  No jobs match your filters yet.
                </p>
              )}

              {jobs.map((job, index) => {
                const isNeonYellow = job.isFeatured && index % 2 === 0;
                const isNeonGreen = job.isFeatured && index % 2 !== 0;

                return (
                  <Link
                    key={job.id}
                    href={isDashboard ? `/dashboard/jobs/${job.slug}` : `/jobs/${job.slug}`}
                    className={cn(
                      "group block border rounded-3xl p-6 transition-all font-sans",
                      isNeonYellow && "bg-[#E1FF00] border-[#E1FF00] text-black shadow-[0_8px_30px_rgb(225,255,0,0.1)] hover:scale-[1.01]",
                      isNeonGreen && "bg-[#00FFA3] border-[#00FFA3] text-black shadow-[0_8px_30px_rgb(0,255,163,0.1)] hover:scale-[1.01]",
                      !job.isFeatured && "bg-white border-gray-100 text-gray-900 shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 hover:scale-[1.005]"
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="min-w-0 flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className={cn(
                            "text-xl font-bold leading-tight tracking-tight group-hover:text-blue-600 transition-colors",
                            job.isFeatured ? "text-black" : "text-gray-900"
                          )}>
                            {job.title}
                          </h3>
                          {job.isFeatured && (
                            <span className="px-2 py-0.5 rounded-md bg-black/5 text-[10px] font-black uppercase tracking-[0.2em] text-black/60">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-bold">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black",
                              job.isFeatured ? "bg-black/5 text-black" : "bg-gray-100 text-gray-500"
                            )}>
                              {job.companyName?.[0] || 'R'}
                            </div>
                            <span className={cn(
                              job.isFeatured ? "text-black/80" : "text-gray-700"
                            )}>
                              {job.companyName ?? "Remote company"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className={cn(
                              job.isFeatured ? "text-black/60 font-bold" : "text-gray-400 font-medium"
                            )}>
                              {job.location ?? "Remote"}
                            </span>
                          </div>
                        </div>

                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {job.tags.slice(0, 5).map((tag) => (
                              <span
                                key={tag}
                                className={cn(
                                  "rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors border",
                                  job.isFeatured
                                    ? "bg-black/5 text-black/70 border-black/10"
                                    : "bg-gray-50 text-gray-500 border-gray-100 group-hover:border-blue-100 group-hover:text-blue-500"
                                )}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-4">
                        <span className={cn(
                          "text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                          job.isFeatured ? "bg-black/5 text-black/40" : "bg-gray-50 text-gray-400"
                        )}>
                          {job.postedAt ? new Date(job.postedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Just now"}
                        </span>
                        <div className={cn(
                          "px-8 py-3 text-sm font-bold rounded-2xl transition-all border shadow-sm",
                          job.isFeatured
                            ? "bg-black text-white border-black hover:bg-zinc-900"
                            : "bg-white border-gray-200 text-gray-900 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
                        )}>
                          {job.isFeatured ? "Apply Now" : "View Details"}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination for jobs */}
            {!isLoading && total > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-8 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    if (jobsPage > 1) {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("jobsPage", String(jobsPage - 1));
                      router.push(`${pathname}?${params.toString()}`);
                    }
                  }}
                  disabled={jobsPage <= 1}
                  className="px-6 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm font-bold hover:border-blue-500 hover:text-blue-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  Previous
                </button>

                <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Page {jobsPage} of {jobsTotalPages}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (jobsPage < jobsTotalPages) {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("jobsPage", String(jobsPage + 1));
                      router.push(`${pathname}?${params.toString()}`);
                    }
                  }}
                  disabled={jobsPage >= jobsTotalPages}
                  className="px-6 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm font-bold hover:border-blue-500 hover:text-blue-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Companies list */}
        {viewMode === "companies" && (
          <>
            <div className="space-y-4">
              {isLoadingCompanies && <p className="px-3 py-4 text-sm font-medium text-zinc-500">Loading companies…</p>}
              {isCompaniesError && (
                <p className="px-3 py-4 text-sm font-medium text-red-400">
                  Failed to load companies. Please try again.
                </p>
              )}
              {!isLoadingCompanies && companies.length === 0 && (
                <p className="px-3 py-4 text-sm font-medium text-zinc-500">
                  No companies found.
                </p>
              )}

              {companies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => router.push(`${isDashboard ? "/dashboard/companies" : "/companies"}/${company.slug}`)}
                  className="group block bg-white border border-gray-100 rounded-3xl p-6 transition-all hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 hover:scale-[1.005] cursor-pointer shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="min-w-0 flex-1 flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl font-black text-gray-300 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-200 transition-all">
                        {company.name[0]}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </h3>
                        {company.location && (
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {company.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-block px-8 py-3 bg-gray-50 text-gray-900 text-sm font-bold rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all border border-gray-200 group-hover:border-blue-600 shadow-sm">
                        Browse Positions
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination for companies */}
            {!isLoadingCompanies && totalCompanies > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6 pt-6 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    if (companiesPage > 1) {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("companiesPage", String(companiesPage - 1));
                      router.push(`${pathname}?${params.toString()}`);
                    }
                  }}
                  disabled={companiesPage <= 1}
                  className="px-4 py-2 border border-zinc-800 rounded-xl bg-zinc-900/50 text-white text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="px-4 py-2 text-sm font-medium text-zinc-500">
                  Page {companiesPage} of {companiesTotalPages}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (companiesPage < companiesTotalPages) {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("companiesPage", String(companiesPage + 1));
                      router.push(`${pathname}?${params.toString()}`);
                    }
                  }}
                  disabled={companiesPage >= companiesTotalPages}
                  className="px-4 py-2 border border-zinc-800 rounded-xl bg-zinc-900/50 text-white text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

      </section>
    </div>
  );
}

