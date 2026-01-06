import type { Metadata } from "next";
import Link from "next/link";

import { db } from "../../db";
import { categories } from "../../db/schema";
import { AdminJobForm } from "../../components/admin/job-form";

export const metadata: Metadata = {
  title: "Admin – Create Remote Jobs | WorkIsWork",
  description: "Curate and publish remote jobs to the WorkIsWork board.",
};

async function getCategories() {
  const rows = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
    })
    .from(categories);
  return rows;
}

export default async function AdminPage() {
  const cats = await getCategories();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/jobs" className="text-sm font-semibold">
            ← Back to jobs
          </Link>
          <span className="text-xs text-zinc-500">
            Simple admin – add jobs directly to the board
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <AdminJobForm categories={cats} />
      </main>
    </div>
  );
}


