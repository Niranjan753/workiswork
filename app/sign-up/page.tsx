"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, X } from "lucide-react";
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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role>(roleParam || "user");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Sign Up Form */}
      <div className="flex-1 bg-white text-zinc-900 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
            <p className="text-zinc-600 text-sm">
              Join WorkIsWork and start your remote work journey
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
                className={`flex-1 rounded-lg border cursor-pointer px-4 py-2.5 text-sm font-semibold transition-colors ${
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="first-name" className="text-sm text-zinc-700">First name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500 focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name" className="text-sm text-zinc-700">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  required
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500 focus:border-orange-500"
                />
              </div>
            </div>

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
              <Label htmlFor="password" className="text-sm text-zinc-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation" className="text-sm text-zinc-700">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirm your password"
                className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm text-zinc-700">Profile Image (optional)</Label>
              <div className="flex items-end gap-3">
                {imagePreview && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-300">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-white border-zinc-300 text-zinc-900 file:text-zinc-900 file:bg-zinc-100 file:border-0 file:rounded file:px-3 file:py-1 file:text-sm file:cursor-pointer"
                  />
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="p-2 hover:bg-zinc-100 rounded"
                    >
                      <X className="w-4 h-4 text-zinc-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer text-white font-semibold"
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
                      }).catch(() => {}); // Fail silently
                    }
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
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>

            {password && passwordConfirmation && password !== passwordConfirmation && (
              <p className="text-xs text-red-400 text-center">
                Passwords do not match
              </p>
            )}

            <div className="text-center">
              <p className="text-sm text-zinc-600">
                Already have an account?{" "}
                <Link
                  href={`/sign-in${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}${roleParam ? `&role=${roleParam}` : ""}`}
                  className="text-orange-600 hover:text-orange-700 font-semibold underline"
                >
                  Sign In
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
            src="/signup.jpeg"
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

export default function SignUp() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <SignUpForm />
    </Suspense>
  );
}
