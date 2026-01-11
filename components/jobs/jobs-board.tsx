"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
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
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

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
      router.replace("/jobs");
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
        router.replace(`/jobs${buildQueryString(params)}`);
      }
    } catch (error) {
      console.error("[Optimise] Error:", error);
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


      <section className="space-y-3">

        <div className="flex flex-col gap-4 bg-white border-2 border-black p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setViewMode("jobs")}
                className={cn(
                  "px-4 py-2 text-sm font-bold border-2 border-black transition-colors cursor-pointer",
                  viewMode === "jobs"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100"
                )}
              >
                Jobs
              </button>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setViewMode("companies")}
                className={cn(
                  "px-4 py-2 text-sm font-bold border-2 border-black transition-colors cursor-pointer",
                  viewMode === "companies"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100"
                )}
              >
                Companies
              </button>
            </div>
            {viewMode === "jobs" && (
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      if (!session?.user) {
                        setShowUnlockDialog(true);
                      } else {
                        router.push("/pricing");
                      }
                    }}
                    className="px-4 py-2 bg-black text-white text-sm font-bold hover:bg-gray-900 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <LockOpen className="w-4 h-4" />
                    Unlock All Jobs
                  </button>
                </div>
                <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
                  <DialogContent className="border-2 border-black bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black text-black">
                        Join to Unlock All Jobs
                      </DialogTitle>
                      <DialogDescription className="text-sm font-medium text-black/80 pt-2">
                        Join WorkIsWork to access all job listings and unlock premium features.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <Link
                        href="/join"
                        className="px-6 py-3 border-2 border-black bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-500 transition-colors shadow-md"
                        onClick={() => setShowUnlockDialog(false)}
                      >
                        Join Now
                      </Link>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
            {viewMode === "jobs" && (
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      if (!session?.user) {
                        setShowAlertDialog(true);
                      } else {
                        router.push("/alerts");
                      }
                    }}
                    className="px-4 py-2 border-2 border-black text-black text-sm font-bold hover:bg-black cursor-pointer hover:text-white transition-colors"
                  > 
                    Create Job Alert
                  </button>
                </div>
                <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
                  <DialogContent className="border-2 border-black bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black text-black">
                        Join to Create Job Alerts
                      </DialogTitle>
                      <DialogDescription className="text-sm font-medium text-black/80 pt-2">
                        Join WorkIsWork to create personalized job alerts and get notified about new opportunities.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <Link
                        href="/join"
                        className="px-6 py-3 border-2 border-black bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-500 transition-colors shadow-md"
                        onClick={() => setShowAlertDialog(false)}
                      >
                        Join Now
                      </Link>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
            {viewMode === "jobs" && (
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleOptimise}
                    className={cn(
                      "px-4 py-2 border-2 border-black cursor-pointer text-sm font-bold transition-colors",
                      optimised
                        ? "bg-yellow-400 text-black shadow-lg"
                        : "bg-white text-black hover:bg-black hover:text-white hover:shadow-md transition-all",
                    )}
                  >
                    {optimised ? "Optimised ✓" : "Optimise"}
                  </button>
                </div>
                <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
                  <DialogContent className="border-2 border-black bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black text-black">
                        Join to Optimise Your Job Search
                      </DialogTitle>
                      <DialogDescription className="text-sm font-medium text-black/80 pt-2">
                        You can modify your preferences after joining to get personalized job recommendations.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <Link
                        href="/join"
                        className="px-6 py-3 border-2 border-black bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-500 transition-colors shadow-md"
                        onClick={() => setShowJoinDialog(false)}
                      >
                        Join Now
                      </Link>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
          <p className="text-sm font-medium text-black/60">
            {viewMode === "jobs" 
              ? `${total.toLocaleString()} matching jobs`
              : `${totalCompanies.toLocaleString()} companies`
            }
          </p>
        </div>

        {/* Jobs list - Gumroad style */}
        {viewMode === "jobs" && (
          <>
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
                      <span className="inline-block px-4 py-2 bg-black text-white text-sm font-bold border-2 border-black hover:bg-yellow-400 hover:text-black transition-all cursor-pointer shadow-sm hover:shadow-lg">
                        View job →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination for jobs */}
            {!isLoading && total > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6 pt-6 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => {
                    if (jobsPage > 1) {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("jobsPage", String(jobsPage - 1));
                      router.push(`/jobs?${params.toString()}`);
                    }
                  }}
                  disabled={jobsPage <= 1}
                  className="px-4 py-2 border-2 border-black bg-white text-black text-sm font-bold hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-sm font-medium text-black">
                  Page {jobsPage} of {jobsTotalPages}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (jobsPage < jobsTotalPages) {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("jobsPage", String(jobsPage + 1));
                      router.push(`/jobs?${params.toString()}`);
                    }
                  }}
                  disabled={jobsPage >= jobsTotalPages}
                  className="px-4 py-2 border-2 border-black bg-white text-black text-sm font-bold hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              {isLoadingCompanies && <p className="px-3 py-4 text-sm font-medium">Loading companies…</p>}
              {isCompaniesError && (
                <p className="px-3 py-4 text-sm font-medium text-red-600">
                  Failed to load companies. Please try again.
                </p>
              )}
              {!isLoadingCompanies && companies.length === 0 && (
                <p className="px-3 py-4 text-sm font-medium text-black/40">
                  No companies found.
                </p>
              )}

              {companies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => router.push(`/companies/${company.slug}`)}
                  className="block bg-white border-2 border-black p-6 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      <h3 className="text-lg font-black text-black leading-tight">
                        {company.name}
                      </h3>
                      {company.location && (
                        <p className="text-sm font-medium text-black/70">
                          {company.location}
                        </p>
                      )}
                      {company.websiteUrl && (
                        <a
                          href={company.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-yellow-600 hover:underline font-medium"
                        >
                          {company.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </a>
                      )}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {company.twitterUrl && (
                          <a
                            href={company.twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-black/60 hover:text-black"
                          >
                            Twitter
                          </a>
                        )}
                        {company.linkedinUrl && (
                          <a
                            href={company.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-black/60 hover:text-black"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-block px-4 py-2 bg-black text-white text-sm font-bold border-2 border-black hover:bg-yellow-400 hover:text-black transition-all cursor-pointer shadow-sm hover:shadow-lg">
                        View company →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination for companies */}
            {!isLoadingCompanies && totalCompanies > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6 pt-6 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => {
                    if (companiesPage > 1) {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("companiesPage", String(companiesPage - 1));
                      router.push(`/jobs?${params.toString()}`);
                    }
                  }}
                  disabled={companiesPage <= 1}
                  className="px-4 py-2 border-2 border-black bg-white text-black text-sm font-bold hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-sm font-medium text-black">
                  Page {companiesPage} of {companiesTotalPages}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (companiesPage < companiesTotalPages) {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("companiesPage", String(companiesPage + 1));
                      router.push(`/jobs?${params.toString()}`);
                    }
                  }}
                  disabled={companiesPage >= companiesTotalPages}
                  className="px-4 py-2 border-2 border-black bg-white text-black text-sm font-bold hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

