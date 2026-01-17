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
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <section className="relative z-10 py-12 sm:py-16 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none text-foreground">
              Blog from the{" "}
              <span className="text-primary relative inline-block">
                WorkIsWork
              </span>{" "}
              community
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              Short, opinionated essays on remote careers, hiring, and building great distributed teams.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 bg-background">
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex flex-col bg-background border border-border rounded-lg p-6 transition-all hover:bg-secondary/50 group"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {post.category}
              </span>
              <h2 className="text-lg font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground font-medium mb-4 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground font-medium pt-4 border-t border-border">
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                <span className="font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">Read More →</span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
