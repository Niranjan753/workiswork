import type { Metadata } from "next";
import { db } from "../../db";
import { categories } from "../../db/schema";
import { inArray } from "drizzle-orm";
import { AdminJobForm } from "../../components/admin/job-form";
import { GridBackground } from "../../components/GridBackground";
import Link from "next/link";
import { getSiteUrl, getOgImageUrl } from "../../lib/site-url";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Post a Job – WorkIsWork",
  description: "Post your remote job to the WorkIsWork board.",
  openGraph: {
    type: "website",
    url: `${siteUrl}/post`,
    title: "Post a Job – WorkIsWork",
    description: "Post your remote job to the WorkIsWork board.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "WorkIsWork Post a Job",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Post a Job – WorkIsWork",
    description: "Post your remote job to the WorkIsWork board.",
    images: [ogImage],
  },
};

// Use the same categories as the jobs page
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
  // Get categories from database that match the slugs from categoryChips
  const slugs = categoryChips.map(c => c.slug);
  const rows = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
    })
    .from(categories)
    .where(inArray(categories.slug, slugs));

  // Map categoryChips to database categories, creating a merged list
  const mergedCategories = categoryChips.map(chip => {
    const dbCategory = rows.find(c => c.slug === chip.slug);
    return {
      id: dbCategory?.id || 0,
      slug: chip.slug,
      name: chip.label, // Use the label from categoryChips
    };
  });

  return mergedCategories;
}

// Notice removed per instructions (was RemotiveDistributionNotice)

export default async function PostJobPage() {
  const cats = await getCategories();

  return (
    <div className="bg-white min-h-screen selection:bg-orange-500/30 font-sans">
      {/* Dark Hero Section */}
      <section className="bg-[#0A0A0A] text-white pt-24 pb-32 px-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '60px 100%' }} />

        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-500 border border-orange-500/20 px-3 py-1">
              RECRUITMENT HUB
            </span>
          </div>

          <h1 className="font-black tracking-tighter text-[40px] leading-[0.9] sm:text-[60px] md:text-[80px] lg:text-[100px] uppercase italic">
            Acquire <br />
            <span className="text-gray-800">Elite</span> Talent
          </h1>

          <p className="mt-8 text-base sm:text-lg md:text-xl font-medium text-gray-400 max-w-xl mx-auto leading-tight uppercase tracking-tight">
            Connect your mission with the world's most innovative <br className="hidden md:block" />
            remote professionals. Join the elite network.
          </p>

          <div className="mt-12 flex items-center justify-center gap-6">
            <Link href="/jobs" className="text-[10px] font-black text-white hover:text-orange-500 transition-colors uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="text-orange-500">←</span> Browse Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="px-6 pb-32 -mt-16 relative z-20">
        <div className="max-w-3xl mx-auto">
          <AdminJobForm categories={cats} />
        </div>
      </section>
    </div>
  );
}

