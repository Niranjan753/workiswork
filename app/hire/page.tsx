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
    <div className="relative min-h-screen bg-[#0B0B0B] text-white selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-16 text-center px-4">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-semibold tracking-tighter text-[44px] leading-[1] sm:text-[56px] md:text-[90px]">
            Hire <span className="text-[#FF5A1F]">remote</span> talent
            <br />
            without the guesswork.
          </h1>

          <p className="mt-8 text-[18px] sm:text-[24px] max-w-3xl mx-auto leading-[1.1] text-[#B6B6B6]">
            Reach people who already live and breathe remote work – across
            <br className="hidden sm:block" />
            product, engineering, design, marketing and operations.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3">
            <Link
              href="/post"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[22px] font-medium cursor-pointer px-10 py-[12px] rounded-2xl transition-colors shadow-lg shadow-blue-900/20"
            >
              Post a job for $199
            </Link>
            <span className="text-[13px] text-[#8C8C8C] mt-2 font-bold uppercase tracking-widest">
              Flat fee. No subscriptions.
            </span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-10">
        {/* 3-column style value props */}
        <section className="grid gap-6 sm:grid-cols-3 mb-16">
          <div className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm space-y-3">
            <h2 className="text-xl font-bold text-white">Built for <span className="text-blue-500">remote</span>-first teams</h2>
            <p className="text-sm font-medium text-zinc-400 leading-relaxed">
              WorkIsWork is 100% focused on remote roles, so you&apos;re not sifting through candidates who actually
              want to go back to an office.
            </p>
          </div>
          <div className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm space-y-3">
            <h2 className="text-xl font-bold text-white">Targeted, not massive</h2>
            <p className="text-sm font-medium text-zinc-400 leading-relaxed">
              We optimize for signal over noise. Fewer, better applications from people who match your stack and
              timezone.
            </p>
          </div>
          <div className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm space-y-3">
            <h2 className="text-xl font-bold text-white">You keep the relationship</h2>
            <p className="text-sm font-medium text-zinc-400 leading-relaxed">
              Candidates apply straight to you. No middle-man, no mark-ups, no agency-style ownership clauses.
            </p>
          </div>
        </section>

        {/* Simple pricing strip */}
        <section className="border border-zinc-800 bg-gradient-to-r from-zinc-900 to-black p-8 sm:p-12 mb-16 rounded-[2rem] shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center lg:text-left">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">PRICING</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">One flat price. No surprises.</h2>
              <p className="text-lg font-medium text-zinc-400">
                Post a <span className="text-white">remote</span> role to WorkIsWork for a simple, all-in <span className="font-bold text-white">$199</span> per job. Stay live for 30 days.
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-center lg:items-end gap-3">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">PER POST</p>
              <p className="text-5xl font-bold text-white tracking-tighter">$199</p>
              <Link
                href="/post"
                className="mt-4 inline-block px-10 py-4 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
              >
                Hire for $199
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-8 max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: "1", title: "Post your job", desc: "Tell us who you're looking for – role, stack, timezone, and remote policy." },
              { step: "2", title: "We feature it", desc: "Your job goes live on our board and is pushed to our targeted audience." },
              { step: "3", title: "Get candidates", desc: "Applicants go directly to you. You run your own hiring process." }
            ].map((item) => (
              <div key={item.step} className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-white border border-zinc-700">
                  {item.step}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-sm font-medium text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

