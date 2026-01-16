"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { cn } from "../lib/utils";
import * as React from "react";
import { authClient } from "../lib/auth-client";
import { LockOpen, Menu, X } from "lucide-react";
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

  const isJobs = pathname === "/" || pathname.startsWith("/jobs");
  const isBlog = pathname.startsWith("/blog");
  const isJoin = pathname.startsWith("/join");
  const isHire = pathname.startsWith("/hire");
  const isPortfolio = pathname.startsWith("/portfolio");

  const userEmail = session?.user?.email;

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/jobs");
        },
      },
    });
  }

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Remote Jobs", href: "/jobs", active: isJobs },
    { name: "Blog", href: "/blog", active: isBlog },
    { name: "Portfolio", href: "/portfolio", active: isPortfolio },
    { name: "Join", href: "/join", active: isJoin },
    { name: "Post a Job", href: "/hire", active: isHire },
  ];

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full border border-white/10 bg-[#1A1A1A]/90 backdrop-blur-md shadow-2xl px-2 py-2">
        <div className="flex items-center justify-between px-2 sm:px-4">
          {/* Logo & Brand */}
          <Link href="/jobs" className="flex items-center gap-3 min-w-fit hover:opacity-80 transition-opacity">
            <span className="flex h-8 w-8 items-center justify-center text-white">
              <Logo width={32} height={24} />
            </span>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:inline-block">
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
                  "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                  link.active
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => {
                if (!session?.user) {
                  setShowUnlockDialog(true);
                } else {
                  router.push("/pricing");
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              <LockOpen className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Unlock Jobs</span>
            </button>

            {userEmail ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-zinc-400 hover:text-white text-xs font-medium px-2 transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login?callbackUrl=/alerts"
                className="px-4 py-2 rounded-full border border-white/10 bg-transparent text-white text-sm font-bold hover:bg-white/5 transition-colors"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm origin-top rounded-3xl bg-[#1A1A1A] border border-white/10 p-2 shadow-2xl transition-all duration-300 md:hidden",
          mobileOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none translate-y-[-20px]"
        )}
      >
        <div className="flex flex-col gap-1 p-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                link.active
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="h-px bg-white/10 my-2 mx-2" />

          {/* Mobile Auth Actions */}
          <div className="flex flex-col gap-2 p-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                if (!session?.user) {
                  setShowUnlockDialog(true);
                } else {
                  router.push("/pricing");
                }
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-primary text-white font-bold"
            >
              <LockOpen className="w-4 h-4" />
              Unlock All Jobs
            </button>

            {userEmail ? (
              <>
                <Link
                  href="/profile"
                  className="w-full text-center px-4 py-3 rounded-xl border border-white/10 text-white font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleSignOut();
                  }}
                  className="w-full text-center py-2 text-zinc-400 text-sm"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login?callbackUrl=/alerts"
                className="w-full text-center px-4 py-3 rounded-xl border border-white/10 text-white font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Unlock Dialog */}
      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent className="border border-white/10 bg-[#1A1A1A] text-white sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Join WorkIsWork</DialogTitle>
            <DialogDescription className="text-zinc-400 pt-2">
              Unlock unlimited access to the best remote jobs and premium features.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start gap-2">
            <Link
              href="/join"
              className="px-6 py-2.5 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
              onClick={() => setShowUnlockDialog(false)}
            >
              Join Now
            </Link>
            <button
              onClick={() => setShowUnlockDialog(false)}
              className="px-4 py-2.5 rounded-full text-zinc-400 font-medium hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
