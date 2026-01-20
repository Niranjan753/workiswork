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
    <div className="relative min-h-screen bg-[#0B0B0B] text-white selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pb-16 text-center px-4">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-semibold tracking-tighter mt-12 sm:mt-16 text-[36px] leading-[1.1] sm:text-[56px] md:text-[80px] lg:text-[90px]">
            Stories from the
            <br />
            <span className="text-[#FF5A1F]">WorkIsWork</span> community
          </h1>

          <p className="mt-6 text-[16px] sm:text-[22px] md:text-[24px] max-w-3xl mx-auto leading-[1.2] text-[#B6B6B6] px-4">
            Short, opinionated essays on remote careers, hiring,
            <br className="hidden sm:block" />
            and building great distributed teams.
          </p>

          <div className="mt-6 sm:mt-10 flex flex-col items-center gap-3">
            <Link
              href="/join"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[18px] sm:text-[22px] font-medium cursor-pointer px-8 py-3 rounded-2xl transition-colors shadow-lg shadow-blue-900/20"
            >
              Get the newsletter
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-8">
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex flex-col bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 transition-all hover:bg-zinc-800/80 group shadow-sm"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">
                {post.category}
              </span>
              <h2 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-zinc-400 font-medium mb-6 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between text-[11px] text-zinc-500 font-bold uppercase tracking-wider pt-4 border-t border-zinc-800">
                <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-blue-500">Read Essay →</span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
