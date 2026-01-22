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
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Top bar */}
      <header className="border-b border-[#3a3a3a] bg-[#0B0B0B]">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Link
            href="/jobs"
            className="text-sm text-gray-400 hover:text-white transition-colors"
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
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-500">
              {job.categoryName}
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-tight">
              {job.title}
            </h1>

            <div className="flex items-center gap-3 text-gray-400 font-medium">
              <span>{job.companyName}</span>
              <span className="w-1 h-1 rounded-full bg-[#3a3a3a]" />
              <span>{job.location || "Remote"}</span>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest">
            <span className="bg-[#1a1a1a] border border-[#3a3a3a] text-gray-300 px-3 py-1.5 rounded-lg">
              {job.jobType.replace("_", " ")}
            </span>
            <span className="bg-[#1a1a1a] border border-[#3a3a3a] text-gray-300 px-3 py-1.5 rounded-lg">
              {job.remoteScope}
            </span>
            {job.salaryMin && (
              <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg">
                {job.salaryCurrency} {job.salaryMin}
                {job.salaryMax && ` – ${job.salaryMax}`}
              </span>
            )}
          </div>

          {/* Description */}
          <div
            className="prose prose-invert max-w-none
              prose-headings:text-white
              prose-headings:font-black
              prose-headings:tracking-tighter
              prose-p:text-gray-300
              prose-li:text-gray-300
              prose-a:text-orange-400
              prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
          />

          {/* Tags */}
          {/* @ts-ignore */}
          {job.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-10 border-t border-[#3a3a3a]">
              {/* @ts-ignore */}
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-black uppercase tracking-widest text-[#FF5A1F] bg-[#FF5A1F]/10 px-3 py-2 rounded-xl"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* RIGHT */}
        <aside className="space-y-6">
          <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-8 rounded-3xl space-y-8 sticky top-24 shadow-2xl">
            <div className="space-y-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                About the Company
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5A1F] to-orange-400 flex items-center justify-center overflow-hidden shrink-0">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.companyName || "Company"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-black text-xl">
                      {job.companyName?.charAt(0) || "?"}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="font-black text-xl tracking-tight truncate">
                    {job.companyName}
                  </h2>
                  {job.companyWebsite && (
                    <a
                      href={job.companyWebsite}
                      target="_blank"
                      className="text-xs text-orange-500 hover:text-orange-400 font-bold transition-colors"
                    >
                      {job.companyWebsite.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                Posted On
              </p>
              <div className="text-sm font-bold text-gray-300 bg-[#0B0B0B] p-3 rounded-xl border border-[#3a3a3a]">
                {new Date(job.postedAt!).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center bg-[#FF5A1F] text-white py-4 px-6 text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-[#E54D15] transition-all shadow-xl shadow-orange-500/10 active:scale-[0.98]"
            >
              Apply for this role
            </a>
          </div>
        </aside>
      </main>

      {/* Similar jobs */}
      {similar.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-24">
          <h2 className="text-2xl font-black mb-8 tracking-tighter">Similar roles</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((j) => (
              <Link
                key={j.id}
                href={`/jobs/${j.slug}`}
                className="group border border-[#3a3a3a] bg-[#1a1a1a] p-6 rounded-2xl hover:border-orange-500/50 transition-all"
              >
                <h3 className="font-black text-lg tracking-tight group-hover:text-[#FF5A1F] transition-colors">{j.title}</h3>
                <p className="text-sm font-medium text-gray-400 mt-1">
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
