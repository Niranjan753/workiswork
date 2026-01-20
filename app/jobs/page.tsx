import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl, getOgImageUrl } from "../../lib/site-url";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Remote Jobs Board – WorkIsWork",
  description: "Discover curated remote jobs in software development, design, marketing, and more. Built for remote-first teams and talent",
  openGraph: {
    type: "website",
    url: `${siteUrl}/jobs`,
    title: "Remote Jobs Board – WorkIsWork",
    description: "Discover curated remote jobs in software development, design, marketing, and more. Built for remote-first teams and talent",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "WorkIsWork - Remote Jobs Board",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote Jobs Board – WorkIsWork",
    description: "Discover curated remote jobs in software development, design, marketing, and more. Built for remote-first teams and talent",
    images: [ogImage],
  },
};

export default function JobsPage() {

  return (
    <div className="relative min-h-screen bg-[#0B0B0B] text-white selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pb-16 text-center px-4 min-h-[60vh] flex flex-col justify-center">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-semibold tracking-tighter mt-12 sm:mt-16 text-[36px] leading-[1] sm:text-[56px] md:text-[80px] lg:text-[90px]">
            Built for the future
            <br />
            of <span className="text-[#FF5A1F]">remote work</span>
          </h1>

          <p className="mt-6 text-[16px] sm:text-[22px] md:text-[24px] leading-[1.2] text-[#B6B6B6] max-w-2xl mx-auto px-4">
            Discover 110,000+ curated remote jobs from vetted startups and global tech leaders.
            The best place for real talent.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/join"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[18px] sm:text-[22px] mt-4 sm:mt-6 font-medium cursor-pointer px-8 py-3 rounded-2xl transition-colors shadow-lg shadow-blue-900/20"
            >
              Get started for free
            </Link>
            <span className="text-[13px] text-[#8C8C8C] mt-2">
              TRUSTED BY 5,000+ COMPANIES WORLDWIDE
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:pb-24 space-y-16 sm:space-y-24">
        {/* Subscription Section - Dark Premium */}
        <div className="relative mx-auto max-w-6xl rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-br from-zinc-900/80 to-black p-6 sm:p-14 overflow-hidden border border-zinc-800/50 shadow-2xl">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,white_20px,white_21px)]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left space-y-4 max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Get high-paying remote<br />jobs in your inbox.
              </h2>
              <p className="text-zinc-400 text-lg font-medium">
                We filter the noise so you only see the best roles from top-tier companies. Free forever.
              </p>
            </div>

            <form className="w-full max-w-md flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-14 px-8 py-2 bg-zinc-800/50 backdrop-blur-md rounded-2xl border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
              />
              <button
                type="submit"
                className="h-14 px-8 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 active:scale-[0.97] transition-all shadow-lg whitespace-nowrap"
              >
                Join the list
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

