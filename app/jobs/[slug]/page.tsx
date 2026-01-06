import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { db } from "../../../db";
import { categories, companies, jobs } from "../../../db/schema";
import { getSiteUrl, getOgImageUrl } from "../../../lib/site-url";

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
    <div className="min-h-screen bg-[#fde9d7] text-zinc-900">
      <header className="border-b border-orange-200 bg-[#fde9d7]/95">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/jobs" className="text-sm font-semibold text-orange-700">
            ← Back to jobs
          </Link>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full border border-orange-300 bg-white px-3 py-1 font-semibold text-orange-700">
              {job.remoteScope}
            </span>
            {job.isFeatured && (
              <span className="rounded-full border border-orange-300 bg-orange-50 px-3 py-1 font-semibold text-orange-700">
                Featured
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-orange-600">
                {job.categoryName}
              </p>
              <h1 className="text-2xl font-semibold text-zinc-900">
                {job.title}
              </h1>
              <p className="text-sm text-zinc-600">
                {job.companyName || "Remote company"} •{" "}
                {job.location || "Remote"}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600"
              >
                Apply now
              </a>
              <a
                href="/alerts"
                className="rounded-full border border-orange-300 bg-white px-4 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-50"
              >
                Save alert
              </a>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-zinc-600">
            <span className="rounded-full border border-orange-200 bg-orange-50 px-2 py-1 font-semibold">
              {job.jobType.replace("_", " ")}
            </span>
            <span className="rounded-full border border-orange-200 bg-orange-50 px-2 py-1 font-semibold">
              {job.remoteScope}
            </span>
            {job.salaryMin && (
              <span className="rounded-full border border-orange-200 bg-orange-50 px-2 py-1 font-semibold">
                {job.salaryCurrency} {job.salaryMin}
                {job.salaryMax ? ` - ${job.salaryMax}` : ""} / yr
              </span>
            )}
          </div>

          <div
            className="prose prose-sm mt-6 max-w-none text-zinc-800 prose-a:text-orange-600"
            dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
          />

          {job.tags && job.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-orange-200 bg-orange-50 px-2 py-1 font-semibold text-orange-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {similar.length > 0 && (
          <section className="mt-8 rounded-2xl border border-orange-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900">
              Similar jobs
            </h2>
            <div className="grid gap-2">
              {similar.map((item) => (
                <Link
                  key={item.id}
                  href={`/jobs/${item.slug}`}
                  className="rounded-lg border border-orange-100 px-3 py-3 text-xs text-zinc-800 hover:bg-orange-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-zinc-900">
                        {item.title}
                      </p>
                      <p className="truncate text-[11px] text-zinc-600">
                        {item.companyName || "Remote company"} •{" "}
                        {item.location || "Remote"}
                      </p>
                    </div>
                    <span className="mt-2 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-700 sm:mt-0">
                      View job
                    </span>
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


