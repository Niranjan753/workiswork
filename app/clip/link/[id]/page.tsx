"use client";

import { useEffect, useState } from "react";
import { Loader2, Eye, DollarSign, ExternalLink, ChevronLeft, TrendingUp } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

type ClipDetails = {
    id: number;
    views: number;
    status: string;
    link: string;
    platform: string;
    createdAt: string;
    campaign: {
        id: number;
        brandName: string;
        payPerViewRate: string;
        logoUrl: string | null;
    };
};

export default function LinkDashboardPage() {
    const params = useParams();
    const [clip, setClip] = useState<ClipDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetch(`/api/clip/link/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    setClip(data);
                    setLoading(false);
                })
                .catch(err => setLoading(false));
        }
    }, [params.id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
    if (!clip) return <div className="min-h-screen flex items-center justify-center text-xs font-bold uppercase">Clip not found</div>;

    const earnings = (clip.views * parseFloat(clip.campaign.payPerViewRate)).toFixed(4);

    return (
        <div className="min-h-screen bg-white p-6 md:p-12 font-sans">
            <div className="max-w-[1000px] mx-auto space-y-12">

                {/* Header */}
                <div className="space-y-6">
                    <Link href={`/clip/${clip.campaign.id}`} className="inline-flex items-center gap-2 text-[10px] text-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
                        <ChevronLeft className="w-3 h-3" />
                        Back to Campaign
                    </Link>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b-4 border-black">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 text-[9px] text-black uppercase tracking-widest text-white ${clip.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'}`}>
                                    {clip.status}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{clip.platform}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl text-black uppercase italic tracking-tighter leading-none mb-4">
                                Clip #{clip.id} Stats
                            </h1>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                                <span>For {clip.campaign.brandName}</span>
                                <span>•</span>
                                <span>Uploaded {formatDistanceToNow(new Date(clip.createdAt), { addSuffix: true })}</span>
                            </div>
                        </div>

                        <a href={clip.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-black text-white px-6 py-3 text-[10px] text-black uppercase tracking-[0.2em] hover:bg-orange-500 transition-colors">
                            View Original <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-black translate-x-[6px] translate-y-[6px]" />
                        <Card className="relative bg-white border-2 border-black rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-[10px] text-black uppercase tracking-[0.2em] text-gray-500">Total Views</CardTitle>
                                <Eye className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-5xl font-black italic tracking-tighter mb-2 text-black">{clip.views.toLocaleString()}</div>
                                <p className="text-[9px] font-bold text-green-500 uppercase tracking-wide">Live Tracking Active</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-black translate-x-[6px] translate-y-[6px]" />
                        <Card className="relative bg-white border-2 border-black rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-[10px] text-black uppercase tracking-[0.2em] text-gray-500">Earnings</CardTitle>
                                <DollarSign className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-5xl text-black italic tracking-tighter text-orange-500">${earnings}</div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Rate: ${clip.campaign.payPerViewRate}/view</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-black translate-x-[6px] translate-y-[6px]" />
                        <Card className="relative bg-black text-white border-2 border-black rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-[10px] text-black uppercase tracking-[0.2em] text-white/50">Performance</CardTitle>
                                <TrendingUp className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-5xl text-black italic tracking-tighter">High</div>
                                <p className="text-[9px] font-bold text-white/50 uppercase tracking-wide">Top 10% of clips</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Placeholder Chart / Activity Feed */}
                <div className="border-2 border-black p-8 bg-gray-50">
                    <h3 className="text-xl text-black uppercase italic tracking-tighter mb-6">Activity Log</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                            <span className="text-xs font-bold uppercase">View Count Updated</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Just now</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                            <span className="text-xs font-bold uppercase">Clip Status set to <span className="text-green-600">Approved</span></span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{formatDistanceToNow(new Date(clip.createdAt))} ago</span>
                        </div>
                        <div className="flex items-center justify-between pb-2">
                            <span className="text-xs font-bold uppercase">Submitted for review</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{formatDistanceToNow(new Date(clip.createdAt))} ago</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
