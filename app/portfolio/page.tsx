"use client";

import Link from "next/link";
import { ExternalLink, ArrowRight, Plus, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Project {
    id: string;
    title: string;
    tagline: string;
    description: string;
    href: string;
    tags: string[];
}

const INITIAL_PROJECTS: Project[] = [
    {
        id: "workiswork",
        title: "Workiswork",
        tagline: "The Global Hub for Remote Work",
        description: "A comprehensive marketplace connecting top-tier remote talent with fast-growing companies.",
        href: "https://workiswork.xyz",
        tags: ["Next.js", "PostgreSQL", "Stripe"],
    },
    {
        id: "pocketsflow",
        title: "Pocketsflow",
        tagline: "Financial Tooling for Teams",
        description: "Modern financial management and capital orchestration for remote-first organizations.",
        href: "https://pocketsflow.com",
        tags: ["Fintech", "Real-time", "API"],
    },
    {
        id: "pockets",
        title: "$POCKETS",
        tagline: "The Native Ecosystem Asset",
        description: "The primary value layer powering the future of the remote work economy.",
        href: "#",
        tags: ["Protocol", "Asset", "Web3"],
    }
];

export default function PortfolioPage() {
    const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newProject, setNewProject] = useState({
        title: "",
        tagline: "",
        description: "",
        href: "",
        tags: ""
    });

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            const project: Project = {
                id: Math.random().toString(36).substr(2, 9),
                title: newProject.title,
                tagline: newProject.tagline,
                description: newProject.description,
                href: newProject.href || "#",
                tags: newProject.tags.split(",").map(t => t.trim().toUpperCase()).filter(t => t),
            };

            setProjects(prev => [project, ...prev]);
            setIsSubmitting(false);
            setIsModalOpen(false);
            setNewProject({ title: "", tagline: "", description: "", href: "", tags: "" });
        }, 1000);
    };

    return (
        <div className="bg-white min-h-screen selection:bg-orange-500/30 text-black font-sans">
            {/* Dark Hero Section */}
            <section className="bg-[#0A0A0A] text-white pt-24 pb-32 px-6 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '60px 100%' }} />

                <div className="max-w-[1200px] mx-auto text-center relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-500 border border-orange-500/20 px-3 py-1">
                            COMMUNITY SHOWCASE
                        </span>
                    </div>

                    <h1 className="font-black tracking-tighter text-[40px] leading-[0.9] sm:text-[60px] md:text-[80px] lg:text-[100px] uppercase italic">
                        Selected <br />
                        <span className="text-gray-800">Projects</span>
                    </h1>

                    <p className="mt-8 text-base sm:text-lg md:text-xl font-medium text-gray-500 max-w-xl mx-auto leading-tight uppercase tracking-tight">
                        Explore high-impact platforms and protocols <br className="hidden md:block" />
                        built by the world's most elite remote talent.
                    </p>

                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-orange-500 hover:bg-white hover:text-black text-white text-[10px] font-black uppercase tracking-widest px-10 py-4 rounded-none transition-all border-2 border-orange-500 shadow-[4px_4px_0px_rgba(249,115,22,0.3)]"
                        >
                            Submit Your Project
                        </button>
                    </div>
                </div>
            </section>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-xl bg-white border-2 border-black p-8 sm:p-12 shadow-[12px_12px_0px_rgba(0,0,0,1)] rounded-none"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Initialize Project</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Document your technical contribution to the ecosystem.</p>
                                </div>

                                <form onSubmit={handleCreateProject} className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Project Title</label>
                                        <input
                                            required
                                            value={newProject.title}
                                            onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                                            type="text"
                                            placeholder="E.G. POCKETSFLOW"
                                            className="w-full bg-white border-2 border-black px-4 py-3 text-xs font-bold uppercase tracking-widest focus:bg-orange-50 outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Tagline</label>
                                        <input
                                            required
                                            value={newProject.tagline}
                                            onChange={e => setNewProject({ ...newProject, tagline: e.target.value })}
                                            type="text"
                                            placeholder="A short summary..."
                                            className="w-full bg-white border-2 border-black px-4 py-3 text-xs font-bold uppercase tracking-widest focus:bg-orange-50 outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Description</label>
                                        <textarea
                                            required
                                            value={newProject.description}
                                            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                            rows={3}
                                            placeholder="What did you build?"
                                            className="w-full bg-white border-2 border-black px-4 py-3 text-xs font-bold uppercase tracking-widest focus:bg-orange-50 outline-none transition-colors resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Tech Stack (CSV)</label>
                                            <input
                                                value={newProject.tags}
                                                onChange={e => setNewProject({ ...newProject, tags: e.target.value })}
                                                type="text"
                                                placeholder="REACT, NODE..."
                                                className="w-full bg-white border-2 border-black px-4 py-3 text-xs font-bold uppercase tracking-widest focus:bg-orange-50 outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">URL</label>
                                            <input
                                                value={newProject.href}
                                                onChange={e => setNewProject({ ...newProject, href: e.target.value })}
                                                type="url"
                                                placeholder="https://..."
                                                className="w-full bg-white border-2 border-black px-4 py-3 text-xs font-bold uppercase tracking-widest focus:bg-orange-50 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full bg-black text-white py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-orange-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Processing..." : "Commit Project"}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Project Grid */}
            <section className="px-6 pb-32 -mt-12 relative z-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {projects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group"
                                >
                                    <div className="h-full bg-white border-2 border-black p-8 flex flex-col justify-between shadow-[6px_6px_0px_black] hover:shadow-[12px_12px_0px_#f97316] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                                        <div>
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex flex-wrap gap-2">
                                                    {project.tags.map(tag => (
                                                        <span key={tag} className="text-[8px] font-black uppercase tracking-[0.2em] text-black/40 border border-black/10 px-2 py-0.5 rounded-none">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <ExternalLink className="w-4 h-4 text-black group-hover:text-orange-500 transition-colors" />
                                            </div>

                                            <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none mb-3 group-hover:text-orange-500 transition-colors">
                                                {project.title}
                                            </h3>

                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-6 border-l-2 border-orange-500 pl-3">
                                                {project.tagline}
                                            </p>

                                            <p className="text-[13px] font-medium leading-relaxed text-gray-500 mb-8 uppercase tracking-tight">
                                                {project.description}
                                            </p>
                                        </div>

                                        <Link
                                            href={project.href}
                                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-black group-hover:translate-x-2 transition-all"
                                        >
                                            View Project <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </div>
    );
}
