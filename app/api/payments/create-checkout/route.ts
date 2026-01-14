import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site-url";
import { createPolarCheckout, ensurePolarConfig } from "@/lib/polar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type JobData = {
  title: string;
  companyName: string;
  companyWebsite?: string;
  categorySlug: string;
  applyUrl: string;
  receiveApplicationsByEmail?: boolean;
  companyEmail?: string;
  highlightColor?: string;
  descriptionHtml: string;
  tags?: string[];
  jobType?: string;
  remoteScope?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
};

const MAX_METADATA_VALUE = 480; // stay under Polar's 500 char value limit

function chunkText(key: string, value: string, target: Record<string, string>) {
  if (!value) return;
  for (let i = 0; i < value.length; i += MAX_METADATA_VALUE) {
    target[`${key}_${String(i / MAX_METADATA_VALUE).padStart(2, "0")}`] = value.slice(i, i + MAX_METADATA_VALUE);
  }
}

function buildJobMetadata(jobData: JobData) {
  const metadata: Record<string, string | boolean> = {
    flow: "job_posting",
    job_title: jobData.title || "",
    company_name: jobData.companyName || "",
    company_website: jobData.companyWebsite || "",
    category_slug: jobData.categorySlug || "",
    apply_url: jobData.applyUrl || "",
    company_email: jobData.companyEmail || "",
    receive_email: !!jobData.receiveApplicationsByEmail,
    highlight_color: jobData.highlightColor || "",
    job_type: jobData.jobType || "",
    remote_scope: jobData.remoteScope || "",
    location: jobData.location || "",
    salary_min: jobData.salaryMin?.toString() || "",
    salary_max: jobData.salaryMax?.toString() || "",
  };

  const tags = (jobData.tags || []).filter(Boolean).join(",");
  if (tags) {
    metadata.job_tags = tags.slice(0, MAX_METADATA_VALUE);
  }

  chunkText("job_desc", jobData.descriptionHtml || "", metadata);
  return metadata;
}

export async function POST(request: Request) {
  const polarCheck = ensurePolarConfig({ jobProductId: process.env.POLAR_JOB_PRODUCT_ID });
  if (polarCheck) return polarCheck;

  try {
    const body = await request.json();
    const { jobData } = body as { jobData?: JobData };

    if (!jobData) {
      return NextResponse.json({ error: "Job data is required" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl() || "https://workiswork.xyz";
    const metadata = buildJobMetadata(jobData);

    const checkout = await createPolarCheckout({
      products: [process.env.POLAR_JOB_PRODUCT_ID],
      success_url: `${siteUrl}/api/payments/success?checkout_id={CHECKOUT_ID}`,
      allow_discount_codes: true,
      require_billing_address: false,
      metadata,
    });

    if (!checkout?.url) {
      throw new Error("Polar did not return a checkout URL");
    }

    return NextResponse.json({
      checkout_id: checkout.id,
      url: checkout.url,
    });
  } catch (error: any) {
    console.error("[POST /api/payments/create-checkout] Polar error:", error);
    const message = error?.message || "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
