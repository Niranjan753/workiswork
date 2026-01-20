"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/sign-in?callbackUrl=/dashboard");
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="flex items-center bg-zinc-900 justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 text-white">Dashboard</h1>
                <p className="text-[#B6B6B6] text-lg">
                    Welcome back, {session.user?.email}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                    <h3 className="text-sm font-medium text-[#B6B6B6]">Total Jobs</h3>
                    <p className="text-4xl font-bold mt-3 text-white">0</p>
                </div>

                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                    <h3 className="text-sm font-medium text-[#B6B6B6]">Applications</h3>
                    <p className="text-4xl font-bold mt-3 text-white">0</p>
                </div>

                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                    <h3 className="text-sm font-medium text-[#B6B6B6]">Active Posts</h3>
                    <p className="text-4xl font-bold mt-3 text-white">0</p>
                </div>
            </div>

            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <h2 className="text-2xl font-semibold mb-3 text-white">Quick Actions</h2>
                <p className="text-[#B6B6B6] text-lg">
                    Navigate using the sidebar to access Remote Jobs, Blog, Portfolio, and more.
                </p>
            </div>
        </div>
    );
}
