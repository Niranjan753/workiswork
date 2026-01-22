import { NextResponse } from "next/server";
import { db } from "@/db";
import { companies, jobs, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { guessLogoFromWebsite } from "@/lib/logo";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { jobData } = body;

        if (!jobData) {
            return NextResponse.json({ error: "Job data is required" }, { status: 400 });
        }

        // 1. Find or create company
        let company;

        const calculatedCompanySlug = jobData.companyName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        if (jobData.companyId) {
            [company] = await db.select().from(companies).where(eq(companies.id, jobData.companyId)).limit(1);
        }

        if (!company) {
            // Try finding by name/slug if no ID or ID not found
            [company] = await db
                .select()
                .from(companies)
                .where(eq(companies.slug, calculatedCompanySlug))
                .limit(1);

            if (!company) {
                // Create new company
                [company] = await db
                    .insert(companies)
                    .values({
                        name: jobData.companyName,
                        slug: calculatedCompanySlug,
                        websiteUrl: jobData.companyWebsite || null,
                        logoUrl: jobData.companyLogo || (jobData.companyWebsite ? await guessLogoFromWebsite(jobData.companyWebsite) : null),
                    })
                    .returning();
            }
        }

        if (!company) {
            throw new Error("Failed to find or create company");
        }

        // Always update company logo/website if new ones are provided in jobData
        const updates: any = {};
        if (jobData.companyWebsite && jobData.companyWebsite !== company.websiteUrl) {
            updates.websiteUrl = jobData.companyWebsite;
        }
        if (jobData.companyLogo && jobData.companyLogo !== company.logoUrl) {
            updates.logoUrl = jobData.companyLogo;
        }

        if (Object.keys(updates).length > 0) {
            await db.update(companies).set(updates).where(eq(companies.id, company.id));
        }

        // 2. Find category
        let [category] = await db
            .select()
            .from(categories)
            .where(eq(categories.slug, jobData.categorySlug))
            .limit(1);

        if (!category) {
            console.log(`[POST /api/jobs/draft] Creating missing category: ${jobData.categorySlug}`);
            [category] = await db
                .insert(categories)
                .values({
                    slug: jobData.categorySlug,
                    name: jobData.categorySlug.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
                    description: `${jobData.categorySlug} remote jobs`,
                })
                .returning();
        }

        if (!category) {
            return NextResponse.json({ error: `Failed to find or create category "${jobData.categorySlug}"` }, { status: 400 });
        }

        // 3. Create draft job
        const baseSlug = `${jobData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${company.slug}`;
        const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

        const [job] = await db
            .insert(jobs)
            .values({
                title: jobData.title,
                slug: uniqueSlug,
                companyId: company.id,
                categoryId: category.id,
                location: jobData.location || "Worldwide",
                jobType: jobData.jobType || "full_time",
                remoteScope: jobData.remoteScope || "worldwide",
                applyUrl: jobData.applyUrl,
                receiveApplicationsByEmail: jobData.receiveApplicationsByEmail ?? false,
                companyEmail: jobData.companyEmail,
                highlightColor: jobData.highlightColor,
                isPublished: false,
                paymentStatus: "pending",
                source: "internal",
                descriptionHtml: jobData.descriptionHtml,
                tags: jobData.tags || [],
                salaryMin: jobData.salaryMin ? String(jobData.salaryMin) : null,
                salaryMax: jobData.salaryMax ? String(jobData.salaryMax) : null,
            })
            .returning();

        return NextResponse.json({ jobId: job.id });
    } catch (error: any) {
        console.error("[POST /api/jobs/draft] error:", error);
        return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
    }
}
