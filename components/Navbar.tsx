"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { cn } from "../lib/utils";
import * as React from "react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isJobs = pathname === "/" || pathname.startsWith("/jobs");
  const isBlog = pathname.startsWith("/blog");
  const isAlerts = pathname.startsWith("/alerts");
  const isAdmin = pathname.startsWith("/admin");

  React.useEffect(() => {
    setMobileOpen(false); // close mobile nav when navigating
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-orange-200 bg-[#fde9d7]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <Link href="/jobs" className="flex items-center min-w-fit">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white px-2 py-1 shadow-sm ring-1 ring-orange-200">
            <Logo width={32} height={20} />
          </span>
          {/* Brand name always visible to right of Logo in desktop */}
          <span className="text-lg font-semibold tracking-tight text-zinc-900 ml-2 hidden md:inline">
            WorkIsWork
          </span>
          {/* Show name on xs but hide on SM+ for only mobile (optional) */}
          <span className="text-lg font-semibold tracking-tight text-zinc-900 ml-2 inline md:hidden xs:inline">
            WorkIsWork
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-3 text-xs font-medium text-zinc-800">
          <Link
            href="/jobs"
            className={cn(
              "px-4 py-2 text-sm font-semibold",
              isJobs
                ? "rounded-xl bg-white text-zinc-900 shadow-sm"
                : "text-zinc-700 hover:text-zinc-900",
            )}
          >
            Remote Jobs
          </Link>
          <Link
            href="/blog"
            className={cn(
              "px-4 py-2 text-sm font-semibold",
              isBlog
                ? "rounded-xl bg-white text-zinc-900 shadow-sm"
                : "text-zinc-700 hover:text-zinc-900",
            )}
          >
            Blog
          </Link>
          <Link
            href="/alerts"
            className={cn(
              "px-4 py-2 text-sm font-semibold",
              isAlerts
                ? "rounded-xl bg-white text-zinc-900 shadow-sm"
                : "text-zinc-700 hover:text-zinc-900",
            )}
          >
            Job Alerts
          </Link>
          <Link
            href="/admin"
            className={cn(
              "px-4 py-2 text-sm font-semibold",
              isAdmin
                ? "rounded-xl bg-white text-zinc-900 shadow-sm"
                : "text-zinc-700 hover:text-zinc-900",
            )}
          >
            For Employers
          </Link>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <Link
            href="/pricing"
            className="rounded-xl border border-orange-500 bg-white px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm"
          >
            Unlock All Jobs
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-black font-semibold shadow-sm"
          >
            Log in
          </Link>
        </div>

        {/* Hamburger Icon for Mobile */}
        <button
          type="button"
          className="flex md:hidden items-center justify-center rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-orange-300 z-50"
          aria-label="Open menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {/* Hamburger icon */}
          <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} className="text-orange-700">
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

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 md:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Dropdown Menu */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-4/5 max-w-xs bg-[#fde9d7] border-l border-orange-200 shadow-2xl transition-transform duration-200 flex flex-col gap-0 md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ transitionProperty: 'transform' }}
        aria-modal={mobileOpen}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-orange-200">
          <Link href="/jobs" className="flex items-center gap-2 min-w-fit" onClick={() => setMobileOpen(false)}>
          </Link>
          <button
            className="p-2 rounded-full hover:bg-orange-100"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg width={24} height={24} fill="none" stroke="black" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4 text-base font-medium text-zinc-800">
          <Link
            href="/jobs"
            className={cn(
              "rounded-xl px-4 py-2",
              isJobs
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-700 hover:text-zinc-900"
            )}
            onClick={() => setMobileOpen(false)}
          >
            Remote Jobs
          </Link>
          <Link
            href="/blog"
            className={cn(
              "rounded-xl px-4 py-2",
              isBlog
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-700 hover:text-zinc-900"
            )}
            onClick={() => setMobileOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/alerts"
            className={cn(
              "rounded-xl px-4 py-2",
              isAlerts
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-700 hover:text-zinc-900"
            )}
            onClick={() => setMobileOpen(false)}
          >
            Job Alerts
          </Link>
          <Link
            href="/admin"
            className={cn(
              "rounded-xl px-4 py-2",
              isAdmin
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-700 hover:text-zinc-900"
            )}
            onClick={() => setMobileOpen(false)}
          >
            For Employers
          </Link>
        </nav>
        <div className="flex flex-col gap-2 px-3 pb-4">
          <Link
            href="/pricing"
            className="rounded-xl border border-orange-500 bg-white px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm"
            onClick={() => setMobileOpen(false)}
          >
            Unlock All Jobs
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-black font-semibold shadow-sm"
            onClick={() => setMobileOpen(false)}
          >
            Log in
          </Link>
        </div>
      </div>
    </header>
  );
}
