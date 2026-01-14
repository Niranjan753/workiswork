import type { Metadata } from "next";
import { GridBackground } from "../../components/GridBackground";
import { MembershipCTA } from "../../components/join/membership-cta";
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
    <div className="relative min-h-screen bg-white text-black overflow-hidden">
      <GridBackground />
      {/* Hero Section - Yellow */}
      <section className="relative z-10 bg-yellow-400 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-black leading-none mb-6">
            Unlock All Jobs
          </h1>
          <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto font-medium">
            Join the WorkIsWork membership to access premium alerts and unlock remote roles. Payments are now powered by Polar.
          </p>
          <div className="mt-6 flex justify-center">
            <MembershipCTA label="Join membership" />
          </div>
        </div>
      </section>

      {/* Main Content - White */}
      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-12 pt-8 sm:px-6 bg-white">
      </main>
    </div>
  );
}


