import Link from "next/link";
import { JobsBoard } from "../../components/jobs/jobs-board";
import { Suspense } from "react";

export default function Home() {
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
              RECRUITMENT HUB
            </span>
          </div>

          <h1 className="font-black tracking-tighter text-[40px] leading-[0.9] sm:text-[60px] md:text-[80px] lg:text-[100px] uppercase italic">
            Elite <br />
            <span className="text-orange-500">Remote</span> Talent
          </h1>

          <p className="mt-8 text-base sm:text-lg md:text-xl font-medium text-gray-400 max-w-xl mx-auto leading-tight uppercase tracking-tight">
            The global standard for remote-first companies <br className="hidden md:block" />
            to discover and hire world-class professionals.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/post"
              className="w-full sm:w-auto bg-orange-500 hover:bg-white hover:text-black text-white text-[10px] font-black uppercase tracking-widest px-10 py-4 rounded-none transition-all active:scale-[0.98] border-2 border-orange-500"
            >
              Post a Position
            </Link>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">Market Access</span>
              <span className="text-lg font-black italic text-white tracking-tighter uppercase">No Subscriptions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 pb-32 -mt-16 relative z-20">
        <div className="max-w-[1200px] mx-auto">
          <Suspense fallback={
            <div className="text-center py-40 bg-white border-2 border-dashed border-gray-200">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-gray-100" />
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">Synchronizing Data</div>
              </div>
            </div>
          }>
            <JobsBoard />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
