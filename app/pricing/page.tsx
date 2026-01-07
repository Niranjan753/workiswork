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
    <div className="min-h-screen bg-yellow-400 text-black">
      <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pb-12 pt-16 sm:px-6">
        <h1 className="text-2xl font-bold text-black">Unlock All Jobs</h1>
        <p className="text-sm text-black/80 font-medium">
          Billing and premium plans are not wired up yet in this version, but
          this page is reserved for your Stripe subscription flow.
        </p>
      </main>
    </div>
  );
}


