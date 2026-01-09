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
    <div className="relative min-h-screen overflow-hidden bg-transparent text-black">
      <GridBackground />

      <section className="relative z-10 bg-transparent py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-black">
              Portfolios from the{" "}
              <span className="cooper-heading inline-block bg-yellow-300 px-2 py-1 border-2 border-black">
                WorkIsWork
              </span>{" "}
              community
            </h1>
            <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto font-medium leading-relaxed">
              Browse a curated set of portfolios from people who build products, write, design, and ship remote work.
            </p>
            <p className="text-sm text-black/70 font-medium">
              Want to be featured here?{" "}
              <Link href="/join" className="underline font-semibold">
                Join WorkIsWork
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-0 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {PORTFOLIOS.map((profile) => (
            <a
              key={profile.id}
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white border-2 border-black p-6 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
              title={`Visit ${profile.name} website`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <h3 className="text-lg font-black text-black leading-tight">
                    {profile.name}
                  </h3>
                  <p className="text-sm font-medium text-black/70">
                    {profile.role} • {profile.location}
                  </p>
                  <p className="text-sm font-medium text-black/80">
                    {profile.bio}
                  </p>
                  {profile.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {profile.specialties.map((tag) => (
                        <span
                          key={tag}
                          className="border-2 border-black bg-yellow-400 px-2 py-1 text-[11px] font-bold text-black shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-black/60">
                    {profile.github && (
                      <span className="inline-flex items-center gap-1">
                        <Github className="w-3 h-3" />
                        GitHub
                      </span>
                    )}
                    {profile.twitter && (
                      <span className="inline-flex items-center gap-1">
                        <Twitter className="w-3 h-3" />
                        Twitter
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="inline-block px-4 py-2 bg-black text-white text-sm font-bold border-2 border-black hover:bg-yellow-400 hover:text-black transition-all cursor-pointer shadow-sm hover:shadow-lg">
                    Visit site <ArrowUpRight className="inline w-4 h-4 ml-1 -mt-px" />
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

