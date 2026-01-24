import { db } from "@/db";
import { clips } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const campaignId = searchParams.get("campaignId");

        const whereCondition = campaignId ? eq(clips.campaignId, parseInt(campaignId)) : undefined;

        const allClips = await db.select()
            .from(clips)
            .where(whereCondition)
            .orderBy(desc(clips.createdAt));
        return NextResponse.json(allClips);
    } catch (error) {
        console.error("[CLIPS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            campaignId,
            clipperEmail,
            platform,
            link
        } = body;

        if (!campaignId || !clipperEmail || !platform || !link) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const newClip = await db.insert(clips).values({
            campaignId: parseInt(campaignId),
            clipperEmail,
            platform, // "instagram", "tiktok", "youtube"
            link,
            status: "approved",
            views: 0
        }).returning();

        return NextResponse.json(newClip[0]);
    } catch (error) {
        console.error("[CLIPS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
