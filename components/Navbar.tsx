"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { cn } from "../lib/utils";
import * as React from "react";
import { authClient } from "../lib/auth-client";
import { LockOpen } from "lucide-react";
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
  const [userRole, setUserRole] = React.useState<"user" | "employer" | null>(null);
  const [showUnlockDialog, setShowUnlockDialog] = React.useState(false);
  const isJobs = pathname === "/" || pathname.startsWith("/jobs");
  const isBlog = pathname.startsWith("/blog");
  const isJoin = pathname.startsWith("/join");
  const isHire = pathname.startsWith("/hire");
  const isPortfolio = pathname.startsWith("/portfolio");

  const userEmail = session?.user?.email;

  // Fetch user role when session is available
  React.useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/user/role")
        .then((res) => res.json())
        .then((data) => {
          if (data.role) {
            setUserRole(data.role);
          }
        })
        .catch(() => {
          // Default to user if fetch fails
          setUserRole("user");
        });
    } else {
      setUserRole(null);
    }
  }, [session?.user?.id]);

  // Removed handlePostClick - no authentication required for posting jobs

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
    setMobileOpen(false); // close mobile nav when navigating
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b-2 border-black bg-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <Link href="/jobs" className="flex items-center min-w-fit">
          <span className="flex h-10 w-10 items-center justify-center">
            <Logo width={48} height={32} />
          </span>
          {/* Brand name always visible to right of Logo in desktop */}
          <span className="text-lg font-bold tracking-tight text-black ml-2 hidden md:inline">
            WorkIsWork
          </span>
          {/* Show name on xs but hide on SM+ for only mobile (optional) */}
          <span className="text-lg font-bold tracking-tight text-black ml-2 inline md:hidden xs:inline">
            WorkIsWork
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-3 text-xs font-medium">
          <Link
            href="/jobs"
            className={cn(
              "px-4 py-2 text-sm font-bold transition-all",
              isJobs
                ? "bg-yellow-400 text-black shadow-lg border-2 border-black"
                : "text-black hover:bg-black hover:text-white hover:shadow-md"
            )}
          >
            Remote Jobs
          </Link>
          <Link
            href="/blog"
            className={cn(
              "px-4 py-2 text-sm font-bold transition-all",
              isBlog
                ? "bg-yellow-400 text-black shadow-lg border-2 border-black"
                : "text-black hover:bg-black hover:text-white hover:shadow-md"
            )}
          >
            Blog
          </Link>
          <Link
            href="/portfolio"
            className={cn(
              "px-4 py-2 text-sm font-bold transition-all",
              isPortfolio
                ? "bg-yellow-400 text-black shadow-lg border-2 border-black"
                : "text-black hover:bg-black hover:text-white hover:shadow-md"
            )}
          >
            Portfolio
          </Link>
          <Link
            href="/join"
            className={cn(
              "px-4 py-2 text-sm font-bold transition-all",
              isJoin
                ? "bg-yellow-400 text-black shadow-lg border-2 border-black"
                : "text-black hover:bg-black hover:text-white hover:shadow-md"
            )}
          >
            Join
          </Link>
          <Link
            href="/hire"
            className={cn(
              "px-4 py-2 text-sm font-bold transition-all",
              isHire
                ? "bg-yellow-400 text-black shadow-lg border-2 border-black"
                : "text-black hover:bg-black hover:text-white hover:shadow-md"
            )}
          >
            Post a Job
          </Link>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (!session?.user) {
                  setShowUnlockDialog(true);
                } else {
                  router.push("/pricing");
                }
              }}
              className="flex items-center gap-2 border-2 border-black bg-yellow-300 px-4 py-2 text-sm font-bold text-black shadow-md hover:bg-yellow-500 transition-all border-black border-b-2 hover:border-black cursor-pointer"
            >
              <LockOpen className="w-4 h-4" />
              Unlock All Jobs
            </button>
            <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
              <DialogContent className="border-2 border-black bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black text-black">
                    Join to Unlock All Jobs
                  </DialogTitle>
                  <DialogDescription className="text-sm font-medium text-black/80 pt-2">
                    Join WorkIsWork to access all job listings and unlock premium features.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                  <Link
                    href="/join"
                    className="px-6 py-3 border-2 border-black bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-500 transition-colors shadow-md"
                    onClick={() => setShowUnlockDialog(false)}
                  >
                    Join Now
                  </Link>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {userEmail ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="border-2 border-yellow-400 bg-yellow-300 px-4 py-2 text-sm font-bold text-black shadow-md hover:bg-yellow-500 cursor-pointer transition-all"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login?callbackUrl=/alerts"
              className="border-2 border-black bg-yellow-300 px-4 py-2 text-sm font-bold text-black shadow-md hover:bg-yellow-500 transition-all border-black border-b-2 hover:border-black cursor-pointer"
            >
              Log in
            </Link>
          )}
        </div>

        <button
          type="button"
          className="flex md:hidden items-center justify-center border-2 border-yellow-400 p-2 focus:outline-none z-50"
          aria-label="Open menu"
          onClick={() => setMobileOpen((open) => !open)}
        >

          <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={3} className="text-yellow-400">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={mobileOpen
                ? "M6 6l12 12M6 18L18 6"
                : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>


      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 md:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-4/5 max-w-xs bg-white border-l-2 border-yellow-400 shadow-2xl transition-transform duration-200 flex flex-col gap-0 md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ transitionProperty: 'transform' }}
        aria-modal={mobileOpen}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b-2 border-black">
          <Link href="/jobs" className="flex items-center gap-2 min-w-fit" onClick={() => setMobileOpen(false)}>
          </Link>
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4 text-base font-bold">
          <Link
            href="/jobs"
            className={cn(
              "px-4 py-2 transition-all border-2",
              isJobs
                ? "bg-yellow-400 text-black shadow-lg border-black"
                : "text-black hover:bg-white hover:text-black border-yellow-400"
            )}
            onClick={() => setMobileOpen(false)}
          >
            Remote Jobs
          </Link>
          <Link
            href="/blog"
            className={cn(
              "px-4 py-2 transition-all border-2",
              isBlog
                ? "bg-yellow-400 text-black shadow-lg border-black"
                : "text-black hover:bg-white hover:text-black border-yellow-400"
            )}
            onClick={() => setMobileOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/portfolio"
            className={cn(
              "px-4 py-2 transition-all border-2",
              isPortfolio
                ? "bg-yellow-400 text-black shadow-lg border-black"
                : "text-black hover:bg-white hover:text-black border-yellow-400"
            )}
            onClick={() => setMobileOpen(false)}
          >
            Portfolio
          </Link>
          <Link
            href="/join"
            className={cn(
              "px-4 py-2 transition-all border-2",
              isJoin
                ? "bg-yellow-400 text-black shadow-lg border-black"
                : "text-black hover:bg-white hover:text-black border-yellow-400"
            )}
            onClick={() => setMobileOpen(false)}
          >
            Join
          </Link>
          <Link
            href="/hire"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "px-4 py-2 transition-all border-2",
              isHire
                ? "bg-yellow-400 text-black shadow-lg border-black"
                : "text-black hover:bg-white hover:text-black border-yellow-400"
            )}
          >
            Post a Job
          </Link>
        </nav>
        <div className="flex flex-col gap-2 px-3 pb-4">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              if (!session?.user) {
                setShowUnlockDialog(true);
              } else {
                router.push("/pricing");
              }
            }}
            className="flex items-center gap-2 border-2 border-black bg-black px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-gray-900 transition-all text-left"
          >
            <LockOpen className="w-4 h-4" />
            Unlock All Jobs
          </button>
          {userEmail ? (
            <button
              type="button"
              className="border-2 border-yellow-400 bg-yellow-400 px-4 py-2 text-sm font-bold text-black shadow-md hover:bg-yellow-500 transition-all cursor-pointer text-left"
              onClick={() => {
                setMobileOpen(false);
                handleSignOut();
              }}
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login?callbackUrl=/alerts"
              className="border-2 border-yellow-400 cursor-pointer bg-yellow-400 px-4 py-2 text-sm font-bold text-black shadow-md hover:bg-yellow-500 transition-all"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
