import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { jobs, companies, categories } from "@/db/schema";
import { getSiteUrl, getOgImageUrl } from "@/lib/site-url";
import {
  Calendar,
  MapPin,
  Briefcase,
  Tag,
  Globe,
  Share2,
  Twitter,
  Linkedin,
  Mail,
  Link as LinkIcon,
  ExternalLink,
  ChevronRight
} from "lucide-react";

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
    <div className="relative min-h-screen bg-[#060606] text-[#E0E0E0] selection:bg-orange-500/30 overflow-x-hidden">
      {/* Background Pattern - Vertical Lines */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '60px 100%' }} />

      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[60%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full" />
      </div>
      {/* Top bar */}
      <header className="border-b border-white/[0.05] bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link
            href="/jobs"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors">
              <span className="text-gray-400 group-hover:text-white group-hover:-translate-x-0.5 transition-all text-sm">←</span>
            </div>
            <span className="text-sm font-bold text-gray-500 group-hover:text-white transition-colors">Browse all</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/jobs" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">Categories</Link>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-orange-500 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-[0.98]"
            >
              Post a Job
            </a>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-12 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter text-white leading-none max-w-4xl mx-auto uppercase">
            {job.title} <span className="text-gray-500">at</span> {job.companyName}
          </h1>

          <div className="w-px h-16 bg-white/10 mx-auto" />

          <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed italic">
            Join the future of remote work. Hand picked jobs for modern professionals.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 py-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <span className="text-[10px] font-bold text-orange-500/60 uppercase tracking-[0.4em]">Scroll to explore</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12">
        <div className="mb-12 bg-[#0C0C0C] border border-white/[0.05] rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-4 text-gray-500 font-medium">
            <span>Send new remote jobs to</span>
            <input
              type="email"
              placeholder="you@email.com"
              className="bg-black border border-white/10 px-4 py-3 rounded-xl text-sm focus:border-orange-500 outline-none w-64 transition-all"
            />
            <span>every week!</span>
            <button className="bg-orange-500 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/10">
              Subscribe
            </button>
          </div>
          <div className="text-[10px] font-bold text-orange-500/50 uppercase tracking-widest">
            17,000+ remote workers already subscribed
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-10">
            {/* Hero / Header Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-orange-500/20">
                  {job.categoryName}
                </span>
                <span className="text-white/10 text-xs">•</span>
                <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                  <Globe className="w-4 h-4 text-orange-500/50" />
                  {job.location || "Worldwide"}
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white leading-[1.05]">
                {job.title}
              </h1>

              <div className="flex items-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-orange-500/50" />
                  <span className="text-sm font-semibold tracking-wide uppercase">{job.jobType.replace("_", "-")}</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  <span className="text-xs uppercase tracking-widest text-gray-500">Actively Hiring</span>
                </div>
              </div>
            </div>

            <article className="bg-[#0C0C0C] border border-white/[0.05] rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="p-8 md:p-14">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-px h-8 bg-orange-500" />
                  <h2 className="text-2xl font-bold text-white tracking-tight">Job Description</h2>
                </div>

                <div
                  className="prose prose-invert max-w-none
                  prose-p:text-gray-400 prose-p:leading-relaxed prose-p:text-[18px]
                  prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                  prose-li:text-gray-400 prose-li:text-[18px] prose-li:mb-2
                  prose-strong:text-white prose-strong:font-bold
                  prose-a:text-orange-500 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                  prose-ul:my-8"
                  dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
                />

                <div className="mt-16 pt-10 border-t border-white/[0.05] flex flex-wrap gap-3">
                  {/* @ts-ignore */}
                  {job.tags?.length > 0 && job.tags.map((tag) => (
                    <span key={tag} className="text-[11px] font-bold text-gray-400 bg-white/[0.02] border border-white/[0.05] px-4 py-2 rounded-xl hover:bg-white/[0.05] hover:text-white transition-colors cursor-default">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* RIGHT COLUMN (SIDEBAR) */}
          <aside className="space-y-8">
            {/* Action Card */}
            <div className="bg-[#0A0A0A] border border-orange-500/20 rounded-[2rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight">Ready to apply?</h3>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">
                    Join {job.companyName} and start your next adventure today.
                  </p>
                </div>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center bg-orange-500 text-white py-4 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-[0.98]"
                >
                  Apply for this role
                </a>
                <p className="text-[10px] text-gray-500 text-center font-medium uppercase tracking-[0.2em]">
                  External Application
                </p>
              </div>
            </div>

            <div className="bg-[#0C0C0C] border border-white/[0.05] rounded-[2.5rem] p-8 group hover:border-white/[0.1] transition-all">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 rounded-3xl bg-black border border-white/[0.05] flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.companyName || ""} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-extrabold text-white/20">{job.companyName?.charAt(0)}</span>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{job.companyName}</h3>
                  <p className="text-sm text-gray-500 font-medium">{job.companyWebsite?.replace(/^https?:\/\//, "").replace(/\/$/, "")}</p>
                </div>

                <Link
                  href={`/companies/${job.companyName?.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all group/btn"
                >
                  <span className="text-sm font-bold text-white group-hover/btn:text-orange-500 transition-colors">View Profile</span>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover/btn:text-orange-500 group-hover/btn:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-[#0C0C0C] border border-white/[0.05] rounded-[2.5rem] p-8 space-y-10">
              <div className="space-y-6">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600">Details</h4>

                <div className="grid grid-cols-1 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center shrink-0 border border-orange-500/10">
                      <Calendar className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date Posted</p>
                      <p className="text-sm font-bold text-white">
                        {new Date(job.postedAt!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center shrink-0 border border-orange-500/10">
                      <MapPin className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Location</p>
                      <p className="text-sm font-bold text-white">{job.location || "Remote"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center shrink-0 border border-orange-500/10">
                      <Briefcase className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Job Type</p>
                      <p className="text-sm font-bold text-white capitalize">{job.jobType.replace("_", " ")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/[0.05] space-y-6">
                <h4 className="text-sm font-bold text-white text-center tracking-widest uppercase opacity-20">Share Job</h4>
                <div className="flex items-center justify-center gap-4">
                  {[Twitter, Linkedin, Mail, LinkIcon].map((Icon, i) => (
                    <button key={i} className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-gray-500 hover:text-orange-500 hover:bg-orange-500/5 hover:border-orange-500/20 transition-all hover:-translate-y-1">
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Similar jobs */}
      {similar.length > 0 && (
        <section className="relative z-10 mx-auto max-w-7xl px-4 pb-32 mt-20">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold text-white tracking-tighter">Similar Roles</h2>
              <p className="text-sm text-gray-500 font-medium">Explore related opportunities in {job.categoryName}</p>
            </div>
            <Link href="/jobs" className="text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors">
              Browse all jobs →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((j) => (
              <Link
                key={j.id}
                href={`/jobs/${j.slug}`}
                className="group relative bg-[#0A0A0A] border border-white/[0.05] p-8 rounded-[2rem] hover:border-orange-500/20 hover:bg-[#0E0E0E] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-2xl font-bold text-white/20 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all">
                    {j.companyName?.charAt(0)}
                  </div>
                  <div className="text-[10px] font-bold text-gray-600 bg-white/[0.05] px-2.5 py-1 rounded-lg">
                    {new Date(j.postedAt!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <h3 className="font-bold text-xl text-white tracking-tight group-hover:text-orange-500 transition-colors mb-2">{j.title}</h3>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <span>{j.companyName}</span>
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                  <span>{j.location || "Remote"}</span>
                </div>

                <div className="mt-8 flex items-center text-xs font-bold text-orange-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 transition-transform">
                  View Role <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
