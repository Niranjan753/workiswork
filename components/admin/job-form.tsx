"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

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
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");
  const [receiveByEmail, setReceiveByEmail] = React.useState(false);
  const [highlightColor, setHighlightColor] = React.useState(false);

  function addTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

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
      companyLogo: String(formData.get("companyLogo") || ""),
      categorySlug: String(formData.get("category") || ""),
      applyUrl: String(formData.get("applyUrl") || ""),
      receiveApplicationsByEmail: receiveByEmail,
      companyEmail: String(formData.get("companyEmail") || ""),
      highlightColor: highlightColor ? String(formData.get("highlightColor") || "") : undefined,
      descriptionHtml: String(formData.get("descriptionHtml") || ""),
      tags: tags,
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
      setTags([]);
      setTagInput("");
      setReceiveByEmail(false);
      setHighlightColor(false);

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
      className="space-y-6 border-2 border-black bg-white p-8 text-sm text-black shadow-lg"
    >
      <h2 className="text-2xl font-bold text-black">Post a job</h2>

      <div className="space-y-5">
        {/* Company Name */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">
            Company Name
          </label>
          <p className="text-xs text-black/70">
            Your company's brand/trade name: without Inc., Ltd., B.V., Pte., etc.
          </p>
          <Input 
            name="companyName" 
            required 
            placeholder="Acme" 
            className="border-2 border-black"
          />
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">
            Job Title
          </label>
          <p className="text-xs text-black/70">
            Please specify as single job position like "Machine Learning Engineer"
          </p>
          <Input 
            name="title" 
            required 
            placeholder="Machine Learning Engineer" 
            className="border-2 border-black"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">
            Tags, Keywords, or Stack
          </label>
          <p className="text-xs text-black/70">
            Short tags are preferred. Use tags like industry and tech stack.
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 border-2 border-black bg-yellow-400 px-3 py-1 text-xs font-bold text-black"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:bg-black hover:text-yellow-400 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Type a tag to search and add it"
              className="border-2 border-black"
            />
            <Button
              type="button"
              onClick={addTag}
              className="border-2 border-black bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Company Logo */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">
            Company Logo
          </label>
          <p className="text-xs text-black/70">
            Upload a square logo of at least 48x48 pixels for best aesthetic results. Supports: JPG, PNG, WebP, SVG, AVIF, and GIF formats.
          </p>
          <Input
            name="companyLogo"
            type="url"
            placeholder="https://company.com/logo.png"
            className="border-2 border-black"
          />
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">
            Job Description
          </label>
          <textarea
            name="descriptionHtml"
            required
            rows={8}
            className="w-full border-2 border-black bg-white px-3 py-2 text-sm"
            placeholder="Write the full job description here..."
          />
        </div>

        {/* Apply URL */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">
            Apply URL
          </label>
          <p className="text-xs text-black/70">
            Apply URLs with a form an applicant can fill out generally receive a lot more applicants
          </p>
          <Input
            name="applyUrl"
            type="url"
            required
            placeholder="https://company.com/jobs/123"
            className="border-2 border-black"
          />
        </div>

        {/* Receive applications by email */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={receiveByEmail}
              onChange={(e) => setReceiveByEmail(e.target.checked)}
              className="h-4 w-4 border-2 border-black"
            />
            <span className="text-sm font-bold text-black">
              I want to receive applications by email
            </span>
          </label>
        </div>

        {/* Company Email */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">
            Company Email (For invoice)
          </label>
          <p className="text-xs text-black/70">
            Make sure this email is accessible by you! We use this to send the invoice and edit link.
          </p>
          <Input
            name="companyEmail"
            type="email"
            required
            placeholder="contact@company.com"
            className="border-2 border-black"
          />
        </div>

        {/* Highlight with brand color */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={highlightColor}
              onChange={(e) => setHighlightColor(e.target.checked)}
              className="h-4 w-4 border-2 border-black"
            />
            <span className="text-sm font-bold text-black">
              Highlight with a brand color (+$49)
            </span>
            <span className="text-xs text-black/70">2x more views</span>
          </label>
          {highlightColor && (
            <Input
              name="highlightColor"
              type="color"
              defaultValue="#facc15"
              className="border-2 border-black w-20 h-10"
            />
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">
            Category
          </label>
          <select
            name="category"
            className="h-10 w-full border-2 border-black bg-white px-3 text-sm font-bold"
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
      </div>

      <div className="pt-4 border-t-2 border-black">
        <Button
          type="submit"
          disabled={submitting}
          className="w-full border-2 border-black cursor-pointer bg-black px-6 py-3 text-base font-bold text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all shadow-lg"
        >
          {submitting ? "Posting job…" : "Post job - $299"}
        </Button>
      </div>

      {error && (
        <div className="border-2 border-black bg-red-50 p-4">
          <p className="text-sm font-bold text-red-600">Error: {error}</p>
        </div>
      )}
      {successSlug && (
        <div className="border-2 border-black bg-green-50 p-4">
          <p className="text-sm font-bold text-green-600">
            Job created successfully!{" "}
            <button
              type="button"
              className="underline"
              onClick={() => router.push(`/jobs/${successSlug}`)}
            >
              View it on the board
            </button>
          </p>
        </div>
      )}
    </form>
  );
}
