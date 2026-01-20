"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardJoinPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/sign-in?callbackUrl=/dashboard/join");
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
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-3 text-black tracking-tight">Join the Community</h1>
                <p className="text-[#64748b] text-xl max-w-2xl mx-auto">
                    Connect with 10,000+ remote professionals and companies building the future of work.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-2">Community Slack</h3>
                    <p className="text-[#64748b] mb-6">Get instant feedback, networking opportunities, and exclusive job leads.</p>
                    <button className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-zinc-800 transition-colors">
                        Get Invite Link
                    </button>
                </div>

                <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-2">Weekly Newsletter</h3>
                    <p className="text-[#64748b] mb-6">The best remote jobs and career tips delivered straight to your inbox.</p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 px-4 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black"
                        />
                        <button className="px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                            Join
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-8 rounded-3xl border border-zinc-200 bg-zinc-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h4 className="text-xl font-bold text-black mb-1">Follow our progress</h4>
                    <p className="text-zinc-500 font-medium">Get real-time updates on new features and job drops.</p>
                </div>
                <div className="flex gap-3">
                    {['Twitter', 'Discord', 'YouTube'].map(social => (
                        <button key={social} className="px-5 py-2.5 bg-white border border-zinc-200 rounded-xl font-bold text-sm text-black hover:border-black transition-all">
                            {social}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
