import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createPolarCheckout, ensurePolarConfig } from "@/lib/polar-sdk";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const polarCheck = ensurePolarConfig({
    membershipProductId: process.env.POLAR_MEMBERSHIP_PRODUCT_ID,
  });
  if (polarCheck) return polarCheck;

  // Still fine to keep headers() if Polar SDK needs request context
  await headers();

  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      getSiteUrl() ||
      "https://workiswork.xyz";

    const checkout = await createPolarCheckout({
      product_id: process.env.POLAR_MEMBERSHIP_PRODUCT_ID,
      success_url: `${siteUrl}/api/payments/membership-success?checkout_id={CHECKOUT_ID}`,
      allow_discount_codes: false,
      metadata: {
        custom_flow: "membership",
      },
    });

    if (!checkout?.url) {
      throw new Error("Polar did not return a checkout URL");
    }

    return NextResponse.json({
      checkout_id: checkout.id,
      url: checkout.url,
    });
  } catch (error: any) {
    console.error(
      "[POST /api/payments/membership-checkout] Polar error:",
      error
    );

    return NextResponse.json(
      { error: error?.message || "Failed to start membership checkout" },
      { status: 500 }
    );
  }
}
