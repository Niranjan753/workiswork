import { db } from "@/db";
import { clips } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: 'apify_api_1yQM383YQuwfMfd8Nxja39icmnBr552HEjWN',
});

// Helper to scrape view count based on platform
async function scrapeViewCount(url: string, platform: string): Promise<number | null> {
    try {
        console.log(`Scraping ${platform} link: ${url}`);

        if (platform === "instagram") {
            // Prepare Actor input for the powerful Instagram Scraper (shu8hvrXbJbY3Eb9W)
            // It supports direct URLs which is perfect for our use case (single links).
            // "username" based scrapers (like the reels one) are harder to use with just a link.
            const input = {
                "directUrls": [url],
                "resultsType": "posts",
                "resultsLimit": 1,
                "searchType": "hashtag",
                "searchLimit": 1,
                "addParentData": false
            };

            // Run the Actor and wait for it to finish
            console.log("Starting Apify Instagram Scraper...");
            const run = await client.actor("shu8hvrXbJbY3Eb9W").call(input);

            // Fetch and print Actor results from the run's dataset (if any)
            console.log('Apify run finished, fetching results...');
            const { items } = await client.dataset(run.defaultDatasetId).listItems();

            if (items && items.length > 0) {
                const post = items[0];
                console.log("Apify Result:", post.url); // Log URL to confirm match

                // Instagram scraper output mapping
                // @ts-ignore
                const views = post.videoViewCount || post.video_view_count || post.viewCount || 0;
                // @ts-ignore
                const likes = post.likesCount || post.likes_count || 0;

                // If it's a video/reel, views are preferred.
                if (views > 0) return views;

                // Fallback for images or if views are hidden (return likes as proxy? or just null)
                // User asked for "views", so let's try to return views. 
                // If 0 views but has likes, we might return likes but that's inaccuracies.
                // Let's stick to null if no views to be "Real".
                return null;
            }
            return null;
        }

        // TODO: Implement TikTok/YouTube using their respective Apify actors if needed.
        return null;

    } catch (error) {
        console.error("Scraping error:", error);
        return null;
    }
}


export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const clipId = parseInt(resolvedParams.id);

        // 1. Get the clip
        const clip = await db.select().from(clips).where(eq(clips.id, clipId)).then(rows => rows[0]);
        if (!clip) return new NextResponse("Clip not found", { status: 404 });

        // 2. Real Scrape
        let newViews = clip.views;
        let didUpdate = false;

        if (clip.platform === "instagram") {
            const realViews = await scrapeViewCount(clip.link, "instagram");
            if (realViews !== null && realViews !== undefined) {
                newViews = realViews;
                didUpdate = true;
            } else {
                console.log("Apify returned no views. No update performed.");
            }
        } else {
            console.log("No scraper configured for", clip.platform);
        }

        // 3. Update DB only if we got new data or if we just want to touch updatedAt?
        // User requested "remove fake simulation". So if we didn't get data, we probably shouldn't update views.
        if (didUpdate) {
            const updated = await db.update(clips)
                .set({ views: newViews, updatedAt: new Date() })
                .where(eq(clips.id, clipId))
                .returning();
            return NextResponse.json(updated[0]);
        } else {
            // Return existing clip if no update
            return NextResponse.json(clip);
        }

    } catch (error) {
        console.error("[CLIP_REFRESH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
