import { NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";

const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;

// Initialize Polar SDK
export const polar = POLAR_ACCESS_TOKEN
  ? new Polar({ accessToken: POLAR_ACCESS_TOKEN })
  : null;

export type PolarCheckout = {
  id: string;
  url?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  customer_id?: string | null;
  subscription_id?: string | null;
  product_id?: string | null;
};

export async function createPolarCheckout(payload: {
  product_price_id?: string;
  success_url: string;
  allow_discount_codes?: boolean;
  metadata?: Record<string, string>;
}) {
  if (!polar) {
    throw new Error("Polar SDK is not initialized. Check POLAR_ACCESS_TOKEN.");
  }

  try {
    // The current version of @polar-sh/sdk (0.42.2) uses 'products' array for checkout creation
    const checkout = await polar.checkouts.create({
      products: [payload.product_price_id!],
      successUrl: payload.success_url,
      allowDiscountCodes: payload.allow_discount_codes,
      metadata: payload.metadata,
    });

    return checkout;
  } catch (error: any) {
    console.error("[Polar SDK] Checkout creation error:", error);
    throw error;
  }
}

export async function retrievePolarCheckout(checkoutId: string) {
  if (!polar) {
    throw new Error("Polar SDK is not initialized. Check POLAR_ACCESS_TOKEN.");
  }

  try {
    const checkout = await polar.checkouts.get({ id: checkoutId });
    return checkout;
  } catch (error: any) {
    console.error("[Polar SDK] Checkout retrieval error:", error);
    throw error;
  }
}

export function ensurePolarConfig(config: {
  jobProductId?: string | null;
  membershipProductId?: string | null;
}) {
  if (!POLAR_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "POLAR_ACCESS_TOKEN is not configured" },
      { status: 500 }
    );
  }

  if (config.jobProductId !== undefined && !config.jobProductId) {
    return NextResponse.json(
      { error: "POLAR_JOB_PRICE_ID is not configured" },
      { status: 500 }
    );
  }

  if (config.membershipProductId !== undefined && !config.membershipProductId) {
    return NextResponse.json(
      { error: "POLAR_MEMBERSHIP_PRODUCT_ID is not configured" },
      { status: 500 }
    );
  }

  return null;
}
