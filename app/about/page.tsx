import Link from "next/link";
import { Globe, Users, Briefcase } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen selection:bg-orange-500/30 font-sans">
            {/* Dark Hero Section */}
            <section className="bg-[#0A0A0A] text-white pt-24 pb-32 px-6 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '60px 100%' }} />

                <div className="max-w-[1200px] mx-auto text-center relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-500 border border-orange-500/20 px-3 py-1">
                            THE MANIFESTO
                        </span>
                    </div>

                    <h1 className="font-black tracking-tighter text-[40px] leading-[0.9] sm:text-[60px] md:text-[80px] lg:text-[100px] uppercase italic">
                        Elite <br />
                        <span className="text-orange-500">Connection</span>
                    </h1>

                    <p className="mt-8 text-base sm:text-lg md:text-xl font-medium text-gray-400 max-w-xl mx-auto leading-tight uppercase tracking-tight">
                        WorkIsWork is the premier protocol for high-velocity remote hiring. <br className="hidden md:block" />
                        We strip away the noise and focus on pure talent-to-company alignment.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="px-6 pb-32 -mt-16 relative z-20">
                <div className="max-w-[1200px] mx-auto">
                    <div className="bg-white border-2 border-black p-8 sm:p-16 shadow-[12px_12px_0px_black] sm:shadow-[24px_24px_0px_black]">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                            <div className="space-y-6">
                                <div className="w-12 h-12 bg-black text-white flex items-center justify-center italic font-black text-xl">01</div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter">The Vision</h3>
                                <p className="text-[11px] font-black uppercase tracking-widest text-gray-600 leading-relaxed">
                                    To eliminate geographical barriers and connect the world's most capable professionals with high-impact opportunities regardless of location.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="w-12 h-12 bg-orange-500 text-white flex items-center justify-center italic font-black text-xl">02</div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter">The Standard</h3>
                                <p className="text-[11px] font-black uppercase tracking-widest text-gray-600 leading-relaxed">
                                    We maintain a rigorous vetting process and a high-signal environment. Our marketplace is optimized for quality over quantity.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="w-12 h-12 bg-black text-white flex items-center justify-center italic font-black text-xl">03</div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter">The Result</h3>
                                <p className="text-[11px] font-black uppercase tracking-widest text-gray-600 leading-relaxed">
                                    Faster hiring cycles, better retention, and a community of remote professionals who are defining the future of global labor.
                                </p>
                            </div>
                        </div>

                        <div className="mt-20 pt-20 border-t-2 border-dashed border-gray-100 flex flex-col items-center text-center">
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8 leading-none">Ready to <br /> Initialize?</h2>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <Link
                                    href="/join"
                                    className="bg-orange-500 text-white px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all border-2 border-orange-500"
                                >
                                    Join the Network
                                </Link>
                                <Link
                                    href="/jobs"
                                    className="bg-white text-black px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-none"
                                >
                                    Browse Jobs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
