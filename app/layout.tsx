import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "../components/providers";
import { Navbar } from "../components/Navbar";
import { Footer } from "@/components/Footer";
import { getSiteUrl, getOgImageUrl } from "../lib/site-url";
import localFont from "next/font/local";

const basierCircle = localFont({
  src: "../fonts/BasierCircle-Regular.ttf",
  variable: "--font-basier-circle",
  display: "swap",
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
        {/* Viewport Meta Tag - Prevent zoom on mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        {/* Primary Meta Tags */}
        <title>Workiswork - Remote Jobs Board</title>
        <meta name="title" content="Workiswork - Remote Jobs Board" />
        <meta
          name="description"
          content="Discover curated remote jobs in software development, design, marketing, and more. Built for remote-first teams and talent."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content="Workiswork - Remote Jobs Board" />
        <meta
          property="og:description"
          content="Discover curated remote jobs in software development, design, marketing, and more. Built for remote-first teams and talent."
        />
        <meta property="og:image" content={ogImage} />

        {/* X (Twitter) */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={siteUrl} />
        <meta property="twitter:title" content="Workiswork - Remote Jobs Board" />
        <meta
          property="twitter:description"
          content="Discover curated remote jobs in software development, design, marketing, and more. Built for remote-first teams and talent."
        />
        <meta property="twitter:image" content={ogImage} />
      </head>
      <body
        className={`${basierCircle.variable} font-sans antialiased bg-white text-black relative overflow-x-hidden`}
      >
        <AppProviders>
          <Navbar />
          <div className="pt-20 sm:pt-24 lg:pt-10">{children}</div>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}

