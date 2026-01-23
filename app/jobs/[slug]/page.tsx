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
    <div className="relative min-h-screen bg-white text-black selection:bg-orange-500/30 overflow-x-hidden font-sans">
      {/* Dark Hero Section */}
      <div className="bg-[#0A0A0A] text-white">
        {/* Background Pattern - Vertical Lines (only in hero) */}
        <div className="absolute inset-0 h-[600px] pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '60px 100%' }} />

        {/* Glow Effects (only in hero) */}
        <div className="absolute inset-x-0 top-0 h-[600px] pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[10%] w-[60%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full" />
        </div>

        {/* Top bar */}
        <header className="border-b border-white/[0.05] bg-black/20 backdrop-blur-xl sticky top-0 z-50">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <Link
              href="/jobs"
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-none bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                <span className="text-gray-400 group-hover:text-white group-hover:-translate-x-0.5 transition-all text-sm">←</span>
              </div>
              <span className="text-sm font-bold text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest">Browse Jobs</span>
            </Link>

            <div className="flex items-center gap-8">
              <Link href="/jobs" className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em]">Categories</Link>
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-orange-500 text-white px-8 py-3 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-[0.98]"
              >
                Post a Job
              </a>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-32 text-center space-y-12">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="text-[11px] font-bold text-orange-500 uppercase tracking-[0.3em] border border-orange-500/20 px-4 py-1">
                {job.categoryName}
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none max-w-5xl mx-auto uppercase">
              {job.title} <span className="text-gray-700">/</span> {job.companyName}
            </h1>

            <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed border-l-2 border-orange-500/20 pl-8 text-left py-2">
              Hiring the next generation of digital talent. {job.jobType.replace("_", " ")} position based in {job.location || "Remote"}.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-12">
            <div className="w-px h-12 bg-white/10" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.5em] animate-pulse">Scroll to explore</span>
            <div className="w-px h-12 bg-white/10" />
          </div>
        </div>
      </div> {/* End Dark Section */}

      <main className="relative z-20 mx-auto max-w-7xl px-6 -mt-16 pb-24">
        {/* Subscription Box - Squared */}
        <div className="mb-24 bg-white border border-black p-12 md:p-20 flex flex-col md:flex-row items-center justify-between text-left gap-12 rounded-none shadow-[24px_24px_0px_rgba(0,0,0,1)]">
          <div className="space-y-4 max-w-md">
            <h2 className="text-4xl font-black text-black tracking-tight uppercase leading-none italic">Stay Ahead.</h2>
            <p className="text-gray-500 font-medium text-lg leading-tight uppercase tracking-tight">Join 17,000+ experts receiving the best remote opportunities every Monday.</p>
          </div>

          <div className="w-full max-w-lg space-y-4">
            <div className="flex flex-col md:flex-row gap-0 border-2 border-black">
              <input
                type="email"
                placeholder="YOUR EMAIL ADDRESS"
                className="flex-1 bg-white px-6 py-5 text-sm outline-none text-black font-bold placeholder:text-gray-300"
              />
              <button className="bg-black text-white px-10 py-5 text-sm font-black uppercase hover:bg-orange-500 transition-all">
                Join Now
              </button>
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">0% SPAM • 100% QUALITY</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-10">


            <article className="bg-white border-2 border-black p-8 md:p-16 rounded-none shadow-[12px_12px_0px_rgba(0,0,0,0.05)]">
              <div className="space-y-12">
                <div className="flex items-center gap-6">
                  <div className="w-1.5 h-12 bg-black" />
                  <div>
                    <h2 className="text-3xl font-black text-black tracking-tighter uppercase italic">Job Details</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Everything you need to know about this role</p>
                  </div>
                </div>

                <div
                  className="prose prose-zinc max-w-none
                  prose-p:text-gray-800 prose-p:leading-relaxed prose-p:text-[19px] prose-p:font-medium
                  prose-headings:text-black prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase
                  prose-li:text-gray-800 prose-li:text-[18px] prose-li:mb-4
                  prose-strong:text-black prose-strong:font-black
                  prose-a:text-orange-500 prose-a:font-bold prose-a:underline decoration-2 underline-offset-4 hover:bg-orange-50 transition-all
                  prose-ul:my-10 prose-ul:list-square"
                  dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
                />

                <div className="pt-12 border-t-2 border-gray-50 flex flex-wrap gap-3">
                  {/* @ts-ignore */}
                  {job.tags?.length > 0 && job.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-black text-black bg-gray-50 border border-gray-200 px-4 py-2 rounded-none hover:bg-black hover:text-white transition-all cursor-default uppercase tracking-widest">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* RIGHT COLUMN (SIDEBAR) */}
          <aside className="space-y-10">
            {/* Action Card - Squared */}
            <div className="bg-black text-white p-10 rounded-none sticky top-24 shadow-[20px_20px_0px_rgba(249,115,22,0.1)]">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Ready?</h3>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-loose">
                    JOIN {job.companyName} TODAY.
                  </p>
                </div>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-orange-500 text-white text-center py-5 rounded-none text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all border-2 border-orange-500 hover:border-black active:scale-[0.98]"
                >
                  Apply Now
                </a>

                <div className="pt-6 border-t border-white/10 text-center">
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                    External Application Policy Applies
                  </p>
                </div>
              </div>
            </div>

            {/* Company Card - Squared */}
            <div className="bg-white border-2 border-black p-8 rounded-none space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-none bg-gray-50 border border-gray-200 flex items-center justify-center text-4xl font-black text-gray-200 shrink-0">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.companyName || ""} className="w-full h-full object-cover" />
                  ) : (
                    job.companyName?.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-black tracking-tighter uppercase">{job.companyName}</h3>
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Official Partner</p>
                </div>
              </div>

              <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
                Established leader in digital innovation and remote-first culture.
              </p>

              <Link
                href={`/companies/${job.companyName?.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center justify-between p-5 rounded-none bg-gray-50 border border-black group/btn hover:bg-black transition-all"
              >
                <span className="text-xs font-black text-black uppercase tracking-widest group-hover/btn:text-white">Profile</span>
                <ChevronRight className="w-5 h-5 text-black group-hover/btn:text-white" />
              </Link>
            </div>

            {/* Details Card - Squared */}
            <div className="bg-white border-2 border-black p-8 rounded-none space-y-8 shadow-[12px_12px_0px_rgba(0,0,0,0.03)]">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-4">Specifications</h4>

              <div className="space-y-8">
                <div className="flex gap-4 items-center">
                  <Calendar className="w-5 h-5 text-black" />
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Posted</p>
                    <p className="text-xs font-black text-black uppercase">
                      {new Date(job.postedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <MapPin className="w-5 h-5 text-black" />
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Local</p>
                    <p className="text-xs font-black text-black uppercase">{job.location || "Worldwide"}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <Briefcase className="w-5 h-5 text-black" />
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Type</p>
                    <p className="text-xs font-black text-black uppercase capitalize">{job.jobType.replace("_", " ")}</p>
                  </div>
                </div>

                {job.salaryMin && (
                  <div className="flex gap-4 items-center">
                    <Tag className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Comp</p>
                      <p className="text-xs font-black text-black uppercase">
                        ${job.salaryMin.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-gray-100 flex justify-between">
                {[Twitter, Linkedin, Mail, LinkIcon].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Similar jobs - Squared */}
      {similar.length > 0 && (
        <section className="bg-gray-50 border-t border-black/5 pb-32 pt-24 mt-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between mb-16">
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-black tracking-tighter uppercase leading-none">Similar Roles</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-0.5 bg-orange-500" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Explore related opportunities</p>
                </div>
              </div>
              <Link href="/jobs" className="text-xs font-black text-black uppercase tracking-[0.2em] hover:text-orange-500 transition-colors border-b-2 border-black pb-1">
                Browse all →
              </Link>
            </div>

            <div className="grid gap-1 lg:grid-cols-3 bg-black border border-black overflow-hidden shadow-[32px_32px_0px_rgba(0,0,0,0.03)]">
              {similar.map((j) => (
                <Link
                  key={j.id}
                  href={`/jobs/${j.slug}`}
                  className="group relative bg-white p-10 hover:bg-orange-50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-10">
                    <div className="w-16 h-16 rounded-none bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl font-black text-gray-200 group-hover:bg-black group-hover:text-white transition-all">
                      {j.companyName?.charAt(0)}
                    </div>
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      {new Date(j.postedAt!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <h3 className="font-black text-2xl text-black tracking-tighter uppercase italic leading-none mb-4 group-hover:translate-x-2 transition-transform">{j.title}</h3>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className="text-black">{j.companyName}</span>
                    <span className="text-orange-500">/</span>
                    <span>{j.location || "Remote"}</span>
                  </div>

                  <div className="mt-12 flex items-center text-[10px] font-black text-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                    View Project <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
