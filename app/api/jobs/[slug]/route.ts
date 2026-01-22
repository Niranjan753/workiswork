import { NextResponse, type NextRequest } from "next/server";
import { and, eq, ne } from "drizzle-orm";

import { db } from "../../../../db";
import { categories, companies, jobs } from "../../../../db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: NextRequest, context: Context) {
  const { slug } = await context.params;

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

  if (!job) {
    console.error("[jobs/[slug]] not found", { slug, hasDbUrl: !!process.env.DATABASE_URL });
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

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
    .where(
      and(
        eq(jobs.categoryId, job.categoryId as any),
        ne(jobs.slug, slug),
      ),
    )
    .limit(6);

  return NextResponse.json({ job, similar });
}


