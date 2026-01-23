import Link from "next/link";
import { ArrowRight, Briefcase, Users, Globe } from "lucide-react";

export default function Home() {
    return (
        <div className="bg-white min-h-screen selection:bg-orange-500/30">
            {/* Dark Hero Section */}
            <section className="bg-[#0A0A0A] text-white flex flex-col items-center justify-center pt-32 pb-24 px-6 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '60px 100%' }} />

                <div className="max-w-[1200px] text-center relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-500 border border-orange-500/20 px-3 py-1">
                            EST. 2024
                        </span>
                        <div className="h-[1px] w-8 bg-orange-500/20" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">
                            REMOTE PROTOCOL
                        </span>
                    </div>

                    <h1 className="font-black tracking-tighter text-[40px] leading-[0.85] 
                   sm:text-[60px] md:text-[90px] lg:text-[110px] uppercase italic">
                        The Global <br />
                        <span className="text-orange-500">Labor</span> Market
                    </h1>

                    <p className="mt-10 text-base sm:text-lg md:text-xl font-medium text-gray-400 max-w-xl mx-auto leading-tight uppercase tracking-tight">
                        Connecting high-velocity companies with the world's most elite <br className="hidden md:block" />
                        remote professionals. Join the network of the future.
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/post"
                            className="group relative bg-[#FF5A1F] text-white text-[11px] font-black uppercase tracking-[0.3em]
                                     px-10 py-5 rounded-none transition-all shadow-[8px_8px_0px_rgba(255,90,31,0.2)]
                                     hover:shadow-none hover:translate-x-1 hover:translate-y-1 overflow-hidden border-2 border-[#FF5A1F]"
                        >
                            <span className="relative z-10">Post a Position</span>
                            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>

                        <Link
                            href="/jobs"
                            className="group relative bg-white text-black text-[11px] font-black uppercase tracking-[0.3em]
                                     px-10 py-5 rounded-none transition-all shadow-[8px_8px_0px_rgba(255,255,255,0.1)]
                                     hover:shadow-none hover:translate-x-1 hover:translate-y-1 overflow-hidden border-2 border-white"
                        >
                            <span className="relative z-10">Explore Roles</span>
                            <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                    </div>

                    <div className="mt-16 flex items-center justify-center gap-8 opacity-20 filter grayscale">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Authorized by elite firms worldwide</span>
                    </div>
                </div>
            </section>

            {/* Quick Stats / Info Section */}
            <section className="py-24 px-6 bg-white border-t-2 border-black">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="space-y-4 group">
                        <div className="w-16 h-16 bg-white border-2 border-black rounded-none flex items-center justify-center mx-auto shadow-[4px_4px_0px_black] group-hover:shadow-[8px_8px_0px_#f97316] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all">
                            <Briefcase className="w-8 h-8 text-black" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Verified Roles</h3>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-tight">High-quality remote positions from vetted companies.</p>
                    </div>
                    <div className="space-y-4 group">
                        <div className="w-16 h-16 bg-white border-2 border-black rounded-none flex items-center justify-center mx-auto shadow-[4px_4px_0px_black] group-hover:shadow-[8px_8px_0px_#3b82f6] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all">
                            <Users className="w-8 h-8 text-black" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Elite Talent</h3>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-tight">A community of experienced remote professionals.</p>
                    </div>
                    <div className="space-y-4 group">
                        <div className="w-16 h-16 bg-white border-2 border-black rounded-none flex items-center justify-center mx-auto shadow-[4px_4px_0px_black] group-hover:shadow-[8px_8px_0px_#10b981] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all">
                            <Globe className="w-8 h-8 text-black" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Global Reach</h3>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-tight">Hire from anywhere or work from anywhere.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
