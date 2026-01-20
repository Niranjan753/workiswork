import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/GridBackground";
import { getSiteUrl, getOgImageUrl } from "@/lib/site-url";
import { ArrowUpRight, Github, Twitter } from "lucide-react";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Portfolio – WorkIsWork",
  description: "Discover standout portfolios from talented people in the WorkIsWork community.",
  openGraph: {
    type: "website",
    url: `${siteUrl}/portfolio`,
    title: "Portfolio – WorkIsWork",
    description: "Discover standout portfolios from talented people in the WorkIsWork community.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "WorkIsWork - Portfolio",
      },
      {
        url: "https://berlified.xyz/og-image.png",
        width: 1200,
        height: 630,
        alt: "berlified.xyz",
      },
      {
        url: "https://pocketsflow.com/og.jpg",
        width: 1200,
        height: 630,
        alt: "pocketsflow.com",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio – WorkIsWork",
    description: "Discover standout portfolios from talented people in the WorkIsWork community.",
    images: [
      ogImage,
      "https://berlified.xyz/og-image.png",
      "https://pocketsflow.com/og.jpg"
    ],
  },
};

type Portfolio = {
  id: number;
  name: string;
  role: string;
  location: string;
  avatarInitials: string;
  avatarUrl?: string;
  bio: string;
  specialties: string[];
  website?: string;
  twitter?: string;
  github?: string;
  metaImageUrl?: string;
};

const PORTFOLIOS: Portfolio[] = [
  {
    id: 1,
    name: "Berlified",
    role: "Web Platform, Creator Tools",
    location: "Remote · Berlin",
    avatarInitials: "BF",
    bio: "Product, platform and creative tech — current at berlified.xyz, building digital storytelling tools.",
    specialties: ["Next.js", "Storytelling", "Experimental UX"],
    website: "https://berlified.xyz",
    metaImageUrl: "https://berlified.xyz/og-image.png",
    twitter: "https://twitter.com/berlified",
  },
  {
    id: 2,
    name: "Pocketsflow",
    role: "Indie Founder",
    location: "Remote · UK",
    avatarInitials: "PF",
    bio: "I’m building Pocketsflow — simple, set-and-forget business analytics for indie makers.",
    specialties: ["Product", "Analytics", "Indie SaaS"],
    website: "https://pocketsflow.com",
    metaImageUrl: "https://pocketsflow.com/og.jpg",
    twitter: "https://twitter.com/pocketsflow",
    github: "https://github.com/pocketsflow",
  }
];

export default function PortfolioPage() {
  return (
    <div className="relative min-h-screen bg-[#0B0B0B] text-white selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <section className="relative z-10 pb-16 text-center px-4">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-semibold tracking-tighter mt-16 text-[44px] leading-[1] sm:text-[56px] md:text-[90px]">
            Portfolios from the
            <br />
            <span className="text-[#FF5A1F]">WorkIsWork</span> community
          </h1>

          <p className="mt-6 text-[18px] sm:text-[24px] max-w-3xl mx-auto leading-[1.1] text-[#B6B6B6]">
            Browse a curated set of portfolios from people who build products,
            <br className="hidden sm:block" />
            write, design, and ship remote work.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/join"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[22px] mt-6 font-medium cursor-pointer px-8 py-[8px] rounded-2xl transition-colors shadow-lg shadow-blue-900/20"
            >
              Get featured
            </Link>
            <span className="text-[13px] text-[#8C8C8C] mt-2 uppercase tracking-widest font-bold">
              Join the elite
            </span>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-0">
        <div className="space-y-4">
          {PORTFOLIOS.map((profile) => (
            <a
              key={profile.id}
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 transition-all hover:bg-zinc-800/80 group shadow-sm"
              title={`Visit ${profile.name} website`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
                    {profile.name}
                  </h3>
                  <p className="text-sm font-medium text-zinc-500">
                    {profile.role} • {profile.location}
                  </p>
                  <p className="text-sm font-medium text-zinc-400">
                    {profile.bio}
                  </p>
                  {profile.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {profile.specialties.map((tag) => (
                        <span
                          key={tag}
                          className="bg-zinc-800 text-zinc-500 border border-transparent rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider group-hover:text-white group-hover:bg-zinc-700 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-4 pt-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    {profile.github && (
                      <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                        <Github className="w-3.5 h-3.5" />
                        GitHub
                      </span>
                    )}
                    {profile.twitter && (
                      <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                        <Twitter className="w-3.5 h-3.5" />
                        Twitter
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-lg active:scale-95">
                    Visit site <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}

