"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Briefcase, Users, TrendingUp, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signIn } from "@/lib/auth-client";

type Role = "user" | "employer";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/alerts";
  const roleParam = searchParams.get("role") as Role | null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState<Role>(roleParam || "user");

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Sign In Form */}
      <div className="flex-1 bg-white text-zinc-900 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Welcome to WorkIsWork</h1>
            <p className="text-zinc-600 text-sm">
              Sign in to access your account
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
              <Label className="text-sm text-zinc-700">I am a...</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  role === "user"
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole("employer")}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  role === "employer"
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                Employer
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-zinc-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm text-zinc-300">Password</Label>
                <Link
                  href="#"
                  className="text-xs text-orange-400 hover:text-orange-300 underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-zinc-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <Label htmlFor="remember" className="text-sm text-zinc-300 cursor-pointer">
                Keep me signed in
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              disabled={loading}
              onClick={async () => {
                await signIn.email(
                  {
                    email,
                    password,
                  },
                  {
                    onRequest: () => {
                      setLoading(true);
                    },
                    onResponse: () => {
                      setLoading(false);
                    },
                    onSuccess: () => {
                      router.push(callbackUrl);
                    },
                  },
                );
              }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-zinc-600">
                Are you a new member?{" "}
                <Link
                  href={`/sign-up${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}${roleParam ? `&role=${roleParam}` : ""}`}
                  className="text-orange-600 hover:text-orange-700 font-semibold underline"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-zinc-500 space-x-2">
            <Link href="#" className="hover:text-zinc-700">Terms of Use</Link>
            <span>•</span>
            <Link href="#" className="hover:text-zinc-700">Privacy Policy</Link>
          </div>
        </div>
      </div>

      {/* Right Side - Promotional Section (Orange Theme) */}
      <div className="flex-1 bg-gradient-to-br from-orange-500 to-orange-600 text-white hidden lg:flex items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 max-w-lg space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-4">Stay tuned with WorkIsWork</h2>
            <p className="text-lg text-orange-50">
              Join the largest remote job community and discover your next opportunity. 
              Connect with top companies and find the perfect remote role.
            </p>
          </div>

          {/* Stats Preview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5" />
                  <span className="text-sm text-orange-100">Active Jobs</span>
                </div>
                <p className="text-3xl font-bold">12,543</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm text-orange-100">Job Seekers</span>
                </div>
                <p className="text-3xl font-bold">45,231</p>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-orange-200" />
                <span className="text-sm">Curated remote jobs from top companies</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-orange-200" />
                <span className="text-sm">Instant job alerts for your skills</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-orange-200" />
                <span className="text-sm">Save and track your favorite opportunities</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-orange-200" />
                <span className="text-sm">Join thousands of remote workers</span>
              </div>
            </div>
          </div>

          {/* Growth Indicator */}
          <div className="flex items-center gap-2 text-orange-100">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">+2,341 new jobs this week</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}


