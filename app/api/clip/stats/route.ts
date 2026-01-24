import { db } from "@/db";
import { clips, clippingCampaigns } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // Aggregate stats
        // Total active clips (status = approved)
        // const activeClipsCount = await db.select({ count: sql<number>`count(*)` }).from(clips).where(eq(clips.status, "approved"));
        // For now user wants everything to be real, but newly created things are approved.

        const allClips = await db.select().from(clips);
        const allCampaigns = await db.select().from(clippingCampaigns);

        const totalClips = allClips.length;
        const totalViews = allClips.reduce((acc, clip) => acc + (clip.views || 0), 0);

        // Calculate earnings
        let totalEarnings = 0;
        const recentSubmissions = [];

        // Map campaign rates to calculate earnings
        const campaignMap = new Map();
        allCampaigns.forEach(c => campaignMap.set(c.id, parseFloat(c.payPerViewRate || "0")));

        // Get recent submissions with details
        // We will fetch recent clips with campaign info manually or use a join if we rewrite the query, 
        // but for simplicity with Drizzle payload:

        const recentClips = await db.select({
            id: clips.id,
            platform: clips.platform,
            views: clips.views,
            status: clips.status,
            createdAt: clips.createdAt,
            campaignName: clippingCampaigns.brandName,
        })
            .from(clips)
            .leftJoin(clippingCampaigns, eq(clips.campaignId, clippingCampaigns.id))
            .orderBy(desc(clips.createdAt))
            .limit(5);

        // Calculate earnings roughly
        for (const clip of allClips) {
            const rate = campaignMap.get(clip.campaignId) || 0;
            totalEarnings += (clip.views || 0) * rate;
        }

        // Mock chart data for now based on createdAt if we had enough data, 
        // but likely we don't have enough 'real' time series data yet.
        // We will stick to the aggregate numbers being real, and keep chart static or simple.

        return NextResponse.json({
            totalViews,
            totalEarnings: totalEarnings.toFixed(2),
            activeClips: totalClips,
            recentSubmissions: recentClips
        });

    } catch (error) {
        console.error("[STATS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
