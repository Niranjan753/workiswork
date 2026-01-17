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
    <footer className={cn(
      "border-t border-border",
      "bg-background text-foreground"
    )}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo />
              <span className={cn("text-lg font-bold", "text-foreground")}>
                WorkIsWork
              </span>
            </div>
            <p className={cn("text-sm font-medium", "text-muted-foreground")}>
              The best remote jobs, curated for you. Find your next opportunity in tech, design, marketing, and more.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/workiswork"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "transition-all hover:scale-110",
                  "text-muted-foreground hover:text-foreground"
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
                  "transition-all hover:scale-110",
                  "text-muted-foreground hover:text-foreground"
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
                  "transition-all hover:scale-110",
                  "text-muted-foreground hover:text-foreground"
                )}
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div className="space-y-4">
            <h3 className={cn("text-sm font-bold", "text-foreground")}>
              For Job Seekers
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/jobs"
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-all hover:underline",
                    "text-muted-foreground hover:text-foreground"
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
                    "flex items-center gap-2 text-sm font-medium transition-all hover:underline",
                    "text-muted-foreground hover:text-foreground"
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
                    "flex items-center gap-2 text-sm font-medium transition-all hover:underline",
                    "text-muted-foreground hover:text-foreground"
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
                    "flex items-center gap-2 text-sm font-medium transition-all hover:underline",
                    "text-muted-foreground hover:text-foreground"
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
            <h3 className={cn("text-sm font-bold", "text-foreground")}>
              For Employers
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/post"
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-all hover:underline",
                    "text-muted-foreground hover:text-foreground"
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
                    "flex items-center gap-2 text-sm font-medium transition-all hover:underline",
                    "text-muted-foreground hover:text-foreground"
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
                    "flex items-center gap-2 text-sm font-medium transition-all hover:underline",
                    "text-muted-foreground hover:text-foreground"
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
            <h3 className={cn("text-sm font-bold", "text-foreground")}>
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className={cn(
                    "text-sm font-medium transition-all hover:underline",
                    "text-muted-foreground hover:text-foreground"
                  )}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className={cn(
                    "text-sm font-medium transition-all hover:underline",
                    "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="mailto:berlin@workiswork.xyz"
                  className={cn(
                    "text-sm font-medium transition-all hover:underline",
                    "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Contact
                </a>
              </li>
              <li>
                <Link
                  href="/terms"
                  className={cn(
                    "text-sm font-medium transition-all hover:underline",
                    "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className={cn(
                    "text-sm font-medium transition-all hover:underline",
                    "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={cn("mt-12 border-t border-border pt-8")}>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className={cn("text-xs font-medium", "text-muted-foreground")}>
              © {currentYear} WorkIsWork. All rights reserved.
            </p>
            <div className={cn("flex items-center gap-6 text-xs font-medium", "text-muted-foreground")}>
              <span>Made with ❤️ for remote workers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

