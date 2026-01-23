import Link from "next/link";

export default function PricingPage() {
    const tiers = [
        {
            name: "Standard",
            price: "$59",
            duration: "per post",
            features: [
                "30 days listing",
                "Company branding",
                "Social media promotion",
                "Basic analytics"
            ],
            cta: "Get Started",
            href: "/post",
            highlight: false
        },
        {
            name: "Elite",
            price: "$499",
            duration: "per post",
            features: [
                "60 days listing",
                "Priority placement",
                "Newsletter inclusion",
                "Direct talent matching",
                "Premium analytics"
            ],
            cta: "Initialize Elite",
            href: "/post",
            highlight: true
        }
    ];

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
                            INVESTMENT TIERS
                        </span>
                    </div>

                    <h1 className="font-black tracking-tighter text-[40px] leading-[0.9] sm:text-[60px] md:text-[80px] lg:text-[100px] uppercase italic">
                        Market <br />
                        <span className="text-orange-500">Pricing</span>
                    </h1>

                    <p className="mt-8 text-base sm:text-lg md:text-xl font-medium text-gray-400 max-w-xl mx-auto leading-tight uppercase tracking-tight">
                        Transparent pricing for high-velocity teams. <br className="hidden md:block" />
                        No hidden fees, just elite talent access.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="px-6 pb-32 -mt-16 relative z-20">
                <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`bg-white border-2 border-black p-8 sm:p-12 flex flex-col ${tier.highlight ? 'shadow-[8px_8px_0px_#FF5A1F] sm:shadow-[16px_16px_0px_#FF5A1F]' : 'shadow-[8px_8px_0px_black] sm:shadow-[16px_16px_0px_black]'}`}
                        >
                            <div className="mb-8">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border-2 border-black ${tier.highlight ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    {tier.name}
                                </span>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-black italic tracking-tighter uppercase">{tier.price}</span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{tier.duration}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-12 flex-grow">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-orange-500" />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={tier.href}
                                className={`w-full py-5 text-center text-[11px] font-black uppercase tracking-[0.3em] transition-all border-2 border-black ${tier.highlight
                                    ? 'bg-orange-500 text-white hover:bg-black'
                                    : 'bg-white text-black hover:bg-black hover:text-white'
                                    }`}
                            >
                                {tier.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
