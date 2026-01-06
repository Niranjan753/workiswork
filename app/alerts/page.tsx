import type { Metadata } from "next";

import { AlertsForm } from "../../components/alerts/alerts-form";

export const metadata: Metadata = {
  title: "Job Alerts – WorkIsWork",
  description:
    "Create custom remote job alerts and get new matching roles emailed to you.",
};

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-[#fde9d7] text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <section className="mb-6 space-y-3 text-center">
          <h1 className="cooper-heading text-balance text-3xl font-bold tracking-tight text-zinc-900 sm:text-[32px]">
            Never miss a great remote job
          </h1>
          <p className="text-xs text-zinc-600 sm:text-sm">
            Pick the skills you care about and we&apos;ll send you curated
            roles when they go live.
          </p>
        </section>

        <AlertsForm />
      </main>
    </div>
  );
}


