"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPortfolioPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

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
                        Manage your professional identity and showcase your work.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="h-11 px-6 bg-zinc-100 text-black rounded-xl font-medium hover:bg-zinc-200 transition-colors">
                        View Public Profile
                    </button>
                    <button className="h-11 px-6 bg-black text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>

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
        </div>
    );
}
