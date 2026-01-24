import Link from "next/link";
import { ArrowRight, Briefcase, Users, Globe } from "lucide-react";

export default function Home() {
    return (
        <div className="bg-white min-h-screen selection:bg-orange-500/30">
            {/* Dark Hero Section */}
            <section className="bg-[#0A0A0A] text-white flex flex-col items-center justify-center pt-32 pb-150 px-6 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '60px 100%' }} />

                <div className="max-w-[1200px] text-center relative z-10">

                    <h1 className="text-white tracking-tighter text-[40px] leading-[0.85] 
                   sm:text-[60px] md:text-[90px] lg:text-[110px] uppercase italic">
                        REMOTE ONLY <br />
                        <span className="text-orange-500"> JOB BOARD </span>
                    </h1>

                    <p className="mt-10 text-base sm:text-lg md:text-xl font-medium text-gray-400 max-w-xl mx-auto leading-tight uppercase tracking-tight">
                        Connecting high-velocity companies with the world's most elite
                        remote professionals.
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/post"
                            className="group relative bg-[#FF5A1F] text-white text-[11px] text-black uppercase tracking-[0.3em]
                                     px-10 py-5 rounded-none transition-all shadow-[8px_8px_0px_rgba(255,90,31,0.2)]
                                     hover:shadow-none hover:translate-x-1 hover:translate-y-1 overflow-hidden border-2 border-[#FF5A1F]"
                        >
                            <span className="relative z-10">Post a Position</span>
                            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>

                        <Link
                            href="/jobs"
                            className="group relative bg-white text-black text-[11px] text-black uppercase tracking-[0.3em]
                                     px-10 py-5 rounded-none transition-all shadow-[8px_8px_0px_rgba(255,255,255,0.1)]
                                     hover:shadow-none hover:translate-x-1 hover:translate-y-1 overflow-hidden border-2 border-white"
                        >
                            <span className="relative z-10">Explore Roles</span>
                            <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
