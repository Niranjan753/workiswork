import Link from "next/link";
import { Bell, Mail, Shield } from "lucide-react";

export default function AlertsPage() {
  return (
    <div className="bg-white min-h-screen selection:bg-orange-500/30 font-sans">
      {/* Dark Hero Section */}
      <section className="bg-[#0A0A0A] text-white pt-24 pb-32 px-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '60px 100%' }} />

        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-[9px] text-black uppercase tracking-[0.4em] text-orange-500 border border-orange-500/20 px-3 py-1">
              REAL-TIME MONITORING
            </span>
          </div>

          <h1 className="text-black tracking-tighter text-[40px] leading-[0.9] sm:text-[60px] md:text-[80px] lg:text-[100px] uppercase italic">
            Job <br />
            <span className="text-orange-500">Alerts</span>
          </h1>

          <p className="mt-8 text-base sm:text-lg md:text-xl font-medium text-gray-400 max-w-xl mx-auto leading-tight uppercase tracking-tight">
            Never miss an elite opportunity. Configure your <br className="hidden md:block" />
            surveillance parameters and receive direct signals.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 pb-32 -mt-16 relative z-20">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white border-2 border-black p-8 sm:p-16 shadow-[12px_12px_0px_black] sm:shadow-[24px_24px_0px_black] text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-500/10 border-2 border-dashed border-orange-500 flex items-center justify-center mx-auto mb-10">
              <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
            </div>

            <h2 className="text-2xl sm:text-3xl text-black uppercase italic tracking-tighter mb-6">Initialize Surveillance</h2>
            <p className="text-[10px] sm:text-[11px] text-black uppercase tracking-widest text-gray-500 mb-12 max-w-md mx-auto leading-relaxed">
              We are currently finalizing the V2 automated alert protocol. Join our early access list to receive priority notifications for new roles.
            </p>

            <form className="max-w-md mx-auto flex flex-col gap-4">
              <input
                type="email"
                placeholder="ENTER EMAIL ADDRESS"
                className="w-full bg-gray-50 border-2 border-black p-4 sm:p-5 text-black text-[10px] sm:text-[11px] text-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
              <button
                type="submit"
                className="w-full bg-black text-white p-4 sm:p-5 text-[10px] sm:text-[11px] text-black uppercase tracking-[0.3em] hover:bg-orange-500 transition-all border-2 border-black"
              >
                Activate Notifications
              </button>
            </form>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 opacity-40 grayscale">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-[9px] text-black uppercase tracking-widest">Encrypted Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-[9px] text-black uppercase tracking-widest">No Spam</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}