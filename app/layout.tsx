import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "../components/providers";
import { Navbar } from "../components/Navbar";
import { Footer } from "@/components/Footer";
import { getSiteUrl, getOgImageUrl } from "../lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Workiswork - Remote Jobs Board",
  description: "Discover curated remote jobs in software development, design, marketing, and more. Built for remote-first teams and talent.",
  icons: {
    icon: "/svgg.svg",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Workiswork - Remote Jobs Board",
    description: "Discover curated remote jobs in software development, design, marketing, and more. Built for remote-first teams and talent.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Workiswork - Remote Jobs Board",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workiswork - Remote Jobs Board",
    description: "Discover curated remote jobs in software development, design, marketing, and more. Built for remote-first teams and talent.",
    images: [ogImage],
  },
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Primary Meta Tags */}
        <title>Meta Tags — Preview, Edit and Generate</title>
        <meta name="title" content="Meta Tags — Preview, Edit and Generate" />
        <meta
          name="description"
          content="With Meta Tags you can edit and experiment with your content then preview how your webpage will look on Google, Facebook, X and more!"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://workiswork.xyz" />
        <meta property="og:title" content="Meta Tags — Preview, Edit and Generate" />
        <meta
          property="og:description"
          content="With Meta Tags you can edit and experiment with your content then preview how your webpage will look on Google, Facebook, X and more!"
        />
        <meta property="og:image" content="/Users/berlin/workiswork/workiswork/public/metaheader.png" />

        {/* X (Twitter) */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://workiswork.xyz" />
        <meta property="twitter:title" content="Meta Tags — Preview, Edit and Generate" />
        <meta
          property="twitter:description"
          content="With Meta Tags you can edit and experiment with your content then preview how your webpage will look on Google, Facebook, X and more!"
        />
        <meta property="twitter:image" content="/Users/berlin/workiswork/workiswork/public/metaheader.png" />
        {/* Meta Tags Generated with https://metatags.io */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-50`}
      >
        <AppProviders>
          <Navbar />
          <div className="pt-18 sm:pt-24 lg:pt-18">{children}</div>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}

