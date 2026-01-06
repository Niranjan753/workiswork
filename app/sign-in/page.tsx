"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
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
      <div className="flex-1 bg-white text-zinc-900 flex items-center justify-center p-8 overflow-y-auto">
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
                className={`flex-1 rounded-lg cursor-pointer border px-4 py-2.5 text-sm font-semibold transition-colors ${
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
                className={`flex-1 rounded-lg cursor-pointer border px-4 py-2.5 text-sm font-semibold transition-colors ${
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
              className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer text-white font-semibold"
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
                  className="text-orange-600 hover:text-orange-700 cursor-pointer font-semibold underline"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-zinc-500 space-x-2 pt-4 border-t border-zinc-200">
            <Link href="#" className="hover:text-zinc-700">Terms of Use</Link>
            <span>•</span>
            <Link href="#" className="hover:text-zinc-700">Privacy Policy</Link>
          </div>
        </div>
      </div>

      {/* Right Side - Promotional Image Section */}
      <div className="flex-1 bg-white text-white hidden lg:flex items-center justify-center p-0 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='60' viewBox='0 0 50 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
          <Image
            src="/signin.jpg"
            alt="Sign up promo"
            fill
            style={{ objectFit: "contain" }}
            className="rounded-2xl shadow-xl"
            priority
          />
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

