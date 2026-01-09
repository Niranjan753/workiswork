import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { categories, companies, jobs } from "@/db/schema";
import { guessLogoFromWebsite } from "@/lib/logo";
import { sendAlertEmail } from "@/lib/resend";
import { alerts } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("payment_id");
    const status = searchParams.get("status");

    if (!paymentId) {
      return NextResponse.json(
        { error: "Missing payment_id" },
        { status: 400 }
      );
    }

    if (status !== "succeeded") {
      return NextResponse.json(
        { error: `Payment status is ${status}, expected succeeded` },
        { status: 400 }
      );
    }

    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Dodo Payments API key not configured" },
        { status: 500 }
      );
    }

    const client = new DodoPayments({
      bearerToken: apiKey,
      environment: process.env.NODE_ENV === "production" ? "live_mode" : "test_mode",
    });

    // Retrieve the payment to get the checkout session ID
    const payment = await client.payments.retrieve(paymentId);

    if (!payment || !payment.checkout_session_id) {
      return NextResponse.json(
        { error: "Payment not found or not associated with a checkout session" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session to verify it's completed
    const session = await client.checkoutSessions.retrieve(payment.checkout_session_id);

    if (!session || session.payment_status !== "succeeded") {
      return NextResponse.json(
        { error: "Checkout session payment not succeeded" },
        { status: 400 }
      );
    }

    // Extract job data from payment metadata (metadata is passed through from checkout session)
    const jobDataStr = payment.metadata?.jobData;
    if (!jobDataStr) {
      // Fallback: try to get from payment metadata directly
      console.error("[GET /api/payments/success] Job data not found in payment metadata:", payment.metadata);
      return NextResponse.json(
        { error: "Job data not found in payment metadata" },
        { status: 400 }
      );
    }

    const jobData = JSON.parse(jobDataStr);

    // Find category
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, jobData.categorySlug))
      .limit(1);

    if (!category) {
      return NextResponse.json(
        { error: `Category "${jobData.categorySlug}" not found` },
        { status: 400 }
      );
    }

    // Find or create company
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
          logoUrl: jobData.companyLogo || (jobData.companyWebsite ? await guessLogoFromWebsite(jobData.companyWebsite) : null),
        })
        .returning()
        .then((rows) => rows[0]));

    // Create job slug
    const baseSlug = `${jobData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${companySlug}`;
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    // Create the job
    const inserted = await db
      .insert(jobs)
      .values({
        title: jobData.title,
        slug: uniqueSlug,
        companyId: company.id,
        categoryId: category.id,
        location: "Worldwide",
        jobType: "full_time",
        remoteScope: "worldwide",
        applyUrl: jobData.applyUrl,
        receiveApplicationsByEmail: jobData.receiveApplicationsByEmail ?? false,
        companyEmail: jobData.companyEmail,
        highlightColor: jobData.highlightColor || null,
        isFeatured: false,
        isPremium: false,
        source: "admin",
        descriptionHtml: jobData.descriptionHtml,
        tags: jobData.tags || [],
      })
      .returning({
        id: jobs.id,
        slug: jobs.slug,
        title: jobs.title,
      })
      .then((rows) => rows[0]);

    // Notify matching alerts
    try {
      const jobText = [jobData.title, ...(jobData.tags || [])]
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
        if (notifiedEmails.has(alert.email)) continue;

        await sendAlertEmail({
          to: alert.email,
          keyword: alert.keyword,
          frequency: (alert.frequency as "daily" | "weekly") || "daily",
          jobTitles: [jobData.title],
        });

        notifiedEmails.add(alert.email);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch {
      // fail silently
    }

    // Redirect to success page with job and company info
    const successUrl = new URL(`/post/success`, request.url);
    successUrl.searchParams.set("job_slug", inserted.slug);
    successUrl.searchParams.set("company_slug", companySlug);
    return NextResponse.redirect(successUrl);
  } catch (error: any) {
    console.error("[GET /api/payments/success] Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to process payment",
      },
      { status: 500 }
    );
  }
}

