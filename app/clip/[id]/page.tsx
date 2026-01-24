import { db } from "@/db";
import { clippingCampaigns, clips } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, AlertCircle, ArrowRight } from "lucide-react";
import SubmissionForm from "./submission-form";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

type Props = {
    params: Promise<{ id: string }>;
};

async function getCampaign(id: number) {
    const campaign = await db.select().from(clippingCampaigns).where(eq(clippingCampaigns.id, id)).then(rows => rows[0]);
    return campaign;
}

// Fetch clips for this campaign
async function getCampaignClips(id: number) {
    return await db.select().from(clips)
        .where(eq(clips.campaignId, id))
        .orderBy(desc(clips.createdAt));
}

export default async function CampaignDetailsPage({ params }: Props) {
    const resolvedParams = await params;
    const campaignId = parseInt(resolvedParams.id);
    const campaign = await getCampaign(campaignId);

    // Fetch clips submitted to this campaign
    const submittedClips = await getCampaignClips(campaignId);

    if (!campaign) return notFound();

    return (
        <div className="min-h-screen bg-white pb-32 font-sans">
            {/* Header / Hero */}
            <div className="bg-[#0A0A0A] text-white pt-32 pb-16 px-6 relative border-b-4 border-orange-500">
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '40px 100%' }} />
                <div className="max-w-[1200px] mx-auto relative z-10">
                    <Link href="/clip" className="inline-flex items-center gap-2 text-[10px] text-black uppercase tracking-[0.2em] text-white/50 hover:text-white mb-8 transition-colors">
                        <ChevronLeft className="w-3 h-3" />
                        Back to Hub
                    </Link>

                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white border-4 border-white flex items-center justify-center text-black text-3xl text-black">
                                {campaign.logoUrl ? (
                                    <img src={campaign.logoUrl} alt={campaign.brandName} className="w-full h-full object-cover" />
                                ) : campaign.brandName[0]}
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-6xl text-white uppercase italic tracking-tighter leading-none mb-2">
                                    {campaign.brandName}
                                </h1>
                                <span className="bg-orange-500 text-white px-2 py-1 text-[9px] text-black uppercase tracking-widest inline-block border border-white/20">
                                    ${campaign.payPerViewRate} Per View
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 -mt-8 relative z-20">
                <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
                    <div className="space-y-12">
                        {/* Brief */}
                        <div className="bg-white border-2 border-black p-8 shadow-[6px_6px_0px_black]">
                            <h2 className="text-xl text-black uppercase italic tracking-tighter text-black mb-4 flex items-center gap-2">
                                Mission Brief
                            </h2>
                            <p className="text-sm font-bold leading-relaxed text-gray-600 mb-8 max-w-2xl">
                                {campaign.description}
                            </p>

                            <h3 className="text-[10px] text-black uppercase tracking-[0.2em] text-black mb-4 border-b-2 border-black/5 pb-2 inline-block">
                                Goals & Requirements
                            </h3>
                            <div className="text-sm font-bold text-gray-500 whitespace-pre-wrap leading-relaxed bg-gray-50 p-6 border-l-4 border-black">
                                {campaign.goals}
                            </div>
                        </div>

                        {/* Recent Submission List (User requested this feature) */}
                        <div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black mb-6 flex items-center gap-3">
                                Submitted Clips <span className="text-base font-bold not-italic text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{submittedClips.length}</span>
                            </h3>

                            <div className="space-y-4">
                                {submittedClips.length === 0 ? (
                                    <div className="p-8 border-2 border-dashed border-black/10 text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No clips submitted yet.</p>
                                    </div>
                                ) : (
                                    submittedClips.map((clip) => (
                                        <Link
                                            key={clip.id}
                                            href={`/clip/link/${clip.id}`}
                                            className="group block bg-white border-2 border-black p-4 hover:shadow-[4px_4px_0px_orange] hover:-translate-y-1 transition-all"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xs uppercase">
                                                        {clip.platform.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 mb-1 inline-block ${clip.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                            {clip.status}
                                                        </span>
                                                        <p className="text-sm font-black uppercase truncate max-w-[200px] group-hover:underline">
                                                            {clip.link}
                                                        </p>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                                                            Submitted {formatDistanceToNow(new Date(clip.createdAt))} ago
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-black italic tracking-tighter group-hover:text-orange-500 transition-colors">
                                                        {clip.views.toLocaleString()} <span className="text-[10px] not-italic text-gray-400 font-bold uppercase tracking-wide">Views</span>
                                                    </p>
                                                    <div className="flex items-center justify-end gap-1 text-[9px] font-black uppercase tracking-widest mt-1">
                                                        Dashboard <ArrowRight className="w-3 h-3" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Submission Form */}
                    <div className="space-y-8">
                        <div className="relative group w-full">
                            <div className="absolute inset-0 bg-black translate-x-[6px] translate-y-[6px]" />
                            <div className="relative bg-orange-500 border-2 border-black p-8 text-white text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 mb-2">Earnings Potential</p>
                                <p className="text-5xl font-black italic tracking-tighter mb-4">$100 - $5k</p>
                                <p className="text-[9px] font-bold uppercase tracking-wide leading-tight px-4 opacity-80">
                                    Calculate your estimated earnings based on your average view count.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-black translate-x-[6px] translate-y-[6px]" />
                            <div className="relative border-2 border-black bg-white p-6 md:p-8">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black mb-2">Submit Clip</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Track your work & get paid</p>
                                <SubmissionForm campaignId={campaign.id} />
                            </div>
                        </div>

                        <div className="bg-blue-50 border-2 border-blue-500 p-6 flex gap-4 items-start">
                            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-1">Important Rule</h4>
                                <p className="text-[11px] font-bold text-blue-600/80 leading-relaxed uppercase tracking-wide">
                                    Only original content posted on TikTok, Instagram Reels, or YouTube Shorts is eligible.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
