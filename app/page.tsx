export default function Home() {
    return (
        <div>
            <section className="bg-[#0B0B0B] text-white flex  justify-center min-h-screen px-6">
                <div className="max-w-[720px] text-center">

                    {/* Headline */}
                    <h1 className="font-semibold tracking-tighter mt-16 text-[44px] leading-[1]
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
                        <button
                            className="bg-[#2563EB] hover:bg-[#1D4ED8]
                   text-white text-[20px] font-semibold cursor-pointer
                   px-12 py-[14px] rounded-lg
                   transition-colors"
                        >
                            Start hiring for free
                        </button>

                        <span className="text-[13px] text-[#8C8C8C]">
                            No subscription required
                        </span>
                    </div>

                </div>
            </section>


        </div>
    )
}
