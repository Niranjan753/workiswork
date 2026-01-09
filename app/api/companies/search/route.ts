import { NextResponse } from "next/server";
import { db } from "@/db";
import { companies } from "@/db/schema";
import { ilike } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ companies: [] });
    }

    const results = await db
      .select({
        id: companies.id,
        name: companies.name,
        slug: companies.slug,
        websiteUrl: companies.websiteUrl,
      })
      .from(companies)
      .where(ilike(companies.name, `%${query}%`))
      .limit(10);

    return NextResponse.json({ companies: results });
  } catch (err: any) {
    console.error("[GET /api/companies/search] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to search companies" },
      { status: 500 }
    );
  }
}

