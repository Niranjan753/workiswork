import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "../../../data/blog";
import { GridBackground } from "../../../components/GridBackground";
import { getSiteUrl, getOgImageUrl } from "../../../lib/site-url";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  const siteUrl = getSiteUrl();
  const ogImage = getOgImageUrl();

  if (!post) {
    return {
      title: "Blog post not found – WorkIsWork",
      description: "The article you’re looking for doesn’t exist.",
      openGraph: {
        type: "article",
        url: `${siteUrl}/blog/${slug}`,
        title: "Blog post not found – WorkIsWork",
        description: "The article you’re looking for doesn’t exist.",
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
        title: "Blog post not found – WorkIsWork",
        description: "The article you’re looking for doesn’t exist.",
        images: [ogImage],
      },
    };
  }

  return {
    title: `${post.title} – WorkIsWork`,
    description: post.excerpt,
    openGraph: {
      type: "article",
      url: `${siteUrl}/blog/${post.slug}`,
      title: `${post.title} – WorkIsWork`,
      description: post.excerpt,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} – WorkIsWork`,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    // Next.js will render the global not-found page
    throw new Error("Post not found");
  }

  return (

    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative z-10 bg-background py-16 sm:py-20 lg:py-24 border-b border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {post.heroLabel && (
            <span className="inline-block mb-4 border border-border bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-full text-secondary-foreground">
              {post.heroLabel}
            </span>
          )}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight mb-6">
            {post.title}
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex flex-wrap gap-3 items-center">
            <span className="bg-secondary text-secondary-foreground px-3 py-1 text-xs font-bold rounded">
              {post.category}
            </span>
            <span className="bg-primary/10 text-primary px-3 py-1 text-xs font-bold rounded">
              {post.readTime}
            </span>
            <span className="flex items-center gap-1">
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
          </p>
        </div>
      </section>

      {/* Article Content */}
      <main className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 bg-background">
        <article className="prose prose-lg sm:prose-xl max-w-none 
          prose-headings:font-bold prose-headings:text-foreground
          prose-p:text-foreground/90 prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground prose-strong:font-bold
          prose-ul:text-foreground/90 prose-ol:text-foreground/90
          prose-li:marker:text-primary
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-secondary/20 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
          prose-code:text-primary prose-code:bg-secondary/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
          prose-pre:bg-secondary prose-pre:text-secondary-foreground prose-pre:p-6 prose-pre:rounded-lg prose-pre:border prose-pre:border-border
          prose-hr:border-border prose-hr:my-12">
          <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>

        <div className="mt-16 flex flex-wrap gap-4 justify-between items-center border-t border-border pt-8">
          <Link
            href="/blog"
            className="text-sm font-bold text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            ← Back to all articles
          </Link>
          <Link
            href="/post"
            className="bg-primary text-primary-foreground px-6 py-3 text-sm font-bold rounded-md hover:bg-primary/90 transition-all shadow-sm"
          >
            Hire remote talent on WorkIsWork →
          </Link>
        </div>
      </main>
    </div>
  );
}


