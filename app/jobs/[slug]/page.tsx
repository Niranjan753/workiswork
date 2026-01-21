import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { jobs, companies, categories } from "@/db/schema";
import { getSiteUrl, getOgImageUrl } from "@/lib/site-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

async function getJob(slug: string) {
  const job = await db
    .select({
      id: jobs.id,
      slug: jobs.slug,
      title: jobs.title,
      descriptionHtml: jobs.descriptionHtml,
      location: jobs.location,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      salaryCurrency: jobs.salaryCurrency,
      jobType: jobs.jobType,
      remoteScope: jobs.remoteScope,
      postedAt: jobs.postedAt,
      applyUrl: jobs.applyUrl,
      tags: jobs.tags,
      companyName: companies.name,
      companyLogo: companies.logoUrl,
      companyWebsite: companies.websiteUrl,
      categoryId: categories.id,
      categoryName: categories.name,
    })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .leftJoin(categories, eq(jobs.categoryId, categories.id))
    .where(eq(jobs.slug, slug))
    .limit(1)
    .then((rows) => rows[0] || null);

  if (!job) return { job: null, similar: [] };

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

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { job } = await getJob(slug);

  if (!job) {
    return {
      title: "Job not found",
      description: "This job is no longer available.",
    };
  }

  const title = `${job.title} at ${job.companyName} | WorkIsWork`;
  const description = `Remote ${job.jobType} role. Apply now.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/jobs/${slug}`,
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

export default async function JobDetailPage({ params }: Params) {
  const { slug } = await params;
  const { job, similar } = await getJob(slug);

  if (!job) return notFound();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top bar */}
      <header className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link
            href="/jobs"
            className="text-sm text-zinc-600 hover:text-black"
          >
            ← Back to jobs
          </Link>
        </div>
      </header>

      {/* Layout */}
      <main className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        {/* LEFT */}
        <article className="space-y-10">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              {job.categoryName}
            </p>

            <h1 className="text-4xl font-semibold leading-tight">
              {job.title}
            </h1>

            <p className="text-zinc-600">
              {job.companyName} · {job.location || "Remote"}
            </p>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
            <span className="border border-zinc-300 px-3 py-1">
              {job.jobType.replace("_", " ")}
            </span>
            <span className="border border-zinc-300 px-3 py-1">
              {job.remoteScope}
            </span>
            {job.salaryMin && (
              <span className="border border-zinc-300 px-3 py-1">
                {job.salaryCurrency} {job.salaryMin}
                {job.salaryMax && ` – ${job.salaryMax}`}
              </span>
            )}
          </div>

          {/* Description */}
          <div
            className="prose max-w-none
              prose-headings:text-black
              prose-headings:font-semibold
              prose-p:text-zinc-800
              prose-li:text-zinc-800
              prose-a:text-black
              prose-a:underline"
            dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
          />

          {/* Tags */}
          {/* @ts-ignore */}
          {job.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6 border-t border-zinc-200">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-zinc-600 border border-zinc-300 px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* RIGHT */}
        <aside className="space-y-6">
          <div className="border border-zinc-200 p-6 space-y-6 sticky top-6 bg-white">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                Company
              </p>

              <div className="flex items-center gap-3">
                {job.companyLogo && (
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    className="w-10 h-10 object-contain"
                  />
                )}
                <span className="font-medium">
                  {job.companyName}
                </span>
              </div>

              {job.companyWebsite && (
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  className="text-sm text-zinc-600 hover:text-black"
                >
                  {job.companyWebsite.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>

            <div className="text-sm text-zinc-600">
              Posted{" "}
              {new Date(job.postedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center border border-black text-black py-3 font-medium hover:bg-black hover:text-white transition"
            >
              Apply
            </a>
          </div>
        </aside>
      </main>

      {/* Similar jobs */}
      {similar.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="text-lg font-medium mb-6">
            Similar opportunities
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((j) => (
              <Link
                key={j.id}
                href={`/jobs/${j.slug}`}
                className="border border-zinc-200 p-4 hover:border-black transition"
              >
                <h3 className="font-medium">{j.title}</h3>
                <p className="text-sm text-zinc-600 mt-1">
                  {j.companyName} · {j.location || "Remote"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
