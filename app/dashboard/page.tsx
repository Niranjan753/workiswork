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
            <div className="flex items-center bg-white justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-black" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 text-black tracking-tight">Dashboard</h1>
                <p className="text-[#64748b] text-lg">
                    Welcome back, {session.user?.email}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">Total Jobs</h3>
                    <p className="text-4xl font-bold mt-3 text-black">0</p>
                </div>

                <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">Applications</h3>
                    <p className="text-4xl font-bold mt-3 text-black">0</p>
                </div>

                <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">Active Posts</h3>
                    <p className="text-4xl font-bold mt-3 text-black">0</p>
                </div>
            </div>

            <div className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <h2 className="text-2xl font-bold mb-3 text-black">Quick Actions</h2>
                <p className="text-[#64748b] text-lg">
                    Navigate using the sidebar to access Remote Jobs, Blog, Portfolio, and more.
                </p>
            </div>
        </div>
    );
}
