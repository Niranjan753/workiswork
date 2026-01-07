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
    <div className="min-h-screen bg-white text-black">
      <header className="border-b-2 border-black bg-white shadow-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/jobs" className="text-sm font-bold text-black hover:underline">
            ← Back to jobs
          </Link>
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="rounded-full border border-black bg-yellow-100 px-3 py-1 text-black">
              {job.remoteScope}
            </span>
            {job.isFeatured && (
              <span className="rounded-full border border-black bg-yellow-100 px-3 py-1 text-black font-bold">
                Featured
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-2xl border-2 border-black bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-yellow-800 font-bold">
                {job.categoryName}
              </p>
              <h1 className="text-3xl font-black text-black mb-1">
                {job.title}
              </h1>
              <p className="text-sm text-black/70 font-medium">
                {job.companyName || "Remote company"} • {job.location || "Remote"}
              </p>
              {job.companyWebsite && (
                <p className="mt-1 text-xs">
                  <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-yellow-900 underline hover:text-yellow-700">
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
                className="rounded-full bg-black px-5 py-2 text-xs font-bold text-yellow-400 hover:bg-yellow-500 hover:text-black border-2 border-black transition-colors"
              >
                Apply now
              </a>
              <Link
                href="/alerts"
                className="rounded-full border-2 border-black bg-yellow-400 px-5 py-2 text-xs font-bold text-black hover:bg-black hover:text-yellow-400 transition-colors"
              >
                Create alert
              </Link>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-black/70">
            <span className="rounded-full border border-black/10 bg-yellow-100 px-2 py-1">
              {job.jobType.replace("_", " ")}
            </span>
            <span className="rounded-full border border-black/10 bg-yellow-100 px-2 py-1">
              {job.remoteScope}
            </span>
            {job.salaryMin && (
              <span className="rounded-full border border-black/10 bg-yellow-100 px-2 py-1">
                {job.salaryCurrency} {job.salaryMin}
                {job.salaryMax ? ` - ${job.salaryMax}` : ""} / yr
              </span>
            )}
          </div>

          <div
            className="prose prose-sm mt-6 max-w-none text-black prose-a:text-yellow-700"
            dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
          />

          {job.tags && job.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/10 bg-yellow-100 px-2 py-1 font-bold text-yellow-900"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {similar.length > 0 && (
          <section className="mt-8 rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
            <h2 className="mb-3 text-sm font-black text-black">Similar jobs</h2>
            <div className="space-y-3">
              {similar.map((item) => (
                <Link
                  key={item.id}
                  href={`/jobs/${item.slug}`}
                  className="block rounded-xl border border-black/10 px-4 py-4 text-xs text-black hover:bg-yellow-50 transition"
                >
                  <div className="space-y-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold text-black">
                        {item.title}
                      </p>
                      <p className="truncate text-xs text-black/60">
                        {item.companyName || "Remote company"} •{" "}
                        {item.location || "Remote"}
                      </p>
                    </div>
                    <div>
                      <span className="inline-flex w-full items-center justify-center border-2 border-black bg-yellow-400 px-4 py-2 text-xs font-bold text-black">
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
