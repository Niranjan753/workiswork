"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signIn } from "@/lib/auth-client";

type Role = "user" | "employer";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") as Role | null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState<Role>(roleParam || "user");

  return (
    <div className="min-h-screen flex bg-[#0B0B0B]">
      {/* Sign In Form */}
      <div className="w-full text-white flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter mb-3">Welcome Back</h1>
            <p className="text-[#B6B6B6] text-lg">
              Sign in to your WorkIsWork account
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm text-[#B6B6B6] font-medium uppercase tracking-wider">Password</Label>
                <Link
                  href="#"
                  className="text-xs text-[#2563EB] font-bold hover:underline"
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
                className="bg-zinc-900/50 border-zinc-800 text-white h-12 rounded-xl placeholder:text-zinc-600 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-zinc-800 data-[state=checked]:bg-[#2563EB] data-[state=checked]:border-[#2563EB] rounded-md"
              />
              <Label htmlFor="remember" className="text-sm text-[#B6B6B6] cursor-pointer font-medium">
                Keep me signed in
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98]"
              disabled={loading}
              onClick={async () => {
                await signIn.email(
                  {
                    email,
                    password,
                    callbackURL: "/dashboard",
                  },
                  {
                    onRequest: () => {
                      setLoading(true);
                    },
                    onResponse: () => {
                      setLoading(false);
                    },
                    onSuccess: () => {
                      router.push("/dashboard");
                    },
                    onError: (error: any) => {
                      const errorMsg = error?.message || String(error || "");
                      toast.error(errorMsg || "Failed to sign in. Please check your credentials and try again.");
                    },
                  },
                );
              }}
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="text-center">
              <p className="text-[#B6B6B6] font-medium">
                Are you a new member?{" "}
                <Link
                  href={`/sign-up${roleParam ? `?role=${roleParam}` : ""}`}
                  className="text-white font-bold underline hover:text-[#2563EB] transition-colors"
                >
                  Create Account
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

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}

