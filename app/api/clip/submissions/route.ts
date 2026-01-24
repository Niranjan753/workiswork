import { db } from "@/db";
import { clips } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const campaignId = searchParams.get("campaignId");

        let query = db.select().from(clips).orderBy(desc(clips.createdAt));

        if (campaignId) {
            query = query.where(eq(clips.campaignId, parseInt(campaignId)));
        }

        const allClips = await query;
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
