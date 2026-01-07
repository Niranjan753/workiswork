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
    async sendResetPassword(data, request) {
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

