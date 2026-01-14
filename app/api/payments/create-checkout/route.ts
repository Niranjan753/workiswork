import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site-url";
import { createPolarCheckout, ensurePolarConfig } from "@/lib/polar-sdk";

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
  // Polar requires custom metadata fields to be simple key-value strings
  // We'll use a simplified approach with custom_ prefix
  // IMPORTANT: Polar rejects empty strings in metadata, so only include non-empty values
  const metadata: Record<string, string> = {
    custom_flow: "job_posting",
    custom_job_title: jobData.title || "",
    custom_company_name: jobData.companyName || "",
    custom_category_slug: jobData.categorySlug || "",
    custom_apply_url: jobData.applyUrl || "",
    custom_company_email: jobData.companyEmail || "",
    custom_receive_email: String(!!jobData.receiveApplicationsByEmail),
    custom_job_type: jobData.jobType || "full_time",
    custom_remote_scope: jobData.remoteScope || "worldwide",
    custom_location: jobData.location || "Worldwide",
  };

  // Only add optional fields if they have values
  if (jobData.companyWebsite) {
    metadata.custom_company_website = jobData.companyWebsite;
  }

  if (jobData.highlightColor) {
    metadata.custom_highlight_color = jobData.highlightColor;
  }

  if (jobData.salaryMin) {
    metadata.custom_salary_min = jobData.salaryMin.toString();
  }

  if (jobData.salaryMax) {
    metadata.custom_salary_max = jobData.salaryMax.toString();
  }

  const tags = (jobData.tags || []).filter(Boolean).join(",");
  if (tags) {
    metadata.custom_job_tags = tags.slice(0, MAX_METADATA_VALUE);
  }

  // Chunk the description with custom_ prefix
  if (jobData.descriptionHtml) {
    const desc = jobData.descriptionHtml;
    for (let i = 0; i < desc.length; i += MAX_METADATA_VALUE) {
      const chunkIndex = String(i / MAX_METADATA_VALUE).padStart(2, "0");
      metadata[`custom_job_desc_${chunkIndex}`] = desc.slice(i, i + MAX_METADATA_VALUE);
    }
  }

  return metadata;
}

export async function POST(request: Request) {
  const polarCheck = ensurePolarConfig({ jobProductId: process.env.POLAR_JOB_PRICE_ID });
  if (polarCheck) return polarCheck;

  try {
    const body = await request.json();
    const { jobData } = body as { jobData?: JobData };

    if (!jobData) {
      return NextResponse.json({ error: "Job data is required" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl() || "https://workiswork.xyz";
    const metadata = buildJobMetadata(jobData);

    console.log('[Create Checkout] Creating Polar checkout with:', {
      product_price_id: process.env.POLAR_JOB_PRICE_ID,
      success_url: `${siteUrl}/api/payments/success?checkout_id={CHECKOUT_ID}`,
      metadata_keys: Object.keys(metadata),
    });

    const checkout = await createPolarCheckout({
      product_price_id: process.env.POLAR_JOB_PRICE_ID,
      success_url: `${siteUrl}/api/payments/success?checkout_id={CHECKOUT_ID}`,
      allow_discount_codes: true,
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
