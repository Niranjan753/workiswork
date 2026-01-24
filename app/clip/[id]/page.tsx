import { db } from "@/db";
import { clippingCampaigns } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Share2, AlertCircle } from "lucide-react";
import SubmissionForm from "./submission-form";

export const dynamic = "force-dynamic";

type Props = {
    params: Promise<{ id: string }>;
};

async function getCampaign(id: number) {
    const campaign = await db.select().from(clippingCampaigns).where(eq(clippingCampaigns.id, id)).then(rows => rows[0]);
    return campaign;
}

export default async function CampaignDetailsPage({ params }: Props) {
    const resolvedParams = await params;
    const campaign = await getCampaign(parseInt(resolvedParams.id));

    if (!campaign) return notFound();

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Header / Hero */}
            <div className="bg-[#0A0A0A] text-white pt-32 pb-16 px-6 relative">
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '40px 100%' }} />
                <div className="max-w-[1000px] mx-auto relative z-10">
                    <Link href="/clip" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white mb-8 transition-colors">
                        <ChevronLeft className="w-3 h-3" />
                        Back to Hub
                    </Link>

                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white border-4 border-white flex items-center justify-center text-black text-3xl font-black">
                                {campaign.logoUrl ? (
                                    <img src={campaign.logoUrl} alt={campaign.brandName} className="w-full h-full object-cover" />
                                ) : campaign.brandName[0]}
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-2">
                                    {campaign.brandName}
                                </h1>
                                <span className="bg-orange-500 text-white px-2 py-1 text-[9px] font-black uppercase tracking-widest inline-block">
                                    ${campaign.payPerViewRate} Per View
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 -mt-8 relative z-20">
                <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
                    <div className="space-y-8">

                        <div className="bg-white border-2 border-black p-8 shadow-[6px_6px_0px_black]">
                            <h2 className="text-xl font-black uppercase italic tracking-tighter text-black mb-4 flex items-center gap-2">
                                Mission Brief
                            </h2>
                            <p className="text-sm font-medium leading-relaxed text-gray-600 mb-6">
                                {campaign.description}
                            </p>

                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black mb-3 border-b border-gray-100 pb-2">
                                Goals & Requirements
                            </h3>
                            <div className="text-sm font-medium text-gray-600 whitespace-pre-wrap">
                                {campaign.goals}
                            </div>
                        </div>

                        <div className="bg-blue-50 border-2 border-blue-500 p-6 flex gap-4 items-start">
                            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-1">Important Tracking Note</h4>
                                <p className="text-[11px] font-bold text-blue-600/80 leading-relaxed uppercase tracking-wide">
                                    Only original content posted on TikTok, Instagram Reels, or YouTube Shorts is eligible.
                                    Ensure your account is public so our system can track views.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submission Sidebar */}
                    <div className="space-y-6">
                        <div className="relative group w-full">
                            <div className="absolute inset-0 bg-black translate-x-[4px] translate-y-[4px]" />
                            <div className="relative bg-orange-500 border-2 border-black p-6 text-white text-center">
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/80 mb-1">Potential Earnings</p>
                                <p className="text-4xl font-black italic tracking-tighter mb-4">$100 - $5k</p>
                                <p className="text-[9px] font-bold uppercase tracking-wide leading-tight px-4">
                                    Based on average performance of similar campaigns
                                </p>
                            </div>
                        </div>

                        <div className="border-2 border-black bg-white p-6">
                            <h3 className="text-lg font-black uppercase italic tracking-tighter text-black mb-6">Submit Your Clip</h3>
                            <SubmissionForm campaignId={campaign.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
