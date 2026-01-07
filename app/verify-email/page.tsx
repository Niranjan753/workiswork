"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { GridBackground } from "@/components/GridBackground";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token");
  const success = searchParams.get("success") === "true";
  const [status, setStatus] = useState<"pending" | "verifying" | "success" | "error">(
    success ? "success" : token ? "verifying" : "pending"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (success) {
      // User was redirected here after successful verification
      setStatus("success");
      // Save preferences and role after email verification
      saveUserDataAfterVerification();
      setTimeout(() => {
        router.push("/jobs");
      }, 2000);
    } else if (token) {
      // Better Auth verification URLs point to /api/auth/verify-email
      // Redirect to the Better Auth endpoint which will handle verification
      window.location.href = `/api/auth/verify-email?token=${encodeURIComponent(token)}`;
    }
  }, [token, success, router]);

  async function saveUserDataAfterVerification() {
    // Save preferences from localStorage if they exist
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("workiswork_join_preferences");
      if (stored) {
        fetch("/api/user/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: stored,
        }).catch(() => {});
      }
    }
  }

  async function resendVerificationEmail() {
    if (!email) return;
    
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Verification email sent! Please check your inbox.");
      } else {
        // Show the actual error message from the API
        const errorMsg = data.message || data.error || "Failed to send verification email. Please try again.";
        console.error("[VerifyEmail] Resend error:", data);
        alert(`Failed to send verification email: ${errorMsg}`);
      }
    } catch (error: any) {
      console.error("[VerifyEmail] Resend error:", error);
      alert(`An error occurred: ${error?.message || "Please try again."}`);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black">
      <GridBackground />
      
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6 border-2 border-black bg-white p-8 shadow-lg">
          {status === "pending" && (
            <>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-yellow-400">
                  <Mail className="h-8 w-8 text-black" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-black">
                  Check your email
                </h1>
                <p className="text-sm text-black/80 font-medium">
                  We've sent a verification link to
                </p>
                <p className="mb-4 text-sm font-bold text-black">{email}</p>
                <p className="text-sm text-black/70 font-medium">
                  Click the link in the email to verify your account and get started.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={resendVerificationEmail}
                  className="w-full border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black hover:bg-yellow-100 transition-colors"
                >
                  Resend verification email
                </button>
                <Link
                  href="/sign-in"
                  className="block w-full border-2 border-black bg-black px-4 py-2 text-center text-sm font-bold text-yellow-400 hover:bg-yellow-500 hover:text-black transition-colors"
                >
                  Back to sign in
                </Link>
              </div>
            </>
          )}

          {status === "verifying" && (
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-black" />
              <h1 className="mb-2 text-2xl font-bold text-black">
                Verifying your email...
              </h1>
              <p className="text-sm text-black/70 font-medium">
                Please wait while we verify your account.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-yellow-400">
                <CheckCircle2 className="h-8 w-8 text-black" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-black">
                Email verified!
              </h1>
              <p className="mb-4 text-sm text-black/70 font-medium">
                Your account has been verified. Redirecting you now...
              </p>
              <Link
                href="/jobs"
                className="inline-block border-2 border-black bg-black px-6 py-2 text-sm font-bold text-yellow-400 hover:bg-yellow-500 hover:text-black transition-colors"
              >
                Go to jobs
              </Link>
            </div>
          )}

          {status === "error" && (
            <>
              <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold text-black">
                  Verification failed
                </h1>
                <p className="mb-4 text-sm text-black/70 font-medium">
                  {errorMessage}
                </p>
              </div>
              <div className="space-y-3">
                {email && (
                  <button
                    onClick={resendVerificationEmail}
                    className="w-full border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black hover:bg-yellow-100 transition-colors"
                  >
                    Resend verification email
                  </button>
                )}
                <Link
                  href="/sign-up"
                  className="block w-full border-2 border-black bg-black px-4 py-2 text-center text-sm font-bold text-yellow-400 hover:bg-yellow-500 hover:text-black transition-colors"
                >
                  Sign up again
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white text-black">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

