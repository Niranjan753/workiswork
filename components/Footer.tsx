import Link from "next/link";
import { Logo } from "./Logo";
import { Briefcase, Bell, FileText, Building2, DollarSign, Mail, Twitter, Linkedin, Github } from "lucide-react";
import { cn } from "../lib/utils";

type FooterProps = {
  variant?: "dark" | "light";
};

export function Footer({ variant = "dark" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Force background to be white and use dark text.
  const isLight = true;

  return (
    <footer className={cn(
      "border-t",
      "border-zinc-200 bg-white text-zinc-600"
    )}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo />
              <span className={cn("text-lg font-bold", "text-zinc-900")}>
                WorkIsWork
              </span>
            </div>
            <p className={cn("text-sm", "text-zinc-600")}>
              The best remote jobs, curated for you. Find your next opportunity in tech, design, marketing, and more.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/workiswork"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "transition-colors",
                  "text-zinc-500 hover:text-orange-600"
                )}
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/workiswork"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "transition-colors",
                  "text-zinc-500 hover:text-orange-600"
                )}
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/workiswork"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "transition-colors",
                  "text-zinc-500 hover:text-orange-600"
                )}
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div className="space-y-4">
            <h3 className={cn("text-sm font-semibold", "text-zinc-900")}>
              For Job Seekers
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/jobs"
                  className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    "text-zinc-600 hover:text-orange-600"
                  )}
                >
                  <Briefcase className="h-4 w-4" />
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/alerts"
                  className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    "text-zinc-600 hover:text-orange-600"
                  )}
                >
                  <Bell className="h-4 w-4" />
                  Job Alerts
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    "text-zinc-600 hover:text-orange-600"
                  )}
                >
                  <FileText className="h-4 w-4" />
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    "text-zinc-600 hover:text-orange-600"
                  )}
                >
                  <DollarSign className="h-4 w-4" />
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="space-y-4">
            <h3 className={cn("text-sm font-semibold", "text-zinc-900")}>
              For Employers
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    "text-zinc-600 hover:text-orange-600"
                  )}
                >
                  <Building2 className="h-4 w-4" />
                  Post a Job
                </Link>
              </li>
              <li>
                <a
                  href="mailto:employers@workiswork.com"
                  className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    "text-zinc-600 hover:text-orange-600"
                  )}
                >
                  <Mail className="h-4 w-4" />
                  Contact Sales
                </a>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    "text-zinc-600 hover:text-orange-600"
                  )}
                >
                  <DollarSign className="h-4 w-4" />
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-4">
            <h3 className={cn("text-sm font-semibold", "text-zinc-900")}>
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className={cn(
                    "text-sm transition-colors",
                    "text-zinc-600 hover:text-orange-600"
                  )}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className={cn(
                    "text-sm transition-colors",
                    "text-zinc-600 hover:text-orange-600"
                  )}
                >
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@workiswork.com"
                  className={cn(
                    "text-sm transition-colors",
                    "text-zinc-600 hover:text-orange-600"
                  )}
                >
                  Contact
                </a>
              </li>
              <li>
                <Link
                  href="/terms"
                  className={cn(
                    "text-sm transition-colors",
                    "text-zinc-600 hover:text-orange-600"
                  )}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className={cn(
                    "text-sm transition-colors",
                    "text-zinc-600 hover:text-orange-600"
                  )}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={cn("mt-12 border-t pt-8", "border-zinc-200")}>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className={cn("text-xs", "text-zinc-500")}>
              © {currentYear} WorkIsWork. All rights reserved.
            </p>
            <div className={cn("flex items-center gap-6 text-xs", "text-zinc-500")}>
              <span>Made with ❤️ for remote workers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

