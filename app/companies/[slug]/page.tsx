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
    <div className="relative min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Header */}
      <section className="relative z-10 py-16 sm:py-24 border-b border-zinc-900 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <span className="text-3xl font-black text-zinc-700">
                  {company.name[0]}
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-6xl font-black mb-6">
              {company.name}
            </h1>

            <div className="flex flex-wrap gap-6 text-sm font-bold uppercase tracking-widest text-zinc-500">
              {company.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  {company.location}
                </div>
              )}
              {company.websiteUrl && (
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white"
                >
                  <Globe className="w-4 h-4 text-blue-500" />
                  Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 pt-16 pb-24">
        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-3 mb-16">
          <Stat label="Jobs Posted" value={jobs.length} />
          <Stat
            label="Featured"
            value={jobs.filter((j) => j.isFeatured).length}
          />
          <Stat
            label="Categories"
            value={
              new Set(jobs.map((j) => j.categorySlug).filter(Boolean)).size
            }
          />
        </div>

        {/* Jobs */}
        <section className="space-y-8">
          <h2 className="text-2xl font-black">Open Positions</h2>

          {jobs.length === 0 ? (
            <div className="bg-zinc-900/30 border border-zinc-800 p-20 text-center rounded-[2.5rem]">
              <p className="text-zinc-500">No jobs posted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug}`}
                  className="block bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 hover:bg-zinc-900/80 transition"
                >
                  <h3 className="text-2xl font-bold mb-2">{job.title}</h3>

                  <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    {job.categoryName && (
                      <span className="text-blue-500">
                        {job.categoryName}
                      </span>
                    )}
                    <span>{job.location || "Remote"}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(job.postedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-8 text-center rounded-3xl">
      <p className="text-4xl font-black mb-2">{value}</p>
      <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
        {label}
      </p>
    </div>
  );
}
