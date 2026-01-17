import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { db } from "../../../db";
import { categories, companies, jobs } from "../../../db/schema";
import { getSiteUrl, getOgImageUrl } from "../../../lib/site-url";
import { GridBackground } from "../../../components/GridBackground";
import { CreateAlertButton } from "../../../components/jobs/create-alert-button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

async function getJob(slug: string) {
  const job = await db
    .select({
      id: jobs.id,
      slug: jobs.slug,
      title: jobs.title,
      location: jobs.location,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      salaryCurrency: jobs.salaryCurrency,
      jobType: jobs.jobType,
      remoteScope: jobs.remoteScope,
      isFeatured: jobs.isFeatured,
      isPremium: jobs.isPremium,
      postedAt: jobs.postedAt,
      applyUrl: jobs.applyUrl,
      descriptionHtml: jobs.descriptionHtml,
      tags: jobs.tags,
      companyName: companies.name,
      companyLogo: companies.logoUrl,
      companyWebsite: companies.websiteUrl,
      companyLocation: companies.location,
      categorySlug: categories.slug,
      categoryName: categories.name,
      categoryId: categories.id,
    })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .leftJoin(categories, eq(jobs.categoryId, categories.id))
    .where(eq(jobs.slug, slug))
    .limit(1)
    .then((rows) => rows[0] || null);

  if (!job) return { job: null, similar: [] as typeof job[] };

  const similar = await db
    .select({
      id: jobs.id,
      slug: jobs.slug,
      title: jobs.title,
      companyName: companies.name,
      location: jobs.location,
      postedAt: jobs.postedAt,
    })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .where(and(eq(jobs.categoryId, job.categoryId!), ne(jobs.slug, slug)))
    .limit(5);

  return { job, similar };
}

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const resolved = await params;
  const { job } = await getJob(resolved.slug);
  if (!job) {
    return {
      title: "Job not found",
      description: "This job is no longer available.",
    };
  }

  const title = `${job.title} at ${job.companyName || "Remote company"} | WorkIsWork`;
  const description = `Remote ${job.jobType} role in ${job.location || "Remote"} – apply now.`;
  const url = `${siteUrl}/jobs/${resolved.slug}`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function JobDetailPage({ params }: Params) {
  const resolved = await params;
  const { job, similar } = await getJob(resolved.slug);

  if (!job) return notFound();

  return (

    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <header className="relative z-10 border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/jobs" className="text-sm font-bold text-muted-foreground hover:text-foreground hover:underline transition-colors">
            ← Back to jobs
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded">
              {job.remoteScope}
            </span>
            {job.isFeatured && (
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded">
                Featured
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="border border-border bg-background p-8 shadow-sm rounded-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-bold">
                {job.categoryName}
              </p>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                {job.title}
              </h1>
              <p className="text-sm text-foreground/80 font-medium">
                {job.companyName || "Remote company"} • {job.location || "Remote"}
              </p>
              {job.companyWebsite && (
                <p className="mt-1 text-xs">
                  <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                    {job.companyWebsite}
                  </a>
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-primary text-primary-foreground px-5 py-2 text-xs font-bold rounded-md hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center"
              >
                Apply now
              </a>
              <CreateAlertButton />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded">
              {job.jobType.replace("_", " ")}
            </span>
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded">
              {job.remoteScope}
            </span>
            {job.salaryMin && (
              <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded">
                {job.salaryCurrency} {job.salaryMin}
                {job.salaryMax ? ` - ${job.salaryMax}` : ""} / yr
              </span>
            )}
          </div>

          <div
            className="prose prose-sm mt-6 max-w-none text-foreground prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
          />

          {job.tags && job.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary text-secondary-foreground px-3 py-1 font-bold rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {similar.length > 0 && (
          <section className="mt-8 border border-border bg-background p-6 shadow-sm rounded-lg">
            <h2 className="mb-4 text-lg font-bold text-foreground">Similar jobs</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => (
                <Link
                  key={item.id}
                  href={`/jobs/${item.slug}`}
                  className="block border border-border bg-background p-4 rounded-lg hover:bg-secondary/50 transition-all"
                >
                  <div className="space-y-3">
                    <div className="min-w-0">
                      <p className="text-base font-bold text-foreground mb-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {item.companyName || "Remote company"} •{" "}
                        {item.location || "Remote"}
                      </p>
                    </div>
                    <div>
                      <span className="inline-flex w-full items-center justify-center bg-secondary text-secondary-foreground px-4 py-2 text-xs font-bold rounded-md hover:bg-secondary/80 transition-all">
                        View job →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
