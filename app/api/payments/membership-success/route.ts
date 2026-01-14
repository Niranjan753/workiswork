import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subscriptions, users } from "@/db/schema";
import { ensurePolarConfig, retrievePolarCheckout } from "@/lib/polar-sdk";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MetadataMap = Record<string, unknown>;

export async function GET(request: Request) {
  const polarCheck = ensurePolarConfig({ membershipProductId: process.env.POLAR_MEMBERSHIP_PRODUCT_ID });
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

    const metadata = (checkout.metadata || {}) as MetadataMap;

    if (metadata["custom_flow"] !== "membership") {
      return NextResponse.json({ error: "Checkout does not belong to membership flow" }, { status: 400 });
    }

    const userId = (metadata["custom_user_id"] || "").toString();

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id in checkout metadata" }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return NextResponse.json({ error: "User not found for membership" }, { status: 404 });
    }

    const subscriptionId = checkout.subscriptionId || checkout.id;
    const customerId = checkout.customerId || (metadata["custom_customer_id"] || "polar").toString();

    const existing = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1)
      .then((rows) => rows[0]);

    if (existing) {
      await db
        .update(subscriptions)
        .set({
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          plan: "premium",
          status: "active",
        })
        .where(eq(subscriptions.id, existing.id));
    } else {
      await db.insert(subscriptions).values({
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        plan: "premium",
        status: "active",
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl() || "https://workiswork.xyz";
    const redirectUrl = new URL("/profile", siteUrl);
    redirectUrl.searchParams.set("membership", "active");

    return NextResponse.redirect(redirectUrl.toString(), { status: 307 });
  } catch (error: any) {
    console.error("[GET /api/payments/membership-success] Polar flow error:", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to record membership",
      },
      { status: 500 },
    );
  }
}
