import { NextResponse } from "next/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { alerts, categories, companies, jobs } from "@/db/schema";
import { guessLogoFromWebsite } from "@/lib/logo";
import { sendAlertEmail } from "@/lib/resend";
import { getSiteUrl } from "@/lib/site-url";
import { ensurePolarConfig, retrievePolarCheckout } from "@/lib/polar-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MetadataMap = Record<string, unknown>;

function reconstructJobData(metadata: MetadataMap) {
  if (!metadata || metadata["custom_flow"] !== "job_posting") {
    throw new Error("Invalid checkout flow for job creation");
  }

  // Reconstruct description from chunked custom_ fields
  const description = Object.entries(metadata)
    .filter(([key]) => key.startsWith("custom_job_desc_"))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => (value ?? "").toString())
    .join("");

  const tagsValue = metadata["custom_job_tags"];
  const tags = typeof tagsValue === "string" ? tagsValue.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const jobData = {
    title: (metadata["custom_job_title"] || "").toString(),
    companyName: (metadata["custom_company_name"] || "").toString(),
    companyWebsite: (metadata["custom_company_website"] || "").toString(),
    categorySlug: (metadata["custom_category_slug"] || "").toString(),
    applyUrl: (metadata["custom_apply_url"] || "").toString(),
    receiveApplicationsByEmail: metadata["custom_receive_email"] === "true",
    companyEmail: (metadata["custom_company_email"] || "").toString(),
    highlightColor: (metadata["custom_highlight_color"] || "").toString() || null,
    descriptionHtml: description,
    tags,
    jobType: (metadata["custom_job_type"] || "").toString() || "full_time",
    remoteScope: (metadata["custom_remote_scope"] || "").toString() || "worldwide",
    location: (metadata["custom_location"] || "").toString() || "Worldwide",
    salaryMin: metadata["custom_salary_min"] ? Number(metadata["custom_salary_min"]) : undefined,
    salaryMax: metadata["custom_salary_max"] ? Number(metadata["custom_salary_max"]) : undefined,
  };

  if (!jobData.title || !jobData.companyName || !jobData.categorySlug || !jobData.applyUrl) {
    throw new Error("Missing required job metadata");
  }

  return jobData;
}

export async function GET(request: Request) {
  const polarCheck = ensurePolarConfig({ jobProductId: process.env.POLAR_JOB_PRODUCT_ID });
  if (polarCheck) return polarCheck;

  try {
    const { searchParams } = new URL(request.url);
    const checkoutId = searchParams.get("checkout_id");

    if (!checkoutId) {
      return NextResponse.json({ error: "Missing checkout_id" }, { status: 400 });
    }

    const checkout = await retrievePolarCheckout(checkoutId);

    if (!checkout || !checkout.status || !["succeeded", "confirmed"].includes(checkout.status)) {
      return NextResponse.json(
        { error: `Checkout status ${checkout?.status ?? "unknown"} is not paid` },
        { status: 400 },
      );
    }

    const jobData = reconstructJobData((checkout.metadata as MetadataMap) || {});

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, jobData.categorySlug))
      .limit(1);

    if (!category) {
      return NextResponse.json({ error: `Category "${jobData.categorySlug}" not found` }, { status: 400 });
    }

    const companySlug = jobData.companyName
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
          name: jobData.companyName,
          slug: companySlug,
          websiteUrl: jobData.companyWebsite || null,
          logoUrl: jobData.companyWebsite ? await guessLogoFromWebsite(jobData.companyWebsite) : null,
        })
        .returning()
        .then((rows) => rows[0]));

    const baseSlug = `${jobData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${companySlug}`;
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    const inserted = await db
      .insert(jobs)
      .values({
        title: jobData.title,
        slug: uniqueSlug,
        companyId: company.id,
        categoryId: category.id,
        location: jobData.location || "Worldwide",
        jobType: (jobData.jobType as any) || "full_time",
        remoteScope: (jobData.remoteScope as any) || "worldwide",
        applyUrl: jobData.applyUrl,
        receiveApplicationsByEmail: jobData.receiveApplicationsByEmail ?? false,
        companyEmail: jobData.companyEmail,
        highlightColor: jobData.highlightColor,
        isFeatured: false,
        isPremium: false,
        source: "polar",
        descriptionHtml: jobData.descriptionHtml,
        tags: jobData.tags || [],
      })
      .returning({
        id: jobs.id,
        slug: jobs.slug,
        title: jobs.title,
      })
      .then((rows) => rows[0]);

    // Notify alerts (best-effort)
    try {
      const jobText = [jobData.title, ...(jobData.tags || [])].join(" ").toLowerCase();
      const activeAlerts = await db
        .select()
        .from(alerts)
        .where(eq(alerts.isActive, true));

      const notifiedEmails = new Set<string>();

      for (const alert of activeAlerts) {
        if (!alert.keyword) continue;
        const kw = alert.keyword.toLowerCase();
        if (!jobText.includes(kw)) continue;
        if (notifiedEmails.has(alert.email)) continue;

        await sendAlertEmail({
          to: alert.email,
          keyword: alert.keyword,
          frequency: (alert.frequency as "daily" | "weekly") || "daily",
          jobTitles: [jobData.title],
        });

        notifiedEmails.add(alert.email);
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    } catch {
      // ignore alert failures
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl() || "https://workiswork.xyz";
    const successUrl = new URL(`/post/success`, siteUrl);
    successUrl.searchParams.set("job_slug", inserted.slug);
    successUrl.searchParams.set("company_slug", companySlug);

    return NextResponse.redirect(successUrl.toString(), { status: 307 });
  } catch (error: any) {
    console.error("[GET /api/payments/success] Polar flow error:", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to process payment",
      },
      { status: 500 },
    );
  }
}
