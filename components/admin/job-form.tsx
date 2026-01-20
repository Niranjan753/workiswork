"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

type Category = {
  id: number;
  slug: string;
  name: string;
};

type Company = {
  id: number;
  name: string;
  slug: string;
  websiteUrl: string | null;
};

type Props = {
  categories: Category[];
};

function parseTags(input: string) {
  return input
    .split(/[,\\n]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

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

  // Company autocomplete state
  const [companyName, setCompanyName] = React.useState("");
  const [companySuggestions, setCompanySuggestions] = React.useState<Company[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<number | null>(null);
  const companyInputRef = React.useRef<HTMLInputElement>(null);

  function addTag() {
    const parsed = parseTags(tagInput);
    if (parsed.length === 0) return;
    const next = Array.from(new Set([...tags, ...parsed]));
    setTags(next);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  // Company search with debounce
  React.useEffect(() => {
    if (companyName.length < 2) {
      setCompanySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/companies/search?q=${encodeURIComponent(companyName)}`);
        const data = await res.json();
        setCompanySuggestions(data.companies || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Failed to search companies:", err);
        setCompanySuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [companyName]);

  function selectCompany(company: Company) {
    setCompanyName(company.name);
    setSelectedCompanyId(company.id);
    setShowSuggestions(false);
    // Set hidden input for company ID
    const hiddenInput = document.querySelector('input[name="companyId"]') as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = String(company.id);
    }
  }

  function handleCompanyNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCompanyName(e.target.value);
    setSelectedCompanyId(null);
    // Clear hidden input
    const hiddenInput = document.querySelector('input[name="companyId"]') as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = "";
    }
  }

  // Parse tags from input and highlight them
  function getTagHighlights(input: string) {
    if (!input) return null;
    const parts = input.split(/(,)/);
    return parts.map((part, index) => {
      if (part === ",") return <span key={index}>,</span>;
      const trimmed = part.trim();
      if (trimmed) {
        return (
          <span
            key={index}
            className="bg-yellow-400 px-1 font-bold"
          >
            {trimmed}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessSlug(null);

    const formData = new FormData(e.currentTarget);

    // If user typed comma-separated tags but didn't click Add, capture them
    const pendingTags =
      tags.length > 0 ? tags : parseTags(tagInput);

    const companyId = formData.get("companyId");
    const salaryMin = formData.get("salaryMin");
    const salaryMax = formData.get("salaryMax");
    const jobData = {
      title: String(formData.get("title") || ""),
      companyName: String(formData.get("companyName") || ""),
      companyWebsite: String(formData.get("companyWebsite") || ""),
      companyId: companyId ? Number(companyId) : undefined,
      categorySlug: String(formData.get("category") || ""),
      applyUrl: String(formData.get("applyUrl") || ""),
      receiveApplicationsByEmail: receiveByEmail,
      companyEmail: String(formData.get("companyEmail") || ""),
      highlightColor: highlightColor ? String(formData.get("highlightColor") || "") : undefined,
      descriptionHtml: String(formData.get("descriptionHtml") || ""),
      tags: pendingTags,
      jobType: String(formData.get("jobType") || "full_time"),
      remoteScope: String(formData.get("remoteScope") || "worldwide"),
      location: String(formData.get("location") || "Worldwide"),
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
    };

    try {
      // Create checkout session with Polar
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobData }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMsg =
          data?.error ||
          `Failed to create checkout session (${res.status})`;
        throw new Error(
          typeof errorMsg === "string"
            ? errorMsg
            : JSON.stringify(errorMsg),
        );
      }

      // Log the response for debugging
      console.log("[AdminJobForm] Checkout response:", data);

      // Redirect to Polar checkout
      const checkoutUrl = data.url || data.checkout_url || data.redirect_url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error("[AdminJobForm] No URL in response:", data);
        throw new Error(`No checkout URL returned. Response: ${JSON.stringify(data)}`);
      }
    } catch (err: any) {
      console.error("[AdminJobForm] Error:", err);
      setError(err.message || "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-8 border border-zinc-200 bg-white rounded-2xl p-10 text-sm text-zinc-950 shadow-xl"
    >
      <h2 className="text-3xl font-black text-zinc-950 tracking-tighter">Post a job</h2>

      <div className="space-y-5">
        {/* Company Name with Autocomplete */}
        <div className="space-y-2 relative">
          <label className="text-sm font-black uppercase tracking-widest text-zinc-900">
            Company Name
          </label>
          <p className="text-xs text-zinc-500 font-medium">
            Your company's brand/trade name: without Inc., Ltd., B.V., Pte., etc. If your company already exists, select it from the suggestions.
          </p>
          <div className="relative">
            <Input
              ref={companyInputRef}
              name="companyName"
              value={companyName}
              onChange={handleCompanyNameChange}
              onFocus={() => companySuggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => {
                // Delay to allow clicking on suggestions
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              required
              placeholder="Acme"
              className="border-zinc-200 rounded-xl h-12 bg-zinc-50 focus:bg-white transition-all"
            />
            <input type="hidden" name="companyId" value={selectedCompanyId || ""} />
            {showSuggestions && companySuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-zinc-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto overflow-hidden">
                {companySuggestions.map((company) => (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => selectCompany(company)}
                    className="w-full text-left px-4 py-3 hover:bg-zinc-50 border-b border-zinc-100 last:border-b-0 text-sm font-medium transition-colors"
                  >
                    <div className="font-bold text-zinc-900">{company.name}</div>
                    {company.websiteUrl && (
                      <div className="text-xs text-zinc-500">{company.websiteUrl}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-zinc-900">
            Job Title
          </label>
          <p className="text-xs text-zinc-500 font-medium">
            Please specify as single job position like "Machine Learning Engineer"
          </p>
          <Input
            name="title"
            required
            placeholder="Machine Learning Engineer"
            className="border-zinc-200 rounded-xl h-12 bg-zinc-50 focus:bg-white transition-all"
          />
        </div>

        {/* Tags with comma-separated highlighting */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-zinc-900">
            Tags, Keywords, or Stack
          </label>
          <p className="text-xs text-zinc-500 font-medium">
            Short tags are preferred. Use tags like industry and tech stack. You can enter comma-separated values (e.g., "React, TypeScript, Node.js").
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-zinc-800 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-500 transition-all rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-0 px-3 py-2 pointer-events-none text-sm border border-transparent flex items-center">
                {tagInput && getTagHighlights(tagInput)}
              </div>
              <Input
                value={tagInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setTagInput(value);
                  // Auto-add tags when comma is entered
                  if (value.includes(",")) {
                    const parts = value.split(",");
                    const beforeComma = parts[0]?.trim();
                    if (beforeComma) {
                      const next = Array.from(new Set([...tags, beforeComma]));
                      setTags(next);
                      // Keep everything after the first comma
                      const afterComma = parts.slice(1).join(",");
                      setTagInput(afterComma);
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type tags separated by commas (e.g., React, TypeScript, Node.js)"
                className="border-zinc-200 rounded-xl h-12 bg-zinc-50 focus:bg-white transition-all"
                style={{
                  color: tagInput ? "transparent" : "inherit",
                  caretColor: "black"
                }}
              />
            </div>
            <Button
              type="button"
              onClick={addTag}
              variant="outline"
              className="border-zinc-200 rounded-xl font-bold hover:bg-zinc-50 transition-all"
            >
              Add Tags
            </Button>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-zinc-900">
            Job Description
          </label>
          <textarea
            name="descriptionHtml"
            required
            rows={8}
            className="w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-zinc-900"
            placeholder="Write the full job description here..."
          />
        </div>

        {/* Apply URL */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-zinc-900">
            Apply URL
          </label>
          <p className="text-xs text-zinc-500 font-medium">
            Apply URLs with a form an applicant can fill out generally receive a lot more applicants
          </p>
          <Input
            name="applyUrl"
            type="url"
            required
            placeholder="https://company.com/jobs/123"
            className="border-zinc-200 rounded-xl h-12 bg-zinc-50 focus:bg-white transition-all"
          />
        </div>

        {/* Receive applications by email */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={receiveByEmail}
              onChange={(e) => setReceiveByEmail(e.target.checked)}
              className="h-4 w-4 border border-zinc-300 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-black uppercase tracking-widest text-zinc-900">
              I want to receive applications by email
            </span>
          </label>
        </div>

        {/* Company Email */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-zinc-900">
            Company Email (For invoice)
          </label>
          <p className="text-xs text-zinc-500 font-medium">
            Make sure this email is accessible by you! We use this to send the invoice and edit link.
          </p>
          <Input
            name="companyEmail"
            type="email"
            required
            placeholder="contact@company.com"
            className="border-zinc-200 rounded-xl h-12 bg-zinc-50 focus:bg-white transition-all"
          />
        </div>

        {/* Highlight with brand color */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={highlightColor}
              onChange={(e) => setHighlightColor(e.target.checked)}
              className="h-4 w-4 border border-zinc-300 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-black uppercase tracking-widest text-zinc-900">
              Highlight with a brand color (+$49)
            </span>
            <span className="text-xs text-zinc-500 font-bold">2x more views</span>
          </label>
          {highlightColor && (
            <Input
              name="highlightColor"
              type="color"
              defaultValue="#facc15"
              className="border border-border w-20 h-10 rounded-md p-1"
            />
          )}
        </div>

        {/* Category - using jobs page categories */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-zinc-900">
            Category
          </label>
          <select
            name="category"
            className="h-12 w-full border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-zinc-900"
            required
            defaultValue={categories[0]?.slug}
          >
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-zinc-900">
            Job Type
          </label>
          <p className="text-xs text-muted-foreground">
            What type of employment contract is this?
          </p>
          <select
            name="jobType"
            className="h-12 w-full border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-zinc-900"
            required
            defaultValue="full_time"
          >
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="freelance">Freelance</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* Remote Scope / Time Zones */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-zinc-900">
            Remote Scope / Time Zones
          </label>
          <p className="text-xs text-muted-foreground">
            Which regions or time zones can candidates work from?
          </p>
          <select
            name="remoteScope"
            className="h-12 w-full border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-zinc-900"
            required
            defaultValue="worldwide"
          >
            <option value="worldwide">Worldwide / Any</option>
            <option value="north_america">North America (US, Canada, Mexico)</option>
            <option value="europe">Europe</option>
            <option value="latam">Latin America</option>
            <option value="asia">Asia-Pacific</option>
          </select>
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-zinc-900">
            Salary Range (USD)
          </label>
          <p className="text-xs text-muted-foreground">
            Optional: Provide salary range to attract more candidates
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                name="salaryMin"
                type="number"
                placeholder="Min (e.g., 90000)"
                className="border-zinc-200 rounded-xl h-12 bg-zinc-50 focus:bg-white transition-all font-bold"
              />
            </div>
            <div>
              <Input
                name="salaryMax"
                type="number"
                placeholder="Max (e.g., 130000)"
                className="border-zinc-200 rounded-xl h-12 bg-zinc-50 focus:bg-white transition-all font-bold"
              />
            </div>
          </div>
        </div>

        {/* Location / Work Authorization */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-zinc-900">
            Location / Work Authorization
          </label>
          <p className="text-xs text-muted-foreground">
            Where should candidates be legally authorized to work? (e.g., "US only", "EU", "Remote contractor worldwide")
          </p>
          <Input
            name="location"
            placeholder="e.g., US only, EU, Remote contractor worldwide"
            className="border-zinc-200 rounded-xl h-12 bg-zinc-50 focus:bg-white transition-all"
            required
          />
        </div>
      </div>

      <div className="pt-8 border-t border-zinc-100 flex flex-col gap-6">
        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-16 bg-[#645cff] text-white text-[13px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#5249ff] transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98]"
        >
          {submitting ? "Redirecting to payment…" : "Post job - $199"}
        </Button>

        {error && (
          <div className="border border-red-100 bg-red-50 p-4 rounded-xl text-center">
            <p className="text-xs font-bold text-red-600">Error: {error}</p>
          </div>
        )}
        {successSlug && (
          <div className="border border-green-100 bg-green-50 p-4 rounded-xl text-center">
            <p className="text-sm font-bold text-green-600">
              Job created successfully!{" "}
              <button
                type="button"
                className="underline hover:text-green-800"
                onClick={() => router.push(`/jobs/${successSlug}`)}
              >
                View it on the board
              </button>
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
