import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { headers } from "next/headers";

import { db } from "../../../../db";
import {
  alerts,
  categories,
  companies,
  companyUsers,
  jobTypeEnum,
  jobs,
  remoteScopeEnum,
  users,
} from "../../../../db/schema";
import { auth } from "../../../../lib/auth";
import { guessLogoFromWebsite } from "../../../../lib/logo";
import { sendAlertEmail } from "../../../../lib/resend";

const createJobSchema = z.object({
  title: z.string().min(3),
  companyName: z.string().min(2),
  companyWebsite: z.string().url().optional().or(z.literal("")),
  companyId: z.number().optional(),
  categorySlug: z.string().min(2),
  applyUrl: z.string().url(),
  receiveApplicationsByEmail: z.boolean().optional().default(false),
  companyEmail: z.string().email(),
  highlightColor: z.string().optional(),
  descriptionHtml: z.string().min(10),
  tags: z.array(z.string()).optional().default([]),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // No authentication required - anyone can post a job
    const h = await headers();
    const session = await auth.api.getSession({ headers: h });
    
    // Optional: Link to user if they're logged in, but not required
    let userId: string | null = null;
    if (session?.user?.id) {
      const userRow = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1)
        .then((rows) => rows[0]);
      
      if (userRow) {
        userId = userRow.id;
      }
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

    // Find or create company
    let company;
    let isNewCompany = false;
    
    // If companyId is provided, use that company
    if (data.companyId) {
      company = await db
        .select()
        .from(companies)
        .where(eq(companies.id, data.companyId))
        .limit(1)
        .then((rows) => rows[0]);
      
      if (!company) {
        return NextResponse.json(
          { error: `Company with ID ${data.companyId} not found` },
          { status: 400 }
        );
      }
      
      // Update company name and website if provided
      if (data.companyName !== company.name || data.companyWebsite) {
        try {
          await db
            .update(companies)
            .set({
              name: data.companyName,
              websiteUrl: data.companyWebsite || company.websiteUrl,
            })
            .where(eq(companies.id, company.id));
          company.name = data.companyName;
          if (data.companyWebsite) {
            company.websiteUrl = data.companyWebsite;
          }
        } catch (err) {
          console.error("[POST /api/admin/jobs] Failed to update company", err);
        }
      }
    } else {
      // Find or create company by name
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

      if (existingCompany) {
        company = existingCompany;
      } else {
        company = await db
          .insert(companies)
          .values({
            name: data.companyName,
            slug: companySlug,
            websiteUrl: data.companyWebsite || null,
            logoUrl: guessLogoFromWebsite(data.companyWebsite),
          })
          .returning()
          .then((rows) => rows[0]!);
        isNewCompany = true;
      }
    }

    // link company owner if new and user is logged in (best-effort; don't block job creation)
    if (isNewCompany && userId) {
      try {
        await db.insert(companyUsers).values({
          companyId: company.id,
          userId: userId,
          role: "owner",
        });
      } catch (err) {
        console.error("[POST /api/admin/jobs] Failed to link company owner", err);
        // continue without failing the whole request
      }
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
        location: "Worldwide", // All jobs are worldwide remote
        jobType: "full_time", // Default
        remoteScope: "worldwide", // Default
        applyUrl: data.applyUrl,
        receiveApplicationsByEmail: data.receiveApplicationsByEmail ?? false,
        companyEmail: data.companyEmail,
        highlightColor: data.highlightColor || null,
        isFeatured: false,
        isPremium: false,
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

    // Immediately notify matching alerts based on keyword in title/tags.
    // One email per user per job, sent sequentially to avoid Resend rate limits.
    try {
      const jobText = [data.title, ...(data.tags || [])]
        .join(" ")
        .toLowerCase();

      const activeAlerts = await db
        .select()
        .from(alerts)
        .where(eq(alerts.isActive, true));

      const notifiedEmails = new Set<string>();

      for (const alert of activeAlerts) {
        if (!alert.keyword) continue;
        const kw = alert.keyword.toLowerCase();
        if (!jobText.includes(kw)) continue;
        if (notifiedEmails.has(alert.email)) continue; // one email per user

        await sendAlertEmail({
          to: alert.email,
          keyword: alert.keyword,
          frequency: (alert.frequency as "daily" | "weekly") || "daily",
          jobTitles: [data.title],
        });

        notifiedEmails.add(alert.email);
        // Small delay so we don't hit Resend's per‑second rate limit
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
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


