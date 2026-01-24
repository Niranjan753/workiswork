import { db } from "@/db";
import { clippingCampaigns } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await req.json();
        const { status } = body;
        const resolvedParams = await params;

        if (!status) return new NextResponse("Missing status", { status: 400 });

        const updated = await db.update(clippingCampaigns)
            .set({ status })
            .where(eq(clippingCampaigns.id, parseInt(resolvedParams.id)))
            .returning();

        return NextResponse.json(updated[0]);
    } catch (error) {
        console.error("[CAMPAIGN_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
