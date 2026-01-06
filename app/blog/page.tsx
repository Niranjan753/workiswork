import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "../../data/blog";

export const metadata: Metadata = {
  title: "Blog – WorkIsWork",
  description:
    "Tips, stories, and resources for remote work and job seekers.",
};

export default function BlogPage() {
  const posts = blogPosts;

  return (
    <div className="min-h-screen bg-[#fde9d7] text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <section className="mb-6 space-y-3 text-center">
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Remote work, without the fluff
          </h1>
          <p className="text-xs text-zinc-600 sm:text-sm">
            Short, opinionated essays on remote careers, hiring, and building
            great distributed teams.
          </p>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex flex-col rounded-2xl border border-orange-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide text-orange-600">
                {post.category}
              </span>
              <h2 className="mt-1 text-sm font-semibold text-zinc-900">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-xs text-zinc-600">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-500">
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
