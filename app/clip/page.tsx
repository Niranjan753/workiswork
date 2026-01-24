import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Suspense } from "react";
import { db } from "@/db";
import { clippingCampaigns } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function CampaignList() {
    // Show all campaigns
    const campaigns = await db.select().from(clippingCampaigns)
        .orderBy(desc(clippingCampaigns.createdAt));

    if (campaigns.length === 0) {
        return (
            <div className="border-2 border-dashed border-gray-200 p-12 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No active campaigns yet</p>
                <Link href="/clip/create" className="text-orange-500 underline text-[10px] font-bold uppercase mt-2 block">
                    Be the first to create one
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
                <Link key={campaign.id} href={`/clip/${campaign.id}`} className="group relative block">
                    <div className="absolute inset-0 bg-black translate-x-[4px] translate-y-[4px] transition-transform group-hover:translate-x-[8px] group-hover:translate-y-[8px]" />
                    <div className="relative bg-white border-2 border-black p-6 h-full flex flex-col justify-between transition-transform duration-300">
                        <div>
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 border-2 border-black bg-gray-50 flex items-center justify-center font-black text-xl">
                                    {campaign.logoUrl ? (
                                        <img src={campaign.logoUrl} alt={campaign.brandName} className="w-full h-full object-cover" />
                                    ) : campaign.brandName[0]}
                                </div>
                                <span className="bg-black text-white px-2 py-1 text-[8px] font-black uppercase tracking-widest">
                                    ${campaign.payPerViewRate} / View
                                </span>
                            </div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 group-hover:text-orange-500 transition-colors">
                                {campaign.brandName}
                            </h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed line-clamp-3 mb-6">
                                {campaign.description}
                            </p>
                        </div>
                        <div className="flex items-center justify-between border-t-2 border-black/5 pt-4 mt-auto">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">View Details</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default function ClipPage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="bg-[#0A0A0A] text-white pt-32 pb-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="max-w-[1200px] mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
                        <div>
                            <span className="inline-block border border-orange-500 text-orange-500 px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] mb-6">
                                Beta Access
                            </span>
                            <h1 className="text-[60px] md:text-[100px] font-black tracking-tighter uppercase italic leading-[0.8] mb-8">
                                Clip <span className="text-orange-500">&</span> Earn
                                <br /> System
                            </h1>
                            <p className="text-gray-400 font-medium max-w-xl text-lg uppercase tracking-tight leading-tight">
                                Transform your views into revenue. Create campaigns or clip for brands.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 w-full md:w-auto">
                            <Link href="/clip/create" className="bg-orange-500 hover:bg-white hover:text-black text-white px-8 py-4 text-xs font-black uppercase tracking-[0.2em] border-2 border-orange-500 transition-all text-center flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />
                                Create Campaign
                            </Link>
                            <Link href="/clip/dashboard" className="bg-white hover:bg-black hover:text-white text-black px-8 py-4 text-xs font-black uppercase tracking-[0.2em] border-2 border-white transition-all text-center">
                                View Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-6 py-24">
                <div className="max-w-[1200px] mx-auto">
                    <div className="flex items-end justify-between mb-12 border-b-4 border-black pb-6">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter">Active Campaigns</h2>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hidden sm:block">Select a campaign to clip</span>
                    </div>

                    <Suspense fallback={<div className="text-center py-20 animate-pulse text-[10px] font-black uppercase tracking-widest text-gray-300">Loading Opportunities...</div>}>
                        <CampaignList />
                    </Suspense>
                </div>
            </section>
        </div>
    );
}
