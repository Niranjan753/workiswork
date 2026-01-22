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
    <div className="relative min-h-screen bg-[#0B0B0B] text-white overflow-hidden">
      {/* Hero Success Section */}
      <section className="relative z-10 border-b border-[#3a3a3a] py-16 sm:py-24 bg-[#0B0B0B]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/20 mb-6">
            <CheckCircle2 className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white mb-4">
            Job is live!
          </h1>
          <p className="text-lg sm:text-xl font-medium text-gray-400 max-w-2xl mx-auto">
            <span className="text-white font-bold">{job.title}</span> is now active on WorkIsWork and visible to thousands of remote job seekers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <section className="grid gap-6 sm:grid-cols-2 mb-12">
          <Link
            href={`/jobs/${job.slug}`}
            className="group border border-[#3a3a3a] bg-[#1a1a1a] p-8 rounded-2xl hover:border-orange-500/50 hover:bg-[#222222] transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-black text-white tracking-tight">View job listing</h3>
              <ArrowRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-sm font-medium text-gray-400">
              See how your job appears to candidates on the board
            </p>
          </Link>

          <Link
            href={`/hire`}
            className="group border border-[#3a3a3a] bg-[#1a1a1a] p-8 rounded-2xl hover:border-orange-500/50 hover:bg-[#222222] transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-black text-white tracking-tight">Post another</h3>
              <ArrowRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-sm font-medium text-gray-400">
              Hire for another position or team
            </p>
          </Link>
        </section>

        {/* Next Steps */}
        <section className="border border-[#3a3a3a] bg-[#1a1a1a] p-10 rounded-3xl">
          <h2 className="text-2xl font-black text-white mb-8 tracking-tighter">What happens next?</h2>
          <div className="grid gap-8 sm:grid-cols-3 text-sm font-medium">
            <div className="space-y-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20 text-orange-500 font-black text-sm">
                1
              </div>
              <div>
                <p className="font-bold text-white text-base mb-1">Live visibility</p>
                <p className="text-gray-400 leading-relaxed">Your job is now indexed and searchable by thousands of daily visitors looking for remote roles.</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20 text-orange-500 font-black text-sm">
                2
              </div>
              <div>
                <p className="font-bold text-white text-base mb-1">Direct applications</p>
                <p className="text-gray-400 leading-relaxed">Candidates will apply directly via your provided URL or email, maintaining your existing workflow.</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20 text-orange-500 font-black text-sm">
                3
              </div>
              <div>
                <p className="font-bold text-white text-base mb-1">Hire the best</p>
                <p className="text-gray-400 leading-relaxed">Qualify and interview the top remote talent from around the world to grow your team.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-[#FF5A1F] px-10 py-4 text-base font-black uppercase tracking-widest text-white rounded-2xl hover:bg-[#E54D15] transition-all shadow-xl shadow-orange-500/20"
          >
            Go to Jobs Board
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}

