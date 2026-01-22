import Link from "next/link";
import { JobsBoard } from "../../components/jobs/jobs-board";
import { Suspense } from "react";

export default function Home() {
    return (
        <div className="bg-[#0B0B0B] min-h-screen">
            <section className="text-white flex flex-col items-center justify-center pt-20 pb-20 px-6">
                <div className="max-w-[720px] text-center">

                    {/* Headline */}
                    <h1 className="font-semibold tracking-tighter text-[44px] leading-[1]
                   sm:text-[56px] md:text-[90px]">
                        Built for the future
                        <br />
                        of <span className="text-[#FF5A1F]">remote work</span>
                    </h1>

                    {/* Description */}
                    <p className="mt-6 text-[18px] sm:text-[24px] leading-[1.1] text-[#B6B6B6]">
                        Best place for companies to hire real talent
                        <br />
                        from around the world & find remote jobs.
                    </p>

                    {/* CTA */}
                    <div className="mt-8 flex flex-col items-center gap-3">
                        <Link
                            href="/post"
                            className="bg-[#FF5A1F] hover:bg-[#E54D15]
                   text-white text-[22px] mt-6 font-medium cursor-pointer
                   px-8 py-[8px] rounded-2xl
                   transition-colors"
                        >
                            Post a job
                        </Link>

                        <span className="text-[13px] text-[#8C8C8C]">
                            No subscription required
                        </span>
                    </div>

                </div>
            </section>

            <section className="px-6 py-12">
                <div className="max-w-[1200px] mx-auto">
                    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading jobs...</div>}>
                        <JobsBoard />
                    </Suspense>
                </div>
            </section>

        </div>
    )
}
