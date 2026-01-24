"use client";

import { useState, useEffect } from "react";
import { Loader2, Check } from "lucide-react";

type Campaign = {
    id: number;
    brandName: string;
    description: string;
    status: string;
    payPerViewRate: string;
};

export default function AdminPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/clip/campaigns?status=pending")
            .then(res => res.json())
            .then(data => {
                setCampaigns(data);
                setIsLoading(false);
            });
    }, []);

    async function approve(id: number) {
        await fetch(`/api/clip/campaigns/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status: "approved" })
        });
        setCampaigns(campaigns.filter(c => c.id !== id));
    }

    if (isLoading) return <div className="p-12"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
        <div className="p-12 max-w-[800px] mx-auto min-h-screen bg-white">
            <h1 className="text-3xl font-black uppercase mb-8">Pending Approvals</h1>

            <div className="space-y-4">
                {campaigns.length === 0 && <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">All caught up. No pending campaigns.</p>}

                {campaigns.map(c => (
                    <div key={c.id} className="border-2 border-black p-6 flex items-center justify-between">
                        <div>
                            <h3 className="font-black text-xl">{c.brandName}</h3>
                            <p className="text-xs text-gray-500 font-bold uppercase">{c.description}</p>
                            <p className="text-xs text-orange-500 font-bold uppercase mt-2">${c.payPerViewRate}/view</p>
                        </div>
                        <button onClick={() => approve(c.id)} className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-green-500 transition-colors flex items-center gap-2">
                            <Check className="w-3 h-3" /> Approve
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
