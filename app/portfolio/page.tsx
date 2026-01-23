import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";

const PROJECTS = [
    {
        id: "workiswork",
        title: "workiswork.xyz",
        tagline: "The Global Protocol for Remote Labor",
        description: "A high-density job marketplace for elite remote talent and high-velocity companies.",
        href: "https://workiswork.xyz",
        tags: ["NEXT.JS", "POSTGRES", "STRIPE"]
    },
    {
        id: "pocketsflow",
        title: "Pocketsflow",
        tagline: "Capital Velocity Orchestration",
        description: "Sophisticated financial tooling for modern remote-first organizations and individuals.",
        href: "https://pocketsflow.com",
        tags: ["FINTECH", "REAL-TIME", "API"]
    },
    {
        id: "pockets",
        title: "$POCKETS",
        tagline: "The Sovereign Asset of the Workiswork Ecosystem",
        description: "Decentralized value layer powering the work economy of the future.",
        href: "#",
        tags: ["ASSET", "PROTOCOL", "VALUE"]
    }
];

export default function PortfolioPage() {
    return (
        <div className="bg-white min-h-screen selection:bg-orange-500/30">
            {/* Dark Hero Section */}
            <section className="bg-[#0A0A0A] text-white pt-24 pb-32 px-6 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '60px 100%' }} />

                <div className="max-w-[1200px] mx-auto text-center relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-500 border border-orange-500/20 px-3 py-1">
                            ECOSYSTEM OVERVIEW
                        </span>
                    </div>

                    <h1 className="font-black tracking-tighter text-[40px] leading-[0.9] sm:text-[60px] md:text-[80px] lg:text-[100px] uppercase italic">
                        SELECTED <br />
                        <span className="text-gray-800">WORKS</span>
                    </h1>

                    <p className="mt-8 text-base sm:text-lg md:text-xl font-medium text-gray-400 max-w-xl mx-auto leading-tight uppercase tracking-tight">
                        A collection of high-density protocols and platforms <br className="hidden md:block" />
                        engineered for the modern digital landscape.
                    </p>
                </div>
            </section>

            {/* Project Grid */}
            <section className="px-6 pb-32 -mt-16 relative z-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {PROJECTS.map((project) => (
                            <div
                                key={project.id}
                                className="group bg-white border-2 border-black p-8 flex flex-col justify-between shadow-[8px_8px_0px_black] hover:shadow-[16px_16px_0px_#f97316] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex gap-2">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="text-[8px] font-black uppercase tracking-widest text-black/40 border border-black/10 px-1.5 py-0.5 leading-none">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-black group-hover:text-orange-500 transition-colors" />
                                    </div>

                                    <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none mb-3 group-hover:text-orange-500 transition-colors">
                                        {project.title}
                                    </h3>

                                    <p className="text-[10px] font-black uppercase tracking-widest text-black mb-6 border-l-2 border-orange-500 pl-3">
                                        {project.tagline}
                                    </p>

                                    <p className="text-[13px] font-medium leading-relaxed text-gray-500 mb-8 uppercase tracking-tight">
                                        {project.description}
                                    </p>
                                </div>

                                <Link
                                    href={project.href}
                                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-black group-hover:translate-x-2 transition-transform"
                                >
                                    Launch Protocol <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Footer Call to Action */}
                    <div className="mt-20 p-12 bg-black text-white text-center border-2 border-black shadow-[12px_12px_0px_rgba(0,0,0,0.1)]">
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Interested in collaboration?</h4>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Currently accepting select high-velocity projects.</p>
                        <a
                            href="mailto:berlin@workiswork.xyz"
                            className="inline-block bg-orange-500 text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
                        >
                            Establish Communication
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
