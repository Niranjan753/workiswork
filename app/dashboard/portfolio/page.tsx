"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, ArrowUpRight, Github, Twitter, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Portfolio = {
    id: number;
    name: string;
    role: string;
    location: string;
    avatarInitials: string;
    avatarUrl?: string;
    bio: string;
    specialties: string[];
    website?: string;
    twitter?: string;
    github?: string;
    metaImageUrl?: string;
};

const PORTFOLIOS: Portfolio[] = [
    {
        id: 1,
        name: "Berlified",
        role: "Web Platform, Creator Tools",
        location: "Remote · Berlin",
        avatarInitials: "BF",
        bio: "Product, platform and creative tech — current at berlified.xyz, building digital storytelling tools.",
        specialties: ["Next.js", "Storytelling", "Experimental UX"],
        website: "https://berlified.xyz",
        metaImageUrl: "https://berlified.xyz/og-image.png",
        twitter: "https://twitter.com/berlified",
    },
    {
        id: 2,
        name: "Pocketsflow",
        role: "Indie Founder",
        location: "Remote · UK",
        avatarInitials: "PF",
        bio: "I’m building Pocketsflow — simple, set-and-forget business analytics for indie makers.",
        specialties: ["Product", "Analytics", "Indie SaaS"],
        website: "https://pocketsflow.com",
        metaImageUrl: "https://pocketsflow.com/og.jpg",
        twitter: "https://twitter.com/pocketsflow",
        github: "https://github.com/pocketsflow",
    }
];

export default function DashboardPortfolioPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"browse" | "edit">("browse");

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/sign-in?callbackUrl=/dashboard/portfolio");
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

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-black tracking-tight">Portfolio</h1>
                    <p className="text-[#64748b] text-lg">
                        {activeTab === "browse"
                            ? "Discover standout portfolios from the community."
                            : "Manage your professional identity and showcase your work."}
                    </p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab("browse")}
                        className={cn(
                            "flex items-center gap-2 h-10 px-4 rounded-lg font-medium transition-all text-sm",
                            activeTab === "browse" ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-black"
                        )}
                    >
                        <Users className="w-4 h-4" />
                        Browse
                    </button>
                    <button
                        onClick={() => setActiveTab("edit")}
                        className={cn(
                            "flex items-center gap-2 h-10 px-4 rounded-lg font-medium transition-all text-sm",
                            activeTab === "edit" ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-black"
                        )}
                    >
                        <User className="w-4 h-4" />
                        My Profile
                    </button>
                </div>
            </div>

            {activeTab === "browse" ? (
                <div className="space-y-4">
                    {PORTFOLIOS.map((profile) => (
                        <div
                            key={profile.id}
                            className="bg-white border border-zinc-200 rounded-2xl p-6 transition-all hover:bg-zinc-50 group shadow-sm"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="min-w-0 flex-1 space-y-2">
                                    <h3 className="text-xl font-bold text-black leading-tight group-hover:text-blue-600 transition-colors">
                                        {profile.name}
                                    </h3>
                                    <p className="text-sm font-medium text-zinc-500">
                                        {profile.role} • {profile.location}
                                    </p>
                                    <p className="text-sm font-medium text-zinc-600">
                                        {profile.bio}
                                    </p>
                                    {profile.specialties.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {profile.specialties.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="bg-zinc-100 text-zinc-600 border border-transparent rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex flex-wrap items-center gap-4 pt-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
                                        {profile.github && (
                                            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-black transition-colors">
                                                <Github className="w-3.5 h-3.5" />
                                                GitHub
                                            </a>
                                        )}
                                        {profile.twitter && (
                                            <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-black transition-colors">
                                                <Twitter className="w-3.5 h-3.5" />
                                                Twitter
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="shrink-0 w-full sm:w-auto">
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
                                    >
                                        Visit site <ArrowUpRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Overview */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-sm flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400 font-bold text-3xl">
                                {session.user?.email?.[0].toUpperCase()}
                            </div>
                            <h3 className="font-bold text-xl text-black">{session.user?.email?.split('@')[0]}</h3>
                            <p className="text-[#64748b] text-sm mt-1">Full-stack Developer</p>
                            <div className="mt-6 w-full pt-6 border-t border-zinc-100 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500 font-medium">Location</span>
                                    <span className="text-black font-semibold">Remote</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500 font-medium">Experience</span>
                                    <span className="text-black font-semibold">5+ Years</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                            <h4 className="font-bold text-black mb-4">Professional Links</h4>
                            <div className="space-y-3">
                                {['GitHub', 'LinkedIn', 'Twitter', 'Personal Website'].map((link) => (
                                    <div key={link} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer group">
                                        <span className="text-zinc-500 font-medium text-sm group-hover:text-black transition-colors">{link}</span>
                                        <span className="text-zinc-300">→</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Edit Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-sm space-y-6">
                            <h4 className="font-bold text-black text-xl mb-4">About Me</h4>
                            <textarea
                                rows={4}
                                placeholder="Tell the world about yourself..."
                                className="w-full p-4 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black"
                                defaultValue="Passionate software engineer with a focus on building scalable web applications and intuitive user experiences. Always looking for new challenges in the remote-first space."
                            />

                            <div>
                                <h4 className="font-bold text-black mb-4">Tags & Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['React', 'Next.js', 'Typescript', 'Node.js', 'PostgreSQL', 'TailwindCSS'].map((tag) => (
                                        <span key={tag} className="px-4 py-2 bg-zinc-100 text-black text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-zinc-200 cursor-pointer">
                                            {tag}
                                            <button className="text-zinc-400 hover:text-red-500">×</button>
                                        </span>
                                    ))}
                                    <button className="px-4 py-2 border border-dashed border-zinc-300 text-zinc-400 text-sm font-semibold rounded-xl hover:border-black hover:text-black transition-all">
                                        + Add Skill
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                            <h4 className="font-bold text-black text-xl mb-4">Experience</h4>
                            <div className="space-y-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-100 shrink-0" />
                                        <div className="space-y-1">
                                            <h5 className="font-bold text-black">{i === 1 ? 'Senior Frontend Engineer' : 'Full Stack Developer'}</h5>
                                            <p className="text-zinc-500 text-sm">{i === 1 ? 'Pocketsflow' : 'Freelance'} • 2021 - Present</p>
                                            <p className="text-zinc-600 text-sm mt-2">Built and managed several products within the ecosystem, focusing on performance and user growth.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

