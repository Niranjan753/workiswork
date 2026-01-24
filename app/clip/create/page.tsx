"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateCampaignPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            brandName: formData.get("brandName"),
            logoUrl: formData.get("logoUrl"),
            description: formData.get("description"),
            goals: formData.get("goals"),
            payPerViewRate: formData.get("payPerViewRate"),
            creatorEmail: formData.get("creatorEmail"),
        };

        try {
            const res = await fetch("/api/clip/campaigns", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to create campaign");

            setIsSuccess(true);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen text-black bg-white flex items-center justify-center p-6">
                <div className="max-w-md w-full border-2 border-black p-8 text-center relative">
                    <div className="absolute inset-0 bg-black translate-x-[6px] translate-y-[6px] -z-10" />
                    <div className="w-16 h-16 bg-green-500 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-black" />
                    </div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Submission Received</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 leading-relaxed">
                        Your campaign is currently under review by our team. We've sent a confirmation email to the address provided.
                    </p>
                    <Link href="/clip" className="block w-full bg-black text-white py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-colors">
                        Return to Hub
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-orange-500/30">
            <div className="max-w-[800px] mx-auto pt-24 pb-32 px-6">
                <Link href="/clip" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black mb-12 transition-colors">
                    <ChevronLeft className="w-3 h-3" />
                    Back to Hub
                </Link>

                <div className="mb-12">
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9] mb-6">
                        Start Your <br /> <span className="text-orange-500">Campaign</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-wide max-w-lg">
                        Define your goals and budget. We'll match you with the best clippers in the ecosystem.
                    </p>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-black translate-x-[4px] translate-y-[4px] md:translate-x-[8px] md:translate-y-[8px]" />
                    <form onSubmit={onSubmit} className="relative bg-white border-2 border-black p-6 md:p-12 space-y-8">

                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-black font-black uppercase tracking-[0.2em]">Brand Name</label>
                                    <input required name="brandName" type="text" placeholder="ACME Corp" className="w-full bg-gray-50 text-black border-2 border-gray-200 p-4 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors rounded-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-black font-black uppercase tracking-[0.2em]">Logo URL</label>
                                    <input name="logoUrl" type="url" placeholder="https://..." className="w-full bg-gray-50 text-black border-2 border-gray-200 p-4 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors rounded-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px]    text-black font-black uppercase tracking-[0.2em]">Creator Email</label>
                                <input required name="creatorEmail" type="email" placeholder="you@company.com" className="w-full bg-gray-50 text-black border-2 border-gray-200 p-4 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors rounded-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-black font-black uppercase tracking-[0.2em]">Campaign Description</label>
                                <textarea required name="description" rows={3} placeholder="Tell clippers what your product is about..." className="w-full bg-gray-50 text-black border-2 border-gray-200 p-4 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors rounded-none resize-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-black font-black uppercase tracking-[0.2em]">Goals & Instructions</label>
                                <textarea required name="goals" rows={4} placeholder="e.g. Focus on the AI features, keep it under 30s..." className="w-full bg-gray-50 text-black border-2 border-gray-200 p-4 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors rounded-none resize-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px]    text-black font-black uppercase tracking-[0.2em]">Pay Per View ($)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
                                    <input required name="payPerViewRate" type="number" step="0.0001" placeholder="0.001" className="w-full bg-gray-50 text-black border-2 border-gray-200 p-4 pl-8 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors rounded-none" />
                                </div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide text-right">Recommended: $0.001 - $0.005</p>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-[10px] font-bold text-red-600 uppercase tracking-wide">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-black text-white py-5 text-sm font-black uppercase tracking-[0.3em] hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                                </span>
                            ) : "Submit for Approval"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
