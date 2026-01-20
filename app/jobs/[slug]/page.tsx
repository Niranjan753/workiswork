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
    <div className="relative min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.05)_0%,transparent_70%)]" />
      </div>

      <header className="relative z-10 border-b border-zinc-900 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/jobs" className="text-sm font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
            ← Back to jobs
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <span className="bg-zinc-900 text-zinc-400 px-3 py-1 rounded-lg border border-zinc-800">
              {job.remoteScope}
            </span>
            {job.isFeatured && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow-lg shadow-blue-900/20">
                Featured
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500">
                  {job.categoryName}
                </p>
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-lg font-medium text-zinc-400">
                  <span className="text-white">{job.companyName || "Remote company"}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <span>{job.location || "Remote"}</span>
                </div>
                {job.companyWebsite && (
                  <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-blue-500 hover:text-blue-400 transition-colors font-bold tracking-tight">
                    {job.companyWebsite.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-3 min-w-[180px]">
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white text-black h-14 px-8 text-sm font-black rounded-2xl hover:bg-zinc-200 transition-all shadow-xl active:scale-95 flex items-center justify-center uppercase tracking-widest text-center"
                >
                  Apply now
                </a>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="bg-zinc-800/50 text-zinc-400 px-4 py-1.5 text-xs font-bold rounded-xl border border-zinc-700/50 uppercase tracking-wider">
                {job.jobType.replace("_", " ")}
              </span>
              <span className="bg-zinc-800/50 text-zinc-400 px-4 py-1.5 text-xs font-bold rounded-xl border border-zinc-700/50 uppercase tracking-wider">
                {job.remoteScope}
              </span>
              {job.salaryMin && (
                <span className="bg-zinc-800/50 text-blue-400 px-4 py-1.5 text-xs font-bold rounded-xl border border-blue-900/30 uppercase tracking-wider">
                  {job.salaryCurrency} {job.salaryMin}
                  {job.salaryMax ? ` - ${job.salaryMax}` : ""} / yr
                </span>
              )}
            </div>

            <div className="mt-12 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

            <div className="relative mt-12">
              <div
                className="prose prose-invert prose-zinc max-w-none text-zinc-300 prose-headings:text-white prose-strong:text-white prose-a:text-blue-500 prose-a:font-bold hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
              />
            </div>

            {job.tags && job.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-zinc-800/80 text-zinc-500 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-xl hover:text-white transition-colors cursor-default border border-zinc-700/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {similar.length > 0 && (
          <section className="mt-12 space-y-8">
            <h2 className="text-2xl font-black text-white tracking-tight px-4">Similar Remote Opportunities</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => (
                <Link
                  key={item.id}
                  href={`/jobs/${item.slug}`}
                  className="group bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 p-6 rounded-3xl hover:bg-zinc-900 transition-all hover:border-zinc-700 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-500 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-zinc-500 font-medium">
                        {item.companyName || "Remote company"} <br />
                        {item.location || "Remote"}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400">
                      <span>{item.postedAt ? new Date(item.postedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Just now"}</span>
                      <span>View →</span>
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
