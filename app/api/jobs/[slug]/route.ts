import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";

import { db } from "../../../../db";
import { categories, companies, jobs } from "../../../../db/schema";

type Params = {
  params: {
    slug: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  const { slug } = params;

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
    })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .leftJoin(categories, eq(jobs.categoryId, categories.id))
    .where(eq(jobs.slug, slug))
    .limit(1)
    .then((rows) => rows[0] || null);

  if (!job) {
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
        eq(jobs.categoryId, jobs.categoryId),
        ne(jobs.slug, slug),
      ) as any,
    )
    .limit(6);

  return NextResponse.json({ job, similar });
}


