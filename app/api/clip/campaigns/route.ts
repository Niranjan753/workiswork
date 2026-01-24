import { db } from "@/db";
import { clippingCampaigns } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        let query = db.select().from(clippingCampaigns).orderBy(desc(clippingCampaigns.createdAt));

        if (status) {
            // @ts-ignore
            query = query.where(eq(clippingCampaigns.status, status));
        }

        const campaigns = await query;
        return NextResponse.json(campaigns);
    } catch (error) {
        console.error("[CAMPAIGNS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            brandName,
            logoUrl,
            description,
            goals,
            payPerViewRate,
            creatorEmail
        } = body;

        if (!brandName || !description || !goals || !payPerViewRate || !creatorEmail) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const newCampaign = await db.insert(clippingCampaigns).values({
            brandName,
            logoUrl,
            description,
            goals,
            payPerViewRate: typeof payPerViewRate === 'string' ? payPerViewRate : String(payPerViewRate),
            creatorEmail,
            status: "approved"
        }).returning();

        return NextResponse.json(newCampaign[0]);
    } catch (error) {
        console.error("[CAMPAIGNS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
