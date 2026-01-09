import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { companies, jobs } from "@/db/schema";
import { GridBackground } from "@/components/GridBackground";
import { getSiteUrl, getOgImageUrl } from "@/lib/site-url";
import { CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Job Posted Successfully – WorkIsWork",
  description: "Your job has been posted successfully to the WorkIsWork board.",
  openGraph: {
    type: "website",
    url: `${siteUrl}/post/success`,
    title: "Job Posted Successfully – WorkIsWork",
    description: "Your job has been posted successfully to the WorkIsWork board.",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Posted Successfully – WorkIsWork",
    description: "Your job has been posted successfully to the WorkIsWork board.",
    images: [ogImage],
  },
};

async function getJobAndCompany(jobSlug: string, companySlug: string) {
  const job = await db
    .select({
      id: jobs.id,
      slug: jobs.slug,
      title: jobs.title,
      postedAt: jobs.postedAt,
      companyName: companies.name,
      companySlug: companies.slug,
      companyLogo: companies.logoUrl,
      companyWebsite: companies.websiteUrl,
    })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(jobs.slug, jobSlug))
    .limit(1)
    .then((rows) => rows[0] || null);

  if (!job) return null;

  // Get all jobs for this company
  const companyJobs = await db
    .select({
      id: jobs.id,
      slug: jobs.slug,
      title: jobs.title,
      postedAt: jobs.postedAt,
    })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(companies.slug, companySlug))
    .orderBy(desc(jobs.postedAt))
    .limit(10);

  return { job, companyJobs };
}

export default async function PostSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ job_slug?: string; company_slug?: string }> | { job_slug?: string; company_slug?: string };
}) {
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  const jobSlug = params?.job_slug;
  const companySlug = params?.company_slug;

  if (!jobSlug || !companySlug) {
    return notFound();
  }

  const data = await getJobAndCompany(jobSlug, companySlug);
  if (!data) {
    return notFound();
  }

  const { job, companyJobs } = data;

  return (
    <div className="relative min-h-screen bg-white text-black overflow-hidden">
      <GridBackground />

      {/* Hero Success Section */}
      <section className="relative z-10 bg-yellow-400 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black mb-6">
            <CheckCircle2 className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-black mb-4">
            Your job is posted!
          </h1>
          <p className="text-lg sm:text-xl font-medium text-black/80 max-w-2xl mx-auto">
            <span className="font-bold">{job.title}</span> is now live on WorkIsWork and visible to thousands of remote job seekers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <section className="grid gap-4 sm:grid-cols-2 mb-12">
          <Link
            href={`/jobs/${job.slug}`}
            className="group border-2 border-black bg-white p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-black text-black">View your job</h3>
              <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-sm font-medium text-black/70">
              See how your job listing appears to candidates
            </p>
          </Link>

          <Link
            href={`/companies/${companySlug}`}
            className="group border-2 border-black bg-white p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-black text-black">View company page</h3>
              <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-sm font-medium text-black/70">
              See all your jobs and company profile
            </p>
          </Link>
        </section>

        {/* Company Jobs Section */}
        {companyJobs.length > 0 && (
          <section className="border-2 border-black bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-black mb-2">
                  {job.companyName}
                </h2>
                <p className="text-sm font-medium text-black/70">
                  {companyJobs.length} {companyJobs.length === 1 ? "job" : "jobs"} posted
                </p>
              </div>
              {job.companyWebsite && (
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border-2 border-black bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-black hover:text-yellow-400 transition-all"
                >
                  Visit website
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="space-y-3">
              {companyJobs.map((companyJob) => (
                <Link
                  key={companyJob.id}
                  href={`/jobs/${companyJob.slug}`}
                  className="group block border-2 border-black bg-white p-4 hover:bg-yellow-100 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-base font-black text-black mb-1 group-hover:text-yellow-700 transition-colors">
                        {companyJob.title}
                      </h3>
                      <p className="text-xs font-medium text-black/60">
                        Posted {new Date(companyJob.postedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-black/40 group-hover:text-black group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t-2 border-black">
              <Link
                href={`/companies/${companySlug}`}
                className="inline-flex items-center gap-2 border-2 border-black bg-black px-6 py-3 text-sm font-bold text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all"
              >
                View all jobs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Next Steps */}
        <section className="mt-12 border-2 border-black bg-yellow-100 p-8">
          <h2 className="text-xl font-black text-black mb-4">What happens next?</h2>
          <div className="space-y-4 text-sm font-medium text-black/80">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-yellow-400 font-bold text-xs shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-bold text-black">Your job is live</p>
                <p>It's now visible on the WorkIsWork jobs board and searchable by thousands of remote job seekers.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-yellow-400 font-bold text-xs shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-bold text-black">Candidates will apply</p>
                <p>Qualified candidates will apply directly through your application URL.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-yellow-400 font-bold text-xs shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-bold text-black">Review applications</p>
                <p>Check your email or ATS for new applications from qualified remote candidates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 border-2 border-black bg-yellow-400 px-8 py-4 text-base font-bold text-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg"
          >
            Browse all jobs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}

