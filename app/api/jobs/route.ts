import { NextResponse } from "next/server";
import { and, desc, eq, gte, ilike, inArray, or, sql } from "drizzle-orm";

import { db } from "../../../db";
import { categories, companies, jobs } from "../../../db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE_DEFAULT = 20;
const PAGE_SIZE_MAX = 50;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page") ?? "1");
  const pageSizeRaw = Number(searchParams.get("limit") ?? PAGE_SIZE_DEFAULT);
  const pageSize = Math.min(
    Math.max(pageSizeRaw || PAGE_SIZE_DEFAULT, 1),
    PAGE_SIZE_MAX,
  );

  const q = searchParams.get("q") || "";
  const categorySlug = searchParams.get("category") || undefined;
  // Allow multiple category filters (?category=software-development&category=design)
  const categorySlugs = searchParams.getAll("category").filter(Boolean);
  const jobType = searchParams.get("job_type") || undefined;
  const remoteScope = searchParams.get("remote_scope") || undefined;
  const minSalary = searchParams.get("min_salary");
  const location = searchParams.get("location") || undefined;
  const sort = searchParams.get("sort") || "date"; // date | relevance
  const premiumOnly = searchParams.get("premium") === "true";

  const filters = [];

  if (q) {
    const pattern = `%${q}%`;
    filters.push(
      or(
        ilike(jobs.title, pattern),
        ilike(jobs.descriptionHtml, pattern),
        ilike(companies.name, pattern),
      ),
    );
  }

  // Handle multiple categories
  if (categorySlugs.length > 0) {
    filters.push(inArray(categories.slug, categorySlugs));
  } else if (categorySlug) {
    // Fallback for single value
    filters.push(eq(categories.slug, categorySlug));
  }

  // Allow multiple job_type filters (?job_type=full_time&job_type=contract)
  const jobTypes = searchParams.getAll("job_type").filter(Boolean);
  if (jobTypes.length === 1 && jobTypes[0]?.includes(",")) {
    jobTypes.splice(0, 1, ...jobTypes[0].split(",").map((t) => t.trim()));
  }
  if (jobTypes.length > 0) {
    filters.push(inArray(jobs.jobType, jobTypes as any));
  } else if (jobType) {
    // Fallback for single value
    filters.push(eq(jobs.jobType, jobType as any));
  }

  if (remoteScope) {
    filters.push(eq(jobs.remoteScope, remoteScope as any));
  }

  if (minSalary) {
    filters.push(gte(jobs.salaryMin, sql`${minSalary}`));
  }

  if (location) {
    const pattern = `%${location}%`;
    filters.push(ilike(jobs.location, pattern));
  }

  if (premiumOnly) {
    filters.push(eq(jobs.isPremium, true));
  }

  const where =
    filters.length > 0 ? and.apply(null, filters as any) : undefined;

  const orderBy =
    sort === "relevance" && q
      ? [desc(jobs.isFeatured), desc(jobs.isPremium), desc(jobs.postedAt)]
      : [desc(jobs.postedAt)];

  const offset = (page - 1) * pageSize;

  const [rows, [{ count }]] = await Promise.all([
    db
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
        companyName: companies.name,
        companyLogo: companies.logoUrl,
        categorySlug: categories.slug,
      })
      .from(jobs)
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .leftJoin(categories, eq(jobs.categoryId, categories.id))
      .where(where)
      .orderBy(...orderBy)
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(jobs)
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .leftJoin(categories, eq(jobs.categoryId, categories.id))
      .where(where)
      .limit(1),
  ]);

  const total = Number(count ?? 0);
  const totalPages = Math.ceil(total / pageSize);

  return NextResponse.json({
    page,
    pageSize,
    total,
    totalPages,
    jobs: rows,
  });
}


