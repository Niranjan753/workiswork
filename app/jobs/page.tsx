import Link from "next/link";
import { JobsBoard } from "../../components/jobs/jobs-board";
import { Suspense } from "react";

export default function Home() {
    return (
        <div className="bg-[#050505] min-h-screen selection:bg-orange-500/30">
            <section className="text-white flex flex-col items-center justify-center pt-24 pb-20 px-6">
                <div className="max-w-[840px] text-center">

                    {/* Headline */}
                    <h1 className="font-bold tracking-tighter text-[44px] leading-[1]
                   sm:text-[64px] md:text-[80px]">
                        Built for the future
                        <br />
                        of <span className="text-orange-500">remote work</span>
                    </h1>

                    {/* Description */}
                    <p className="mt-8 text-[18px] sm:text-[22px] leading-[1.4] text-gray-400 max-w-2xl mx-auto">
                        The premier platform for companies to source world-class talent
                        and for professionals to find their next remote role.
                    </p>

                    {/* CTA */}
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <Link
                            href="/post"
                            className="bg-orange-500 hover:bg-orange-600
                   text-white text-lg font-bold
                   px-10 py-3.5 rounded-xl
                   transition-all active:scale-[0.98] shadow-lg shadow-orange-500/10"
                        >
                            Post a job
                        </Link>

                        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                            No subscription required
                        </span>
                    </div>

                </div>
            </section>

            <section className="px-6 pb-24">
                <div className="max-w-[1200px] mx-auto">
                    <Suspense fallback={<div className="text-center py-20 text-gray-500 animate-pulse">Loading opportunities...</div>}>
                        <JobsBoard />
                    </Suspense>
                </div>
            </section>

        </div>
    )
}
