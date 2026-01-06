"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Category = {
  id: number;
  slug: string;
  name: string;
};

type Props = {
  categories: Category[];
};

export function AdminJobForm({ categories }: Props) {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successSlug, setSuccessSlug] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessSlug(null);

    const formData = new FormData(e.currentTarget);

    const payload = {
      title: String(formData.get("title") || ""),
      companyName: String(formData.get("companyName") || ""),
      companyWebsite: String(formData.get("companyWebsite") || ""),
      location: String(formData.get("location") || ""),
      categorySlug: String(formData.get("category") || ""),
      jobType: String(formData.get("jobType") || "full_time"),
      remoteScope: String(formData.get("remoteScope") || "worldwide"),
      salaryMin: String(formData.get("salaryMin") || ""),
      salaryMax: String(formData.get("salaryMax") || ""),
      salaryCurrency: String(formData.get("salaryCurrency") || "USD"),
      applyUrl: String(formData.get("applyUrl") || ""),
      isFeatured: formData.get("isFeatured") === "on",
      isPremium: formData.get("isPremium") === "on",
      descriptionHtml: String(formData.get("descriptionHtml") || ""),
      tags: String(formData.get("tags") || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMsg =
          data?.error ||
          data?.details?.fieldErrors ||
          `Failed to create job (${res.status})`;
        throw new Error(
          typeof errorMsg === "string"
            ? errorMsg
            : JSON.stringify(errorMsg),
        );
      }

      const slug: string | undefined = data?.job?.slug;
      if (!slug) {
        throw new Error("Job created but no slug returned");
      }

      setSuccessSlug(slug);

      // Reset form
      formRef.current?.reset();

      // Refresh jobs board
      router.refresh();
    } catch (err: any) {
      console.error("[AdminJobForm] Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-900 shadow-sm"
    >
      <h2 className="text-base font-semibold">Create a new remote job</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium">Job title</label>
          <Input name="title" required placeholder="Senior React Engineer" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium">Company name</label>
          <Input name="companyName" required placeholder="Acme Inc." />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium">Company website</label>
          <Input
            name="companyWebsite"
            type="url"
            placeholder="https://company.com"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium">Location label</label>
          <Input
            name="location"
            required
            placeholder="Worldwide, Europe, Americas, etc."
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Category</label>
          <select
            name="category"
            className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 text-xs"
            required
            defaultValue={categories[0]?.slug}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Job type</label>
          <select
            name="jobType"
            className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 text-xs"
            defaultValue="full_time"
          >
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="freelance">Freelance</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Remote scope</label>
          <select
            name="remoteScope"
            className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 text-xs"
            defaultValue="worldwide"
          >
            <option value="worldwide">Worldwide</option>
            <option value="europe">Europe</option>
            <option value="north_america">North America</option>
            <option value="latam">LATAM</option>
            <option value="asia">Asia</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Min salary</label>
          <Input name="salaryMin" type="number" placeholder="60000" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium">Max salary</label>
          <Input name="salaryMax" type="number" placeholder="90000" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium">Currency</label>
          <Input name="salaryCurrency" defaultValue="USD" />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-medium">Apply URL</label>
          <Input
            name="applyUrl"
            type="url"
            required
            placeholder="https://company.com/jobs/123"
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-medium">
            Tags (comma separated, e.g. React, TypeScript, Senior)
          </label>
          <Input name="tags" placeholder="React, TypeScript, Senior" />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-medium">Description (HTML)</label>
          <textarea
            name="descriptionHtml"
            required
            rows={6}
            className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-xs"
            placeholder="<p>Write the full job description here...</p>"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-1">
            <input type="checkbox" name="isFeatured" className="h-3 w-3" />
            <span>Featured</span>
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" name="isPremium" className="h-3 w-3" />
            <span>Premium</span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-orange-500 px-5 py-2 text-xs font-semibold text-white hover:bg-orange-600"
        >
          {submitting ? "Saving…" : "Publish job"}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-xs font-medium text-red-600">Error: {error}</p>
          <p className="mt-1 text-xs text-red-500">
            Check the browser console for more details.
          </p>
        </div>
      )}
      {successSlug && (
        <p className="text-xs text-emerald-600">
          Job created.{" "}
          <button
            type="button"
            className="underline"
            onClick={() => router.push(`/jobs/${successSlug}`)}
          >
            View it on the board
          </button>
          .
        </p>
      )}
    </form>
  );
}


