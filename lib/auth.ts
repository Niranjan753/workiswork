import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";
import { randomUUID } from "crypto";
import { users } from "../db/schema";

// Create a wrapped database client that intercepts user inserts
const originalInsert = db.insert.bind(db);
const wrappedDb = new Proxy(db, {
  get(target, prop) {
    if (prop === "insert") {
      return function (table: any) {
        const insertBuilder = originalInsert(table);
        // If inserting into users table, wrap the values method
        if (table === users) {
          const originalValues = insertBuilder.values.bind(insertBuilder);
          insertBuilder.values = function (values: any) {
            const makeUuid = () => randomUUID();
            // If values is an array, map over it; otherwise wrap single object
            const processedValues = Array.isArray(values)
              ? values.map((v) => ({ ...v, id: makeUuid() }))
              : { ...values, id: makeUuid() };
            const userData = Array.isArray(processedValues)
              ? processedValues[0]
              : processedValues;
            console.log(
              "[Wrapped DB] Inserting user:",
              {
                id: (userData as any).id,
                email: (userData as any).email,
                name: (userData as any).name,
                role: (userData as any).role,
              },
            );
            return originalValues(processedValues);
          };
        }
        return insertBuilder;
      };
    }
    return target[prop as keyof typeof target];
  },
});

export const auth = betterAuth({
  database: drizzleAdapter(wrappedDb, {
    provider: "pg",
    schema: {
      user: schema.users,
      account: schema.accounts,
      session: schema.sessions,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async sendVerificationEmail(data: { user: { email: string }; url: string }, request: any) {
      console.log("[Better Auth] sendVerificationEmail hook called", {
        email: data.user.email,
        url: data.url,
        fullData: JSON.stringify(data, null, 2),
      });
      
      // Extract token from Better Auth's URL to see the format
      const urlObj = new URL(data.url, "http://localhost:3000");
      const tokenFromUrl = urlObj.searchParams.get("token");
      console.log("[Better Auth] Token from URL:", tokenFromUrl?.substring(0, 50) + "...");
      
      // Store the original verification URL in the database for resend purposes
      // Better Auth stores tokens, but we need the full URL format
      // We'll store it in the verification record's metadata or use the token to reconstruct
      // Actually, Better Auth's URL format is: /api/auth/verify-email?token=XXX
      // The token in the URL should match what's stored in the database

      // Send verification email via Resend
      const { resendClient } = await import("./resend");
      if (!resendClient) {
        console.error("[Better Auth] Resend not configured, cannot send verification email");
        console.error("[Better Auth] RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
        return;
      }

      console.log("[Better Auth] Resend client initialized, sending email...");

      // Better Auth provides the verification URL
      // Append redirect parameter to send users to our verification success page
      const baseUrl = process.env.BETTER_AUTH_URL || 
        process.env.NEXTAUTH_URL || 
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
      const redirectUrl = `${baseUrl}/verify-email?success=true&email=${encodeURIComponent(data.user.email)}`;
      const verificationUrl = `${data.url}&redirect=${encodeURIComponent(redirectUrl)}`;
      
      console.log("[Better Auth] Verification URL:", verificationUrl);
      
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

      try {
        // Resend requires the "from" email to be verified
        // For Gmail addresses, you need to verify it in Resend dashboard
        // Or use a verified domain like "noreply@yourdomain.com"
        const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
        
        const result = await resendClient.emails.send({
          from: fromEmail,
          to: data.user.email,
          subject: "Verify your WorkIsWork account",
          html,
        });
        
        console.log("[Better Auth] Verification email sent successfully:", {
          email: data.user.email,
          result: result,
        });
      } catch (error: any) {
        console.error("[Better Auth] Failed to send verification email:", {
          error: error,
          message: error?.message,
          response: error?.response,
          status: error?.status,
          email: data.user.email,
        });
        // Don't throw - let Better Auth continue even if email fails
        // The user can use resend button
      }
    },
    async sendResetPassword(data: any, request: any) {
      // Hook for password reset emails – currently just logs.
      console.log("[Better Auth] sendResetPassword called", {
        email: data.user.email,
        url: data.url,
      });
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || process.env.NEXTAUTH_SECRET || "change-me-in-production",
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  basePath: "/api/auth",
  trustedOrigins: [
    process.env.BETTER_AUTH_URL ||
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
    "https://workiswork.xyz", // Add your production domain
  ],
});

export type Session = typeof auth.$Infer.Session;

