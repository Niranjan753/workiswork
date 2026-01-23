import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { companies, jobs, categories } from "@/db/schema";
import { getSiteUrl, getOgImageUrl } from "@/lib/site-url";
import { ExternalLink, MapPin, Globe, Calendar } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

type Params = { params: Promise<{ slug: string }> };

async function getCompany(slug: string) {
  const company = await db
    .select()
    .from(companies)
    .where(eq(companies.slug, slug))
    .limit(1)
    .then((rows) => rows[0] || null);

  if (!company) return null;

  const companyJobs = await db
    .select({
      id: jobs.id,
      slug: jobs.slug,
      title: jobs.title,
      location: jobs.location,
      jobType: jobs.jobType,
      remoteScope: jobs.remoteScope,
      postedAt: jobs.postedAt,
      isFeatured: jobs.isFeatured,

      tags: jobs.tags,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(jobs)
    .leftJoin(categories, eq(jobs.categoryId, categories.id))
    .where(eq(jobs.companyId, company.id))
    .orderBy(desc(jobs.postedAt));

  return { company, jobs: companyJobs };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolved = await params;
  const data = await getCompany(resolved.slug);

  if (!data) {
    return {
      title: "Company not found",
      description: "This company page could not be found.",
    };
  }

  const { company, jobs } = data;
  const title = `${company.name} – Remote Jobs | WorkIsWork`;
  const description = `View all remote jobs at ${company.name}. ${jobs.length} ${jobs.length === 1 ? "job" : "jobs"
    } available.`;
  const url = `${siteUrl}/companies/${resolved.slug}`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url,
      title,
      description,
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

export default async function CompanyPage({ params }: Params) {
  const resolved = await params;
  const data = await getCompany(resolved.slug);

  if (!data) {
    return notFound();
  }

  const { company, jobs } = data;

  return (
    <div className="bg-white min-h-screen selection:bg-orange-500/30">
      {/* Dark Hero Header */}
      <section className="bg-[#0A0A0A] text-white pt-24 pb-32 px-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '60px 100%' }} />

        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <div className="flex items-center justify-center mb-10">
            <div className="w-20 h-20 bg-white border-4 border-black rounded-none flex items-center justify-center p-3 shadow-[6px_6px_0px_#f97316]">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-3xl font-black text-black">
                  {company.name[0]}
                </span>
              )}
            </div>
          </div>

          <h1 className="text-[50px] sm:text-[70px] md:text-[90px] font-black tracking-tighter uppercase italic leading-[0.85] mb-8">
            {company.name}
          </h1>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: MapPin, label: company.location || "Remote" },
              { icon: Globe, label: "Official Site", href: company.websiteUrl }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-orange-500" />
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    {item.label} <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1200px] mx-auto px-6 pb-32 -mt-16 relative z-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-12">
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Active Roles", value: jobs.length },
                { label: "Featured", value: jobs.filter(j => j.isFeatured).length },
                { label: "Sectors", value: new Set(jobs.map(j => j.categorySlug)).size }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white border-2 border-black p-6 rounded-none shadow-[4px_4px_0px_black]">
                  <p className="text-3xl font-black tracking-tighter italic text-black leading-none mb-2">{stat.value}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Jobs Board Segment */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b-4 border-black pb-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter italic text-black">Live Opportunities</h2>
                <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">{jobs.length} VACANCIES</div>
              </div>

              {jobs.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 p-24 text-center">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300">Station Idle - No Active Roles</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {jobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.slug}`}
                      className="group bg-white border-2 border-black p-6 rounded-none transition-all shadow-[4px_4px_0px_black] hover:shadow-[8px_8px_0px_black] hover:-translate-x-1 hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black tracking-tighter uppercase italic group-hover:text-orange-500 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {job.categoryName && <span className="text-black">{job.categoryName}</span>}
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span>{job.location || "Remote"}</span>
                          </div>
                        </div>
                        <div className="text-[10px] font-black text-gray-300 group-hover:text-black transition-colors uppercase tracking-widest flex items-center gap-2">
                          Details <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Area */}
          <aside className="space-y-8">
            <div className="bg-orange-500 border-2 border-black p-8 rounded-none shadow-[6px_6px_0px_black] text-white">
              <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-[0.9] mb-4">
                Partner with <br /> {company.name}
              </h4>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 mb-8 leading-relaxed">
                Be the first to know about new opportunities from this company.
              </p>
              <button className="w-full bg-black text-white py-4 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
                Subscribe Updates
              </button>
            </div>
            
            <div className="p-6 border-2 border-black">
               <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-4">Genesis Protocol</h5>
               <p className="text-[11px] font-medium leading-relaxed text-gray-500 uppercase tracking-tight">
                 Authorized recruitment channel for {company.name}. All roles are verified for remote capability.
               </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.05] p-8 text-center rounded-3xl">
      <p className="text-4xl font-bold mb-2 tracking-tighter">{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </p>
    </div>
  );
}
