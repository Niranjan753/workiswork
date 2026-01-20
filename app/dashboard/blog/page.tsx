"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { blogPosts } from "@/data/blog";
import Link from "next/link";

export default function DashboardBlogPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/sign-in?callbackUrl=/dashboard/blog");
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="flex items-center bg-white justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-black" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const posts = blogPosts;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-black tracking-tight">Blog</h1>
                    <p className="text-[#64748b] text-lg">
                        Stay updated with the latest in remote work and career growth.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="flex flex-col rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer"
                    >
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">
                                    {post.category}
                                </span>
                                <span className="text-zinc-300">•</span>
                                <span className="text-zinc-500 text-xs font-medium">
                                    {new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-black mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                                {post.title}
                            </h3>
                            <p className="text-zinc-500 text-sm mb-4 line-clamp-2">
                                {post.excerpt}
                            </p>
                            <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
                                <span className="text-black text-xs font-bold group-hover:underline">Read more →</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
