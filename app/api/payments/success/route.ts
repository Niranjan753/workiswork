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



export async function GET(request: Request) {
  const polarCheck = ensurePolarConfig({ jobProductId: process.env.POLAR_JOB_PRODUCT_ID });
  if (polarCheck) return polarCheck;

  try {
    const { searchParams } = new URL(request.url);
    const checkoutId = searchParams.get("checkout_id");
    let jobId = searchParams.get("job_id") ? Number(searchParams.get("job_id")) : null;

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

    // If job_id wasn't in URL, try to get it from metadata
    if (!jobId && checkout.metadata) {
      jobId = checkout.metadata.custom_job_id ? Number(checkout.metadata.custom_job_id) : null;
    }

    if (!jobId) {
      return NextResponse.json({ error: "Job ID not found in checkout" }, { status: 400 });
    }

    // Find the job
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.isPublished) {
      // Already processed, redirect to success
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl() || "https://workiswork.xyz";
      const successUrl = new URL(`/post/success`, siteUrl);
      successUrl.searchParams.set("job_slug", job.slug);
      return NextResponse.redirect(successUrl.toString(), { status: 307 });
    }

    // Mark job as published and paid
    await db.update(jobs)
      .set({
        isPublished: true,
        paymentStatus: "paid",
        postedAt: new Date(), // Set publish time
      })
      .where(eq(jobs.id, jobId));

    // Notify alerts (best-effort)
    try {
      const jobText = [job.title, ...(job.tags || [])].join(" ").toLowerCase();
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
          jobTitles: [job.title],
        });

        notifiedEmails.add(alert.email);
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    } catch {
      // ignore alert failures
    }

    // Find the job with company info for redirect
    const [jobWithCompany] = await db
      .select({
        slug: jobs.slug,
        companySlug: companies.slug,
      })
      .from(jobs)
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.id, jobId))
      .limit(1);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl() || "https://workiswork.xyz";
    const successUrl = new URL(`/post/success`, siteUrl);
    successUrl.searchParams.set("job_slug", job.slug);
    if (jobWithCompany?.companySlug) {
      successUrl.searchParams.set("company_slug", jobWithCompany.companySlug);
    }

    return NextResponse.redirect(successUrl.toString(), { status: 307 });
  } catch (error: any) {
    console.error("[GET /api/payments/success] Polar success flow error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process payment" },
      { status: 500 },
    );
  }
}
