import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl, getOgImageUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Join – WorkIsWork",
  description: "Answer a few quick questions so we can better match you with remote roles.",
  openGraph: {
    type: "website",
    url: `${siteUrl}/join`,
    title: "Join – WorkIsWork",
    description: "Join the WorkIsWork community to get matched with the best remote jobs.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "WorkIsWork – Join Community",
      },
    ],
  },
};

export default function JoinPage() {
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
          <h1 className="font-semibold tracking-tighter mt-12 sm:mt-16 text-[36px] leading-[1.1] sm:text-[56px] md:text-[80px] lg:text-[90px]">
            The <span className="text-[#FF5A1F]">community</span> for
            <br />
            remote professionals.
          </h1>

          <p className="mt-8 text-[16px] sm:text-[22px] md:text-[24px] max-w-3xl mx-auto leading-[1.2] text-[#B6B6B6] px-4">
            Join 10,000+ developers, designers, and operators building the
            <br className="hidden sm:block" />
            future of work. Get matched with roles that fit your life.
          </p>

          <div className="mt-10">
            <Link
              href="/dashboard/join"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[18px] sm:text-[22px] font-medium cursor-pointer px-10 py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 inline-block"
            >
              Get started for free
            </Link>
            <p className="mt-4 text-[13px] text-[#8C8C8C] font-bold uppercase tracking-widest">
              Takes less than 2 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Fast-track applications</h3>
            <p className="text-zinc-400 leading-relaxed">
              Your profile is verified and ready to go. Apply to any remote role with a single click.
            </p>
          </div>

          <div className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Custom job alerts</h3>
            <p className="text-zinc-400 leading-relaxed">
              Tell us your stack and timezone. We&apos;ll ping you only when a perfect match goes live.
            </p>
          </div>

          <div className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">The Profile Card</h3>
            <p className="text-zinc-400 leading-relaxed">
              Get a beautiful, shareable profile that highlights your remote experience and skills.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
