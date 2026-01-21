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
    <footer className="bg-[#0B0B0B] text-white py-16 px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          {/* Brand/Logo Section (2 columns wide on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight">WorkIsWork</span>
            </div>
            <p className="text-zinc-500 font-medium text-lg max-w-sm leading-relaxed">
              Where the world comes to work.
              <br />
              The best remote jobs, curated for you.
            </p>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-6">
              <h3 className="font-bold text-white text-sm">For Talent</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/jobs" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/alerts" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                    Job Alerts
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-white text-sm">For Employers</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/post" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <a href="mailto:employers@workiswork.xyz" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                    Contact Sales
                  </a>
                </li>
                <li>
                  <Link href="/pricing" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                    Pricing Plans
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-white text-sm">Company</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/about" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="mailto:berlin@workiswork.xyz" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                    Contact
                  </a>
                </li>
                <li>
                  <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-500 text-sm font-medium">
            © {currentYear} WorkIsWork Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com/workiswork"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/company/workiswork"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/workiswork"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

