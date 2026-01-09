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
    <div className="relative min-h-screen bg-white text-black overflow-hidden">
      <GridBackground />

      {/* Hero */}
      <section className="relative z-10 bg-yellow-400 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/70 mb-3">
            FOR EMPLOYERS & TEAMS
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-black">
            Hire{" "}
            <span className="inline-block bg-white px-2 py-1 border-2 border-black">
              remote
            </span>{" "}
            talent without the guesswork.
          </h1>
          <p className="mt-4 text-base sm:text-lg font-medium text-black/80 max-w-2xl">
            Post a role once and reach people who already live and breathe remote work – across product, engineering,
            design, marketing and operations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Link
              href="/post"
              className="inline-block w-full sm:w-auto text-center px-4 py-3 bg-black text-white text-sm font-bold border-2 border-black hover:bg-white hover:text-black transition-all cursor-pointer shadow-sm hover:shadow-lg"
            >
              Hire for $199 →
            </Link>
            <p className="text-xs sm:text-sm font-medium text-black/70 max-w-xs sm:max-w-none">
              Flat, one-time fee. No recruiters, no percentage of salary, no lock‑in.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 bg-white">
        {/* 3-column style value props similar to Remotive */}
        <section className="grid gap-6 sm:grid-cols-3 mb-10">
          <div className="border-2 border-black bg-white p-5">
            <h2 className="text-lg font-black mb-2">Built for <span className="bg-yellow-400 px-1">remote</span>‑first teams</h2>
            <p className="text-sm font-medium text-black/80">
              WorkIsWork is 100% focused on <span className="bg-yellow-400 px-1">remote</span> roles, so you&apos;re not sifting through candidates who actually
              want to go back to an office.
            </p>
          </div>
          <div className="border-2 border-black bg-white p-5">
            <h2 className="text-lg font-black mb-2">Targeted, not massive</h2>
            <p className="text-sm font-medium text-black/80">
              We optimize for signal over noise. Fewer, better applications from people who match your stack and
              timezone.
            </p>
          </div>
          <div className="border-2 border-black bg-white p-5">
            <h2 className="text-lg font-black mb-2">You keep the relationship</h2>
            <p className="text-sm font-medium text-black/80">
              Candidates apply straight to you. No middle‑man, no mark‑ups, no agency-style ownership clauses.
            </p>
          </div>
        </section>

        {/* Simple pricing strip */}
        <section className="border-2 border-black bg-gray-50 p-6 sm:p-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60">PRICING</p>
              <h2 className="text-2xl sm:text-3xl font-black">One flat price. No surprises.</h2>
              <p className="text-sm font-medium text-black/70 max-w-xl">
                Post a <span className="bg-yellow-400 px-1">remote</span> role to WorkIsWork for a simple, all‑in <span className="font-semibold">$199</span> per job. Your listing stays live for 30
                days and is instantly visible to our audience.
              </p>
            </div>
            <div className="shrink-0 text-center sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60">PER JOB</p>
              <p className="text-3xl sm:text-4xl font-black">$199</p>
              <Link
                href="/post"
                className="mt-3 inline-block w-full sm:w-auto text-center px-4 py-3 bg-black text-white text-sm font-bold border-2 border-black hover:bg-yellow-400 hover:text-black transition-all cursor-pointer shadow-sm hover:shadow-lg"
              >
                Hire for $199 →
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black">How it works</h2>
          <ol className="space-y-3 text-sm font-medium text-black/80">
            <li>
              <span className="font-bold">1. Post your job.</span> Tell us who you&apos;re looking for – role, stack,
              timezone, and what &quot;<span className="bg-yellow-400 px-1">remote</span>&quot; means at your company.
            </li>
            <li>
              <span className="font-bold">2. We feature it.</span> Your job goes live on the WorkIsWork board and is
              discoverable via search, filters, and alerts.
            </li>
            <li>
              <span className="font-bold">3. You get candidates.</span> Applicants go directly to your ATS, form, or
              inbox – you run your own process.
            </li>
          </ol>

          <div className="mt-6">
            <Link
              href="/post"
              className="inline-block w-full sm:w-auto text-center px-4 py-3 bg-black text-white text-sm font-bold border-2 border-black hover:bg-yellow-400 hover:text-black transition-all cursor-pointer shadow-sm hover:shadow-lg"
            >
              Hire for $199 →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

