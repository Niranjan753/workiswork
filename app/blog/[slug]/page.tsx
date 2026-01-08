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
    <div className="relative min-h-screen overflow-hidden bg-white text-black">
      <GridBackground />

      {/* Hero Section - Yellow */}
      <section className="relative z-10 bg-yellow-400 py-16 sm:py-20 lg:py-24 border-b-2 border-black">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {post.heroLabel && (
            <span className="inline-block mb-4 border-2 border-black bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide">
              {post.heroLabel}
            </span>
          )}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-black leading-tight mb-6">
            {post.title}
          </h1>
          <p className="text-sm font-medium text-black/70 flex flex-wrap gap-3">
            <span className="border-2 border-black bg-white px-4 py-2 text-xs font-bold">
              {post.category}
            </span>
            <span className="border-2 border-black bg-black px-4 py-2 text-xs font-bold text-yellow-400">
              {post.readTime}
            </span>
            <span className="text-xs font-medium text-black/70 self-center">
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
          </p>
        </div>
      </section>

      {/* Article Content */}
      <main className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <article className="border-2 border-black bg-white p-8 sm:p-12 lg:p-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div
            className="prose prose-lg sm:prose-xl max-w-none 
              prose-p:text-black prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-base sm:prose-p:text-lg
              prose-h2:text-black prose-h2:font-black prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:leading-tight
              prose-h3:text-black prose-h3:font-black prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:leading-tight
              prose-ul:text-black prose-ul:my-6 prose-ul:space-y-3
              prose-ol:text-black prose-ol:my-6 prose-ol:space-y-3
              prose-li:text-black prose-li:leading-relaxed prose-li:text-base sm:prose-li:text-lg
              prose-strong:text-black prose-strong:font-black
              prose-a:text-black prose-a:font-bold prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2
              prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:pl-6 prose-blockquote:my-8 prose-blockquote:text-black/80 prose-blockquote:italic
              prose-code:text-black prose-code:bg-yellow-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
              prose-pre:bg-black prose-pre:text-yellow-400 prose-pre:p-6 prose-pre:rounded-none prose-pre:border-2 prose-pre:border-black
              prose-hr:border-black prose-hr:border-t-2 prose-hr:my-12"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>

        <div className="mt-16 flex flex-wrap gap-4 justify-between items-center border-t-2 border-black pt-8">
          <Link
            href="/blog"
            className="border-2 border-black bg-white px-6 py-3 text-sm font-bold text-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg"
          >
            ← Back to all articles
          </Link>
          <Link
            href="/post"
            className="border-2 border-black bg-black px-6 py-3 text-sm font-bold text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all shadow-lg"
          >
            Hire remote talent on WorkIsWork →
          </Link>
        </div>
      </main>
    </div>
  );
}


