import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { companies, jobs, categories } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ExternalLink, MapPin, Globe, ChevronLeft, Building2, LayoutGrid, Calendar, Briefcase } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

async function getCompany(slug: string) {
    const companyRecord = await db
        .select()
        .from(companies)
        .where(eq(companies.slug, slug))
        .limit(1)
        .then((rows) => rows[0] || null);

    if (!companyRecord) return null;

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
            isPremium: jobs.isPremium,
            tags: jobs.tags,
            categoryName: categories.name,
            categorySlug: categories.slug,
        })
        .from(jobs)
        .leftJoin(categories, eq(jobs.categoryId, categories.id))
        .where(eq(jobs.companyId, companyRecord.id))
        .orderBy(desc(jobs.postedAt));

    return { company: companyRecord, jobs: companyJobs };
}

export default async function DashboardCompanyPage({ params }: Params) {
    const resolved = await params;
    const data = await getCompany(resolved.slug);
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!data) {
        return notFound();
    }

    const { company, jobs: companyJobs } = data;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10">
            {/* Header / Breadcrumbs */}
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard/jobs"
                    className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors"
                >
                    <div className="p-2 rounded-xl bg-white border border-gray-100 group-hover:border-blue-100 transition-all">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    Back to Browse
                </Link>
            </div>

            {/* Company Profile Hero */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-10 sm:p-12 space-y-10">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="w-24 h-24 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl font-black text-gray-300 shadow-sm overflow-hidden">
                        {company.logoUrl ? (
                            <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                        ) : (
                            company.name[0]
                        )}
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900">
                            {company.name}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-gray-500">
                            {company.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    <span>{company.location}</span>
                                </div>
                            )}
                            {company.websiteUrl && (
                                <a
                                    href={company.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                >
                                    <Globe className="w-4 h-4 text-blue-500" />
                                    <span>Website</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                    {[
                        { label: "Active Jobs", value: companyJobs.length, icon: Briefcase },
                        { label: "Featured", value: companyJobs.filter(j => j.isFeatured).length, icon: LayoutGrid },
                        { label: "Remote Type", value: "Fully Remote", icon: Globe }
                    ].map((stat, i) => (
                        <div key={i} className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center gap-2 border border-transparent hover:border-gray-100 transition-all">
                            <stat.icon className="w-5 h-5 text-gray-300" />
                            <span className="text-2xl font-black text-gray-900 tabular-nums">{stat.value}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Open Positions</h2>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Sorted by most recent
                    </div>
                </div>

                <div className="space-y-4">
                    {companyJobs.length === 0 ? (
                        <div className="bg-white border border-gray-100 p-16 text-center rounded-[2.5rem]">
                            <p className="font-bold text-gray-400">No active positions at the moment.</p>
                        </div>
                    ) : (
                        companyJobs.map((job) => (
                            <Link
                                key={job.id}
                                href={`/dashboard/jobs/${job.slug}`}
                                className="block bg-white border border-gray-100 rounded-3xl p-8 hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-blue-500/5 group"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                            {job.isFeatured && (
                                                <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[10px] font-black rounded border border-yellow-100 uppercase tracking-widest">Featured</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <span className="text-blue-600">{job.categoryName}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{new Date(job.postedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-8 py-3 bg-gray-50 text-gray-900 text-sm font-bold rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all border border-gray-100 group-hover:border-blue-600">
                                        View Full Details
                                    </div>
                                </div>
                            </Link>
                        )
                        ))}
                </div>
            </div>
        </div>
    );
}


