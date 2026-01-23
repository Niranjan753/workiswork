import Link from "next/link";
import { Logo } from "./Logo";
import { Briefcase, Bell, FileText, Building2, DollarSign, Mail, Twitter, Linkedin, Github } from "lucide-react";
import { cn } from "../lib/utils";

type FooterProps = {
  variant?: "dark" | "light";
};

export function Footer({ variant = "dark" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] text-white py-16 px-6 border-t-2 border-black selection:bg-orange-500/30">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-black uppercase tracking-tighter italic">WorkIsWork</span>
            </div>
            <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] leading-relaxed max-w-xs">
              Connecting top-tier remote talent <br />
              with the world's most innovative companies.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-orange-500">For Talent</h3>
            <ul className="space-y-3">
              {[
                { label: "Browse Jobs", href: "/jobs" },
                { label: "Job Alerts", href: "/alerts" },
                { label: "Blog", href: "/blog" },
                { label: "Pricing", href: "/pricing" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-orange-500">For Companies</h3>
            <ul className="space-y-3">
              {[
                { label: "Post a Job", href: "/post" },
                { label: "Hire Talent", href: "/hire" },
                { label: "Pricing", href: "/pricing" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-orange-500">Company</h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "mailto:berlin@workiswork.xyz" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t-2 border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
            © {currentYear} Workiswork. All rights reserved.
          </div>

          <div className="flex items-center gap-8">
            <a href="https://twitter.com/workiswork" className="text-zinc-600 hover:text-orange-500 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com/company/workiswork" className="text-zinc-600 hover:text-orange-500 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://github.com/workiswork" className="text-zinc-600 hover:text-orange-500 transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

