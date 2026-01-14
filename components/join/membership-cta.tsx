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
    <div className="space-y-2">
      <Button
        onClick={startCheckout}
        disabled={loading}
        className="w-full sm:w-auto border-2 border-black bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black"
      >
        {loading ? "Redirecting…" : label}
      </Button>
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
}
