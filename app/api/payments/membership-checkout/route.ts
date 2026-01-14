import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPolarCheckout, ensurePolarConfig } from "@/lib/polar-sdk";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const polarCheck = ensurePolarConfig({ membershipProductId: process.env.POLAR_MEMBERSHIP_PRODUCT_ID });
  if (polarCheck) return polarCheck;

  const headerStore = await headers();
  const session = await auth.api.getSession({ headers: headerStore });

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json(
      {
        error: "Authentication required",
        redirect: "/sign-in?callbackUrl=/pricing",
      },
      { status: 401 },
    );
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl() || "https://workiswork.xyz";

    const checkout = await createPolarCheckout({
      product_id: process.env.POLAR_MEMBERSHIP_PRODUCT_ID,
      success_url: `${siteUrl}/api/payments/membership-success?checkout_id={CHECKOUT_ID}`,
      allow_discount_codes: false,
      metadata: {
        custom_flow: "membership",
        custom_user_id: session.user.id,
        custom_user_email: session.user.email,
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
    console.error("[POST /api/payments/membership-checkout] Polar error:", error);
    return NextResponse.json({ error: error?.message || "Failed to start membership checkout" }, { status: 500 });
  }
}
