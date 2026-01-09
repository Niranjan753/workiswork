import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";

// For now, use localhost for the return URL
const returnUrl = "http://localhost:3000/api/payments/success";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
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

    const body = await request.json();
    const { jobData } = body;

    if (!jobData) {
      return NextResponse.json(
        { error: "Job data is required" },
        { status: 400 }
      );
    }

    // Create checkout session with job data in metadata
    // Note: For highlight color (+$49), we'll handle that as a separate product or feature later
    // For now, using the base $199 product
    const checkoutSession = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: process.env.DODO_PAYMENTS_PRODUCT_ID || "pdt_0NVuKHfq5oxzX9GqaKFL2",
          quantity: 1,
        },
      ],
      return_url: returnUrl,
      metadata: {
        jobData: JSON.stringify(jobData),
      },
    });

    console.log("[POST /api/payments/create-checkout] Checkout session response:", JSON.stringify(checkoutSession, null, 2));

    // Check if the response has the expected structure
    if (!checkoutSession) {
      throw new Error("Checkout session creation returned null or undefined");
    }

    // CheckoutSessionResponse has: session_id and checkout_url
    const checkoutUrl = checkoutSession.checkout_url;
    const sessionId = checkoutSession.session_id;

    if (!checkoutUrl) {
      console.error("[POST /api/payments/create-checkout] Missing checkout_url in response:", checkoutSession);
      throw new Error(`No checkout URL in response. Response keys: ${Object.keys(checkoutSession).join(", ")}`);
    }

    return NextResponse.json({
      session_id: sessionId,
      url: checkoutUrl,
    });
  } catch (error: any) {
    console.error("[POST /api/payments/create-checkout] Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to create checkout session",
      },
      { status: 500 }
    );
  }
}

