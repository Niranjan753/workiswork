import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getServerSession } from "next-auth";

import { db } from "../../../../db";
import {
  alerts,
  categories,
  companies,
  companyUsers,
  jobTypeEnum,
  jobs,
  remoteScopeEnum,
} from "../../../../db/schema";
import { authOptions } from "../../auth/[...nextauth]/route";
import { guessLogoFromWebsite } from "../../../../lib/logo";
import { sendAlertEmail } from "../../../../lib/resend";

const createJobSchema = z.object({
  title: z.string().min(3),
  companyName: z.string().min(2),
  companyWebsite: z.string().url().optional().or(z.literal("")),
  location: z.string().min(2),
  categorySlug: z.string().min(2),
  jobType: z.enum(jobTypeEnum.enumValues),
  remoteScope: z.enum(remoteScopeEnum.enumValues),
  salaryMin: z.string().optional().or(z.literal("")),
  salaryMax: z.string().optional().or(z.literal("")),
  salaryCurrency: z.string().default("USD"),
  applyUrl: z.string().url(),
  isFeatured: z.boolean().optional().default(false),
  isPremium: z.boolean().optional().default(false),
  descriptionHtml: z.string().min(10),
  tags: z.array(z.string()).optional().default([]),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session?.user?.email || !session.user?.id) {
      console.error("[POST /api/admin/jobs] Unauthorized:", {
        hasSession: !!session,
        hasEmail: !!session?.user?.email,
        hasId: !!session?.user?.id,
      });
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const parsed = createJobSchema.safeParse(body);
    if (!parsed.success) {
      console.error("[POST /api/admin/jobs] Validation error:", parsed.error);
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, data.categorySlug))
      .limit(1);

    if (!category) {
      console.error(
        "[POST /api/admin/jobs] Category not found:",
        data.categorySlug,
      );
      return NextResponse.json(
        { error: `Category "${data.categorySlug}" not found` },
        { status: 400 },
      );
    }

    // Find or create company tied to this user
    const companySlug = data.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existingCompany = await db
      .select()
      .from(companies)
      .where(eq(companies.slug, companySlug))
      .limit(1)
      .then((rows) => rows[0]);

    const company =
      existingCompany ??
      (await db
        .insert(companies)
        .values({
          name: data.companyName,
          slug: companySlug,
          websiteUrl: data.companyWebsite || null,
          logoUrl: guessLogoFromWebsite(data.companyWebsite),
        })
        .returning()
        .then((rows) => rows[0]!));

    // link company owner if new
    if (!existingCompany) {
      await db.insert(companyUsers).values({
        companyId: company.id,
        userId: session.user.id as string,
        role: "owner",
      });
    }

    const baseSlug = `${data.title}-${company.name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    const inserted = await db
      .insert(jobs)
      .values({
        title: data.title,
        slug: uniqueSlug,
        companyId: company.id,
        categoryId: category.id,
        location: data.location,
        salaryMin: data.salaryMin || null,
        salaryMax: data.salaryMax || null,
        salaryCurrency: data.salaryCurrency || "USD",
        jobType: data.jobType,
        remoteScope: data.remoteScope,
        isFeatured: data.isFeatured ?? false,
        isPremium: data.isPremium ?? false,
        applyUrl: data.applyUrl,
        source: "admin",
        descriptionHtml: data.descriptionHtml,
        tags: data.tags,
      })
      .returning({
        id: jobs.id,
        slug: jobs.slug,
        title: jobs.title,
      })
      .then((rows) => rows[0]);

    // Immediately notify matching alerts based on keyword in title/tags
    try {
      const jobText = [
        data.title,
        ...(data.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      const activeAlerts = await db
        .select()
        .from(alerts)
        .where(eq(alerts.isActive, true));

      await Promise.all(
        activeAlerts.map(async (alert) => {
          if (!alert.keyword) return;
          const kw = alert.keyword.toLowerCase();
          if (!jobText.includes(kw)) return;

          await sendAlertEmail({
            to: alert.email,
            keyword: alert.keyword,
            frequency: (alert.frequency as "daily" | "weekly") || "daily",
            jobTitles: [data.title],
          });
        }),
      );
    } catch {
      // fail silently; job creation should still succeed
    }

    return NextResponse.json({ job: inserted }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/admin/jobs] Error:", err);
    return NextResponse.json(
      {
        error: err.message || "Failed to create job",
        details: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 },
    );
  }
}


