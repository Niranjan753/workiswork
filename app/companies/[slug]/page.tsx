import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { companies, jobs, categories } from "@/db/schema";
import { GridBackground } from "@/components/GridBackground";
import { getSiteUrl, getOgImageUrl } from "@/lib/site-url";
import { ExternalLink, MapPin, Globe, Calendar, Lock } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

type Params = { params: Promise<{ slug: string }> };

async function getCompany(slug: string) {
  const company = await db
    .select()
    .from(companies)
    .where(eq(companies.slug, slug))
    .limit(1)
    .then((rows) => rows[0] || null);

  if (!company) return null;

  const companyJobs = await db
    .select({
      id: jobs.id,
      slug: jobs.slug,
      title: jobs.title,
      location: jobs.location,
      jobType: jobs.jobType,
      remoteScope: jobs.remoteScope,
      postedAt: jobs.postedAt,
      isFeatured: jobs.isFeatured,
      isPremium: jobs.isPremium,
      tags: jobs.tags,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(jobs)
    .leftJoin(categories, eq(jobs.categoryId, categories.id))
    .where(eq(jobs.companyId, company.id))
    .orderBy(desc(jobs.postedAt));

  return { company, jobs: companyJobs };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolved = await params;
  const data = await getCompany(resolved.slug);

  if (!data) {
    return {
      title: "Company not found",
      description: "This company page could not be found.",
    };
  }

  const { company, jobs } = data;
  const title = `${company.name} – Remote Jobs | WorkIsWork`;
  const description = `View all remote jobs at ${company.name}. ${jobs.length} ${jobs.length === 1 ? "job" : "jobs"} available.`;
  const url = `${siteUrl}/companies/${resolved.slug}`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CompanyPage({ params }: Params) {
  const resolved = await params;
  const data = await getCompany(resolved.slug);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    return notFound();
  }

  const { company, jobs } = data;

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.05)_0%,transparent_70%)]" />
      </div>

      {/* Company Header */}
      <section className="relative z-10 py-16 sm:py-24 border-b border-zinc-900 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8 shadow-2xl">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-16 h-16 object-contain" />
              ) : (
                <span className="text-3xl font-black text-zinc-700">{company.name[0]}</span>
              )}
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none text-white mb-6">
              {company.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold uppercase tracking-widest text-zinc-500">
              {company.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>{company.location}</span>
                </div>
              )}
              {company.websiteUrl && (
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors text-zinc-400"
                >
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        {!session ? (
          <div className="relative z-20 flex flex-col items-center justify-center py-20 px-6 rounded-[2.5rem] bg-zinc-900/50 border border-zinc-800 shadow-2xl text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-blue-900/40">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">View Open Positions</h2>
            <p className="text-zinc-400 max-w-md mb-10 text-lg font-medium leading-relaxed">
              Join the WorkIsWork community to see open positions at {company.name} and apply to vetted remote roles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
              <Link
                href="/join"
                className="flex-1 h-14 bg-white text-black font-black rounded-2xl flex items-center justify-center hover:bg-zinc-200 transition-all uppercase tracking-widest text-sm shadow-xl"
              >
                Join WorkIsWork
              </Link>
              <Link
                href="/login?callbackUrl=/companies"
                className="flex-1 h-14 bg-zinc-800 text-white font-black rounded-2xl flex items-center justify-center hover:bg-zinc-700 transition-all uppercase tracking-widest text-sm border border-zinc-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-6 sm:grid-cols-3 mb-16">
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 text-center rounded-3xl shadow-sm">
                <p className="text-4xl font-black text-white mb-2">{jobs.length}</p>
                <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
                  {jobs.length === 1 ? "Job" : "Jobs"} Posted
                </p>
              </div>
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 text-center rounded-3xl shadow-sm">
                <p className="text-4xl font-black text-white mb-2">
                  {jobs.filter((j) => j.isFeatured).length}
                </p>
                <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Featured</p>
              </div>
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 text-center rounded-3xl shadow-sm">
                <p className="text-4xl font-black text-white mb-2">
                  {new Set(jobs.map((j) => j.categorySlug).filter(Boolean)).size}
                </p>
                <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Categories</p>
              </div>
            </div>

            {/* Jobs List */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Open Positions
                </h2>
                <Link
                  href="/dashboard/jobs"
                  className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  Browse all jobs →
                </Link>
              </div>

              {jobs.length === 0 ? (
                <div className="bg-zinc-900/30 border border-zinc-800 p-20 text-center rounded-[2.5rem]">
                  <p className="text-lg font-medium text-zinc-500">
                    No jobs posted yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.slug}`}
                      className="group block bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8 hover:bg-zinc-900/80 transition-all hover:border-zinc-700 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-6">
                        <div className="min-w-0 flex-1 space-y-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-blue-500 transition-colors">
                              {job.title}
                            </h3>
                            {job.isFeatured && (
                              <span className="bg-blue-600/10 text-blue-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-500/20">
                                FEATURED
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                            {job.categoryName && (
                              <span className="text-blue-500">{job.categoryName}</span>
                            )}
                            <span className="w-1 h-1 rounded-full bg-zinc-800" />
                            <span>{job.location || "Remote"}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-800" />
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {new Date(job.postedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-zinc-900 text-zinc-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-zinc-800 group-hover:border-zinc-700">
                              {job.jobType.replace("_", " ")}
                            </span>
                            <span className="bg-zinc-900 text-zinc-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-zinc-800 group-hover:border-zinc-700">
                              {job.remoteScope}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 pt-1">
                          <span className="inline-flex h-12 items-center justify-center px-6 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-lg">
                            View job →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

