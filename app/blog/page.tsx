import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "../../data/blog";
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
    <div className="min-h-screen bg-yellow-400 text-black">
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <section className="mb-6 space-y-3 text-center">
          <h1 className="text-balance text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Remote work, without the fluff
          </h1>
          <p className="text-xs text-black/80 sm:text-sm font-medium">
            Short, opinionated essays on remote careers, hiring, and building
            great distributed teams.
          </p>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex flex-col rounded-2xl border-2 border-black bg-yellow-500 p-4 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl hover:bg-yellow-300"
            >
              <span className="text-[11px] font-bold uppercase tracking-wide text-black">
                {post.category}
              </span>
              <h2 className="mt-1 text-sm font-bold text-black">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-xs text-black/80 font-medium">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between text-[11px] text-black/70 font-medium">
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
