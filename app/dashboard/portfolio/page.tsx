"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPortfolioPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/sign-in?callbackUrl=/dashboard/portfolio");
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="flex items-center bg-[#0B0B0B] justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 text-black tracking-tight">Portfolio</h1>
                <p className="text-[#64748b] text-lg">
                    View and manage your portfolio
                </p>
            </div>

            <div className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <p className="text-[#64748b] text-lg">
                    Portfolio content will be displayed here.
                </p>
            </div>
        </div>
    );
}
