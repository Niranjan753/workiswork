"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LockOpen } from "lucide-react";

import { Logo } from "./Logo";
import { cn } from "../lib/utils";
import { authClient } from "../lib/auth-client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = React.useState(false);

  const isJobs = pathname === "/jobs" || pathname.startsWith("/jobs");
  const isBlog = pathname.startsWith("/blog");
  const isJoin = pathname.startsWith("/join");
  const isHire = pathname.startsWith("/hire");
  const isPortfolio = pathname.startsWith("/portfolio");

  const userEmail = session?.user?.email;

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/jobs"),
      },
    });
  }

  const navLinks = [
    { name: "Remote Jobs", href: session ? "/dashboard/jobs" : "/jobs", active: isJobs },
    { name: "Blog", href: session ? "/dashboard/blog" : "/blog", active: isBlog },
    { name: "Portfolio", href: session ? "/dashboard/portfolio" : "/portfolio", active: isPortfolio },
    { name: "Join", href: session ? "/dashboard/join" : "/join", active: isJoin },
    { name: "Post a Job", href: session ? "/dashboard/hire" : "/hire", active: isHire },
  ];

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#1b1b1b] backdrop-blur text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Logo width={28} height={20} />
              <span className="text-xl font-bold">
                WorkIsWork
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-md text-md font-medium transition",
                    link.active
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() =>
                  session?.user
                    ? router.push("/pricing")
                    : setShowUnlockDialog(true)
                }
                className="flex items-center gap-2 rounded-md bg-[#FF5A1F] px-6 py-2 text-md font-bold text-white hover:bg-[#FF5A1F]/90 cursor-pointer"
              >
                <LockOpen className="h-4 w-4" />
                Unlock Jobs
              </button>

              {userEmail ? (
                <>
                  <Link
                    href="/profile"
                    className="rounded-md border bg-white px-4 py-2 text-md font-medium text-black"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="rounded-md border bg-white px-4 py-2 text-md font-bold text-black cursor-pointer"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  href="/login?callbackUrl=/alerts"
                  className="rounded-md border bg-white px-4 py-2 text-md font-bold text-black cursor-pointer hover:bg-white/90"
                >
                  Log in
                </Link>
              )}
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden rounded-md p-2 text-white hover:bg-white/10"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}
      <div
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm bg-[#121212] shadow-2xl transition-all ease-[cubic-bezier(0.2,0.6,0.2,0.8)] duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center text-white justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2">
            <Logo width={24} height={18} />
            <span className="font-bold text-white">WorkIsWork</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-2 hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "rounded-lg px-4 py-3 text-base font-medium transition",
                link.active
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="mx-4 my-3 h-px bg-white/10" />

        {/* Actions */}
        <div className="space-y-3 px-4">
          <button
            onClick={() => {
              setMobileOpen(false);
              session?.user
                ? router.push("/pricing")
                : setShowUnlockDialog(true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF5A1F] py-3 font-bold text-white"
          >
            <LockOpen className="h-4 w-4" />
            Unlock Jobs
          </button>

          {userEmail ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg border border-white/10 py-3 text-center text-white"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleSignOut();
                }}
                className="w-full text-md text-gray-400 hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login?callbackUrl=/alerts"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg border border-white/10 py-3 text-center text-white"
            >
              Log in
            </Link>
          )}
        </div>
      </div>

      {/* ================= UNLOCK DIALOG ================= */}
      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent className="sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle>Join WorkIsWork</DialogTitle>
            <DialogDescription>
              Unlock unlimited access to the best remote jobs.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Link
              href="/join"
              onClick={() => setShowUnlockDialog(false)}
              className="rounded-full bg-primary px-6 py-2 font-bold text-white"
            >
              Join Now
            </Link>
            <button
              onClick={() => setShowUnlockDialog(false)}
              className="rounded-full px-4 py-2 text-muted-foreground"
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
