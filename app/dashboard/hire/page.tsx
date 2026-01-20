"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardHirePage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/sign-in?callbackUrl=/dashboard/hire");
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-screen">
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
                <h1 className="text-4xl font-bold mb-2 text-white">Post a Job</h1>
                <p className="text-[#B6B6B6] text-lg">
                    Create and manage job postings
                </p>
            </div>

            <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <p className="text-[#B6B6B6] text-lg">
                    Job posting form will be displayed here.
                </p>
            </div>
        </div>
    );
}
