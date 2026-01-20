"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";

type Role = "user" | "employer";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/jobs";
  const roleParam = searchParams.get("role") as Role | null;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role>(roleParam || "user");

  return (
    <div className="min-h-screen flex bg-[#0B0B0B]">
      {/* Sign Up Form */}
      <div className="w-full text-white flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter mb-3">Create Account</h1>
            <p className="text-[#B6B6B6] text-lg">
              Join WorkIsWork and find your next remote role
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm text-[#B6B6B6] font-medium uppercase tracking-wider">I am a...</Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold transition-all border ${role === "user"
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
                  }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole("employer")}
                className={`flex-1 cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold transition-all border ${role === "employer"
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
                  }`}
              >
                Employer
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name" className="text-sm text-[#B6B6B6] font-medium uppercase tracking-wider">First name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  className="bg-zinc-900/50 border-zinc-800 text-white h-12 rounded-xl placeholder:text-zinc-600 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name" className="text-sm text-[#B6B6B6] font-medium uppercase tracking-wider">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  required
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  className="bg-zinc-900/50 border-zinc-800 text-white h-12 rounded-xl placeholder:text-zinc-600 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-[#B6B6B6] font-medium uppercase tracking-wider">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="bg-zinc-900/50 border-zinc-800 text-white h-12 rounded-xl placeholder:text-zinc-600 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-[#B6B6B6] font-medium uppercase tracking-wider">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="bg-zinc-900/50 border-zinc-800 text-white h-12 rounded-xl placeholder:text-zinc-600 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation" className="text-sm text-[#B6B6B6] font-medium uppercase tracking-wider">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirm your password"
                className="bg-zinc-900/50 border-zinc-800 text-white h-12 rounded-xl placeholder:text-zinc-600 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98]"
              disabled={loading || password !== passwordConfirmation}
              onClick={async () => {
                if (password !== passwordConfirmation) {
                  toast.error("Passwords do not match");
                  return;
                }

                if (!firstName.trim() || !lastName.trim()) {
                  toast.error("Please enter your first and last name");
                  return;
                }

                if (password.length < 8) {
                  toast.error("Password must be at least 8 characters");
                  return;
                }

                setLoading(true);
                try {
                  const { data, error } = await signUp.email({
                    email: email.trim(),
                    password,
                    name: `${firstName.trim()} ${lastName.trim()}`,
                    callbackURL: callbackUrl,
                  });

                  if (error) {
                    toast.error(error.message || "Failed to create account. Please try again.");
                    setLoading(false);
                    return;
                  }

                  if (data?.user) {
                    // Update role after signup if employer
                    if (role === "employer") {
                      await fetch("/api/user/role", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ role: "employer" }),
                      }).catch(() => { }); // Fail silently
                    }
                    // Save join preferences if they exist in localStorage
                    if (typeof window !== "undefined") {
                      const stored = window.localStorage.getItem(
                        "workiswork_join_preferences",
                      );
                      if (stored) {
                        fetch("/api/user/preferences", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: stored,
                        }).catch(() => { });
                      }
                    }
                    toast.success("Account created successfully!");
                    router.push(callbackUrl);
                  }
                } catch (err: any) {
                  console.error("[SignUp] Error:", err);
                  toast.error(err?.message || "An unexpected error occurred. Please try again.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>

            {password && passwordConfirmation && password !== passwordConfirmation && (
              <p className="text-sm text-red-500 font-bold text-center">
                Passwords do not match
              </p>
            )}

            <div className="text-center">
              <p className="text-[#B6B6B6] font-medium">
                Already have an account?{" "}
                <Link
                  href={`/sign-in${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}${roleParam ? `&role=${roleParam}` : ""}`}
                  className="text-white font-bold underline hover:text-[#2563EB] transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-zinc-600 space-x-2 pt-6 border-t border-zinc-800 font-medium">
            <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
            <span>•</span>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUp() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <SignUpForm />
    </Suspense>
  );
}
