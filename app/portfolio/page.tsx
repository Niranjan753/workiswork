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
    <div className="relative min-h-screen bg-background text-foreground">
      <section className="relative z-10 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none text-foreground">
              Portfolios from the{" "}
              <span className="text-primary relative inline-block">
                WorkIsWork
              </span>{" "}
              community
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              Browse a curated set of portfolios from people who build products, write, design, and ship remote work.
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              Want to be featured here?{" "}
              <Link href="/join" className="underline text-foreground font-semibold hover:text-primary transition-colors">
                Join WorkIsWork
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-0 sm:px-6 lg:px-8 bg-background">
        <div className="space-y-4">
          {PORTFOLIOS.map((profile) => (
            <a
              key={profile.id}
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-background border border-border rounded-lg p-6 transition-all hover:bg-secondary/50"
              title={`Visit ${profile.name} website`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <h3 className="text-lg font-bold text-foreground leading-tight">
                    {profile.name}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground">
                    {profile.role} • {profile.location}
                  </p>
                  <p className="text-sm font-medium text-foreground/80">
                    {profile.bio}
                  </p>
                  {profile.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {profile.specialties.map((tag) => (
                        <span
                          key={tag}
                          className="bg-secondary text-secondary-foreground rounded px-2 py-1 text-[11px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-muted-foreground">
                    {profile.github && (
                      <span className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                        <Github className="w-3 h-3" />
                        GitHub
                      </span>
                    )}
                    {profile.twitter && (
                      <span className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                        <Twitter className="w-3 h-3" />
                        Twitter
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="inline-block px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/80 transition-colors cursor-pointer flex items-center gap-1">
                    Visit site <ArrowUpRight className="w-4 h-4 ml-1" />
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

