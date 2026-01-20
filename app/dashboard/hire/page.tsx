import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { AdminJobForm } from "@/components/admin/job-form";

export const metadata: Metadata = {
    title: "Post a Job – Dashboard",
};

const categoryChips: { label: string; slug: string }[] = [
    { label: "Software Development", slug: "software-development" },
    { label: "Customer Service", slug: "customer-support" },
    { label: "Design", slug: "design" },
    { label: "Marketing", slug: "marketing" },
    { label: "Sales / Business", slug: "sales" },
    { label: "Product", slug: "product" },
    { label: "Project Management", slug: "project" },
    { label: "AI / ML", slug: "ai-ml" },
    { label: "Data Analysis", slug: "data-analysis" },
    { label: "Devops / Sysadmin", slug: "devops" },
    { label: "Finance", slug: "finance" },
    { label: "Human Resources", slug: "human-resources" },
    { label: "QA", slug: "qa" },
    { label: "Writing", slug: "writing" },
    { label: "Legal", slug: "legal" },
    { label: "Medical", slug: "medical" },
    { label: "Education", slug: "education" },
    { label: "All Others", slug: "all-others" },
];

async function getCategories() {
    const slugs = categoryChips.map(c => c.slug);
    const rows = await db
        .select({
            id: categories.id,
            slug: categories.slug,
            name: categories.name,
        })
        .from(categories)
        .where(inArray(categories.slug, slugs));

    const mergedCategories = categoryChips.map(chip => {
        const dbCategory = rows.find(c => c.slug === chip.slug);
        return {
            id: dbCategory?.id || 0,
            slug: chip.slug,
            name: chip.label,
        };
    });

    return mergedCategories;
}

export default async function DashboardHirePage() {
    const h = await headers();
    const session = await auth.api.getSession({ headers: h });

    if (!session) {
        redirect("/sign-in?callbackUrl=/dashboard/hire");
    }

    const cats = await getCategories();

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-bold mb-2 text-black tracking-tight">Post a Job</h1>
                <p className="text-[#64748b] text-lg">
                    Find the best remote talent for your company.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
                <div className="lg:col-span-2">
                    <AdminJobForm categories={cats} />
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50 space-y-4">
                        <h4 className="font-bold text-black text-lg">Why post on WorkIsWork?</h4>
                        <ul className="space-y-3">
                            {[
                                'Reach 50,000+ remote developers',
                                'Posts remain live for 30 days',
                                'Social media promotion included',
                                'Company logo on homepage'
                            ].map((tip) => (
                                <li key={tip} className="flex gap-3 text-sm text-zinc-600 font-medium">
                                    <span className="text-green-500">✓</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-6 rounded-3xl border border-zinc-200 bg-white shadow-sm">
                        <h4 className="font-bold text-black mb-2">Need help?</h4>
                        <p className="text-sm text-zinc-500 font-medium">Our team is here to help you find the perfect candidate. Reach out anytime.</p>
                        <button className="mt-4 text-blue-600 font-bold text-sm hover:underline">Contact Support →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
