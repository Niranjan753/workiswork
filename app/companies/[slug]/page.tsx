import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { companies, jobs, categories } from "@/db/schema";
import { GridBackground } from "@/components/GridBackground";
import { getSiteUrl, getOgImageUrl } from "@/lib/site-url";
import { ExternalLink, MapPin, Globe, Calendar } from "lucide-react";

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

  if (!data) {
    return notFound();
  }

  const { company, jobs } = data;

  return (
    <div className="relative min-h-screen bg-white text-black overflow-hidden">
      <GridBackground />

      {/* Company Header */}
      <section className="relative z-10 bg-yellow-400 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Removed Company Logo */}
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-black mb-3">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-black/80">
                {company.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{company.location}</span>
                  </div>
                )}
                {company.websiteUrl && (
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-black transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-12">
          <div className="border-2 border-black bg-white p-6 text-center">
            <p className="text-3xl font-black text-black mb-1">{jobs.length}</p>
            <p className="text-sm font-medium text-black/70">
              {jobs.length === 1 ? "Job" : "Jobs"} Posted
            </p>
          </div>
          <div className="border-2 border-black bg-white p-6 text-center">
            <p className="text-3xl font-black text-black mb-1">
              {jobs.filter((j) => j.isFeatured).length}
            </p>
            <p className="text-sm font-medium text-black/70">Featured</p>
          </div>
          <div className="border-2 border-black bg-white p-6 text-center">
            <p className="text-3xl font-black text-black mb-1">
              {new Set(jobs.map((j) => j.categorySlug).filter(Boolean)).size}
            </p>
            <p className="text-sm font-medium text-black/70">Categories</p>
          </div>
        </div>

        {/* Jobs List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-black">
              Open Positions
            </h2>
            <Link
              href="/jobs"
              className="text-sm font-bold text-black/70 hover:text-black underline"
            >
              Browse all jobs →
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="border-2 border-black bg-white p-12 text-center">
              <p className="text-lg font-medium text-black/70">
                No jobs posted yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug}`}
                  className="group block border-2 border-black bg-white p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-black text-black leading-tight group-hover:text-yellow-700 transition-colors">
                          {job.title}
                        </h3>
                        {job.isFeatured && (
                          <span className="border-2 border-black bg-yellow-400 px-2 py-1 text-[10px] font-bold text-black">
                            FEATURED
                          </span>
                        )}
                        {job.isPremium && (
                          <span className="border-2 border-black bg-black px-2 py-1 text-[10px] font-bold text-yellow-400">
                            PREMIUM
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-medium text-black/60">
                        {job.categoryName && (
                          <span>{job.categoryName}</span>
                        )}
                        <span>•</span>
                        <span>{job.location || "Remote"}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(job.postedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      {job.tags && job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {job.tags.slice(0, 5).map((tag) => (
                            <span
                              key={tag}
                              className="border-2 border-black bg-yellow-100 px-2 py-1 text-[10px] font-bold text-black"
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
                      <span className="inline-block px-4 py-2 bg-black text-white text-sm font-bold border-2 border-black hover:bg-yellow-400 hover:text-black transition-all cursor-pointer shadow-sm">
                        View job →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        {company.websiteUrl && (
          <div className="mt-12 text-center">
            <a
              href={company.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-black bg-yellow-400 px-8 py-4 text-base font-bold text-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg"
            >
              Visit {company.name} website
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
