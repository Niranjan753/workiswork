"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

type Campaign = {
    id: number;
    brandName: string;
    description: string;
    logoUrl: string | null;
    status: string;
    payPerViewRate: string;
    createdAt: string;
};

export default function DashboardPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all campaigns
        fetch("/api/clip/campaigns")
            .then(res => res.json())
            .then(data => {
                setCampaigns(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 font-sans">
            <div className="max-w-[1200px] mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b-4 border-black">
                    <div>
                        <span className="inline-block border border-orange-500 text-orange-500 px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] mb-4">
                            My Workspace
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">
                            Active <span className="text-orange-500">Campaigns</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-wide text-xs max-w-lg">
                            Select a campaign to view your submissions, track performance, or submit new clips.
                        </p>
                    </div>
                    <Link href="/clip" className="bg-black hover:bg-orange-500 text-white px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Browse More
                    </Link>
                </div>

                {/* Campaign Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {campaigns.length === 0 ? (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-300">
                            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No active campaigns found.</p>
                            <Link href="/clip" className="text-orange-500 font-bold uppercase underline text-xs mt-2 inline-block">Join one now</Link>
                        </div>
                    ) : (
                        campaigns.map((campaign) => (
                            <Link key={campaign.id} href={`/clip/${campaign.id}`} className="group relative block h-full">
                                <div className="absolute inset-0 bg-black translate-x-[6px] translate-y-[6px] transition-transform group-hover:translate-x-[10px] group-hover:translate-y-[10px]" />
                                <div className="relative bg-white border-2 border-black p-8 h-full flex flex-col justify-between transition-transform duration-300">
                                    <div className="space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div className="w-14 h-14 border-2 border-black bg-gray-50 flex items-center justify-center font-black text-2xl uppercase">
                                                {campaign.logoUrl ? (
                                                    <img src={campaign.logoUrl} alt={campaign.brandName} className="w-full h-full object-cover" />
                                                ) : campaign.brandName[0]}
                                            </div>
                                            <span className="bg-orange-100 text-orange-700 px-2 py-1 text-[8px] font-black uppercase tracking-widest border border-orange-200">
                                                Active
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2 group-hover:text-orange-500 transition-colors">
                                                {campaign.brandName}
                                            </h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed line-clamp-2">
                                                {campaign.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-6 mt-6 border-t-2 border-black/5 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rate</span>
                                            <span className="text-lg font-black italic tracking-tighter">${campaign.payPerViewRate}/view</span>
                                        </div>
                                        <span className="w-8 h-8 bg-black text-white flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                                            <Plus className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
