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
            <div className="flex items-center bg-white justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-black" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-bold mb-2 text-black tracking-tight">Post a Job</h1>
                <p className="text-[#64748b] text-lg">
                    Find the best remote talent for your company.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Job Details Form */}
                    <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm space-y-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-black uppercase tracking-wider">Job Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Senior Frontend Engineer"
                                className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-black uppercase tracking-wider">Category</label>
                                <select className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black transition-all appearance-none cursor-pointer">
                                    <option>Software Development</option>
                                    <option>Design</option>
                                    <option>Marketing</option>
                                    <option>Customer Support</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-black uppercase tracking-wider">Job Type</label>
                                <select className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black transition-all appearance-none cursor-pointer">
                                    <option>Full-time</option>
                                    <option>Contract</option>
                                    <option>Freelance</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-black uppercase tracking-wider">Salary Range (Annual USD)</label>
                            <div className="flex items-center gap-4">
                                <input type="number" placeholder="Min" className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black" />
                                <span className="text-zinc-400 font-bold">-</span>
                                <input type="number" placeholder="Max" className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-black uppercase tracking-wider">Job Description</label>
                            <textarea
                                rows={8}
                                placeholder="Describe the role, responsibilities, and requirements..."
                                className="w-full p-4 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black transition-all"
                            />
                        </div>

                        <button className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all shadow-lg hover:shadow-black/10">
                            Post Job for $249
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50 space-y-4">
                        <h4 className="font-bold text-black text-lg">Why post on WorkIsWork?</h4>
                        <ul className="space-y-3">
                            {[
                                'Reach 50,000+ remote developers',
                                'Posts remain live for 30 days',
                                'Social media promotion included',
                                'Company logo on homepage'
                            ].map((tip) => (
                                <li key={tip} className="flex gap-3 text-sm text-zinc-600 font-medium">
                                    <span className="text-green-500">✓</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-6 rounded-3xl border border-zinc-200 bg-white shadow-sm">
                        <h4 className="font-bold text-black mb-2">Need help?</h4>
                        <p className="text-sm text-zinc-500 font-medium">Our team is here to help you find the perfect candidate. Reach out anytime.</p>
                        <button className="mt-4 text-blue-600 font-bold text-sm hover:underline">Contact Support →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
