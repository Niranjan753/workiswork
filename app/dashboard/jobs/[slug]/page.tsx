import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { categories, companies, jobs } from "@/db/schema";
import { getSiteUrl, getOgImageUrl } from "@/lib/site-url";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Briefcase, Building2, MapPin, Calendar, Clock, DollarSign, Globe, ExternalLink, ChevronLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
        .limit(3);

    return { job, similar };
}

export default async function DashboardJobDetailPage({ params }: Params) {
    const resolved = await params;
    const { job, similar } = await getJob(resolved.slug);
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!job) return notFound();

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
                    Back to Jobs
                </Link>
                <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                        {job.categoryName}
                    </span>
                    {job.isFeatured && (
                        <span className="px-4 py-1.5 bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-yellow-200">
                            Featured
                        </span>
                    )}
                </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
                {/* Main Content */}
                <div className="space-y-10">
                    <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-10 sm:p-12 space-y-10">
                        {/* Job Heading */}
                        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-4">
                                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                                    {job.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-lg font-medium text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-gray-300" />
                                        <span className="text-gray-900 font-bold">{job.companyName || "Remote company"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-gray-300" />
                                        <span>{job.location || "Remote"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <div className="w-20 h-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl font-black text-gray-300">
                                    {job.companyName?.[0] || 'R'}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: Clock, label: "Type", value: job.jobType.replace("_", " "), color: "blue" },
                                { icon: Globe, label: "Remote", value: job.remoteScope.replace("_", " "), color: "indigo" },
                                { icon: DollarSign, label: "Salary", value: job.salaryMin ? `${job.salaryCurrency} ${job.salaryMin}${job.salaryMax ? `-${job.salaryMax}` : ""}` : "Undisclosed", color: "green" },
                                { icon: Calendar, label: "Posted", value: job.postedAt ? new Date(job.postedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Just now", color: "purple" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-1 border border-transparent hover:border-gray-200 transition-all">
                                    <div className="flex items-center gap-2">
                                        <stat.icon className="w-3 h-3 text-gray-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 capitalize">{stat.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Description */}
                        <div className="relative">
                            <div
                                className="prose prose-zinc max-w-none text-gray-600 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:font-bold hover:prose-a:underline leading-relaxed text-[17px]"
                                dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
                            />
                        </div>

                        {/* Tags */}
                        {job.tags && job.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-10 border-t border-gray-50">
                                {job.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-white border border-gray-100 text-gray-500 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-[2rem] p-8 text-white space-y-8 shadow-2xl shadow-blue-500/10">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold tracking-tight">Ready to apply?</h3>
                            <p className="text-gray-400 font-medium text-[15px] leading-relaxed">
                                Apply directly to {job.companyName} through their official portal.
                            </p>
                        </div>
                        <a
                            href={job.applyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group w-full h-14 bg-white text-black font-black rounded-2xl flex items-center justify-center hover:bg-zinc-200 transition-all uppercase tracking-widest text-sm shadow-xl active:scale-[0.98] gap-2"
                        >
                            Apply Now
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                        </a>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-6">
                        <h4 className="font-bold text-gray-900 text-lg">About the company</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-gray-300">
                                    {job.companyName?.[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{job.companyName}</p>
                                    <p className="text-xs font-medium text-gray-400">{job.companyLocation || "Remote-first"}</p>
                                </div>
                            </div>
                            {job.companyWebsite && (
                                <a
                                    href={job.companyWebsite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-blue-100 hover:shadow-sm transition-all group"
                                >
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600">Company Website</span>
                                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-400" />
                                </a>
                            )}
                        </div>
                    </div>

                    {similar.length > 0 && (
                        <div className="space-y-4 pt-4">
                            <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em] px-2">Similar Opportunities</h4>
                            <div className="space-y-3">
                                {similar.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/dashboard/jobs/${item.slug}`}
                                        className="block p-5 bg-white border border-gray-100 rounded-3xl hover:border-blue-200 hover:shadow-sm transition-all group"
                                    >
                                        <h5 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{item.title}</h5>
                                        <p className="text-xs font-medium text-gray-500">{item.companyName}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
