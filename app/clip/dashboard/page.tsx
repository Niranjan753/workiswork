"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Eye, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis, Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";

// Mock Data for Visualization
const chartData = [
    { month: "January", views: 18600, earnings: 186 },
    { month: "February", views: 30500, earnings: 305 },
    { month: "March", views: 23700, earnings: 237 },
    { month: "April", views: 73000, earnings: 730 },
    { month: "May", views: 20900, earnings: 209 },
    { month: "June", views: 21400, earnings: 214 },
];

const chartConfig = {
    views: {
        label: "Views",
        color: "hsl(20, 100%, 50%)", // Orange-ish
    },
    earnings: {
        label: "Earnings ($)",
        color: "hsl(0, 0%, 10%)", // Black
    },
} satisfies ChartConfig;

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalViews: 0,
        totalEarnings: "0.00",
        activeClips: 0,
        recentSubmissions: [] as any[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/clip/stats")
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 font-sans">
            <div className="max-w-[1200px] mx-auto space-y-8">
                <Link href="/clip" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
                    <ChevronLeft className="w-3 h-3" />
                    Back to Hub
                </Link>

                <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter sm:leading-none mb-2">
                        Clipping <span className="text-orange-500">Analytics</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-wide text-xs">
                        Track your performance across all campaigns
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-2 border-black rounded-none shadow-[4px_4px_0px_black]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Total Views</CardTitle>
                            <Eye className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black italic tracking-tighter">{stats.totalViews.toLocaleString()}</div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">
                                Lifetime Views
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-black rounded-none shadow-[4px_4px_0px_black]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Total Earnings</CardTitle>
                            <DollarSign className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black italic tracking-tighter">${stats.totalEarnings}</div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">
                                Estimated Revenue
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-black rounded-none shadow-[4px_4px_0px_black]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Active Clips</CardTitle>
                            <Activity className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black italic tracking-tighter">{stats.activeClips}</div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">
                                Submitted Links
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-black rounded-none shadow-[4px_4px_0px_black] bg-black text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Pending Payout</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black italic tracking-tighter">${stats.totalEarnings}</div>
                            <button className="mt-3 w-full bg-orange-500 text-white text-[9px] font-black uppercase tracking-[0.2em] py-2 hover:bg-white hover:text-black transition-colors">
                                Request Payout
                            </button>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4 border-2 border-black rounded-none shadow-[4px_4px_0px_black]">
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Performance Trend</CardTitle>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Views vs Earnings over time
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ff5a1f" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ff5a1f" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="fillEarnings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#000000" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area
                                        type="monotone"
                                        dataKey="views"
                                        stroke="#ff5a1f"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#fillViews)"
                                        stackId="1"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="earnings"
                                        stroke="#000000"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#fillEarnings)"
                                        stackId="2" // Stacking might not be what viewing want if scales differ vastly, but for visual effect
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3 border-2 border-black rounded-none shadow-[4px_4px_0px_black]">
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Recent Submission</CardTitle>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Latest clips tracked
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {stats.recentSubmissions.length === 0 ? (
                                    <p className="text-xs text-gray-400 font-bold uppercase">No recent clips found.</p>
                                ) : (
                                    stats.recentSubmissions.map((clip) => (
                                        <div key={clip.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-100 border border-black flex items-center justify-center font-black uppercase">
                                                    {clip.campaignName ? clip.campaignName[0] : "C"}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-tight line-clamp-1">{clip.campaignName || "Unknown Campaign"}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                                                        {clip.platform} • {clip.createdAt ? formatDistanceToNow(new Date(clip.createdAt), { addSuffix: true }) : "Just now"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black">{(clip.views || 0).toLocaleString()} Views</p>
                                                <p className={`text-[9px] font-bold uppercase tracking-wide ${clip.status === 'approved' ? 'text-green-500' : 'text-orange-500'}`}>
                                                    {clip.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
