import Link from "next/link";
import { JoinWizard } from "@/components/join/join-wizard";
import { Suspense } from "react";

export default function JoinPage() {
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
                            TALENT ONBOARDING
                        </span>
                    </div>

                    <h1 className="font-black tracking-tighter text-[40px] leading-[0.9] sm:text-[60px] md:text-[80px] lg:text-[100px] uppercase italic">
                        OPTIMIZE <br />
                        <span className="text-gray-800">YOUR</span> SIGNAL
                    </h1>

                    <p className="mt-8 text-base sm:text-lg md:text-xl font-medium text-gray-400 max-w-xl mx-auto leading-tight uppercase tracking-tight">
                        Define your expertise and preferred parameters. <br className="hidden md:block" />
                        We filter the noise to deliver elite opportunities.
                    </p>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="px-6 pb-32 -mt-16 relative z-20">
                <div className="max-w-3xl mx-auto">
                    <Suspense fallback={<div className="h-96 bg-white border-2 border-black animate-pulse" />}>
                        <JoinWizard />
                    </Suspense>
                </div>
            </section>
        </div>
    )
}
