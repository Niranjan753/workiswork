"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LockOpen } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "../lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = React.useState(false);

  const isHire = pathname.startsWith("/hire");
  const isPost = pathname.startsWith("/post");

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Hire Talent", href: "/hire", active: isHire },
    { name: "Post Jobs", href: "/post", active: isPost },
    { name: "Marketplace", href: "#" },
    { name: "Network", href: "#" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Logo width={32} height={24} />
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black italic tracking-tighter uppercase">
                  WorkIsWork
                </span>
                <span className="text-[8px] font-bold tracking-[0.4em] text-orange-500 uppercase">Remote Elite</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-6 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all",
                    link.active
                      ? "text-orange-500"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setShowUnlockDialog(true)}
                className="bg-white text-black px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all border border-white"
              >
                Access Portal
              </button>
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-12 h-12 flex items-center justify-center border border-white/10 hover:bg-white/5 transition-all"
            >
              <div className="space-y-1.5">
                <div className="w-6 h-0.5 bg-white" />
                <div className="w-4 h-0.5 bg-white" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl transition-all duration-500 ease-in-out lg:hidden",
          mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className="flex flex-col h-full p-8 pt-24">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-8 right-8 w-12 h-12 border border-white/20 flex items-center justify-center text-white"
          >
            <X size={24} />
          </button>

          <div className="space-y-12">
            <div className="flex flex-col space-y-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-5xl font-black text-white hover:text-orange-500 transition-colors uppercase italic tracking-tighter"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-12 border-t border-white/10 space-y-8">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setShowUnlockDialog(true);
                }}
                className="w-full bg-orange-500 text-white py-6 text-xs font-black uppercase tracking-[0.3em] italic"
              >
                Access Elite Portal
              </button>
              <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <span>©2024 WorkIsWork</span>
                <span>Direct Hiring Inc.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= UNLOCK DIALOG ================= */}
      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent className="rounded-none border-2 border-black bg-white p-12 max-w-lg shadow-[24px_24px_0px_rgba(0,0,0,1)]">
          <DialogHeader className="text-left space-y-4">
            <div className="w-12 h-1 bg-black" />
            <DialogTitle className="text-4xl font-black uppercase italic tracking-tighter leading-none">
              Restricted <br /> Access
            </DialogTitle>
            <p className="text-gray-500 font-medium uppercase tracking-tight text-sm">
              Authenticating credentials for elite marketplace access. Join the network to proceed.
            </p>
          </DialogHeader>
          <div className="mt-12 flex flex-col gap-4">
            <Link
              href="/join"
              onClick={() => setShowUnlockDialog(false)}
              className="w-full bg-black text-white py-5 text-center text-xs font-black uppercase tracking-[0.2em] hover:bg-orange-500 transition-all"
            >
              Initialize Membership
            </Link>
            <button
              onClick={() => setShowUnlockDialog(false)}
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
            >
              Decline Access
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
