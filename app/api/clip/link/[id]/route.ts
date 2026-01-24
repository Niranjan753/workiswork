import { db } from "@/db";
import { clips, clippingCampaigns } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const clipId = parseInt(resolvedParams.id);

        const clip = await db.select({
            id: clips.id,
            views: clips.views,
            status: clips.status,
            link: clips.link,
            platform: clips.platform,
            createdAt: clips.createdAt,
            campaign: {
                id: clippingCampaigns.id,
                brandName: clippingCampaigns.brandName,
                payPerViewRate: clippingCampaigns.payPerViewRate,
                logoUrl: clippingCampaigns.logoUrl
            }
        })
            .from(clips)
            .leftJoin(clippingCampaigns, eq(clips.campaignId, clippingCampaigns.id))
            .where(eq(clips.id, clipId))
            .then(rows => rows[0]);

        if (!clip) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json(clip);
    } catch (error) {
        console.error("[CLIP_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
