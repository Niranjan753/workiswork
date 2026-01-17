import type { Metadata } from "next";
import Link from "next/link";

import { GridBackground } from "@/components/GridBackground";
import { getSiteUrl, getOgImageUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Hire Remote Talent – WorkIsWork",
  description: "Reach experienced remote developers, designers, and operators who actually want to work remotely.",
  openGraph: {
    type: "website",
    url: `${siteUrl}/hire`,
    title: "Hire Remote Talent – WorkIsWork",
    description: "Post your remote role to reach a focused audience of remote-first candidates.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "WorkIsWork – Hire Remote Talent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire Remote Talent – WorkIsWork",
    description: "Post your remote role to reach a focused audience of remote-first candidates.",
    images: [ogImage],
  },
};

export default function HirePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Clean Hero */}
      <section className="relative z-10 py-12 sm:py-16 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-3">
            FOR EMPLOYERS & TEAMS
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-foreground">
            Hire{" "}
            <span className="text-primary relative inline-block">
              remote
            </span>{" "}
            talent without the guesswork.
          </h1>
          <p className="mt-4 text-base sm:text-lg font-medium text-muted-foreground max-w-2xl">
            Post a role once and reach people who already live and breathe remote work – across product, engineering,
            design, marketing and operations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Link
              href="/post"
              className="inline-block w-full sm:w-auto text-center px-6 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-md hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
            >
              Hire for $199 →
            </Link>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground max-w-xs sm:max-w-none">
              Flat, one-time fee. No recruiters, no percentage of salary, no lock‑in.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 bg-background">
        {/* 3-column style value props */}
        <section className="grid gap-6 sm:grid-cols-3 mb-10">
          <div className="border border-border bg-background p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-2 text-foreground">Built for <span className="text-primary font-bold">remote</span>‑first teams</h2>
            <p className="text-sm font-medium text-muted-foreground">
              WorkIsWork is 100% focused on remote roles, so you&apos;re not sifting through candidates who actually
              want to go back to an office.
            </p>
          </div>
          <div className="border border-border bg-background p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-2 text-foreground">Targeted, not massive</h2>
            <p className="text-sm font-medium text-muted-foreground">
              We optimize for signal over noise. Fewer, better applications from people who match your stack and
              timezone.
            </p>
          </div>
          <div className="border border-border bg-background p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-2 text-foreground">You keep the relationship</h2>
            <p className="text-sm font-medium text-muted-foreground">
              Candidates apply straight to you. No middle‑man, no mark‑ups, no agency-style ownership clauses.
            </p>
          </div>
        </section>

        {/* Simple pricing strip */}
        <section className="border border-border bg-secondary/30 p-6 sm:p-8 mb-10 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">PRICING</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">One flat price. No surprises.</h2>
              <p className="text-sm font-medium text-muted-foreground max-w-xl">
                Post a <span className="text-foreground font-semibold">remote</span> role to WorkIsWork for a simple, all‑in <span className="font-bold text-foreground">$199</span> per job. Your listing stays live for 30
                days and is instantly visible to our audience.
              </p>
            </div>
            <div className="shrink-0 text-center sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">PER JOB</p>
              <p className="text-3xl sm:text-4xl font-bold text-foreground">$199</p>
              <Link
                href="/post"
                className="mt-3 inline-block w-full sm:w-auto text-center px-6 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-md hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
              >
                Hire for $199 →
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">How it works</h2>
          <ol className="space-y-3 text-sm font-medium text-muted-foreground">
            <li>
              <span className="font-bold text-foreground">1. Post your job.</span> Tell us who you&apos;re looking for – role, stack,
              timezone, and what &quot;remote&quot; means at your company.
            </li>
            <li>
              <span className="font-bold text-foreground">2. We feature it.</span> Your job goes live on the WorkIsWork board and is
              discoverable via search, filters, and alerts.
            </li>
            <li>
              <span className="font-bold text-foreground">3. You get candidates.</span> Applicants go directly to your ATS, form, or
              inbox – you run your own process.
            </li>
          </ol>

          <div className="mt-6">
            <Link
              href="/post"
              className="inline-block w-full sm:w-auto text-center px-6 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-md hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
            >
              Hire for $199 →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

