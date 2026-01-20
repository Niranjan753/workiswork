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
      <header className="sticky top-0 text-white bg-[#1b1b1b] z-50 w-full border-b-[0.5px] border-border  backdrop-blur-sm border-gray-500 border-opacity-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Logo width={28} height={20} />
              <span className="text-xl font-bold tracking-tight text-white">
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
                    "px-4 py-2 text-md font-medium rounded-md transition-all duration-200 ",
                    link.active
                      ? "bg-[#1c1c1c] text-white"
                      : "text-white hover:text-white hover:bg-[#1c1c1c]/50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => {
                  if (!session?.user) {
                    setShowUnlockDialog(true);
                  } else {
                    router.push("/pricing");
                  }
                }}
                className="flex items-center gap-2 px-6 py-2 rounded-md bg-[#FF5A1F] text-white text-sm font-bold shadow-sm hover:bg-[#FF5A1F]/90 transition-all active:scale-95 cursor-pointer"
              >
                <LockOpen className="w-3.5 h-3.5" />
                Unlock Jobs
              </button>

              {userEmail ? (
                <div className="flex items-center gap-3 ml-2 border-l border-border pl-4">
                  <Link
                    href="/profile"
                    className="px-4 py-2 rounded-md border border-border bg-white text-black text-sm font-medium hover:bg-secondary/80 transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-black bg-white hover:bg-white/90 px-4 py-2 rounded-md border border-border text-sm font-bold transition-colors cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login?callbackUrl=/alerts"
                  className="px-4 py-2 rounded-md border bg-white text-black text-sm font-bold hover:bg-white/90"
                >
                  Log in
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 text-foreground hover:bg-secondary/50 rounded-md transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm origin-top rounded-3xl bg-background border border-border p-2 shadow-2xl transition-all duration-300 md:hidden",
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
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="h-px bg-border my-2 mx-2" />

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
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold"
            >
              <LockOpen className="w-4 h-4" />
              Unlock All Jobs
            </button>

            {userEmail ? (
              <>
                <Link
                  href="/profile"
                  className="w-full text-center px-4 py-3 rounded-xl border border-border text-foreground font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleSignOut();
                  }}
                  className="w-full text-center py-2 text-muted-foreground text-sm"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login?callbackUrl=/alerts"
                className="w-full text-center px-4 py-3 rounded-xl border border-border text-foreground font-medium"
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
        <DialogContent className="border border-border bg-background text-foreground sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Join WorkIsWork</DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              Unlock unlimited access to the best remote jobs and premium features.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start gap-2">
            <Link
              href="/join"
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
              onClick={() => setShowUnlockDialog(false)}
            >
              Join Now
            </Link>
            <button
              onClick={() => setShowUnlockDialog(false)}
              className="px-4 py-2.5 rounded-full text-muted-foreground font-medium hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
