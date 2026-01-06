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
      return function(table: any) {
        const insertBuilder = originalInsert(table);
        // If inserting into users table, wrap the values method
        if (table === users) {
          const originalValues = insertBuilder.values.bind(insertBuilder);
          insertBuilder.values = function(values: any) {
            // If values is an array, map over it; otherwise wrap single object
            const processedValues = Array.isArray(values)
              ? values.map(v => ({ ...v, id: v.id ? randomUUID() : randomUUID() }))
              : { ...values, id: values.id ? randomUUID() : randomUUID() };
            console.log("[Wrapped DB] Inserting user with UUID:", processedValues.id || processedValues[0]?.id);
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
  },
  secret: process.env.BETTER_AUTH_SECRET || process.env.NEXTAUTH_SECRET || "change-me-in-production",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
  basePath: "/api/auth",
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
  ],
});

export type Session = typeof auth.$Infer.Session;

