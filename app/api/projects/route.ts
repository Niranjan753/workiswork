import { db } from "@/db";
import { projects } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET() {
    try {
        const allProjects = await db.query.projects.findMany({
            orderBy: [desc(projects.createdAt)],
        });
        return NextResponse.json(allProjects);
    } catch (error) {
        console.error("[PROJECTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            userName,
            userEmail,
            title,
            role,
            location,
            rate,
            description,
            tags,
            projectUrl
        } = body;

        if (!userName || !userEmail || !title || !role || !description) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        let thumbnailUrl = null;
        if (projectUrl) {
            try {
                const response = await fetch(projectUrl);
                const html = await response.text();
                const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

                if (ogImageMatch && ogImageMatch[1]) {
                    thumbnailUrl = ogImageMatch[1];
                }
            } catch (e) {
                console.error("Failed to fetch meta image:", e);
            }
        }

        const newProject = await db.insert(projects).values({
            userName,
            userEmail,
            title,
            role,
            projectUrl,
            thumbnailUrl,
            location,
            rate,
            description,
            tags: tags ? tags.split(",").map((t: string) => t.trim()).filter((t: string) => t) : [],
        }).returning();

        return NextResponse.json(newProject[0]);
    } catch (error) {
        console.error("[PROJECTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

