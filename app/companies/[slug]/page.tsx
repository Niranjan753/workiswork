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
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Company Header */}
      <section className="relative z-10 py-12 sm:py-16 border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-foreground mb-3">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
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
                    className="flex items-center gap-1.5 hover:text-foreground hover:underline transition-colors text-primary"
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
      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 bg-background">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-12">
          <div className="border border-border bg-background p-6 text-center rounded-lg shadow-sm">
            <p className="text-3xl font-bold text-foreground mb-1">{jobs.length}</p>
            <p className="text-sm font-medium text-muted-foreground">
              {jobs.length === 1 ? "Job" : "Jobs"} Posted
            </p>
          </div>
          <div className="border border-border bg-background p-6 text-center rounded-lg shadow-sm">
            <p className="text-3xl font-bold text-foreground mb-1">
              {jobs.filter((j) => j.isFeatured).length}
            </p>
            <p className="text-sm font-medium text-muted-foreground">Featured</p>
          </div>
          <div className="border border-border bg-background p-6 text-center rounded-lg shadow-sm">
            <p className="text-3xl font-bold text-foreground mb-1">
              {new Set(jobs.map((j) => j.categorySlug).filter(Boolean)).size}
            </p>
            <p className="text-sm font-medium text-muted-foreground">Categories</p>
          </div>
        </div>

        {/* Jobs List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Open Positions
            </h2>
            <Link
              href="/jobs"
              className="text-sm font-bold text-muted-foreground hover:text-foreground hover:underline transition-colors"
            >
              Browse all jobs →
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="border border-border bg-background p-12 text-center rounded-lg">
              <p className="text-lg font-medium text-muted-foreground">
                No jobs posted yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug}`}
                  className="group block border border-border bg-background rounded-lg p-6 hover:bg-secondary/50 transition-all"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        {job.isFeatured && (
                          <span className="bg-secondary text-secondary-foreground px-2 py-1 text-[10px] font-bold rounded">
                            FEATURED
                          </span>
                        )}
                        {job.isPremium && (
                          <span className="bg-primary text-primary-foreground px-2 py-1 text-[10px] font-bold rounded">
                            PREMIUM
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
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
                              className="bg-secondary text-secondary-foreground rounded px-2 py-1 text-[10px] font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground/70">
                          {job.jobType.replace("_", " ")}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground/70">
                          {job.remoteScope}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-block px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/80 transition-all cursor-pointer">
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
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-base font-bold rounded-md hover:bg-primary/90 transition-all shadow-md"
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
