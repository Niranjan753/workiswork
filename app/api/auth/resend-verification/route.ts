import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { headers } from "next/headers";
import { db } from "../../../../db";
import { users, verifications } from "../../../../db/schema";
import { eq, and, gt } from "drizzle-orm";
import { resendClient } from "../../../../lib/resend";
import { createHash, randomBytes } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Better Auth doesn't have a direct resend API, so we'll manually create a token
    // and send the email using our Resend client
    const baseUrl = process.env.BETTER_AUTH_URL || 
      process.env.NEXTAUTH_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    
    if (!resendClient) {
      return NextResponse.json(
        { message: "Email service not configured" },
        { status: 500 }
      );
    }

    try {
      // Better Auth automatically generates tokens during sign-up and stores them in the database
      // We should use the token Better Auth created, not create our own
      
      // Find the token Better Auth created during sign-up
      const existingToken = await db
        .select()
        .from(verifications)
        .where(eq(verifications.identifier, user.email))
        .orderBy(verifications.createdAt)
        .limit(1)
        .then((rows) => rows[0]);
      
      if (existingToken) {
        // Better Auth already created a token - use it exactly as Better Auth stored it
        // Better Auth stores the token in the 'value' field
        const token = existingToken.value;
        
        console.log("[Resend Verification] Using Better Auth's token", {
          tokenPreview: token.substring(0, 50) + "...",
          expiresAt: existingToken.expiresAt,
          isExpired: new Date(existingToken.expiresAt) < new Date(),
        });
        
        // If token is expired, extend it
        if (new Date(existingToken.expiresAt) < new Date()) {
          console.log("[Resend Verification] Token expired, extending expiry");
          await db.update(verifications)
            .set({ expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) })
            .where(eq(verifications.id, existingToken.id));
        }
        
        const redirectUrl = `${baseUrl}/verify-email?success=true&email=${encodeURIComponent(user.email)}`;
        const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirectUrl)}`;
        
        // Send email with existing token
        const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
        
        const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #000; font-size: 24px; margin-bottom: 20px;">Verify your email</h1>
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Thanks for signing up for WorkIsWork! Please verify your email address by clicking the button below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; background-color: #000; color: #facc15; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; border: 2px solid #000;">
                Verify Email
              </a>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Or copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #000; word-break: break-all;">${verificationUrl}</a>
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
        `;

        const result = await resendClient.emails.send({
          from: fromEmail,
          to: user.email,
          subject: "Verify your WorkIsWork account",
          html,
        });
        
        console.log("[Resend Verification] Email sent with existing token:", result);
        return NextResponse.json({ success: true, reusedToken: true });
      }

      // No valid token exists - Better Auth should have created one during sign-up
      // If it doesn't exist, we can't create a valid one manually because Better Auth
      // uses a specific token format that we can't replicate.
      // 
      // Solution: Return an error asking user to sign up again, or check if there are
      // any expired tokens we can look at to understand the format
      
      // Check for ANY tokens (even expired) to see the format
      const anyToken = await db
        .select()
        .from(verifications)
        .where(eq(verifications.identifier, user.email))
        .orderBy(verifications.createdAt)
        .limit(1)
        .then((rows) => rows[0]);
      
      if (anyToken) {
        // Token exists but expired - Better Auth won't accept it, but we can try
        // extending it and resending (though this might not work)
        console.log("[Resend Verification] Found expired token, attempting to extend and resend");
        const token = anyToken.value || anyToken.id;
        
        // Update expiry
        await db.update(verifications)
          .set({ expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) })
          .where(eq(verifications.id, anyToken.id));
        
        const redirectUrl = `${baseUrl}/verify-email?success=true&email=${encodeURIComponent(user.email)}`;
        const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirectUrl)}`;
        
        // Send email with extended token
        const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
        
        const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #000; font-size: 24px; margin-bottom: 20px;">Verify your email</h1>
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Thanks for signing up for WorkIsWork! Please verify your email address by clicking the button below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; background-color: #000; color: #facc15; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; border: 2px solid #000;">
                Verify Email
              </a>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Or copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #000; word-break: break-all;">${verificationUrl}</a>
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
        `;

        if (!resendClient) {
          return NextResponse.json(
            { message: "Email service not configured" },
            { status: 500 }
          );
        }
        
        const result = await resendClient.emails.send({
          from: fromEmail,
          to: user.email,
          subject: "Verify your WorkIsWork account",
          html,
        });
        
        console.log("[Resend Verification] Email sent with extended token:", result);
        return NextResponse.json({ success: true, extendedToken: true });
      }
      
      // No token exists at all - this shouldn't happen if Better Auth created one during sign-up
      // Return an error
      return NextResponse.json(
        { 
          message: "No verification token found. Please sign up again or contact support.",
          error: "NO_TOKEN"
        },
        { status: 400 }
      );
    } catch (error: any) {
      console.error("[Resend Verification] Error sending email:", {
        error: error,
        message: error?.message,
        status: error?.status,
        response: error?.response,
        errorData: error?.response?.data,
        errorBody: error?.body,
        stack: error?.stack,
      });
      
      // Resend SDK errors have a specific format
      let errorMessage = "Failed to send verification email";
      let statusCode = 500;
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data) {
        errorMessage = error.response.data.message || JSON.stringify(error.response.data);
        statusCode = error.response.status || 500;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      return NextResponse.json(
        { 
          message: errorMessage,
          error: String(error),
          details: error?.response?.data || error?.body || {},
        },
        { status: statusCode }
      );
    }
  } catch (error: any) {
    console.error("[Resend Verification] Error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}

