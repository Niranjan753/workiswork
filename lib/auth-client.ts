import { createAuthClient } from "better-auth/react";

// Use NEXT_PUBLIC_APP_URL if provided, otherwise fall back to the current origin
// (in the browser) or sensible defaults for server-side usage.
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return (
      process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    );
  }
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_NEXTAUTH_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
  );
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  basePath: "/api/auth",
});

export const { signIn, signUp, signOut, useSession } = authClient;

