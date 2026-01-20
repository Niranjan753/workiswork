"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { JobsBoard } from "@/components/jobs/jobs-board";
import { JobsSearchBar } from "@/components/jobs/search-bar";
import { CategoryFilters } from "@/components/jobs/category-filters";

const categoryChips: { label: string; slug: string }[] = [
    { label: "All Jobs", slug: "" },
    { label: "Frontend Developer", slug: "frontend" },
    { label: "Backend Developer", slug: "backend" },
    { label: "Full Stack Developer", slug: "full-stack" },
    { label: "Blockchain Developer", slug: "blockchain" },
    { label: "Smart Contract Developer", slug: "smart-contract" },
    { label: "Designer", slug: "design" },
    { label: "Sales & Marketing", slug: "sales" },
    { label: "Product Manager", slug: "product" },
    { label: "Customer Support", slug: "customer-support" },
    { label: "InfoSec Engineer", slug: "infosec" },
    { label: "Management & Finance", slug: "finance" },
    { label: "No-Code Developer", slug: "no-code" },
    { label: "DevOps Engineer", slug: "devops" },
    { label: "Community Manager", slug: "community-manager" },
    { label: "Writer", slug: "writing" },
    { label: "Non-Tech", slug: "non-tech" },
];

export default function DashboardJobsPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/sign-in?callbackUrl=/dashboard/jobs");
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="flex items-center bg-white justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-black" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="p-8 max-w-[1400px] mx-auto space-y-16">
            <div className="space-y-4">
                <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Remote Jobs</h1>
                <p className="text-gray-500 text-xl max-w-2xl font-medium leading-relaxed">
                    Discover and manage the best remote opportunities from around the world.
                </p>
            </div>

            <div className="space-y-12">
                <div className="w-full max-w-2xl">
                    <Suspense fallback={null}>
                        <JobsSearchBar categories={categoryChips} />
                    </Suspense>
                </div>

                <div className="space-y-6">
                    <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        Browse by Category
                    </div>
                    <Suspense fallback={null}>
                        <CategoryFilters categories={categoryChips} />
                    </Suspense>
                </div>
            </div>

            <div className="pt-4">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Finding opportunities...</p>
                    </div>
                }>
                    <JobsBoard />
                </Suspense>
            </div>

            <div className="p-12 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm text-center space-y-4">
                <p className="text-gray-900 text-2xl font-bold tracking-tight">
                    Looking for a specific role?
                </p>
                <p className="text-gray-500 font-medium max-w-lg mx-auto">
                    We're adding new jobs every hour. Set up an alert to be the first to know when a match goes live.
                </p>
                <button
                    onClick={() => router.push("/dashboard/alerts")}
                    className="mt-6 px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95"
                >
                    Setup Job Alerts
                </button>
            </div>
        </div>
    );
}

