"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardBlogPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/sign-in?callbackUrl=/dashboard/blog");
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
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-black tracking-tight">Blog</h1>
                    <p className="text-[#64748b] text-lg">
                        Stay updated with the latest in remote work and career growth.
                    </p>
                </div>
                <button className="h-11 px-6 bg-black text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors shrink-0">
                    Write Post
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
                        <div className="aspect-[16/9] bg-zinc-100 relative">
                            {/* Mock Image Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-300 font-bold text-4xl">
                                WIP
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">
                                    {i % 2 === 0 ? 'Remote Work' : 'Career'}
                                </span>
                                <span className="text-zinc-300">•</span>
                                <span className="text-zinc-500 text-xs font-medium">5 min read</span>
                            </div>
                            <h3 className="text-xl font-bold text-black mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                                {i === 1 ? 'Mastering Remote Productivity: A Guide for 2024' :
                                    i === 2 ? 'How to Build an Unbeatable Remote Culture' :
                                        i === 3 ? 'Navigating Global Salaries in Tech' :
                                            'The Future of Distributed Teams'}
                            </h3>
                            <p className="text-zinc-500 text-sm mb-4 line-clamp-2">
                                Discover the essential strategies and tools used by top remote teams to stay efficient and connected...
                            </p>
                            <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
                                <span className="text-zinc-400 text-xs">Jan 20, 2024</span>
                                <span className="text-black text-xs font-bold hover:underline">Read more →</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
