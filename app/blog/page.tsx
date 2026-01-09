import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "../../data/blog";
import { GridBackground } from "../../components/GridBackground";
import { getSiteUrl, getOgImageUrl } from "../../lib/site-url";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Blog – WorkIsWork",
  description: "Tips, stories, and resources for remote work and job seekers.",
  openGraph: {
    type: "website",
    url: `${siteUrl}/blog`,
    title: "Blog – WorkIsWork",
    description: "Tips, stories, and resources for remote work and job seekers.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "WorkIsWork Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog – WorkIsWork",
    description: "Tips, stories, and resources for remote work and job seekers.",
    images: [ogImage],
  },
};

export default function BlogPage() {
  const posts = blogPosts;

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-black">
      <GridBackground />
      <section className="relative z-10 bg-transparent py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-black">
              Blog from the{" "}
              <span className="inline-block bg-yellow-300 px-2 py-1 pb-1.5 mt-2 border-black relative">
                WorkIsWork
              </span>{" "}
              community
            </h1>
            <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto font-medium leading-relaxed">
              Short, opinionated essays on remote careers, hiring, and building great distributed teams.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - White */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 bg-transparent">
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex flex-col bg-white border-2 border-black p-6 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-black/60 mb-2">
                {post.category}
              </span>
              <h2 className="text-lg font-black text-black mb-3 leading-tight">
                {post.title}
              </h2>
              <p className="text-sm text-black/70 font-medium mb-4 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between text-xs text-black/50 font-medium pt-4 border-t border-black/10">
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                <span className="font-bold">Read More +</span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
