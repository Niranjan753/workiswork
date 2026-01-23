"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  label?: string;
};

export function MembershipCTA({ label = "Join membership" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/payments/membership-checkout", { method: "POST" });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401 && data?.redirect) {
        window.location.href = data.redirect;
        return;
      }

      if (!res.ok || !data?.url) {
        setError(data?.error || "Unable to start checkout");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err?.message || "Unable to start checkout");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={startCheckout}
        disabled={loading}
        className="group relative w-full sm:w-auto bg-black text-white px-10 h-14 text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 overflow-hidden disabled:opacity-30"
      >
        <span className="relative z-10">{loading ? "INITIALIZING SECURE LINK…" : label}</span>
        <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </button>
      {error && (
        <p className="text-[10px] font-black uppercase tracking-widest text-red-600 border-2 border-black bg-red-50 p-3 italic">
          CRITICAL ERROR: {error}
        </p>
      )}
    </div>
  );
}
