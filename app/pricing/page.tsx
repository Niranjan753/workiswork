import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing – WorkIsWork",
  description: "Unlock all remote jobs and premium alerts.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#fde9d7] text-zinc-900">
      <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pb-12 pt-16 sm:px-6">
        <h1 className="text-2xl font-semibold text-zinc-900">Unlock All Jobs</h1>
        <p className="text-sm text-zinc-600">
          Billing and premium plans are not wired up yet in this version, but
          this page is reserved for your Stripe subscription flow.
        </p>
      </main>
    </div>
  );
}


