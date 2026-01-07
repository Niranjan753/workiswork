import type { Metadata } from "next";
import { getSiteUrl, getOgImageUrl } from "../../lib/site-url";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Pricing – WorkIsWork",
  description: "Unlock all remote jobs and premium alerts.",
  openGraph: {
    type: "website",
    url: `${siteUrl}/pricing`,
    title: "Pricing – WorkIsWork",
    description: "Unlock all remote jobs and premium alerts.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "WorkIsWork Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing – WorkIsWork",
    description: "Unlock all remote jobs and premium alerts.",
    images: [ogImage],
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section - Yellow */}
      <section className="bg-yellow-400 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-black leading-none mb-6">
            Unlock All Jobs
          </h1>
          <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto font-medium">
          Billing and premium plans are not wired up yet in this version, but
          this page is reserved for your Stripe subscription flow.
        </p>
        </div>
      </section>

      {/* Main Content - White */}
      <main className="mx-auto max-w-2xl px-4 pb-12 pt-8 sm:px-6 bg-white">
      </main>
    </div>
  );
}


