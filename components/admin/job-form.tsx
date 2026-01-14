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
      className="space-y-6 border-2 border-black bg-white p-8 text-sm text-black shadow-lg"
    >
      <h2 className="text-2xl font-bold text-black">Post a job</h2>

      <div className="space-y-5">
        {/* Company Name with Autocomplete */}
        <div className="space-y-2 relative">
          <label className="text-sm font-bold text-black">
            Company Name
          </label>
          <p className="text-xs text-black/70">
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
              className="border-2 border-black"
            />
            <input type="hidden" name="companyId" value={selectedCompanyId || ""} />
            {showSuggestions && companySuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border-2 border-black shadow-lg max-h-60 overflow-y-auto">
                {companySuggestions.map((company) => (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => selectCompany(company)}
                    className="w-full text-left px-4 py-2 hover:bg-yellow-100 border-b border-black/10 last:border-b-0 text-sm font-medium"
                  >
                    <div className="font-bold">{company.name}</div>
                    {company.websiteUrl && (
                      <div className="text-xs text-black/60">{company.websiteUrl}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
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

        {/* Tags with comma-separated highlighting */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">
            Tags, Keywords, or Stack
          </label>
          <p className="text-xs text-black/70">
            Short tags are preferred. Use tags like industry and tech stack. You can enter comma-separated values (e.g., "React, TypeScript, Node.js").
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
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-0 px-3 py-2 pointer-events-none text-sm border-2 border-transparent flex items-center">
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
                className="border-2 border-black"
                style={{ 
                  color: tagInput ? "transparent" : "inherit",
                  caretColor: "black"
                }}
              />
            </div>
            <Button
              type="button"
              onClick={addTag}
              className="border-2 border-black bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              Add Tags
            </Button>
          </div>
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

        {/* Category - using jobs page categories */}
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
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">
            Job Type
          </label>
          <p className="text-xs text-black/70">
            What type of employment contract is this?
          </p>
          <select
            name="jobType"
            className="h-10 w-full border-2 border-black bg-white px-3 text-sm font-bold"
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
          <label className="text-sm font-bold text-black">
            Remote Scope / Time Zones
          </label>
          <p className="text-xs text-black/70">
            Which regions or time zones can candidates work from?
          </p>
          <select
            name="remoteScope"
            className="h-10 w-full border-2 border-black bg-white px-3 text-sm font-bold"
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
          <label className="text-sm font-bold text-black">
            Salary Range (USD)
          </label>
          <p className="text-xs text-black/70">
            Optional: Provide salary range to attract more candidates
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                name="salaryMin"
                type="number"
                placeholder="Min (e.g., 90000)"
                className="border-2 border-black"
              />
            </div>
            <div>
              <Input
                name="salaryMax"
                type="number"
                placeholder="Max (e.g., 130000)"
                className="border-2 border-black"
              />
            </div>
          </div>
        </div>

        {/* Location / Work Authorization */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">
            Location / Work Authorization
          </label>
          <p className="text-xs text-black/70">
            Where should candidates be legally authorized to work? (e.g., "US only", "EU", "Remote contractor worldwide")
          </p>
          <Input
            name="location"
            placeholder="e.g., US only, EU, Remote contractor worldwide"
            className="border-2 border-black"
            required
          />
        </div>
      </div>

      <div className="pt-4 border-t-2 border-black">
        <Button
          type="submit"
          disabled={submitting}
          className="w-full border-2 border-black cursor-pointer bg-black px-6 py-3 text-base font-bold text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all shadow-lg"
        >
          {submitting ? "Redirecting to payment…" : "Post job - $199"}
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
