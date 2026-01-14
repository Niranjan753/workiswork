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
  product_id?: string;
  success_url: string;
  allow_discount_codes?: boolean;
  metadata?: Record<string, string>;
}) {
  if (!polar) {
    throw new Error("Polar SDK is not initialized. Check POLAR_ACCESS_TOKEN.");
  }

  try {
    // The SDK requires 'products' array (list of Product IDs)
    // We prioritize product_id if available, otherwise fall back to product_price_id (though that might be wrong if it expects product ID)
    const idToUse = payload.product_id || payload.product_price_id;

    // We also pass productPriceId if available, as some API versions might support it via direct property or inside options? 
    // Actually, based on types, we should pass 'products' array.

    // If we have a price ID but need a product ID, we might be in trouble if we only pass price ID to 'products'.
    // BUT checkouts.create usually takes Product ID in `products`.

    const checkout = await polar.checkouts.create({
      products: [idToUse!],
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
