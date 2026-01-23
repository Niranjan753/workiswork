import { NextResponse } from "next/server";
import { and, desc, ilike, sql } from "drizzle-orm";
import { db } from "../../../db";
import { companies } from "../../../db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE_DEFAULT = 20;
const PAGE_SIZE_MAX = 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page") ?? "1");
  const pageSizeRaw = Number(searchParams.get("limit") ?? PAGE_SIZE_DEFAULT);
  const pageSize = Math.min(
    Math.max(pageSizeRaw || PAGE_SIZE_DEFAULT, 1),
    PAGE_SIZE_MAX,
  );

  const q = searchParams.get("q") || "";
  const locationFilter = searchParams.get("location") || undefined;

  const filters = [];

  if (q) {
    const pattern = `%${q}%`;
    filters.push(ilike(companies.name, pattern));
  }

  if (locationFilter) {
    const pattern = `%${locationFilter}%`;
    filters.push(ilike(companies.location, pattern));
  }

  const where = filters.length > 0
    ? and.apply(null, filters as any)
    : undefined;

  const orderBy = [desc(companies.createdAt)];

  const offset = (page - 1) * pageSize;

  const [rows, [{ count }]] = await Promise.all([
    db
      .select({
        id: companies.id,
        name: companies.name,
        slug: companies.slug,
        websiteUrl: companies.websiteUrl,
        twitterUrl: companies.twitterUrl,
        linkedinUrl: companies.linkedinUrl,
        location: companies.location,
        logoUrl: companies.logoUrl,
        createdAt: companies.createdAt,
      })
      .from(companies)
      .where(where)
      .orderBy(...orderBy)
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(companies)
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
    companies: rows,
  });
}
