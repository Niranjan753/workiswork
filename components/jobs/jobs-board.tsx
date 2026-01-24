"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import * as React from "react";
import { cn } from "../../lib/utils";
import Link from "next/link";
import { ChevronRight, LockOpen, Loader2, Search, Zap, Code, Briefcase } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

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
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState(q);

  // Sync searchValue back to URL with debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const url = new URL(window.location.href);
      if (searchValue) {
        url.searchParams.set("q", searchValue);
      } else {
        url.searchParams.delete("q");
      }
      router.replace(url.pathname + url.search + url.hash, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, router]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    setJobTypes(searchParams.getAll("job_type"));
    setCategories(searchParams.getAll("category"));
    setOptimised(searchParams.get("optimised") === "true");
    const currentQ = searchParams.get("q") ?? "";
    setSearchValue(currentQ);
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
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const existing = params.getAll("job_type");
    params.delete("job_type");

    const next = existing.includes(value)
      ? existing.filter(v => v !== value)
      : [...existing, value];

    next.forEach(v => params.append("job_type", v));
    router.replace(url.pathname + "?" + params.toString() + url.hash, { scroll: false });
  }

  function toggleCategory(value: string) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const existing = params.getAll("category");
    params.delete("category");

    const next = existing.includes(value)
      ? existing.filter(v => v !== value)
      : [...existing, value];

    next.forEach(v => params.append("category", v));
    router.replace(url.pathname + "?" + params.toString() + url.hash, { scroll: false });
  }


  return (
    <div className="flex flex-col-reverse lg:grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
      {/* Sidebar - Brute Style */}
      <aside className="space-y-8 lg:h-fit w-full">
        <div className="relative group w-full">
          {/* Shadow Box */}
          <div className="absolute inset-0 bg-black translate-x-[3px] translate-y-[3px]" />
          <div className="relative bg-white border-2 border-black p-5 sm:p-6">
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
        </div>

        {/* Action Card */}
        <div className="relative group w-full">
          <div className="absolute inset-0 bg-black translate-x-[3px] translate-y-[3px]" />
          <div className="relative bg-orange-500 border-2 border-black p-6 text-white">
            <h4 className="text-xl font-black uppercase italic tracking-tighter leading-none mb-3">
              Get the best talent <br /> direct to your inbox
            </h4>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/80 mb-5 leading-relaxed">
              Join 5,000+ companies hiring through Workiswork.
            </p>
            <button className="w-full bg-black text-white py-3.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
              Unlock Talent
            </button>
          </div>
        </div>
      </aside>


      {/* Main Content Area */}
      <section className="space-y-4">
        {/* Command Palette Overlay */}
        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          className="border-4 border-black shadow-[10px_10px_0px_black] bg-[#0A0A0A] text-white overflow-hidden"
        >
          <CommandInput
            placeholder="Search roles, companies, tech..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="text-white placeholder:text-gray-500 bg-transparent border-none"
          />

          <CommandList className="custom-scrollbar min-h-[300px]">
            {jobsQuery.isFetching && (
              <div className="p-4 flex items-center justify-center border-b-2 border-black/5">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing...</span>
              </div>
            )}

            <CommandEmpty className="py-12 text-center">
              {jobsQuery.isFetching ? (
                <div className="animate-pulse text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 italic">Reading the matrix...</div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">No results found for "{searchValue}"</div>
                  <p className="text-[9px] font-bold text-gray-300 uppercase underline cursor-pointer" onClick={() => setSearchValue("")}>Clear Search</p>
                </div>
              )}
            </CommandEmpty>

            {/* Matching Categories */}
            {searchValue && (
              <CommandGroup heading={<span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Categories</span>}>
                {JOB_ROLES.filter(r => r.toLowerCase().includes(searchValue.toLowerCase())).slice(0, 5).map((role) => (
                  <CommandItem
                    key={role}
                    value={role}
                    onSelect={() => {
                      toggleCategory(role.toLowerCase());
                      setSearchValue("");
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 py-3 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:!text-black"
                  >
                    <Code className="w-4 h-4 text-orange-500" />
                    <span className="font-black text-[10px] uppercase italic tracking-tighter">Filter by {role}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Matching Employment Types */}
            {searchValue && (
              <CommandGroup heading={<span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Employment Type</span>}>
                {EMPLOYMENT_TYPES.filter(t => t.label.toLowerCase().includes(searchValue.toLowerCase())).map((type) => (
                  <CommandItem
                    key={type.value}
                    value={type.label}
                    onSelect={() => {
                      toggleJobType(type.value);
                      setSearchValue("");
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 py-3 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:!text-black"
                  >
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span className="font-black text-[10px] uppercase italic tracking-tighter">{type.label} Roles</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}


            {(jobsQuery.data?.jobs ?? []).length > 0 && (
              <CommandGroup heading={<span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Opportunities</span>}>
                {jobsQuery.data?.jobs.slice(0, 8).map((job) => (
                  <CommandItem
                    key={job.id}
                    value={job.title + " " + job.companyName}
                    onSelect={() => { router.push(`/jobs/${job.slug}`); setOpen(false); }}
                    className="flex items-center gap-4 py-4 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:!text-black border-b border-black/5 last:border-0"
                  >
                    <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-[12px] font-black italic shadow-[2px_2px_0px_black] transition-all shrink-0 overflow-hidden">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-black">{job.companyName?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-black text-sm uppercase italic tracking-tighter truncate">{job.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">{job.companyName}</span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full" />
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{job.location || "Remote"}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {(companiesQuery.data?.companies ?? []).length > 0 && (
              <CommandGroup heading={<span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Entities</span>}>
                {companiesQuery.data?.companies.slice(0, 4).map((company) => (
                  <CommandItem
                    key={company.id}
                    value={company.name}
                    onSelect={() => { router.push(`/companies/${company.slug}`); setOpen(false); }}
                    className="flex items-center gap-4 py-4 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:!text-black border-b border-black/5 last:border-0"
                  >
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center text-[12px] font-black italic shadow-[2px_2px_0px_rgba(0,0,0,0.1)] shrink-0 overflow-hidden">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white">{company.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-black text-sm uppercase italic tracking-tighter truncate">{company.name}</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{company.location || "Global"}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}



            <CommandSeparator />

            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => { toggleCategory("developer"); setOpen(false); }} className="py-3">
                <Code className="mr-3 h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Dev Openings</span>
              </CommandItem>
              <CommandItem onSelect={() => { toggleCategory("design"); setOpen(false); }} className="py-3">
                <Zap className="mr-3 h-4 w-4 text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Motion & UI</span>
              </CommandItem>
              <CommandItem onSelect={() => { setViewMode("jobs"); setOpen(false); }} className="py-3">
                <Briefcase className="mr-3 h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Switch to Feed</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>


        {/* Search Bar Trigger - High Contrast */}
        <div
          onClick={() => setOpen(true)}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-black translate-x-[3px] translate-y-[3px] transition-transform group-hover:translate-x-[6px] group-hover:translate-y-[6px]" />
          <div className="relative flex bg-white border-2 border-black p-1">
            <div className="flex items-center px-4 border-r-2 border-black">
              <Search className="w-4 h-4 text-black" />
            </div>
            <div className="flex-1 bg-white px-5 py-4 text-[13px] font-bold tracking-tight uppercase italic text-gray-300">
              {q || "Search roles, companies, or technologies..."}
            </div>
            <div className="hidden sm:flex items-center px-4 bg-gray-50 border-l-2 border-black text-[9px] font-black uppercase tracking-widest text-[#FF5A1F]">
              Command + K
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-baseline justify-between gap-3 border-b-2 border-black pb-3 pt-4">

          <div className="flex gap-6">
            {["jobs", "companies"].map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v as any)}
                className={cn(
                  "relative text-[10px] font-black uppercase tracking-[0.3em] transition-all pb-1",
                  viewMode === v
                    ? "!text-black after:absolute after:bottom-[-6px] after:left-0 after:right-0 after:h-[2px] after:bg-orange-500"
                    : "text-gray-400 hover:!text-black cursor-pointer"
                )}
              >
                {v}
              </button>
            ))}
          </div>


          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
            {jobsQuery.isLoading || companiesQuery.isLoading ? (
              <span className="flex items-center gap-1.5 text-black">
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
              <div key={company.id} className="relative group w-full">
                {/* Fixed Shadow Box */}
                <div className="absolute inset-0 bg-black translate-x-[3px] translate-y-[3px] group-hover:translate-x-[6px] group-hover:translate-y-[6px] transition-transform" />

                <Link
                  href={`/companies/${company.slug}`}
                  className="relative flex items-center justify-between p-4 sm:p-7 bg-white border-2 border-black rounded-none transition-all duration-300 gap-4"
                >
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 border-2 border-black flex items-center justify-center text-xl sm:text-2xl font-black text-black shrink-0">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} className="w-full h-full object-cover" />
                      ) : company.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[15px] sm:text-2xl font-black text-black tracking-tighter uppercase italic leading-tight mb-0.5 sm:mb-1 truncate sm:whitespace-normal">
                        {company.name}
                      </h3>
                      <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {company.location || "Global"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-black group-hover:text-orange-500 group-hover:translate-x-2 transition-all shrink-0" />
                </Link>
              </div>
            ))}

        </div>
      </section>
    </div>
  );
}
