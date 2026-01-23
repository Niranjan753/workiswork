import Link from "next/link";

export default function Home() {
    return (
        <div className="bg-[#0A0A0A] min-h-screen selection:bg-orange-500/30">
            <section className="text-white flex flex-col items-center justify-center min-h-[90vh] px-6 relative overflow-hidden">
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

                    <h1 className="font-black tracking-tighter text-[50px] leading-[0.85] 
                   sm:text-[80px] md:text-[120px] lg:text-[160px] uppercase italic">
                        The Global <br />
                        <span className="text-gray-800">Labor</span> Market
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
                                     hover:shadow-none hover:translate-x-1 hover:translate-y-1 overflow-hidden"
                        >
                            <span className="relative z-10">Initialize Hiring</span>
                            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>

                        <Link
                            href="/jobs"
                            className="group relative bg-white text-black text-[11px] font-black uppercase tracking-[0.3em]
                                     px-10 py-5 rounded-none transition-all shadow-[8px_8px_0px_rgba(255,255,255,0.1)]
                                     hover:shadow-none hover:translate-x-1 hover:translate-y-1 overflow-hidden"
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
        </div>
    )
}
