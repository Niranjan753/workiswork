"use client";

import * as React from "react";
import { authClient } from "../../lib/auth-client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Alert = {
  id: number;
  email: string;
  keyword: string | null;
  frequency: string;
  isActive: boolean;
  createdAt: string;
};

export function AlertsForm() {
  const { data: session } = authClient.useSession();
  const [email, setEmail] = React.useState("");
  const [keyword, setKeyword] = React.useState("");
  const [frequency, setFrequency] = React.useState<"daily" | "weekly">("daily");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [alerts, setAlerts] = React.useState<Alert[]>([]);

  // Prefill email from logged-in user
  React.useEffect(() => {
    if (session?.user?.email && !email) {
      setEmail(session.user.email);
    }
  }, [session, email]);

  // Load alerts for current user / email
  React.useEffect(() => {
    const load = async () => {
      try {
        const url =
          session?.user?.email && !email
            ? "/api/alerts"
            : email
              ? `/api/alerts?email=${encodeURIComponent(email)}`
              : null;
        if (!url) return;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        setAlerts(data.alerts || []);
      } catch {
        // ignore
      }
    };
    load();
  }, [session, email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !keyword) {
      setError("Please provide both email and a skill / keyword.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, keyword, frequency }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to create alert");
      }
      const data = await res.json();
      setAlerts((prev) => [data.alert, ...prev]);
      setKeyword("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-orange-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-sm font-semibold text-zinc-900">
          Create a custom job alert
        </h2>
        <p className="text-xs text-zinc-600">
          Pick a skill or keyword and we&apos;ll email you when new remote jobs
          match.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-800">
              Email address
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-800">
              Skill / keyword
            </label>
            <Input
              placeholder="e.g. React, Product Designer, Python"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-800">
              Frequency
            </label>
            <select
              className="h-10 w-full rounded-full border border-orange-200 bg-white px-3 text-xs text-zinc-800"
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as "daily" | "weekly")
              }
            >
              <option value="daily">Daily summary</option>
              <option value="weekly">Weekly digest</option>
            </select>
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          className="rounded-full bg-orange-500 px-5 py-2 text-xs font-semibold text-white hover:bg-orange-600"
        >
          {loading ? "Saving…" : "Save alert"}
        </Button>
      </form>

      {alerts.length > 0 && (
        <div className="rounded-2xl border border-orange-200 bg-white p-5 text-xs text-zinc-800 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-900">
            Your alerts ({alerts.length})
          </h3>
          <ul className="mt-3 space-y-2">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50 px-3 py-2"
              >
                <div>
                  <p className="font-semibold text-zinc-900">
                    {a.keyword || "(no keyword)"}
                  </p>
                  <p className="text-[11px] text-zinc-600">
                    {a.frequency === "daily" ? "Daily" : "Weekly"} •{" "}
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-orange-700">
                  Active
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


