import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { getSiteUrl } from "@/lib/site-url";

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

    // Determine environment - default to test_mode unless explicitly set to live
    // This prevents 401 errors from using wrong environment
    const environment = 
      process.env.DODO_PAYMENTS_ENV === "live_mode" 
        ? "live_mode" 
        : "test_mode";
    
    const isProduction = environment === "live_mode";
    
    console.log("[POST /api/payments/create-checkout] Configuration:", {
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey?.substring(0, 10) + "...",
      environment,
      isProduction,
      VERCEL_ENV: process.env.VERCEL_ENV,
      NODE_ENV: process.env.NODE_ENV,
      siteUrl: getSiteUrl(),
    });

    const client = new DodoPayments({
      bearerToken: apiKey,
      environment: environment,
    });

    const body = await request.json();
    const { jobData } = body;

    if (!jobData) {
      return NextResponse.json(
        { error: "Job data is required" },
        { status: 400 }
      );
    }

    // Get the site URL dynamically for production
    const siteUrl = getSiteUrl();
    const returnUrl = `${siteUrl}/api/payments/success`;

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
    
    // Extract more detailed error information from Dodo Payments SDK
    let errorMessage = error.message || "Failed to create checkout session";
    let statusCode = 500;
    
    // Check if it's an API error from Dodo Payments
    if (error.status || error.statusCode) {
      statusCode = error.status || error.statusCode;
      errorMessage = error.message || `Dodo Payments API error: ${statusCode}`;
    }
    
    // Check for response body with error details
    if (error.body || error.data) {
      const errorBody = error.body || error.data;
      if (typeof errorBody === 'string') {
        try {
          const parsed = JSON.parse(errorBody);
          errorMessage = parsed.message || parsed.error || errorMessage;
        } catch {
          errorMessage = errorBody;
        }
      } else if (errorBody?.message || errorBody?.error) {
        errorMessage = errorBody.message || errorBody.error || errorMessage;
      }
    }
    
    console.error("[POST /api/payments/create-checkout] Full error details:", {
      message: errorMessage,
      status: statusCode,
      error: error,
      apiKeyPresent: !!process.env.DODO_PAYMENTS_API_KEY,
      apiKeyLength: process.env.DODO_PAYMENTS_API_KEY?.length,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
    });
    
    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? {
          status: statusCode,
          type: error.constructor?.name,
        } : undefined,
      },
      { status: statusCode >= 400 && statusCode < 600 ? statusCode : 500 }
    );
  }
}

