"use client";

import Link from "next/link";
import {
    Plus,
    X,
    Star,
    Heart,
    Search,
    MapPin,
    ChevronDown,
    Briefcase,
    Code,
    ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Project {
    id: string | number;
    title: string;
    description: string;
    userName: string;
    userEmail: string;
    projectUrl?: string;
    thumbnailUrl?: string;
    location: string;
    rate: string;
    role: string;
    tags: string[];
    avatar: string;
    isAvailable: boolean;
    recommendations: number;
}

export default function PortfolioPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [newProject, setNewProject] = useState({
        userName: "",
        userEmail: "",
        title: "",
        role: "",
        location: "",
        rate: "",
        tags: "",
        description: "",
        projectUrl: ""
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch("/api/projects");
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data.map((p: any) => ({
                        ...p,
                        avatar: (p.userName || "U").substring(0, 2).toUpperCase(),
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProject),
            });

            if (response.ok) {
                const createdProject = await response.json();
                setProjects(prev => [{
                    ...createdProject,
                    avatar: (createdProject.userName || "U").substring(0, 2).toUpperCase(),
                }, ...prev]);
                setIsModalOpen(false);
                setNewProject({
                    userName: "",
                    userEmail: "",
                    title: "",
                    role: "",
                    location: "",
                    rate: "",
                    tags: "",
                    description: "",
                    projectUrl: ""
                });
            } else {
                alert("Failed to create project. Please check if all fields are filled.");
            }
        } catch (error) {
            console.error("Error creating project:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#FFFFFF] min-h-screen text-[#222222] font-sans">
            {/* Minimal Header */}
            <header className="bg-white border-b border-[#F0F0F0] sticky top-0 z-50 px-6 py-4">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center gap-6">
                    {/* Search */}
                    <div className="relative flex-grow max-w-xl w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
                        <input
                            type="text"
                            placeholder="Search by role, stack, or name..."
                            className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#DDDDDD] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full md:w-auto">
                        {["Location", "Rate"].map((filter) => (
                            <button key={filter} className="bg-white border border-[#EEEEEE] rounded-lg px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-[#F9F9F9] transition-colors whitespace-nowrap">
                                {filter} <ChevronDown className="w-3 h-3 opacity-40" />
                            </button>
                        ))}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="ml-auto bg-black text-white rounded-lg px-6 py-2.5 text-xs font-bold hover:bg-[#333333] transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" /> Add Project
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-6 py-10">
                <div className="max-w-[1400px] mx-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-20">
                            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {projects
                                .filter(p => (p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.userName?.toLowerCase().includes(searchTerm.toLowerCase())))
                                .map((project) => (
                                    <div
                                        key={project.id}
                                        className="group bg-white border border-[#EEEEEE] rounded-xl overflow-hidden hover:border-[#DDDDDD] transition-all flex flex-col shadow-sm hover:shadow-md"
                                    >
                                        {/* Project Header */}
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-full bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center font-bold text-xs text-[#666666]">
                                                        {project.avatar}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[14px] leading-tight text-black">{project.userName}</h3>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <MapPin className="w-3 h-3 text-[#B0B0B0]" />
                                                            <span className="text-[11px] text-[#888888] font-medium">{project.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {project.isAvailable && (
                                                    <span className="text-[#00875A] text-[9px] font-bold uppercase tracking-wider bg-[#F0FAF5] px-2 py-1 rounded">
                                                        Available
                                                    </span>
                                                )}
                                            </div>

                                            {/* Recommendations & Rate */}
                                            <div className="flex items-center gap-3 mb-5">
                                                {project.recommendations > 0 && (
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#444444]">
                                                        <Star className="w-3 h-3 text-[#FFB800] fill-[#FFB800]" />
                                                        {project.recommendations}
                                                    </div>
                                                )}
                                                <div className="text-[10px] font-bold text-[#666666] bg-[#F5F5F5] px-2 py-0.5 rounded">
                                                    {project.rate}
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#EEEEEE] rounded-md text-[10px] font-medium text-[#555555]">
                                                    <Briefcase className="w-3 h-3 opacity-60" /> {project.role}
                                                </div>
                                                {project.tags?.map(tag => (
                                                    <div key={tag} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#EEEEEE] rounded-md text-[10px] font-medium text-[#555555]">
                                                        <Code className="w-3 h-3 opacity-60" /> {tag}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Clean Showcase Area */}
                                        <div className="px-6 pb-6 mt-auto">
                                            <div className="aspect-[16/9] rounded-lg bg-[#F9F9F9] border border-[#F0F0F0] overflow-hidden group-hover:border-[#DDDDDD] transition-all relative">
                                                {project.thumbnailUrl ? (
                                                    <img
                                                        src={project.thumbnailUrl}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5]">
                                                        <h4 className="text-black font-bold text-[14px] leading-snug max-w-[150px] mb-2">
                                                            {project.title}
                                                        </h4>
                                                        <p className="text-[#888888] text-[9px] font-medium uppercase tracking-wider">{project.userName}</p>
                                                    </div>
                                                )}

                                                {project.projectUrl && (
                                                    <Link
                                                        href={project.projectUrl}
                                                        target="_blank"
                                                        className="absolute inset-0 bg-black/0 hover:bg-black/5 flex items-center justify-center transition-all group/link"
                                                    >
                                                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover/link:opacity-100 transition-opacity translate-y-2 group-hover/link:translate-y-0">
                                                            <ExternalLink className="w-4 h-4 text-black" />
                                                        </div>
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="mt-3">
                                                <h4 className="font-bold text-[14px] text-black line-clamp-1">{project.title}</h4>
                                                <p className="text-[#666666] text-[11px] line-clamp-2 mt-1 leading-relaxed">{project.description}</p>
                                            </div>
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="px-6 pb-6 flex items-center gap-2">
                                            <button
                                                onClick={() => alert(`Connect with ${project.userName} at ${project.userEmail}`)}
                                                className="flex-grow bg-black text-white py-2.5 px-4 rounded-lg text-xs font-bold hover:bg-[#333333] transition-all flex items-center justify-center gap-2"
                                            >
                                                Get in Touch
                                            </button>
                                            <button className="p-2.5 bg-white border border-[#EEEEEE] rounded-lg hover:bg-[#F9F9F9] transition-colors text-[#999999] hover:text-[#555555]">
                                                <Heart className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Simple Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px]">
                    <div className="relative w-full max-w-xl bg-white p-8 sm:p-10 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-[#A0A0A0] hover:text-[#222222] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight mb-1">Add your project</h2>
                                <p className="text-sm text-[#888888]">Professional showcase for world-class talent.</p>
                            </div>

                            <form onSubmit={handleCreateProject} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-[#999999]">Your Name</label>
                                        <input
                                            required
                                            value={newProject.userName}
                                            onChange={e => setNewProject({ ...newProject, userName: e.target.value })}
                                            placeholder="e.g. Satoshi Nakamoto"
                                            className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg p-3 text-sm focus:outline-none focus:border-[#DDDDDD]"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-[#999999]">Your Email</label>
                                        <input
                                            required
                                            type="email"
                                            value={newProject.userEmail}
                                            onChange={e => setNewProject({ ...newProject, userEmail: e.target.value })}
                                            placeholder="satoshi@bitcoin.org"
                                            className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg p-3 text-sm focus:outline-none focus:border-[#DDDDDD]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase text-[#999999]">Project URL / Site</label>
                                    <input
                                        required
                                        type="url"
                                        value={newProject.projectUrl}
                                        onChange={e => setNewProject({ ...newProject, projectUrl: e.target.value })}
                                        placeholder="https://yourproject.com"
                                        className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg p-3 text-sm focus:outline-none focus:border-[#DDDDDD]"
                                    />
                                    <p className="text-[10px] text-[#A0A0A0]">We'll automatically pull the preview image from this site.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-[#999999]">Project Title</label>
                                        <input
                                            required
                                            value={newProject.title}
                                            onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                                            placeholder="Name of your project"
                                            className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg p-3 text-sm focus:outline-none focus:border-[#DDDDDD]"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-[#999999]">Role</label>
                                        <input
                                            required
                                            value={newProject.role}
                                            onChange={e => setNewProject({ ...newProject, role: e.target.value })}
                                            placeholder="e.g. Design Engineer"
                                            className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg p-3 text-sm focus:outline-none focus:border-[#DDDDDD]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-[#999999]">Location</label>
                                        <input
                                            value={newProject.location}
                                            onChange={e => setNewProject({ ...newProject, location: e.target.value })}
                                            placeholder="e.g. Tokyo, JP"
                                            className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg p-3 text-sm focus:outline-none focus:border-[#DDDDDD]"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-[#999999]">Hourly Rate</label>
                                        <input
                                            value={newProject.rate}
                                            onChange={e => setNewProject({ ...newProject, rate: e.target.value })}
                                            placeholder="e.g. $80 - $120/hr"
                                            className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg p-3 text-sm focus:outline-none focus:border-[#DDDDDD]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase text-[#999999]">Tech Stack (CSV)</label>
                                    <input
                                        value={newProject.tags}
                                        onChange={e => setNewProject({ ...newProject, tags: e.target.value })}
                                        placeholder="e.g. React, Figma, Node.js"
                                        className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg p-3 text-sm focus:outline-none focus:border-[#DDDDDD]"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase text-[#999999]">Description</label>
                                    <textarea
                                        required
                                        value={newProject.description}
                                        onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                        rows={3}
                                        placeholder="What did you build and how?"
                                        className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg p-3 text-sm focus:outline-none focus:border-[#DDDDDD] resize-none"
                                    />
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full bg-black text-white py-3.5 rounded-lg text-sm font-bold hover:bg-[#333333] transition-all disabled:opacity-50 mt-2"
                                >
                                    {isSubmitting ? "Processing..." : "Publish Project"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
