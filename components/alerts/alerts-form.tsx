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
        className="space-y-4 rounded-lg border border-border bg-background p-6 shadow-sm"
      >
        <h2 className="text-base font-bold text-foreground">
          Create a custom job alert
        </h2>
        <p className="text-sm text-muted-foreground font-medium">
          Pick a skill or keyword and we&apos;ll email you when new remote jobs
          match.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground font-sans">
              Email address
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground font-sans">
              Skill / keyword
            </label>
            <Input
              placeholder="e.g. React, Product Designer, Python"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground font-sans">
              Frequency
            </label>
            <select
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
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
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 font-bold shadow-sm transition-all"
        >
          {loading ? "Saving…" : "Save alert"}
        </Button>
      </form>

      {alerts.length > 0 && (
        <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
          <h3 className="text-base font-bold text-foreground mb-4">
            Your active alerts ({alerts.length})
          </h3>
          <ul className="space-y-3">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {a.keyword || "(no keyword)"}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {a.frequency === "daily" ? "Daily" : "Weekly"} •{" "}
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary uppercase tracking-wide">
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


