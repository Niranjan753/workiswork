"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

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
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-bold mb-2 text-black tracking-tight">Remote Jobs</h1>
                <p className="text-[#64748b] text-lg">
                    Discover and manage the best remote opportunities from around the world.
                </p>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search jobs, companies, or keywords..."
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <button className="h-12 px-8 bg-black text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors">
                    Search Jobs
                </button>
            </div>

            {/* Empty State / Content */}
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all group cursor-pointer">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 font-bold">
                                    {i === 1 ? 'W' : i === 2 ? 'G' : 'S'}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg text-black group-hover:text-blue-600 transition-colors">
                                        {i === 1 ? 'Senior Product Designer' : i === 2 ? 'Full Stack Developer' : 'Growth Marketer'}
                                    </h3>
                                    <p className="text-zinc-500 text-sm font-medium">
                                        {i === 1 ? 'WorkIsWork' : i === 2 ? 'Google' : 'Stripe'} • Remote
                                    </p>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="font-bold text-black">$120k - $180k</p>
                                <p className="text-zinc-400 text-xs">Posted 2 days ago</p>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-full uppercase tracking-wider">Design</span>
                            <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-full uppercase tracking-wider">Figma</span>
                            <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-full uppercase tracking-wider">Remote-First</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 p-8 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 text-center">
                <p className="text-[#64748b] text-lg font-medium">
                    Looking for a specific role? We're adding new jobs every hour.
                </p>
                <button className="mt-4 text-blue-600 font-bold hover:underline">
                    Set up job alerts →
                </button>
            </div>
        </div>
    );
}
