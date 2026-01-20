import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "../../../../db";
import {
  alerts,
  categories,
  companies,
  companyUsers,
  jobs,
} from "../../../../db/schema";
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
  jobType: z
    .enum(["full_time", "part_time", "freelance", "contract", "internship"])
    .optional()
    .default("full_time"),
  remoteScope: z
    .enum(["worldwide", "europe", "north_america", "latam", "asia"])
    .optional()
    .default("worldwide"),
  location: z.string().min(1).optional().default("Worldwide"),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = createJobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, data.categorySlug))
      .limit(1);

    if (!category) {
      return NextResponse.json(
        { error: `Category "${data.categorySlug}" not found` },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────────────
    // Find or create company
    // ─────────────────────────────────────────────
    let company;

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

      if (data.companyName !== company.name || data.companyWebsite) {
        await db
          .update(companies)
          .set({
            name: data.companyName,
            websiteUrl: data.companyWebsite || company.websiteUrl,
          })
          .where(eq(companies.id, company.id));
      }
    } else {
      const companySlug = data.companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      company =
        (await db
          .select()
          .from(companies)
          .where(eq(companies.slug, companySlug))
          .limit(1)
          .then((rows) => rows[0])) ??
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
    }

    // ─────────────────────────────────────────────
    // Create job
    // ─────────────────────────────────────────────
    const baseSlug = `${data.title}-${company.name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    const job = await db
      .insert(jobs)
      .values({
        title: data.title,
        slug: uniqueSlug,
        companyId: company.id,
        categoryId: category.id,
        location: data.location || "Worldwide",
        jobType: data.jobType,
        remoteScope: data.remoteScope,
        salaryMin: data.salaryMin ? String(data.salaryMin) : null,
        salaryMax: data.salaryMax ? String(data.salaryMax) : null,
        salaryCurrency: "USD",
        applyUrl: data.applyUrl,
        receiveApplicationsByEmail: data.receiveApplicationsByEmail,
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

    // ─────────────────────────────────────────────
    // Notify alerts (best-effort)
    // ─────────────────────────────────────────────
    try {
      const jobText = [data.title, ...(data.tags || [])]
        .join(" ")
        .toLowerCase();

      const activeAlerts = await db
        .select()
        .from(alerts)
        .where(eq(alerts.isActive, true));

      const notified = new Set<string>();

      for (const alert of activeAlerts) {
        if (!alert.keyword) continue;
        if (!jobText.includes(alert.keyword.toLowerCase())) continue;
        if (notified.has(alert.email)) continue;

        await sendAlertEmail({
          to: alert.email,
          keyword: alert.keyword,
          frequency: (alert.frequency as "daily" | "weekly") || "daily",
          jobTitles: [data.title],
        });

        notified.add(alert.email);
        await new Promise((r) => setTimeout(r, 500));
      }
    } catch {
      // ignore alert failures
    }

    return NextResponse.json({ job }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/admin/jobs] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create job" },
      { status: 500 }
    );
  }
}
