export default function PrivacyPage() {
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
                            DATA PROTOCOL
                        </span>
                    </div>

                    <h1 className="font-black tracking-tighter text-[40px] leading-[0.9] sm:text-[60px] md:text-[80px] lg:text-[100px] uppercase italic">
                        Privacy <br />
                        <span className="text-orange-500">Policy</span>
                    </h1>

                    <p className="mt-8 text-base sm:text-lg md:text-xl font-medium text-gray-400 max-w-xl mx-auto leading-tight uppercase tracking-tight">
                        How we protect your biometric and professional <br className="hidden md:block" />
                        digital identifiers. Full transparency.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="px-6 pb-32 -mt-16 relative z-20">
                <div className="max-w-[800px] mx-auto">
                    <div className="bg-white border-2 border-black p-8 sm:p-16 shadow-[12px_12px_0px_black] sm:shadow-[24px_24px_0px_black]">
                        <div className="prose prose-sm max-w-none">
                            <div className="space-y-12">
                                <section>
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter border-b-2 text-black border-black pb-4 mb-6">01. DATA COLLECTION</h2>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-600 leading-relaxed">
                                        We collect only minimum required data to facilitate elite hiring. This includes professional history, contact authorization, and platform interaction telemetry.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter border-b-2 text-black border-black pb-4 mb-6">02. DATA USAGE</h2>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-600 leading-relaxed">
                                        Personal data is used exclusively for matching talent with vetted companies. We do not sell datasets to third-party advertising entities.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter border-b-2 text-black border-black pb-4 mb-6">03. SECURITY</h2>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-600 leading-relaxed">
                                        All sensitive identifiers are encrypted at rest using industry-standard protocols. Access is restricted to authorized administrative nodes.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter border-b-2 text-black border-black pb-4 mb-6">04. COOKIES</h2>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-600 leading-relaxed">
                                        We use session identifiers and essential telemetry to maintain portal stability and user authentication.
                                    </p>
                                </section>
                            </div>

                            <div className="mt-20 pt-10 border-t-2 border-dashed border-gray-100 text-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Last updated: January 2024 ● WorkIsWork Global Operations</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
